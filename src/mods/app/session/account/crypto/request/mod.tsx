import { WideContrastButton, WideOppositeButton } from "@/libs/button/mod.tsx";
import { PathBoard } from "@/libs/dialog/board/mod.tsx";
import { Ed25519 } from "@/libs/ed25519/mod.ts";
import { Events } from "@/libs/events/mod.ts";
import { Lang } from "@/libs/lang/mod.ts";
import { CryptoSessionCard } from "@/mods/app/session/account/mod.tsx";
import { BitcoinSeedPhrase } from "@hazae41/broca";
import { SubpathProvider, useAnchorWithCoords, useHashSubpath, usePathContext } from "@hazae41/chemin";
import { BitcoinSeedKey, Ed25519SeedKey } from "@hazae41/clade";
import { Cursor } from "@hazae41/cursor";
import * as KDBX from "@hazae41/kdbx";
import { WcSession, WcSessionRequestParams, WcUnsupportedAccountsError, WcUnsupportedMethodsError, WcUserRejectedError } from "@hazae41/latrine";
import { secp256k1 } from "@noble/curves/secp256k1.js";
import { keccak_256 } from "@noble/hashes/sha3.js";
import { base58 } from "@scure/base";
import React, { Fragment, useCallback, useMemo, useState } from "react";

React;

export interface CryptoRequest {
  readonly params: WcSessionRequestParams

  resolve(result: unknown): void

  reject(error: unknown): void
}

export function CryptoRequestAnchor(props: { $entry: KDBX.Inner.KeePassFile.Entry } & { subaccount: number } & { index: number } & { title: string } & { session: WcSession } & { request: CryptoRequest }) {
  const { $entry, subaccount, index, title, session, request } = props

  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, `/request/${index}`)

  const color = useMemo(() => {
    return $entry.getStringByKeyOrNull("Color")?.getValueOrThrow().get()
  }, [$entry])

  return <Fragment>
    <SubpathProvider value={hash}>
      {hash.url.pathname === `/request/${index}` &&
        <PathBoard>
          <CryptoRequestPage $entry={$entry} subaccount={subaccount} title={title} session={session} request={request} />
        </PathBoard>}
    </SubpathProvider>
    <a className="group w-[200px] 2xs:w-[260px] sm:w-[320px] aspect-video p-4 z-10 rounded-xl bg-default text-default border-2 border-default-contrast select-none hover:translate-x-3 focus-visible:outline-none focus-visible:translate-x-3 transition-transform
      data-[color=red]:bg-red-400 
      data-[color=orange]:bg-orange-400 
      data-[color=amber]:bg-amber-400 
      data-[color=yellow]:bg-yellow-400 
      data-[color=lime]:bg-lime-400 
      data-[color=green]:bg-green-400 
      data-[color=emerald]:bg-emerald-400 
      data-[color=teal]:bg-teal-400 
      data-[color=cyan]:bg-cyan-400 
      data-[color=sky]:bg-sky-400 
      data-[color=blue]:bg-blue-400 
      data-[color=indigo]:bg-indigo-400 
      data-[color=violet]:bg-violet-400 
      data-[color=purple]:bg-purple-400 
      data-[color=fuchsia]:bg-fuchsia-400 
      data-[color=pink]:bg-pink-400 
      data-[color=rose]:bg-rose-400 
      in-dark:data-[color=red]:bg-red-500
      in-dark:data-[color=orange]:bg-orange-500
      in-dark:data-[color=amber]:bg-amber-500
      in-dark:data-[color=yellow]:bg-yellow-500
      in-dark:data-[color=lime]:bg-lime-500
      in-dark:data-[color=green]:bg-green-500
      in-dark:data-[color=emerald]:bg-emerald-500
      in-dark:data-[color=teal]:bg-teal-500
      in-dark:data-[color=cyan]:bg-cyan-500
      in-dark:data-[color=sky]:bg-sky-500
      in-dark:data-[color=blue]:bg-blue-500
      in-dark:data-[color=indigo]:bg-indigo-500
      in-dark:data-[color=violet]:bg-violet-500
      in-dark:data-[color=purple]:bg-purple-500
      in-dark:data-[color=fuchsia]:bg-fuchsia-500
      in-dark:data-[color=pink]:bg-pink-500
      in-dark:data-[color=rose]:bg-rose-500"
      style={{ transform: `translateY(-${index * 120}px)` }}
      data-theme={color == null ? "opposite" : "dark"}
      data-color={color}
      href={coords.url.hash}
      onClick={coords.onClick}
      onKeyDown={coords.onKeyDown}>
      <div className="flex items-center justify-between">
        <div className="font-medium text-xl truncate">
          {title || Lang.match({ en: "Untitled", zh: "无标题", hi: "शीर्षक रहित", es: "Sin título", ar: "بدون عنوان", fr: "Sans titre", de: "Unbenannt", ru: "Без названия", pt: "Sem título", ja: "無題", pa: "ਬਿਨਾਂ ਸਿਰਲੇਖ ਦੇ", bn: "বিনা শিরোনাম", id: "Tanpa judul", ur: "بغیر عنوان کے", ms: "Tanpa judul", it: "Senza titolo", tr: "Başlıksız", ta: "தலைப்பு இல்லாமல்", te: "శీర్షిక లేని", ko: "제목 없음", vi: "Không tiêu đề", pl: "Bez tytułu", ro: "Fără titlu", nl: "Ongetiteld", el: "Χωρίς τίτλο", th: "ไม่มีชื่อเรื่อง", cs: "Nezvaný", hu: "Névtelen", sv: "Otitulerad", da: "Uden titel" })}
        </div>
        <div className="font-medium text-xl text-default-half-contrast">
          #{subaccount + 1}
        </div>
        <div className="absolute top-0 right-0 -translate-y-1.5 translate-x-1.5 flex size-4">
          <div className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
          <div className="relative inline-flex size-4 rounded-full bg-sky-500" />
        </div>
      </div>
    </a>
  </Fragment>
}

export function CryptoRequestPage(props: { $entry: KDBX.Inner.KeePassFile.Entry } & { subaccount: number } & { title: string } & { session: WcSession } & { request: CryptoRequest }) {
  const { $entry, subaccount, title, session, request } = props

  const [flipped, setFlipped] = useState(false)

  const subtitle = useMemo(() => {
    return $entry.getStringByKeyOrNull("Title")?.getValueOrThrow().get()
  }, [$entry])

  const color = useMemo(() => {
    return $entry.getStringByKeyOrNull("Color")?.getValueOrThrow().get()
  }, [$entry])


  const seedphrase = useMemo(() => {
    return $entry.getStringByKeyOrNull("SeedPhrase")?.getValueOrThrow().get()
  }, [$entry])

  const getEthereumOrThrow = useCallback(async () => {
    if (seedphrase == null)
      return

    const seed = new BitcoinSeedKey(await BitcoinSeedPhrase.derive(seedphrase))

    const xsig = await seed.derive(`m/44'/60'/0'/0/${subaccount}`)
    const upub = secp256k1.getPublicKey(xsig.key, false)

    return `0x${keccak_256(upub.slice(1)).slice(-20).toHex()}`
  }, [seedphrase, subaccount])

  const getSolanaOrThrow = useCallback(async () => {
    if (seedphrase == null)
      return

    const seed = new Ed25519SeedKey(await BitcoinSeedPhrase.derive(seedphrase))

    const xsig = await seed.derive(`m/44'/501'/${subaccount}'/0'`)
    const upub = await Ed25519.publish(xsig.key)

    return base58.encode(upub)
  }, [seedphrase, subaccount])

  const respondOrThrow = useCallback(async (params: WcSessionRequestParams) => {
    const { chainId, request } = params

    if (request.method === "personal_sign") {
      const [message, account] = request.params as [string, string]

      const current = await getEthereumOrThrow()

      if (current == null)
        throw new WcUnsupportedAccountsError()
      if (account.toLowerCase() !== current.toLowerCase())
        throw new WcUnsupportedAccountsError()

      if (seedphrase == null)
        throw new WcUnsupportedAccountsError()

      const seed = new BitcoinSeedKey(await BitcoinSeedPhrase.derive(seedphrase))
      const xsig = await seed.derive(`m/44'/60'/0'/0/${subaccount}`)

      const msgraw = Uint8Array.fromHex(message.slice(2))
      const prefix = new TextEncoder().encode(`\x19Ethereum Signed Message:\n${msgraw.length}`)

      const payload = new Cursor(new Uint8Array(prefix.length + msgraw.length))
      payload.writeOrThrow(prefix)
      payload.writeOrThrow(msgraw)

      const digest = keccak_256(payload.bytes)

      const sigraw = secp256k1.sign(digest, xsig.key, { prehash: false, format: "recovered" })
      const sigref = secp256k1.Signature.fromBytes(sigraw, "recovered")

      const signed = new Cursor(new Uint8Array(64 + 1))
      signed.writeOrThrow(sigref.toBytes("compact"))
      signed.writeUint8OrThrow(sigref.recovery! + 27)

      return `0x${signed.bytes.toHex()}`
    }

    if (request.method === "solana_signMessage") {
      const { message, pubkey } = request.params as { message: string, pubkey: string }

      const current = await getSolanaOrThrow()

      if (current == null)
        throw new WcUnsupportedAccountsError()
      if (pubkey !== current)
        throw new WcUnsupportedAccountsError()

      if (seedphrase == null)
        throw new WcUnsupportedAccountsError()

      const seed = new Ed25519SeedKey(await BitcoinSeedPhrase.derive(seedphrase))
      const xsig = await seed.derive(`m/44'/501'/${subaccount}'/0'`)

      const msgraw = new Uint8Array(base58.decode(message))
      const sigraw = new Uint8Array(await Ed25519.sign(xsig.key, msgraw))

      return { signature: base58.encode(sigraw) }
    }

    throw new WcUnsupportedMethodsError()
  }, [])

  const approve = useCallback(() => {
    respondOrThrow(request.params).then(request.resolve).catch(request.reject)
  }, [request, respondOrThrow])

  const decline = useCallback(() => {
    request.reject(new WcUserRejectedError())
  }, [request])

  return <Fragment>
    <div className="flex flex-col grow p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium">
          {Lang.match({ en: "Crypto request", zh: "加密请求", hi: "क्रिप्टो अनुरोध", es: "Solicitud de criptografía", ar: "طلب التشفير", fr: "Requête crypto", de: "Krypto-Anfrage", ru: "Криптозапрос", pt: "Solicitação de criptografia", ja: "暗号化リクエスト", pa: "ਕ੍ਰਿਪਟੋ ਬੇਨਤੀ", bn: "ক্রিপ্টো অনুরোধ", id: "Permintaan kripto", ur: "کرپٹو درخواست", ms: "Permintaan kripto", it: "Richiesta crittografica", tr: "Kripto isteği", ta: "கிரிப்டோ கோரிக்கை", te: "క్రిప్టో అభ్యర్థన", ko: "암호화 요청", vi: "Yêu cầu mã hóa", pl: "Żądanie kryptograficzne", ro: "Cerere criptografică", nl: "Crypto-verzoek", el: "Αίτημα κρυπτογράφησης ", th: "คำขอการเข้ารหัส ", cs: "Požadavek na kryptografii ", hu: "Kriptográfiai kérés ", sv: "Kryptoförfrågan ", da: "Kryptoanmodning" })}
        </h1>
      </div>
      <div className="h-6" />
      <div className="flex flex-col items-center justify-center">
        <CryptoSessionCard
          title={title}
          subtitle={subtitle}
          color={color}
          index={subaccount}
          flip={flipped}
          onFlipChange={setFlipped} />
      </div>
      <form className="grow flex flex-col"
        onSubmit={Events.preventDefault}>
        <input className="hidden"
          autoComplete="off"
          name="username" />
        <Fragment>
          <div className="h-6" />
          <div className="font-medium">
            {Lang.match({ en: "Parameters", zh: "参数", hi: "पैरामीटर", es: "Parámetros", ar: "المعلمات", fr: "Paramètres", de: "Parameter", ru: "Параметры", pt: "Parâmetros", ja: "パラメーター", pa: "ਪੈਰਾਮੀਟਰ", bn: "প্যারামিটার", id: "Parameter", ur: "پیرامیٹرز", ms: "Parameter", it: "Parametri", tr: "Parametreler", ta: "பராமீட்டர்கள்", te: "పరామితులు", ko: "매개변수", vi: "Tham số", pl: "Parametry", ro: "Parametri", nl: "Parameters", el: "Παράμετροι ", th: "พารามิเตอร์ ", cs: "Parametry ", hu: "Paraméterek ", sv: "Parametrar ", da: "Parametre" })}
          </div>
          <div className="text-default-contrast">
            {Lang.match({ en: "The request parameters.", zh: "请求参数。", hi: "अनुरोध पैरामीटर।", es: "Los parámetros de la solicitud.", ar: "معلمات الطلب.", fr: "Les paramètres de la requête.", de: "Die Parameter der Anfrage.", ru: "Параметры запроса.", pt: "Os parâmetros da solicitação.", ja: "リクエストパラメーター。", pa: "ਬੇਨਤੀ ਪੈਰਾਮੀਟਰ।", bn: "অনুরোধের প্যারামিটার।", id: "Parameter permintaan.", ur: "درخواست کے پیرامیٹرز۔", ms: "Parameter permintaan.", it: "I parametri della richiesta.", tr: "İstek parametreleri.", ta: "கோரிக்கை பராமீட்டர்கள்.", te: "అభ్యర్థన పరామితులు.", ko: "요청 매개변수입니다.", vi: "Các tham số yêu cầu.", pl: "Parametry żądania.", ro: "Parametrii cererii.", nl: "De parameters van het verzoek.", el: "Οι παράμετροι του αιτήματος ", th: "พารามิเตอร์ของคำขอ ", cs: "Parametry požadavku ", hu: "A kérés paraméterei ", sv: "Förfrågningsparametrar ", da: "Anmodningsparametre" })}
          </div>
          <div className="h-4" />
          <div className="flex flex-col items-center border border-default-contrast rounded-xl py-6">
            <pre className="whitespace-pre-wrap text-wrap wrap-anywhere">
              {JSON.stringify(request.params.request, null, 2)}
            </pre>
          </div>
        </Fragment>
        <div className="h-8" />
        <div className="flex items-center flex-wrap-reverse gap-2">
          <WideContrastButton
            type="button"
            onClick={decline}>
            {Lang.match({ en: "Decline", zh: "拒绝", hi: "अस्वीकृत करें", es: "Rechazar", ar: "رفض", fr: "Refuser", de: "Ablehnen", ru: "Отклонить", pt: "Recusar", ja: "拒否", pa: "ਅਸਵੀਕਾਰ ਕਰੋ", bn: "প্রত্যাখ্যান করুন", id: "Tolak", ur: "رد کریں", ms: "Tolak", it: "Rifiuta", tr: "Reddet", ta: "நிராகரிக்கவும்", te: "తిరస్కరించండి", ko: "거부", vi: "Từ chối", pl: "Odrzuć", ro: "Respinge", nl: "Afwijzen", el: "Απορρίπτω ", th: "ปฏิเสธ ", cs: "Odmítnout ", hu: "Elutasítás ", sv: "Avvisa ", da: "Afvis" })}
          </WideContrastButton>
          <WideOppositeButton
            type="button"
            onClick={approve}>
            {Lang.match({ en: "Approve", zh: "批准", hi: "स्वीकृत करें", es: "Aprobar", ar: "وافق", fr: "Approuver", de: "Genehmigen", ru: "Одобрить", pt: "Aprovar", ja: "承認", pa: "ਮਨਜ਼ੂਰ ਕਰੋ", bn: "অনুমোদন করুন", id: "Setujui", ur: "منظور کریں", ms: "Setujui", it: "Approva", tr: "Onayla", ta: "அனுமதிக்கவும்", te: "అనుమతించండి", ko: "승인", vi: "Phê duyệt", pl: "Zatwierdź", ro: "Aprobați", nl: "Goedkeuren", el: "Εγκρίνω ", th: "อนุมัติ ", cs: "Schválit ", hu: "Jóváhagyás ", sv: "Godkänn ", da: "Godkend" })}
          </WideOppositeButton>
        </div>
      </form>
    </div>
  </Fragment>
}