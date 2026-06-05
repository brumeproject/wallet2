import { WideContrastButton, WideOppositeButton } from "@/libs/button/mod.tsx";
import { FlipCard } from "@/libs/card/mod.tsx";
import { chainlist } from "@/libs/chainlist/mod.ts";
import { Ed25519 } from "@/libs/ed25519/mod.ts";
import { UnsignedTransaction0 } from "@/libs/eip155/mods/transaction0/mod.ts";
import { UnsignedTransaction2 } from "@/libs/eip155/mods/transaction2/mod.ts";
import { EIP712, EIP712Data } from "@/libs/eip712/mod.ts";
import { Events } from "@/libs/events/mod.ts";
import { Outline } from "@/libs/heroicons/mod.ts";
import { Lang } from "@/libs/lang/mod.ts";
import { Spinner } from "@/libs/spinner/mod.tsx";
import { useSubmit } from "@/libs/submit/mod.ts";
import { base58 } from "@hazae41/base58";
import { BitcoinSeedPhrase } from "@hazae41/broca";
import { SubpathProvider, useAnchorWithCoords, useHashSubpath, usePathContext } from "@hazae41/chemin";
import { BitcoinSeedKey, Ed25519SeedKey } from "@hazae41/clade";
import { Cursor } from "@hazae41/cursor";
import { RpcCounter, RpcRequestPreinit, RpcResponse } from "@hazae41/jsonrpc";
import * as KDBX from "@hazae41/kdbx";
import { keccak256 } from "@hazae41/keccak256";
import { WcSessionRequestParams, WcUnsupportedAccountsError, WcUnsupportedChainsError, WcUnsupportedMethodsError, WcUserRejectedError } from "@hazae41/latrine";
import { PathBoard } from "@hazae41/modal";
import { useCloseContext } from "@hazae41/react-close-context";
import { Result } from "@hazae41/result-and-option";
import { secp256k1 } from "@hazae41/secp256k1";
import React, { Fragment, useCallback, useMemo, useState } from "react";

React;

export interface CryptoRequest {
  readonly params: WcSessionRequestParams

  resolve(result: unknown): void

  reject(error: unknown): void
}

export function CryptoRequestAnchor(props: { index: number } & { $entry: KDBX.Inner.KeePassFile.Entry } & { subaccount: number } & { $subentry: KDBX.Inner.KeePassFile.Entry } & { request: CryptoRequest }) {
  const { index, $entry, subaccount, $subentry, request } = props

  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, `/request/${index}`)

  const title = useMemo(() => {
    return $subentry.getStringByKeyOrNull("Title")?.getValueOrNull()?.get()
  }, [$subentry])

  const subtitle = useMemo(() => {
    return $entry.getStringByKeyOrNull("Title")?.getValueOrNull()?.get()
  }, [$entry])

  const color = useMemo(() => {
    return $entry.getStringByKeyOrNull("Color")?.getValueOrNull()?.get()
  }, [$entry])

  const getTypeOrThrow = useCallback((params: WcSessionRequestParams) => {
    const { request } = params

    if (request.method === "eth_sendTransaction")
      return "transaction"
    if (request.method === "solana_signTransaction")
      return "transaction"

    if (request.method === "personal_sign")
      return "signature"
    if (request.method === "eth_signTypedData_v4")
      return "signature"
    if (request.method === "solana_signMessage")
      return "signature"

    throw new WcUnsupportedMethodsError()
  }, [])

  const type = useMemo(() => {
    return Result.runAndWrapSync(() => getTypeOrThrow(request.params))
  }, [request])

  return <Fragment>
    <SubpathProvider value={hash}>
      {hash.url.pathname === `/request/${index}` &&
        <PathBoard>
          <CryptoRequestPage $entry={$entry} subaccount={subaccount} $subentry={$subentry} request={request} />
        </PathBoard>}
    </SubpathProvider>
    <a className="@container relative group w-[min(20rem,100%)] aspect-video rounded-xl bg-default text-default border-2 border-default-contrast select-none hover:scale-105 focus-visible:outline-none focus-visible:scale-105 transition-transform
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
      data-theme={color == null ? "opposite" : "dark"}
      data-color={color}
      href={coords.url.hash}
      onClick={coords.onClick}
      onKeyDown={coords.onKeyDown}>
      <div className="h-full w-full flex flex-col p-4">
        <div className="flex items-center justify-between">
          <div className="font-medium text-xl truncate">
            {title || Lang.match({ en: "Untitled", zh: "无标题", hi: "शीर्षक रहित", es: "Sin título", ar: "بدون عنوان", fr: "Sans titre", de: "Unbenannt", ru: "Без названия", pt: "Sem título", ja: "無題", pa: "ਬਿਨਾਂ ਸਿਰਲੇਖ ਦੇ", bn: "বিনা শিরোনাম", id: "Tanpa judul", ur: "بغیر عنوان کے", ms: "Tanpa judul", it: "Senza titolo", tr: "Başlıksız", ta: "தலைப்பு இல்லாமல்", te: "శీర్షిక లేని", ko: "제목 없음", vi: "Không tiêu đề", pl: "Bez tytułu", ro: "Fără titlu", nl: "Ongetiteld", el: "Χωρίς τίτλο", th: "ไม่มีชื่อเรื่อง", cs: "Nezvaný", hu: "Névtelen", sv: "Otitulerad", da: "Uden titel" })}
          </div>
          <div className="font-medium text-xl text-default-half-contrast">
            #{subaccount + 1}
          </div>
        </div>
        <div className="not-@[16rem]:hidden h-2" />
        <div className="not-@[16rem]:hidden text-default-half-contrast truncate">
          {subtitle}
        </div>
        <div className="not-@[12rem]:hidden h-4 grow" />
        <div className="not-@[12rem]:hidden flex flex-wrap items-center gap-2">
          <div className="bg-default-contrast rounded-xl po-1 flex items-center gap-2">
            {type.getOrNull() === "transaction" && <Outline.CubeIcon className="size-5" />}
            {type.getOrNull() === "signature" && <Outline.CubeTransparentIcon className="size-5" />}
            {type.isErr() && <Outline.QuestionMarkCircleIcon className="size-5" />}
            {type.getOrNull() === "transaction" && Lang.match({ en: "Transaction", zh: "交易", hi: "लेनदेन", es: "Transacción", ar: "معاملة", fr: "Transaction", de: "Transaktion", ru: "Транзакция", pt: "Transação", ja: "トランザクション", pa: "ਟ੍ਰਾਂਜ਼ੈਕਸ਼ਨ", bn: "লেনদেন", id: "Transaksi", ur: "ٹرانزیکشن", ms: "Transaksi", it: "Transazione", tr: "İşlem", ta: "பரிவர்த்தனை", te: "లావాదేవి", ko: "트랜잭션", vi: "Giao dịch", pl: "Transakcja", ro: "Tranzacție", nl: "Transactie", el: "Συναλλαγή ", th: "ธุรกรรม ", cs: "Transakce ", hu: "Tranzakció ", sv: "Transaktion ", da: "Transaktion" })}
            {type.getOrNull() === "signature" && Lang.match({ en: "Signature", zh: "签名", hi: "हस्ताक्षर", es: "Firma", ar: "توقيع", fr: "Signature", de: "Unterschrift", ru: "Подпись", pt: "Assinatura", ja: "署名", pa: "ਦਸਤਖਤ", bn: "স্বাক্ষর", id: "Tanda tangan", ur: "دستخط", ms: "Tanda tangan", it: "Firma", tr: "İmza", ta: "கையொப்பம்", te: "సంతకం", ko: "서명", vi: "Chữ ký", pl: "Podpis", ro: "Semnătură", nl: "Handtekening", el: "Υπογραφή ", th: "ลายเซ็น ", cs: "Podpis ", hu: "Aláírás ", sv: "Signatur ", da: "Signatur" })}
            {type.isErr() && Lang.match({ en: "Unknown", zh: "未知", hi: "अज्ञात", es: "Desconocido", ar: "غير معروف", fr: "Inconnu", de: "Unbekannt", ru: "Неизвестно", pt: "Desconhecido", ja: "不明", pa: "ਅਣਜਾਣ", bn: "অজানা", id: "Tidak diketahui", ur: "نامعلوم", ms: "Tidak diketahui", it: "Sconosciuto", tr: "Bilinmeyen", ta: "அறியப்படாதது", te: "తెలియని", ko: "알 수 없음", vi: "Không xác định", pl: "Nieznany", ro: "Necunoscut", nl: "Onbekend", el: "Άγνωστο ", th: "ไม่ทราบ ", cs: "Neznámý ", hu: "Ismeretlen ", sv: "Okänd ", da: "Ukendt" })}
          </div>
        </div>
      </div>
    </a>
  </Fragment>
}

export function CryptoRequestPage(props: { $entry: KDBX.Inner.KeePassFile.Entry } & { subaccount: number } & { $subentry: KDBX.Inner.KeePassFile.Entry } & { request: CryptoRequest }) {
  const { $entry, subaccount, $subentry, request } = props

  const close = useCloseContext().getOrThrow()

  const [flipped, setFlipped] = useState(false)

  const title = useMemo(() => {
    return $subentry.getStringByKeyOrNull("Title")?.getValueOrNull()?.get()
  }, [$subentry])

  const subtitle = useMemo(() => {
    return $entry.getStringByKeyOrNull("Title")?.getValueOrNull()?.get()
  }, [$entry])

  const color = useMemo(() => {
    return $entry.getStringByKeyOrNull("Color")?.getValueOrNull()?.get()
  }, [$entry])

  const seedphrase = useMemo(() => {
    return $entry.getStringByKeyOrNull("SeedPhrase")?.getValueOrNull()?.get()
  }, [$entry])

  const getEthereumOrThrow = useCallback(async () => {
    if (seedphrase == null)
      return

    const seed = new BitcoinSeedKey(await BitcoinSeedPhrase.derive(seedphrase))

    const xsig = await seed.derive(`m/44'/60'/0'/0/${subaccount}`)
    const upub = secp256k1.SecretKey.import(xsig.key).publish().export(false)

    return `0x${keccak256.digest(upub.slice(1)).slice(-20).toHex()}`
  }, [seedphrase, subaccount])

  const getSolanaOrThrow = useCallback(async () => {
    if (seedphrase == null)
      return

    const seed = new Ed25519SeedKey(await BitcoinSeedPhrase.derive(seedphrase))

    const xsig = await seed.derive(`m/44'/501'/${subaccount}'/0'`)
    const upub = await Ed25519.publish(xsig.key)

    return base58.encode(upub)
  }, [seedphrase, subaccount])

  const requestOrThrow = useCallback(async <T,>(rpc: string, req: RpcRequestPreinit<unknown>): Promise<RpcResponse<T>> => {
    const headers = { "Content-Type": "application/json" }
    const body = JSON.stringify(new RpcCounter().prepare(req))

    const response = await fetch(rpc, { method: "POST", headers, body })

    if (!response.ok)
      throw new Error("Could not fetch", { cause: response })

    return RpcResponse.from<T>(await response.json())
  }, [])

  const respondOrThrow = useCallback(async (params: WcSessionRequestParams) => {
    const { request } = params

    if (seedphrase == null)
      throw new WcUnsupportedAccountsError()

    if (request.method === "eth_sendTransaction") {
      const [{ data, from, gas, gasPrice, maxFeePerGas, maxPriorityFeePerGas, to, value }] = request.params as [{ data?: `0x${string}`, from: `0x${string}`, gas: `0x${string}`, gasPrice: `0x${string}`, maxFeePerGas?: `0x${string}`, maxPriorityFeePerGas?: `0x${string}`, to?: `0x${string}`, value: `0x${string}` }]

      const chainId = Number(params.chainId.split(":")[1])
      const chain = chainlist.find(chain => chain.chainId === chainId)

      if (chain == null)
        throw new WcUnsupportedChainsError()

      const current = await getEthereumOrThrow()

      if (current == null)
        throw new WcUnsupportedAccountsError()
      if (from.toLowerCase() !== current.toLowerCase())
        throw new WcUnsupportedAccountsError()

      const nonce = await requestOrThrow<`0x${string}`>(chain.rpc, {
        method: "eth_getTransactionCount",
        params: [current, "latest"]
      }).then(r => r.getOrThrow())

      const transaction = await (async () => {
        if (maxFeePerGas != null && maxPriorityFeePerGas != null)
          return UnsignedTransaction2.from({ chainId, data, to, gasLimit: gas, maxFeePerGas, maxPriorityFeePerGas, value, nonce })
        if (gasPrice != null)
          return UnsignedTransaction0.from({ chainId, data, to, gasLimit: gas, gasPrice, value, nonce })

        const liveBlockData = await requestOrThrow<{ baseFeePerGas?: `0x${string}` }>(chain.rpc, {
          method: "eth_getBlockByNumber",
          params: ["latest", false]
        }).then(r => r.getOrThrow())

        if (liveBlockData.baseFeePerGas != null) {
          const liveMaxPriorityFeePerGas = await requestOrThrow<`0x${string}`>(chain.rpc, {
            method: "eth_maxPriorityFeePerGas",
            params: []
          }).then(r => r.getOrThrow())

          const baseFeePerGas = BigInt(liveBlockData.baseFeePerGas)

          const maxPriorityFeePerGas = BigInt(liveMaxPriorityFeePerGas)
          const maxFeePerGas = (baseFeePerGas * 2n) + maxPriorityFeePerGas

          return UnsignedTransaction2.from({ chainId, data, to, gasLimit: gas, maxFeePerGas, maxPriorityFeePerGas, value, nonce })
        } else {
          const liveGasPrice = await requestOrThrow<`0x${string}`>(chain.rpc, {
            method: "eth_gasPrice",
            params: []
          }).then(r => r.getOrThrow())

          return UnsignedTransaction0.from({ chainId, data, to, gasLimit: gas, gasPrice: liveGasPrice, value, nonce })
        }
      })()

      const seed = new BitcoinSeedKey(await BitcoinSeedPhrase.derive(seedphrase))
      const xsig = await seed.derive(`m/44'/60'/0'/0/${subaccount}`)

      const digest = keccak256.digest(transaction.encode())
      const signed = secp256k1.SecretKey.import(xsig.key).sign(digest).export()

      return await requestOrThrow<`0x${string}`>(chain.rpc, {
        method: "eth_sendRawTransaction",
        params: [`0x${transaction.sign(signed).encode().toHex()}`]
      }).then(r => r.getOrThrow())
    }

    if (request.method === "personal_sign") {
      const [message, account] = request.params as [string, string]

      const current = await getEthereumOrThrow()

      if (current == null)
        throw new WcUnsupportedAccountsError()
      if (account.toLowerCase() !== current.toLowerCase())
        throw new WcUnsupportedAccountsError()

      const msgraw = Uint8Array.fromHex(message.slice(2))
      const prefix = new TextEncoder().encode(`\x19Ethereum Signed Message:\n${msgraw.length}`)

      const payload = new Cursor(new Uint8Array(prefix.length + msgraw.length))
      payload.write(prefix)
      payload.write(msgraw)

      const seed = new BitcoinSeedKey(await BitcoinSeedPhrase.derive(seedphrase))
      const xsig = await seed.derive(`m/44'/60'/0'/0/${subaccount}`)

      const digest = keccak256.digest(payload.bytes)
      const signed = secp256k1.SecretKey.import(xsig.key).sign(digest).export()

      signed[64] += 27

      return `0x${signed.toHex()}`
    }

    if (request.method === "eth_signTypedData_v4") {
      const [account, data] = request.params as [string, string]

      const current = await getEthereumOrThrow()

      if (current == null)
        throw new WcUnsupportedAccountsError()
      if (account.toLowerCase() !== current.toLowerCase())
        throw new WcUnsupportedAccountsError()

      const seed = new BitcoinSeedKey(await BitcoinSeedPhrase.derive(seedphrase))
      const xsig = await seed.derive(`m/44'/60'/0'/0/${subaccount}`)

      const digest = EIP712.hash(JSON.parse(data))
      const signed = secp256k1.SecretKey.import(xsig.key).sign(digest).export()

      signed[64] += 27

      return `0x${signed.toHex()}`
    }

    if (request.method === "solana_signMessage") {
      const { message, pubkey } = request.params as { message: string, pubkey: string }

      const current = await getSolanaOrThrow()

      if (current == null)
        throw new WcUnsupportedAccountsError()
      if (pubkey !== current)
        throw new WcUnsupportedAccountsError()

      const seed = new Ed25519SeedKey(await BitcoinSeedPhrase.derive(seedphrase))
      const xsig = await seed.derive(`m/44'/501'/${subaccount}'/0'`)

      const msgraw = new Uint8Array(base58.decode(message))
      const sigraw = new Uint8Array(await Ed25519.sign(xsig.key, msgraw))

      return { signature: base58.encode(sigraw) }
    }

    throw new WcUnsupportedMethodsError()
  }, [])

  const approve = useSubmit(async () => {
    await respondOrThrow(request.params).then(request.resolve).catch(request.reject).finally(() => close(true))
  }, [request, respondOrThrow, close])

  const decline = useSubmit(async () => {
    await Promise.reject(new WcUserRejectedError()).catch(request.reject).finally(() => close(true))
  }, [request, close])

  const getChainOrThrow = useCallback((params: WcSessionRequestParams) => {
    const { request, chainId } = params

    if (request.method === "eth_sendTransaction")
      return chainlist.find(chain => chain.chainId === Number(chainId.split(":")[1]))?.name

    if (request.method === "solana_signTransaction")
      return "Solana"

    throw new WcUnsupportedMethodsError()
  }, [])

  const getTypeOrThrow = useCallback((params: WcSessionRequestParams) => {
    const { request } = params

    if (request.method === "eth_sendTransaction")
      return "transaction"
    if (request.method === "solana_signTransaction")
      return "transaction"

    if (request.method === "personal_sign")
      return "signature"
    if (request.method === "eth_signTypedData_v4")
      return "signature"
    if (request.method === "solana_signMessage")
      return "signature"

    throw new WcUnsupportedMethodsError()
  }, [])

  const getMessageOrThrow = useCallback((params: WcSessionRequestParams) => {
    const { request } = params

    if (request.method === "eth_sendTransaction") {
      const [proposal] = request.params as [{ data?: `0x${string}`, from: `0x${string}`, gas: `0x${string}`, gasPrice: `0x${string}`, maxFeePerGas?: `0x${string}`, maxPriorityFeePerGas?: `0x${string}`, to?: `0x${string}`, value: `0x${string}` }]

      const { to, data, value } = proposal

      return JSON.stringify({ to, data, value }, null, 2)
    }

    if (request.method === "personal_sign") {
      const [message] = request.params as [string]

      const msgraw = Uint8Array.fromHex(message.slice(2))
      const msgtxt = new TextDecoder().decode(msgraw)

      return msgtxt
    }

    if (request.method === "eth_signTypedData_v4") {
      const [account, data] = request.params as [string, string]

      const { domain, message } = JSON.parse(data) as EIP712Data

      return JSON.stringify({ domain, message }, null, 2)
    }

    if (request.method === "solana_signMessage") {
      const { message } = request.params as { message: string }

      const msgraw = base58.decode(message)
      const msgtxt = new TextDecoder().decode(msgraw)

      return msgtxt
    }

    throw new WcUnsupportedMethodsError()
  }, [])

  const type = useMemo(() => {
    return Result.runAndWrapSync(() => getTypeOrThrow(request.params))
  }, [request])

  const chain = useMemo(() => {
    return Result.runAndWrapSync(() => getChainOrThrow(request.params))
  }, [request])

  const message = useMemo(() => {
    return Result.runAndWrapSync(() => getMessageOrThrow(request.params))
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
        {type.getOrNull() === "transaction" &&
          <FlipCard
            type={Lang.match({ en: "Transaction", zh: "交易", hi: "लेनदेन", es: "Transacción", ar: "معاملة", fr: "Transaction", de: "Transaktion", ru: "Транзакция", pt: "Transação", ja: "トランザクション", pa: "ਟ੍ਰਾਂਜ਼ੈਕਸ਼ਨ", bn: "লেনদেন", id: "Transaksi", ur: "ٹرانزیکشن", ms: "Transaksi", it: "Transazione", tr: "İşlem", ta: "பரிவர்த்தனை", te: "లావాదేవి", ko: "트랜잭션", vi: "Giao dịch", pl: "Transakcja", ro: "Tranzacție", nl: "Transactie", el: "Συναλλαγή ", th: "ธุรกรรม ", cs: "Transakce ", hu: "Tranzakció ", sv: "Transaktion ", da: "Transaktion" })}
            title={title}
            subtitle={subtitle}
            color={color}
            index={subaccount}
            icon={<Outline.CubeIcon className="size-5" />}
            flip={flipped}
            onFlipChange={setFlipped} />}
        {type.getOrNull() === "signature" &&
          <FlipCard
            type={Lang.match({ en: "Signature", zh: "签名", hi: "हस्ताक्षर", es: "Firma", ar: "توقيع", fr: "Signature", de: "Unterschrift", ru: "Подпись", pt: "Assinatura", ja: "署名", pa: "ਦਸਤਖਤ", bn: "স্বাক্ষর", id: "Tanda tangan", ur: "دستخط", ms: "Tanda tangan", it: "Firma", tr: "İmza", ta: "கையொப்பம்", te: "సంతకం", ko: "서명", vi: "Chữ ký", pl: "Podpis", ro: "Semnătură", nl: "Handtekening", el: "Υπογραφή ", th: "ลายเซ็น ", cs: "Podpis ", hu: "Aláírás ", sv: "Signatur ", da: "Signatur" })}
            title={title}
            subtitle={subtitle}
            color={color}
            index={subaccount}
            icon={<Outline.CubeTransparentIcon className="size-5" />}
            flip={flipped}
            onFlipChange={setFlipped} />}
        {type.isErr() &&
          <FlipCard
            type={Lang.match({ en: "Unknown", zh: "未知", hi: "अज्ञात", es: "Desconocido", ar: "غير معروف", fr: "Inconnu", de: "Unbekannt", ru: "Неизвестно", pt: "Desconhecido", ja: "不明", pa: "ਅਣਜਾਣ", bn: "অজানা", id: "Tidak diketahui", ur: "نامعلوم", ms: "Tidak diketahui", it: "Sconosciuto", tr: "Bilinmeyen", ta: "அறியப்படாதது", te: "తెలియని", ko: "알 수 없음", vi: "Không xác định", pl: "Nieznany", ro: "Necunoscut", nl: "Onbekend", el: "Άγνωστο ", th: "ไม่ทราบ ", cs: "Neznámý ", hu: "Ismeretlen ", sv: "Okänd ", da: "Ukendt" })}
            title={title}
            subtitle={subtitle}
            color={color}
            index={subaccount}
            icon={<Outline.QuestionMarkCircleIcon className="size-5" />}
            flip={flipped}
            onFlipChange={setFlipped} />}
      </div>
      <form className="grow flex flex-col"
        onSubmit={Events.preventDefault}>
        <input className="hidden"
          autoComplete="off"
          name="username" />
        {chain.isOk() && <Fragment>
          <div className="h-6" />
          <div className="font-medium">
            {Lang.match({ en: "Chain", zh: "链", hi: "चेन", es: "Cadena", ar: "سلسلة", fr: "Chaîne", de: "Kette", ru: "Цепочка", pt: "Cadeia", ja: "チェーン", pa: "ਚੇਨ", bn: "চেইন", id: "Rantai", ur: "چین", ms: "Rantai", it: "Catena", tr: "Zincir", ta: "செயின்", te: "చెయిన్", ko: "체인", vi: "Chuỗi", pl: "Łańcuch", ro: "Lanț", nl: "Ketting", el: "Αλυσίδα ", th: "เชน ", cs: "Řetěz ", hu: "Lánc ", sv: "Kedja ", da: "Kæde" })}
          </div>
          <div className="text-default-contrast">
            {chain.get()}
          </div>
        </Fragment>}
        {message.isOk() && <Fragment>
          <div className="h-6" />
          <div className="font-medium">
            {Lang.match({ en: "Message", zh: "消息", hi: "संदेश", es: "Mensaje", ar: "رسالة", fr: "Message", de: "Nachricht", ru: "Сообщение", pt: "Mensagem", ja: "メッセージ", pa: "ਸੰਦੇਸ਼", bn: "বার্তা", id: "Pesan", ur: "پیغام", ms: "Mesej", it: "Messaggio", tr: "Mesaj", ta: "செய்தி", te: "సందేశం", ko: "메시지", vi: "Tin nhắn", pl: "Wiadomość", ro: "Mesaj", nl: "Bericht", el: "Μήνυμα ", th: "ข้อความ ", cs: "Zpráva ", hu: "Üzenet ", sv: "Meddelande ", da: "Besked" })}
          </div>
          <div className="text-default-contrast">
            {Lang.match({ en: "The request message.", zh: "请求消息。", hi: "अनुरोध संदेश।", es: "El mensaje de la solicitud.", ar: "رسالة الطلب.", fr: "Le message de la requête.", de: "Die Nachricht der Anfrage.", ru: "Сообщение запроса.", pt: "A mensagem da solicitação.", ja: "リクエストメッセージ。", pa: "ਬੇਨਤੀ ਸੁਨੇਹਾ।", bn: "অনুরোধের বার্তা।", id: "Pesan permintaan.", ur: "درخواست کا پیغام۔", ms: "Mesej permintaan.", it: "Il messaggio della richiesta.", tr: "İstek mesajı.", ta: "கோரிக்கை செய்தி.", te: "అభ్యర్థన సందేశం.", ko: "요청 메시지입니다.", vi: "Tin nhắn yêu cầu.", pl: "Wiadomość żądania.", ro: "Mesajul cererii.", nl: "Het bericht van het verzoek.", el: "Το μήνυμα του αιτήματος ", th: "ข้อความของคำขอ ", cs: "Zpráva požadavku ", hu: "A kérés üzenete ", sv: "Förfrågningsmeddelande ", da: "Anmodningsbesked" })}
          </div>
          <div className="h-4" />
          <div className="flex flex-col items-center border border-default-contrast rounded-xl p-6">
            <pre className="whitespace-pre-wrap text-wrap wrap-anywhere">
              {message.get()}
            </pre>
          </div>
        </Fragment>}
        <div className="h-8 grow" />
        <div className="flex items-center flex-wrap-reverse gap-2">
          <WideContrastButton
            type="button"
            disabled={decline.running}
            onClick={decline.execute}>
            {decline.running ? <Spinner className="size-5 animate-spin" /> : <Outline.NoSymbolIcon className="size-5" />}
            {Lang.match({ en: "Decline", zh: "拒绝", hi: "अस्वीकृत करें", es: "Rechazar", ar: "رفض", fr: "Refuser", de: "Ablehnen", ru: "Отклонить", pt: "Recusar", ja: "拒否", pa: "ਅਸਵੀਕਾਰ ਕਰੋ", bn: "প্রত্যাখ্যান করুন", id: "Tolak", ur: "رد کریں", ms: "Tolak", it: "Rifiuta", tr: "Reddet", ta: "நிராகரிக்கவும்", te: "తిరస్కరించండి", ko: "거부", vi: "Từ chối", pl: "Odrzuć", ro: "Respinge", nl: "Afwijzen", el: "Απορρίπτω ", th: "ปฏิเสธ ", cs: "Odmítnout ", hu: "Elutasítás ", sv: "Avvisa ", da: "Afvis" })}
          </WideContrastButton>
          {type.isOk() &&
            <WideOppositeButton
              type="button"
              disabled={approve.running}
              onClick={approve.execute}>
              {approve.running ? <Spinner className="size-5 animate-spin" /> : <Outline.CheckCircleIcon className="size-5" />}
              {Lang.match({ en: "Approve", zh: "批准", hi: "स्वीकृत करें", es: "Aprobar", ar: "وافق", fr: "Approuver", de: "Genehmigen", ru: "Одобрить", pt: "Aprovar", ja: "承認", pa: "ਮਨਜ਼ੂਰ ਕਰੋ", bn: "অনুমোদন করুন", id: "Setujui", ur: "منظور کریں", ms: "Setujui", it: "Approva", tr: "Onayla", ta: "அனுமதிக்கவும்", te: "అనుమతించండి", ko: "승인", vi: "Phê duyệt", pl: "Zatwierdź", ro: "Aprobați", nl: "Goedkeuren", el: "Εγκρίνω ", th: "อนุมัติ ", cs: "Schválit ", hu: "Jóváhagyás ", sv: "Godkänn ", da: "Godkend" })}
            </WideOppositeButton>}
        </div>
      </form>
    </div>
  </Fragment>
}