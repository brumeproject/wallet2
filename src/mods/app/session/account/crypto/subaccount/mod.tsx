import { InOther } from "@/libs/anchor/mod.tsx";
import { InButton, WideContrastButton, WideOppositeButton } from "@/libs/button/mod.tsx";
import { ChainData } from "@/libs/chainlist/mod.ts";
import { useCopy } from "@/libs/copy/mod.ts";
import { PathBoard } from "@/libs/dialog/board/mod.tsx";
import { PathPaper, WideNakedMenuAnchor } from "@/libs/dialog/paper/mod.tsx";
import { Ed25519 } from "@/libs/ed25519/mod.ts";
import { Errors } from "@/libs/errors/mod.ts";
import { Events } from "@/libs/events/mod.ts";
import { Outline } from "@/libs/heroicons/mod.ts";
import { Lang } from "@/libs/lang/mod.ts";
import { Nullable } from "@/libs/nullable/mod.ts";
import { ScanPage } from "@/mods/app/session/account/password/mod.tsx";
import { useSessionContext } from "@/mods/app/session/mod.tsx";
import { BitcoinSeedPhrase } from "@hazae41/broca";
import { SubpathProvider, useAnchorWithCoords, useHashSubpath, usePathContext } from "@hazae41/chemin";
import { BitcoinSeedKey, Ed25519SeedKey } from "@hazae41/clade";
import { Cursor } from "@hazae41/cursor";
import * as KDBX from "@hazae41/kdbx";
import { IrnClient, WalletConnect, WcMetadata, WcPairing, WcPairingParams, WcSession, WcSessionProposeParams, WcSessionProposeResult, WcSessionRequestParams, WcUnsupportedAccountsError, WcUnsupportedMethodsError } from "@hazae41/latrine";
import { useCloseContext } from "@hazae41/react-close-context";
import { secp256k1 } from "@noble/curves/secp256k1.js";
import { keccak_256 } from "@noble/hashes/sha3.js";
import { base58 } from "@scure/base";
import React, { Fragment, useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";
import { AccountMenuAnchor, CryptoAccountCard } from "../../mod.tsx";

React;

export function CryptoSubaccountAnchor(props: { $entry: KDBX.Inner.KeePassFile.Entry } & { index: number }) {
  const { $entry, index } = props

  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, `/subaccount/${index}`)

  const title = useMemo(() => {
    return $entry.getStringByKeyOrNull("Title")?.getValueOrThrow().get()
  }, [$entry])

  const color = useMemo(() => {
    return $entry.getStringByKeyOrNull("Color")?.getValueOrThrow().get()
  }, [$entry])

  return <Fragment>
    <SubpathProvider value={hash}>
      {hash.url.pathname === `/subaccount/${index}` &&
        <PathBoard>
          <CryptoSubaccountPage $entry={$entry} index={index} />
        </PathBoard>}
    </SubpathProvider>
    <a className="group w-[320px] aspect-video p-4 z-10 rounded-xl bg-default text-default border-2 border-default-contrast select-none hover:translate-x-3 focus-visible:outline-none focus-visible:translate-x-3 transition-transform
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
        <div className="font-medium text-xl">
          {title}
        </div>
        <div className="font-medium text-xl text-default-half-contrast">
          #{index + 1}
        </div>
      </div>
    </a>
  </Fragment>
}

export function CryptoSubaccountPage(props: { $entry: KDBX.Inner.KeePassFile.Entry } & { index: number }) {
  const { $entry, index } = props

  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const [flipped, setFlipped] = useState(false)

  const title = useMemo(() => {
    return $entry.getStringByKeyOrNull("Title")?.getValueOrThrow().get()
  }, [$entry])

  const color = useMemo(() => {
    return $entry.getStringByKeyOrNull("Color")?.getValueOrThrow().get()
  }, [$entry])

  const seedphrase = useMemo(() => {
    return $entry.getStringByKeyOrNull("SeedPhrase")?.getValueOrThrow().get()
  }, [$entry])

  const updateOrThrow = useCallback(async () => {
    const res = await fetch("https://chainlist.org/rpcs.json")

    if (!res.ok)
      throw new Error(await res.text(), { cause: res })

    const chainlist = await res.json() as Array<ChainData>

    return chainlist.filter(x => x.rpc.find(x => {
      try {
        const url = new URL(x.url)

        if (url.protocol !== "https:")
          return false

        if (!url.origin.endsWith(".publicnode.com"))
          return false

        return true
      } catch {
        return false
      }
    })).map(x => x.chainId)
  }, [])

  const getEthereumOrThrow = useCallback(async () => {
    if (seedphrase == null)
      return

    const seed = new BitcoinSeedKey(await BitcoinSeedPhrase.derive(seedphrase))

    const xsig = await seed.derive(`m/44'/60'/0'/0/${index}`)
    const upub = secp256k1.getPublicKey(xsig.key, false)

    return `0x${keccak_256(upub.slice(1)).slice(-20).toHex()}`
  }, [seedphrase, index])

  const getSolanaOrThrow = useCallback(async () => {
    if (seedphrase == null)
      return

    const seed = new Ed25519SeedKey(await BitcoinSeedPhrase.derive(seedphrase))

    const xsig = await seed.derive(`m/44'/501'/${index}'/0'`)
    const upub = await Ed25519.publish(xsig.key)

    return base58.encode(upub)
  }, [seedphrase, index])

  const [sessions, setSessions] = useState<{ title: string, session: WcSession, metadata: WcMetadata }[]>([])

  const respondOrThrow = useCallback(async (title: string, url: string, signal = new AbortController().signal) => {
    if (seedphrase == null)
      return

    await using stack = new AsyncDisposableStack()

    const cleaner = new AbortController()
    stack.defer(() => cleaner.abort())

    const ethereum = await getEthereumOrThrow()

    if (ethereum == null)
      return

    const solana = await getSolanaOrThrow()

    if (solana == null)
      return

    const jwk = crypto.getRandomValues(new Uint8Array(32))

    const client = await IrnClient.open(WalletConnect.RELAY, jwk, "c6c9bacd35afa3eb9e6cccf6d8464395")

    const pairing = await WcPairing.from(client, WcPairingParams.parse(url))

    const proposed = Promise.withResolvers<WcSessionProposeParams>()
    stack.defer(() => proposed.reject())
    proposed.promise.catch(() => { })

    const responded = Promise.withResolvers<WcSessionProposeResult>()
    stack.defer(() => responded.reject())
    responded.promise.catch(() => { })

    pairing.addEventListener("propose", event => {
      const proposal = event.data

      proposed.resolve(proposal)

      event.respondWith(responded.promise)
    }, { signal: cleaner.signal })

    const upgraded = Promise.withResolvers<WcSession>()
    stack.defer(() => upgraded.reject())
    upgraded.promise.catch(() => { })

    pairing.addEventListener("upgrade", event => upgraded.resolve(event.data), { signal: cleaner.signal })
    pairing.addEventListener("close", upgraded.reject, { signal: cleaner.signal })
    signal.addEventListener("abort", upgraded.reject, { signal: cleaner.signal })

    await pairing.open()

    stack.defer(async () => await pairing.close())
    stack.defer(async () => await pairing.delete())

    const proposal = await proposed.promise

    responded.resolve(await pairing.respond(proposal))

    await responded.promise

    const session = await upgraded.promise

    const onRequest = (params: WcSessionRequestParams<unknown>) => {
      const { chainId, request } = params

      if (request.method === "personal_sign") {
        const [message, account] = request.params as [string, string]

        if (account.toLowerCase() !== ethereum.toLowerCase())
          throw new WcUnsupportedAccountsError()

        return onPersonalSign(message)
      }

      if (request.method === "solana_signMessage") {
        const { message, pubkey } = request.params as { message: string, pubkey: string }

        if (pubkey !== solana)
          throw new WcUnsupportedAccountsError()

        return onSolanaSignMessage(message)
      }

      throw new WcUnsupportedMethodsError()
    }

    const onPersonalSign = async (message: string) => {
      const seed = new BitcoinSeedKey(await BitcoinSeedPhrase.derive(seedphrase))
      const xsig = await seed.derive(`m/44'/60'/0'/0/${index}`)

      const msgraw = Uint8Array.fromHex(message.slice(2).padStart(64, "0"))
      const prefix = new TextEncoder().encode(`\x19Ethereum Signed Message:\n${msgraw.length}`)

      const cursor = new Cursor(new Uint8Array(prefix.length + msgraw.length))
      cursor.writeOrThrow(prefix)
      cursor.writeOrThrow(msgraw)

      const digest = keccak_256(cursor.bytes)
      const sigraw = secp256k1.sign(digest, xsig.key, { prehash: false })

      return `0x${sigraw.toHex()}`
    }

    const onSolanaSignMessage = async (message: string) => {
      const seed = new Ed25519SeedKey(await BitcoinSeedPhrase.derive(seedphrase))
      const xsig = await seed.derive(`m/44'/501'/${index}'/0'`)

      const msgraw = new Uint8Array(base58.decode(message))
      const sigraw = new Uint8Array(await Ed25519.sign(xsig.key, msgraw))

      return { signature: base58.encode(sigraw) }
    }

    session.addEventListener("request", event => event.respondWith(onRequest(event.data)), { signal: session.closing })
    session.addEventListener("close", () => setSessions(x => x.filter(y => y.session !== session)), { signal: session.closing })

    await session.open()

    let success = false

    stack.defer(async () => success ? undefined : await session.close())
    stack.defer(async () => success ? undefined : await session.delete())

    const relay = session.channel.client.relay

    const { requiredNamespaces, optionalNamespaces } = proposal

    const chains = await updateOrThrow()

    const namespaces = {
      eip155: {
        accounts: chains.map(chainId =>
          `eip155:${chainId}:${ethereum}`
        ),
        chains: chains.map(chainId =>
          `eip155:${chainId}`
        ),
        methods: [
          "personal_sign",
          // "eth_signTypedData_v4",
          // "eth_sendTransaction"
        ],
        events: [],
      },
      solana: {
        accounts: [
          `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp:${solana}`,
          `solana:4sGjMW1sUnHzSxGspuhpqLDx6wiyjNtZ:${solana}`
        ],
        chains: [
          "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",
          "solana:4sGjMW1sUnHzSxGspuhpqLDx6wiyjNtZ"
        ],
        methods: [
          "solana_signMessage",
          // "solana_signTransaction",
        ],
        events: [],
      }
    }

    const metadata = { name: "Brume Wallet", description: "The secure and private wallet", url: "http://wallet.brume.tech", icons: [] }
    const controller = { publicKey: new Uint8Array(await crypto.subtle.exportKey("raw", pairing.keypair.publicKey)).toHex(), metadata }

    const expiry = Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60)

    await session.settle({ relay, namespaces, requiredNamespaces, optionalNamespaces, pairingTopic: pairing.channel.topic, controller, expiry })

    success = true

    setSessions(x => [...x, { title, session, metadata: proposal.proposer.metadata }])
  }, [seedphrase])

  return <Fragment>
    <SubpathProvider value={hash}>
      {hash.url.pathname === "/+" &&
        <PathPaper>
          <CryptoSubaccountMenu $entry={$entry} index={index} />
        </PathPaper>}
      {hash.url.pathname === "/session" &&
        <PathBoard>
          <CryptoSessionAddPage $entry={$entry} index={index} respond={respondOrThrow} />
        </PathBoard>}
    </SubpathProvider>
    <div className="flex flex-col grow p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium">
          {Lang.match({ en: "Crypto subaccount", zh: "加密子账户", hi: "क्रिप्टो उपखाता", es: "Subcuenta de criptomonedas", ar: "الحساب الفرعي المشفر", fr: "Sous-compte crypto", de: "Krypto-Unterkonto", ru: "Крипто-субсчет", pt: "Subconta de criptomoeda", ja: "暗号サブアカウント", pa: "ਕ੍ਰਿਪਟੋ ਉਪਖਾਤਾ", bn: "ক্রিপ্টো সাবঅ্যাকাউন্ট", id: "Subakun Kripto", ur: "کرپٹو سب اکاؤنٹ", ms: "Subakun Kripto", it: "Sottoconto crittografico", tr: "Kripto alt hesabı", ta: "கிரிப்டோ உபகணக்கு", te: "క్రిప్టో ఉపఖాతా", ko: "암호화 하위 계정", vi: "Tài khoản phụ tiền điện tử", pl: "Konto podrzędne kryptowalutowe", ro: "Subcont criptografic", nl: "Crypto subaccount", el: "Υπολογαριασμός κρυπτογράφησης ", th: "บัญชีย่อยคริปโต ", cs: "Krypto podúčet ", hu: "Kripto alszámla ", sv: "Kryptounderkonto ", da: "Krypto underkonto" })}
        </h1>
        <AccountMenuAnchor />
      </div>
      <div className="h-6" />
      <div className="flex flex-col items-center justify-center">
        <CryptoAccountCard
          title={title}
          color={color}
          index={index}
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
            {Lang.match({ en: "Sessions", zh: "会话", hi: "सत्र", es: "Sesiones", ar: "الجلسات", fr: "Sessions", de: "Sitzungen", ru: "Сессии", pt: "Sessões", ja: "セッション", pa: "ਸੈਸ਼ਨ", bn: "সেশন", id: "Sesi", ur: "سیشنز", ms: "Sesi", it: "Sessioni", tr: "Oturumlar", ta: "அமர்வுகள்", te: "సెషన్లు", ko: "세션", vi: "Phiên", pl: "Sesje", ro: "Sesiuni", nl: "Sessies", el: "Συνεδρίες ", th: "เซสชัน ", cs: "Sezení ", hu: "Munkamenetek ", sv: "Sessioner ", da: "Sessioner" })}
          </div>
          <div className="text-default-contrast">
            {Lang.match({ en: "Your WalletConnect sessions.", zh: "您的 WalletConnect 会话。", hi: "आपके WalletConnect सत्र।", es: "Tus sesiones de WalletConnect.", ar: "جلسات WalletConnect الخاصة بك.", fr: "Vos sessions WalletConnect.", de: "Ihre WalletConnect-Sitzungen.", ru: "Ваши сессии WalletConnect.", pt: "Suas sessões do WalletConnect.", ja: "あなたのWalletConnectセッション。", pa: "ਤੁਹਾਡੇ WalletConnect ਸੈਸ਼ਨ।", bn: "আপনার WalletConnect সেশন।", id: "Sesi WalletConnect Anda.", ur: "آپ کے WalletConnect سیشنز۔", ms: "Sesi WalletConnect Anda.", it: "Le tue sessioni di WalletConnect.", tr: "WalletConnect oturumlarınız.", ta: "உங்கள் WalletConnect அமர்வுகள்.", te: "మీ WalletConnect సెషన్లు.", ko: "귀하의 WalletConnect 세션입니다.", vi: "Các phiên của bạn trên WalletConnect.", pl: "Twoje sesje WalletConnect.", ro: "Sesiunile dvs. de pe WalletConnect.", nl: "Uw WalletConnect-sessies.", el: "Οι συνεδρίες σας στο WalletConnect. ", th: "เซสชันของคุณบน WalletConnect. ", cs: "Vaše sezení na WalletConnect. ", hu: "A WalletConnect munkamenetei. ", sv: "Dina sessioner på WalletConnect. ", da: "Dine sessioner på WalletConnect." })}
          </div>
          <div className="h-4" />
          <div className="flex flex-col items-center border border-default-contrast rounded-xl p-6">
            <div className="flex flex-col"
              style={{ "height": `${180 + (sessions.length * 60)}px` }}>
              {sessions.map((data, index) =>
                <Fragment key={index}>
                  <CryptoSessionAnchor $entry={$entry} index={index} />
                </Fragment>)}
              <CryptoSessionAddAnchor count={sessions.length} />
            </div>
          </div>
        </Fragment>
      </form>
    </div>
  </Fragment>
}

export function CryptoSessionAddAnchor(props: { count: number }) {
  const { count } = props

  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, "/session")

  return <a className="group w-[320px] aspect-video z-10 rounded-xl bg-default text-default border-2 border-default-contrast select-none hover:translate-x-3 focus-visible:outline-none focus-visible:translate-x-3 transition-transform"
    style={{ "transform": `translateY(-${count * 120}px)` }}
    href={coords.url.hash}
    onClick={coords.onClick}
    onKeyDown={coords.onKeyDown}>
    <InOther>
      <Outline.PlusIcon className="size-8" />
    </InOther>
  </a>
}

export function CryptoSessionAddPage(props: { $entry: KDBX.Inner.KeePassFile.Entry } & { index: number } & { respond(title: string, url: string): Promise<void> }) {
  const { $entry, index, respond } = props

  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const close = useCloseContext().getOrThrow()

  const session = useSessionContext().getOrThrow()

  const [flipped, setFlipped] = useState(false)

  const subtitle = useMemo(() => {
    return $entry.getStringByKeyOrNull("Title")?.getValueOrThrow().get()
  }, [$entry])

  const color = useMemo(() => {
    return $entry.getStringByKeyOrNull("Color")?.getValueOrThrow().get()
  }, [$entry])

  const [$title, setTitle] = useState("")

  const [$url, setUrl] = useState("")

  const [$notes, setNotes] = useState("")

  const title = useDeferredValue($title || "Uniswap")

  const url = useDeferredValue($url)

  const notes = useDeferredValue($notes)

  // const encryptOrThrow = useCallback(async () => {
  //   const { kdbx, comp } = session.value

  //   const $file = kdbx.inner.content.value
  //   const $root = $file.getRootOrThrow()

  //   const $group = $root.getDirectGroupByIndexOrThrow(0)
  //   const $entry = $group.addEntryOrThrow()

  //   $entry.addStringOrThrow("Title", title)

  //   if (color)
  //     $entry.addStringOrThrow("Color", color)

  //   if (notes)
  //     $entry.addStringOrThrow("Notes", notes)

  //   return Writable.writeToBytesOrThrow(await kdbx.encryptOrThrow(comp))
  // }, [session, title, color, notes])

  // const encryptAndWriteOrAlert = useCallback(() => Promise.try(async () => {
  //   const fsfh = session.value.user.fsfh

  //   if (fsfh == null)
  //     return

  //   const content = await encryptOrThrow()

  //   const writable = await fsfh.createWritable()
  //   await writable.write(content)
  //   await writable.close()

  //   session.update()

  //   close()
  // }).catch(Errors.display), [encryptOrThrow, close])

  // const encryptAndSaveOrAlert = useCallback(() => Promise.try(async () => {
  //   const content = await encryptOrThrow()

  //   const file = new File([content], "wallet.kdbx", { type: "application/kdbx" })

  //   if (/iPad|iPhone|iPod/.test(navigator.platform) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) {
  //     await navigator.share({ files: [file] })
  //   } else {
  //     const url = URL.createObjectURL(file)

  //     const a = document.createElement("a") as HTMLAnchorElement
  //     a.href = url
  //     a.download = "wallet.kdbx"

  //     document.body.appendChild(a)

  //     a.click()

  //     document.body.removeChild(a)

  //     URL.revokeObjectURL(url)
  //   }

  //   session.update()

  //   close()
  // }).catch(Errors.display), [encryptOrThrow, close])

  const error = useMemo(() => {
    return
  }, [])

  const onClick = useCallback(() => Promise.try(async () => {
    await respond(title, url)

    close()
  }).catch(Errors.display), [title, url, respond, close])

  return <Fragment>
    <SubpathProvider value={hash}>
      {hash.url.pathname === "/url" &&
        <PathBoard>
          <ScanPage value={$url} onChange={setUrl} />
        </PathBoard>}
    </SubpathProvider>
    <div className="flex flex-col grow p-6">
      <h1 className="text-xl font-medium">
        {Lang.match({ en: "Add crypto session", zh: "添加加密会话", hi: "क्रिप्टो सत्र जोड़ें", es: "Agregar sesión de cripto", ar: "إضافة جلسة تشفير", fr: "Ajouter une session crypto", de: "Krypto-Sitzung hinzufügen", ru: "Добавить крипто-сессию", pt: "Adicionar sessão cripto", ja: "暗号通貨セッションを追加", pa: "ਕ੍ਰਿਪਟੋ ਸੈਸ਼ਨ ਸ਼ਾਮਲ ਕਰੋ", bn: "ক্রিপ্টো সেশন যোগ করুন", id: "Tambahkan sesi kripto", ur: "کرپٹو سیشن شامل کریں", ms: "Tambahkan sesi kripto", it: "Aggiungi sessione cripto", tr: "Kripto oturumu ekle", ta: "கிரிப்டோ அமர்வை சேர்க்கவும்", te: "క్రిప్టో సెషన్‌ను జోడించండి", ko: "암호화폐 세션 추가", vi: "Thêm phiên crypto", pl: "Dodaj sesję krypto", ro: "Adaugă sesiune crypto", nl: "Crypto-sessie toevoegen", el: "Προσθήκη συνεδρίας κρυπτογράφησης", th: "เพิ่มเซสชันคริปโต", cs: "Přidat krypto relaci", hu: "Kripto munkamenet hozzáadása", sv: "Lägg till krypto-session", da: "Tilføj krypto-session" })}
      </h1>
      <div className="h-6" />
      <div className="flex items-center justify-center">
        <CryptoAccountCard
          title={title}
          subtitle={subtitle}
          color={color}
          index={index}
          flip={flipped}
          onFlipChange={setFlipped} />
      </div>
      <form className="grow flex flex-col"
        onSubmit={Events.preventDefault}>
        <input className="hidden"
          autoComplete="off"
          name="username" />
        <div className="h-6" />
        <div className="font-medium">
          {Lang.match({ en: "Title", zh: "标题", hi: "शीर्षक", es: "Título", ar: "العنوان", fr: "Titre", de: "Titel", ru: "Название", pt: "Título", ja: "タイトル", pa: "ਸਿਰਲੇਖ", bn: "শিরোনাম", id: "Judul", ur: "عنوان", ms: "Judul", it: "Titolo", tr: "Başlık", ta: "தலைப்பு", te: "శీర్షిక", ko: "제목", vi: "Tiêu đề", pl: "Tytuł", ro: "Titlu", nl: "Titel", el: "Τίτλος", th: "หัวข้อเรื่อง", cs: "Název", hu: "Cím", sv: "Titel", da: "Titel" })}
        </div>
        <div className="text-default-contrast">
          {Lang.match({ en: "A name to identify this session.", zh: "用于识别此会话的名称。", hi: "इस सत्र की पहचान करने के लिए एक नाम।", es: "Un nombre para identificar esta sesión.", ar: "اسم لتحديد هذه الجلسة.", fr: "Un nom pour identifier cette session.", de: "Ein Name zur Identifizierung dieser Sitzung.", ru: "Имя для идентификации этой сессии.", pt: "Um nome para identificar esta sessão.", ja: "このセッションを識別するための名前。", pa: "ਇਸ ਸੈਸ਼ਨ ਦੀ ਪਛਾਣ ਕਰਨ ਲਈ ਇੱਕ ਨਾਮ।", bn: "এই সেশনটি সনাক্ত করার জন্য একটি নাম।", id: "Nama untuk mengidentifikasi sesi ini.", ur: "اس سیشن کی شناخت کے لیے ایک نام۔", ms: "Nama untuk mengenal pasti sesi ini.", it: "Un nome per identificare questa sessione.", tr: "Bu oturumu tanımlamak için bir ad.", ta: "இந்த அமர்வை அடையாளம் காண ஒரு பெயர்.", te: "ఈ సెషన్‌ను గుర్తించడానికి ఒక పేరు.", ko: "이 세션을 식별하기 위한 이름.", vi: "Một tên để xác định phiên này.", pl: "Nazwa do identyfikacji tej sesji.", ro: "Un nume pentru a identifica această sesiune.", nl: "Een naam om deze sessie te identificeren.", el: "Ένα όνομα για να αναγνωρίσετε αυτήν τη συνεδρία.", th: "ชื่อเพื่อระบุเซสชันนี้", cs: "Název pro identifikaci této relace.", hu: "Egy név ennek a munkamenetnek az azonosításához.", sv: "Ett namn för att identifiera denna session.", da: "Et navn til at identificere denne session." })}
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <input className="w-full focus-visible:outline-none"
            autoComplete="off"
            placeholder="Uniswap"
            onChange={e => setTitle(e.target.value)}
            value={$title} />
        </div>
        <div className="h-6" />
        <div className="font-medium">
          {Lang.match({ en: "WalletConnect code", zh: "WalletConnect 代码", hi: "WalletConnect कोड", es: "Código WalletConnect", ar: "رمز WalletConnect", fr: "Code WalletConnect", de: "WalletConnect-Code", ru: "Код WalletConnect", pt: "Código WalletConnect", ja: "WalletConnectコード", pa: "WalletConnect ਕੋਡ", bn: "WalletConnect কোড", id: "Kode WalletConnect", ur: "والٹ کنیکٹ کوڈ", ms: "Kode WalletConnect", it: "Codice WalletConnect", tr: "WalletConnect kodu", ta: "WalletConnect குறியீடு", te: "WalletConnect కోడ్", ko: "WalletConnect 코드", vi: "Mã WalletConnect", pl: "Kod WalletConnect", ro: "Codul WalletConnect", nl: "WalletConnect-code", el: "Κωδικός WalletConnect ", th: "รหัส WalletConnect ", cs: "Kód WalletConnect ", hu: "WalletConnect kód ", sv: "WalletConnect-kod ", da: "WalletConnect-kode" })}
        </div>
        <div className="text-default-contrast">
          {Lang.match({ en: "Your WalletConnect pairing code.", zh: "您的 WalletConnect 配对代码。", hi: "आपका WalletConnect पेयरिंग कोड।", es: "Tu código de emparejamiento de WalletConnect.", ar: "رمز الاقتران الخاص بك في WalletConnect.", fr: "Votre code de jumelage WalletConnect.", de: "Ihr WalletConnect-Kopplungscode.", ru: "Ваш код сопряжения WalletConnect.", pt: "Seu código de pareamento do WalletConnect.", ja: "あなたのWalletConnectペアリングコード。", pa: "ਤੁਹਾਡਾ WalletConnect ਜੋੜਨ ਕੋਡ।", bn: "আপনার WalletConnect পেয়ারিং কোড।", id: "Kode pasangan WalletConnect Anda.", ur: "آپ کا WalletConnect جوڑنے کا کوڈ۔", ms: "Kode pasangan WalletConnect Anda.", it: "Il tuo codice di accoppiamento di WalletConnect.", tr: "WalletConnect eşleştirme kodunuz.", ta: "உங்கள் WalletConnect ஜோடிப்புக் குறியீடு.", te: "మీ WalletConnect జతకరణ కోడ్.", ko: "귀하의 WalletConnect 페어링 코드입니다.", vi: "Mã ghép nối WalletConnect của bạn.", pl: "Twój kod parowania WalletConnect.", ro: "Codul de împerechere al WalletConnect.", nl: "Uw WalletConnect-koppelingscode.", el: "Ο κωδικός ζευγαρώματος του WalletConnect σας. ", th: "รหัสจับคู่ของคุณบน WalletConnect. ", cs: "Váš kód pro párování s WalletConnect. ", hu: "A WalletConnect párosító kódja. ", sv: "Din WalletConnect-parningskod. ", da: "Din WalletConnect-parringskode." })}
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <input className="w-full focus-visible:outline-none"
            autoComplete="off"
            type={flipped ? "text" : "password"}
            placeholder="wc:..."
            onChange={e => setUrl(e.target.value)}
            value={$url} />
          <div className="flex items-center gap-2">
            <button className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none"
              type="button"
              onClick={() => setFlipped(x => !x)}>
              <InButton>
                {flipped ? <Outline.EyeSlashIcon className="size-5" /> : <Outline.EyeIcon className="size-5" />}
              </InButton>
            </button>
            <UrlPageAnchor />
          </div>
        </div>
        <div className="h-6" />
        <div className="font-medium">
          {Lang.match({ en: "Notes", zh: "备注", hi: "नोट्स", es: "Notas", ar: "ملاحظات", fr: "Remarques", de: "Notizen", ru: "Заметки", pt: "Notas", ja: "ノート", pa: "ਨੋਟਸ", bn: "নোটস", id: "Catatan", ur: "نوٹس", ms: "Catatan", it: "Note", tr: "Notlar", ta: "குறிப்புகள்", te: "గమనికలు", ko: "노트", vi: "Ghi chú", pl: "Notatki", ro: "Note", nl: "Notities", el: "Σημειώσεις", th: "บันทึกย่อ", cs: "Poznámky", hu: "Jegyzetek", sv: "Anteckningar", da: "Noter" })}
        </div>
        <div className="text-default-contrast">
          {Lang.match({ en: "Any additional information.", zh: "任何附加信息。", hi: "कोई अतिरिक्त जानकारी।", es: "Cualquier información adicional.", ar: "أي معلومات إضافية.", fr: "Toute information supplémentaire.", de: "Alle zusätzlichen Informationen.", ru: "Любая дополнительная информация.", pt: "Qualquer informação adicional.", ja: "追加情報。", pa: "ਕੋਈ ਵੀ ਵਾਧੂ ਜਾਣਕਾਰੀ।", bn: "যেকোনও অতিরিক্ত তথ্য।", id: "Informasi tambahan apa pun.", ur: "کوئی اضافی معلومات۔", ms: "Sebarang maklumat tambahan.", it: "Qualsiasi informazione aggiuntiva.", tr: "Herhangi bir ek bilgi.", ta: "எந்தவொரு கூடுதல் தகவலும்.", te: "ఏదైనా అదనపు సమాచారం.", ko: "추가 정보.", vi: "Bất kỳ thông tin bổ sung nào.", pl: "Wszelkie dodatkowe informacje.", ro: "Orice informație suplimentară.", nl: "Eventuele aanvullende informatie.", el: "Οποιαδήποτε επιπλέον πληροφορία.", th: "ข้อมูลเพิ่มเติมใด ๆ.", cs: "Jakékoli další informace.", hu: "Bármilyen további információ.", sv: "Eventuell ytterligare information.", da: "Eventuelle yderligere oplysninger." })}
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex flex-col gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <textarea className="w-full resize-none focus-visible:outline-none"
            rows={6}
            placeholder={Lang.match({ en: "I use this session for...", zh: "我使用此会话来...", hi: "मैं इस सत्र का उपयोग करता हूं...", es: "Uso esta sesión para...", ar: "أستخدم هذا الجلسة ل...", fr: "J'utilise cette session pour...", de: "Ich verwende diese Sitzung für...", ru: "Я использую эту сессию для...", pt: "Eu uso esta sessão para...", ja: "このセッションは...のために使用します", pa: "ਮੈਂ ਇਸ ਸੈਸ਼ਨ ਨੂੰ... ਲਈ ਵਰਤਦਾ ਹਾਂ", bn: "আমি এই সেশনটি... জন্য ব্যবহার করি", id: "Saya menggunakan sesi ini untuk...", ur: "میں اس سیشن کو... کے لیے استعمال کرتا ہوں", ms: "Saya menggunakan sesi ini untuk...", it: "Uso questa sessione per...", tr: "Bu oturumu... için kullanıyorum", ta: "நான் இந்த அமர்வை... க்காக பயன்படுத்துகிறேன்", te: "నేను ఈ సెషన్‌ను... కోసం ఉపయోగిస్తున్నాను", ko: "이 세션은...에 사용합니다", vi: "Tôi sử dụng phiên này cho...", pl: "Używam tej sesji do...", ro: "Eu uso esta sessão para...", nl: "Ik gebruik deze sessie voor...", el: "Χρησιμοποιώ αυτήν τη συνεδρία για...", th: "ฉันใช้เซสชันนี้สำหรับ...", cs: "Používám tuto relaci pro...", hu: "Ezt a munkamenetet arra használom, hogy...", sv: "Jag använder denna session för...", da: "Jeg bruger denne session til..." })}
            onChange={e => setNotes(e.target.value)}
            value={$notes} />
        </div>
        <div className="h-8" />
        <div className="flex items-center flex-wrap-reverse gap-2">
          {session.value.user.fsfh != null &&
            <WideOppositeButton
              type="button"
              disabled={error != null}
              onClick={onClick}>
              {error != null ? error : Lang.match({ en: "Save", zh: "保存", hi: "सहेजें", es: "Guardar", ar: "حفظ", fr: "Enregistrer", de: "Speichern", ru: "Сохранить", pt: "Salvar", ja: "保存", pa: "ਸੰਭਾਲੋ", bn: "সংরক্ষণ করুন", id: "Simpan", ur: "محفوظ کریں", ms: "Simpan", it: "Salva", tr: "Kaydet", ta: "சேமிக்கவும்", te: "సేవ్ చేయండి", ko: "저장", vi: "Lưu", pl: "Zapisz", ro: "Salvează", nl: "Opslaan", el: "Αποθήκευση ", th: "บันทึก ", cs: "Uložit ", hu: "Mentés ", sv: "Spara ", da: "Gem" })}
            </WideOppositeButton>}
          {session.value.user.fsfh == null &&
            <WideOppositeButton
              type="button"
              disabled={error != null}
              onClick={onClick}>
              {error != null ? error : Lang.match({ en: "Save", zh: "保存", hi: "सहेजें", es: "Guardar", ar: "حفظ", fr: "Enregistrer", de: "Speichern", ru: "Сохранить", pt: "Salvar", ja: "保存", pa: "ਸੰਭਾਲੋ", bn: "সংরক্ষণ করুন", id: "Simpan", ur: "محفوظ کریں", ms: "Simpan", it: "Salva", tr: "Kaydet", ta: "சேமிக்கவும்", te: "సేవ్ చేయండి", ko: "저장", vi: "Lưu", pl: "Zapisz", ro: "Salvează", nl: "Opslaan", el: "Αποθήκευση ", th: "บันทึก ", cs: "Uložit ", hu: "Mentés ", sv: "Spara ", da: "Gem" })}
            </WideOppositeButton>}
        </div>
      </form>
    </div>
  </Fragment>
}

export function UrlPageAnchor() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, "/url")

  return <a className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none"
    href={coords.url.hash}
    onClick={coords.onClick}
    onKeyDown={coords.onKeyDown}>
    <InOther>
      <Outline.QrCodeIcon className="size-5" />
    </InOther>
  </a>
}

export function CryptoSessionAnchor(props: { $entry: KDBX.Inner.KeePassFile.Entry } & { index: number }) {
  const { $entry, index } = props

  const title = useMemo(() => {
    return $entry.getStringByKeyOrNull("Title")?.getValueOrThrow().get()
  }, [$entry])

  const color = useMemo(() => {
    return $entry.getStringByKeyOrNull("Color")?.getValueOrThrow().get()
  }, [$entry])

  return <Fragment>
    <a className="group w-[320px] aspect-video p-4 z-10 rounded-xl bg-default text-default border-2 border-default-contrast select-none hover:translate-x-3 focus-visible:outline-none focus-visible:translate-x-3 transition-transform
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
      data-color={color}>
      <div className="flex items-center justify-between">
        <div className="font-medium text-xl">
          {title}
        </div>
        <div className="absolute top-0 right-0 -translate-y-1.5 translate-x-1.5 flex size-4">
          <div className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
          <div className="relative inline-flex size-4 rounded-full bg-sky-500" />
        </div>
      </div>
    </a>
  </Fragment>
}

export function CryptoSubaccountAddressMenuAnchor() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, "/address")

  return <WideNakedMenuAnchor
    href={coords.url.hash}
    onClick={coords.onClick}
    onKeyDown={coords.onKeyDown}>
    <Outline.AtSymbolIcon className="size-5" />
    {Lang.match({ en: "Address", zh: "地址", hi: "पता", es: "Dirección", ar: "عنوان", fr: "Adresse", de: "Adresse", ru: "Адрес", pt: "Endereço", ja: "アドレス", pa: "ਪਤਾ", bn: "ঠিকানা", id: "Alamat", ur: "پتہ", ms: "Alamat", it: "Indirizzo", tr: "Adres", ta: "முகவரி", te: "చిరునామా", ko: "주소", vi: "Địa chỉ", pl: "Adres", ro: "Adresa", nl: "Adres", el: "Διεύθυνση ", th: "ที่อยู่ ", cs: "Adresa ", hu: "Cím ", sv: "Adress ", da: "Adresse" })}
  </WideNakedMenuAnchor>
}

export function CryptoSubaccountExportMenuAnchor() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, "/export")

  return <WideNakedMenuAnchor
    href={coords.url.hash}
    onClick={coords.onClick}
    onKeyDown={coords.onKeyDown}>
    <Outline.ArrowUpOnSquareIcon className="size-5" />
    {Lang.match({ en: "Export", zh: "导出", hi: "निर्यात", es: "Exportar", ar: "تصدير", fr: "Exporter", de: "Exportieren", ru: "Экспорт", pt: "Exportar", ja: "エクスポート", pa: "ਨਿਰਯਾਤ", bn: "রপ্তানি", id: "Ekspor", ur: "برآمد کریں", ms: "Ekspor", it: "Esporta", tr: "Dışa aktar", ta: "ஏற்றுமதி", te: "ఎగుమతి", ko: "내보내기", vi: "Xuất khẩu", pl: "Eksportuj", ro: "Exportați", nl: "Exporteren", el: "Εξαγωγή ", th: "ส่งออก ", cs: "Exportovat ", hu: "Exportálás ", sv: "Exportera ", da: "Eksporter" })}
  </WideNakedMenuAnchor>
}

export function CryptoSubaccountMenu(props: { $entry: KDBX.Inner.KeePassFile.Entry } & { index: number }) {
  const { $entry, index } = props

  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  return <Fragment>
    <SubpathProvider value={hash}>
      {hash.url.pathname === "/address" &&
        <PathBoard>
          <CryptoSubaccountAddressPage $entry={$entry} index={index} />
        </PathBoard>}
      {hash.url.pathname === "/export" &&
        <PathBoard>
          <CryptoSubaccountExportPage $entry={$entry} index={index} />
        </PathBoard>}
    </SubpathProvider>
    <div className="flex flex-col text-left gap-2">
      <CryptoSubaccountAddressMenuAnchor />
      <CryptoSubaccountExportMenuAnchor />
    </div>
  </Fragment>
}

export function CryptoSubaccountAddressPage(props: { $entry: KDBX.Inner.KeePassFile.Entry } & { index: number }) {
  const { $entry, index } = props

  const [flipped, setFlipped] = useState(false)

  const title = useMemo(() => {
    return $entry.getStringByKeyOrNull("Title")?.getValueOrThrow().get()
  }, [$entry])

  const color = useMemo(() => {
    return $entry.getStringByKeyOrNull("Color")?.getValueOrThrow().get()
  }, [$entry])

  const seedphrase = useMemo(() => {
    return $entry.getStringByKeyOrNull("SeedPhrase")?.getValueOrThrow().get()
  }, [$entry])

  const [ethereum, setEthereum] = useState<Nullable<string>>()

  const getEthereumOrThrow = useCallback(async () => {
    if (seedphrase == null)
      return

    const seed = new BitcoinSeedKey(await BitcoinSeedPhrase.derive(seedphrase))

    const xsig = await seed.derive(`m/44'/60'/0'/0/${index}`)
    const upub = secp256k1.getPublicKey(xsig.key, false)

    return `0x${keccak_256(upub.slice(1)).slice(-20).toHex()}`
  }, [seedphrase, index])

  useEffect(() => {
    getEthereumOrThrow().then(setEthereum).catch(console.error)
  }, [getEthereumOrThrow])

  const [solana, setSolana] = useState<Nullable<string>>()

  const getSolanaOrThrow = useCallback(async () => {
    if (seedphrase == null)
      return

    const seed = new Ed25519SeedKey(await BitcoinSeedPhrase.derive(seedphrase))

    const xsig = await seed.derive(`m/44'/501'/${index}'/0'`)
    const upub = await Ed25519.publish(xsig.key)

    return base58.encode(upub)
  }, [seedphrase, index])

  useEffect(() => {
    getSolanaOrThrow().then(setSolana).catch(console.error)
  }, [getSolanaOrThrow])

  const copyTheEthereum = useCopy(ethereum)
  const copyTheSolana = useCopy(solana)

  return <div className="flex flex-col grow p-6">
    <div className="flex items-center justify-between">
      <h1 className="text-xl font-medium">
        {Lang.match({ en: "Crypto subaccount address", zh: "加密子账户地址", hi: "क्रिप्टो उपखाता पता", es: "Dirección de subcuenta de criptomonedas", ar: "عنوان الحساب الفرعي المشفر", fr: "Adresse du sous-compte crypto", de: "Krypto-Unterkonto-Adresse", ru: "Адрес крипто-субсчета", pt: "Endereço da subconta de criptomoeda", ja: "暗号サブアカウントのアドレス", pa: "ਕ੍ਰਿਪਟੋ ਉਪਖਾਤਾ ਪਤਾ", bn: "ক্রিপ্টো সাবঅ্যাকাউন্ট ঠিকানা", id: "Alamat subakun kripto", ur: "کرپٹو سب اکاؤنٹ کا پتہ", ms: "Alamat subakun kripto", it: "Indirizzo del sottoconto crittografico", tr: "Kripto alt hesap adresi", ta: "கிரிப்டோ உபகணக்கு முகவரி", te: "క్రిప్టో ఉపఖాతా చిరునామా", ko: "암호화 하위 계정 주소", vi: "Địa chỉ tài khoản phụ tiền điện tử", pl: "Adres konta podrzędnego kryptowalutowego", ro: "Adresa subcontului criptografic", nl: "Crypto subaccount adres", el: "Διεύθυνση υπολογαριασμού κρυπτογράφησης ", th: "ที่อยู่บัญชีย่อยคริปโต ", cs: "Adresa krypto podúčtu ", hu: "Kripto alszámla címe ", sv: "Kryptounderkonto-adress ", da: "Krypto underkonto adresse" })}
      </h1>
    </div>
    <div className="h-6" />
    <div className="flex flex-col items-center justify-center">
      <CryptoAccountCard
        title={title}
        color={color}
        index={index}
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
          {Lang.match({ en: "Ethereum address", zh: "以太坊地址", hi: "एथेरियम पता", es: "Dirección de Ethereum", ar: "عنوان إيثريوم", fr: "Adresse Ethereum", de: "Ethereum-Adresse", ru: "Адрес Ethereum", pt: "Endereço Ethereum", ja: "イーサリアムアドレス", pa: "ਇਥਰੀਅਮ ਪਤਾ", bn: "ইথেরিয়াম ঠিকানা", id: "Alamat Ethereum", ur: "ایتھریم ایڈریس", ms: "Alamat Ethereum", it: "Indirizzo Ethereum", tr: "Ethereum adresi", ta: "எதீரியம் முகவரி", te: "ఎతీరియం చిరునామా", ko: "이더리움 주소", vi: "Địa chỉ Ethereum", pl: "Adres Ethereum", ro: "Adresa Ethereum", nl: "Ethereum adres", el: "Διεύθυνση Ethereum ", th: "ที่อยู่ Ethereum ", cs: "Adresa Etherea ", hu: "Ethereum cím ", sv: "Ethereum-adress ", da: "Ethereum-adresse" })}
        </div>
        <div className="text-default-contrast">
          {Lang.match({ en: "Your Ethereum (EVM, ERC20) address.", zh: "您的以太坊（EVM、ERC20）地址。", hi: "आपका एथेरियम (EVM, ERC20) पता।", es: "Tu dirección de Ethereum (EVM, ERC20).", ar: "عنوان إيثريوم الخاص بك (EVM، ERC20).", fr: "Votre adresse Ethereum (EVM, ERC20).", de: "Ihre Ethereum-Adresse (EVM, ERC20).", ru: "Ваш адрес Ethereum (EVM, ERC20).", pt: "Seu endereço Ethereum (EVM, ERC20).", ja: "あなたのイーサリアム（EVM、ERC20）アドレス。", pa: "ਤੁਹਾਡਾ ਇਥਰੀਅਮ (EVM, ERC20) ਪਤਾ।", bn: "আপনার ইথেরিয়াম (EVM, ERC20) ঠিকানা।", id: "Alamat Ethereum Anda (EVM, ERC20).", ur: "آپ کا ایتھریم (EVM، ERC20) ایڈریس۔", ms: "Alamat Ethereum Anda (EVM, ERC20).", it: "Il tuo indirizzo Ethereum (EVM, ERC20).", tr: "Ethereum adresiniz (EVM, ERC20).", ta: "உங்கள் எதீரியம் (EVM, ERC20) முகவரி.", te: "మీ ఎతీరియం (EVM, ERC20) చిరునామా.", ko: "귀하의 이더리움(EVM, ERC20) 주소입니다.", vi: "Địa chỉ Ethereum của bạn (EVM, ERC20).", pl: "Twój adres Ethereum (EVM, ERC20).", ro: "Adresa ta de Ethereum (EVM, ERC20).", nl: "Uw Ethereum-adres (EVM, ERC20).", el: "Η διεύθυνση Ethereum σας (EVM, ERC20). ", th: "ที่อยู่ Ethereum ของคุณ (EVM, ERC20). ", cs: "Vaše adresa Ethereum (EVM, ERC20). ", hu: "Az Ön Ethereum címe (EVM, ERC20). ", sv: "Din Ethereum-adress (EVM, ERC20). ", da: "Din Ethereum-adresse (EVM, ERC20)." })}
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex flex-col gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <textarea className="w-full focus-visible:outline-none"
            rows={2}
            readOnly
            onFocus={e => e.currentTarget.select()}
            value={ethereum || ""} />
        </div>
        <div className="h-2" />
        <div className="flex items-center gap-2">
          <WideContrastButton
            onClick={copyTheEthereum.copyOrAlert}>
            {copyTheEthereum.copied ? <Outline.CheckIcon className="size-5" /> : <Outline.DocumentDuplicateIcon className="size-5" />}
            {copyTheEthereum.copied ? Lang.match({ en: "Copied", zh: "已复制", hi: "कॉपी किया गया", es: "Copiado", ar: "تم النسخ", fr: "Copié", de: "Kopiert", ru: "Скопировано", pt: "Copiado", ja: "コピーしました", pa: "ਨਕਲ ਕੀਤਾ", bn: "কপি করা হয়েছে", id: "Disalin", ur: "کاپی کیا گیا", ms: "Disalin", it: "Copiato", tr: "Kopyalandı", ta: "நகலெடுக்கப்பட்டது", te: "నకలించబడింది", ko: "복사됨", vi: "Đã sao chép", pl: "Skopiowano", ro: "Copiat", nl: "Gekopieerd", el: "Αντιγράφηκε ", th: "คัดลอกแล้ว ", cs: "Zkopírováno ", hu: "Másolva ", sv: "Kopierat ", da: "Kopieret" }) : Lang.match({ en: "Copy", zh: "复制", hi: "कॉपी करें", es: "Copiar", ar: "نسخ", fr: "Copier", de: "Kopieren", ru: "Копировать", pt: "Copiar", ja: "コピー", pa: "ਨਕਲ ਕਰੋ", bn: "কপি করুন", id: "Salin", ur: "کاپی کریں", ms: "Salin", it: "Copia", tr: "Kopyala", ta: "நகலெடுக்கவும்", te: "నకలించు", ko: "복사", vi: "Sao chép", pl: "Kopiuj", ro: "Copiați", nl: "Kopiëren", el: "Αντιγραφή ", th: "คัดลอก ", cs: "Kopírovat ", hu: "Másolás ", sv: "Kopiera ", da: "Kopier" })}
          </WideContrastButton>
        </div>
      </Fragment>
      <Fragment>
        <div className="h-6" />
        <div className="font-medium">
          {Lang.match({ en: "Solana address", zh: "索拉纳地址", hi: "सोलाना पता", es: "Dirección de Solana", ar: "عنوان سولانا", fr: "Adresse Solana", de: "Solana-Adresse", ru: "Адрес Solana", pt: "Endereço Solana", ja: "ソラナアドレス", pa: "ਸੋਲਾਨਾ ਪਤਾ", bn: "সোলানা ঠিকানা", id: "Alamat Solana", ur: "سولانا ایڈریس", ms: "Alamat Solana", it: "Indirizzo Solana", tr: "Solana adresi", ta: "சோலானா முகவரி", te: "సోలానా చిరునామా", ko: "솔라나 주소", vi: "Địa chỉ Solana", pl: "Adres Solana", ro: "Adresa Solana", nl: "Solana adres", el: "Διεύθυνση Solana ", th: "ที่อยู่ Solana ", cs: "Adresa Solana ", hu: "Solana cím ", sv: "Solana-adress ", da: "Solana-adresse" })}
        </div>
        <div className="text-default-contrast">
          {Lang.match({ en: "Your Solana (SVM) address.", zh: "您的索拉纳 (SVM) 地址。", hi: "आपका सोलाना (SVM) पता।", es: "Su dirección de Solana (SVM).", ar: "عنوان سولانا (SVM) الخاص بك.", fr: "Votre adresse Solana (SVM).", de: "Ihre Solana (SVM) Adresse.", ru: "Ваш адрес Solana (SVM).", pt: "Seu endereço Solana (SVM).", ja: "あなたのソラナ (SVM) アドレス。", pa: "ਤੁਹਾਡਾ ਸੋਲਾਨਾ (SVM) ਪਤਾ।", bn: "আপনার সোলানা (SVM) ঠিকানা।", id: "Alamat Solana (SVM) Anda.", ur: "آپ کا سولانا (SVM) ایڈریس۔", ms: "Alamat Solana (SVM) anda.", it: "Il tuo indirizzo Solana (SVM).", tr: "Solana (SVM) adresiniz.", ta: "உங்கள் சோலானா (SVM) முகவரி.", te: "మీ సొలానా (SVM) చిరునామా.", ko: "귀하의 솔라나 (SVM) 주소.", vi: "Địa chỉ Solana (SVM) của bạn.", pl: "Twój adres Solana (SVM).", ro: "Adresa dvs. Solana (SVM).", nl: "Uw Solana (SVM) adres.", el: "Η διεύθυνση Solana (SVM) σας.", th: "ที่อยู่ Solana (SVM) ของคุณ.", cs: "Vaše adresa Solana (SVM).", hu: "Az Ön Solana (SVM) címe.", sv: "Din Solana (SVM) adress.", da: "Din Solana (SVM) adresse." })}
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex flex-col gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <textarea className="w-full focus-visible:outline-none"
            rows={2}
            readOnly
            onFocus={e => e.currentTarget.select()}
            value={solana || ""} />
        </div>
        <div className="h-2" />
        <div className="flex items-center gap-2">
          <WideContrastButton
            onClick={copyTheSolana.copyOrAlert}>
            {copyTheSolana.copied ? <Outline.CheckIcon className="size-5" /> : <Outline.DocumentDuplicateIcon className="size-5" />}
            {copyTheSolana.copied ? Lang.match({ en: "Copied", zh: "已复制", hi: "कॉपी किया गया", es: "Copiado", ar: "تم النسخ", fr: "Copié", de: "Kopiert", ru: "Скопировано", pt: "Copiado", ja: "コピーしました", pa: "ਨਕਲ ਕੀਤਾ", bn: "কপি করা হয়েছে", id: "Disalin", ur: "کاپی کیا گیا", ms: "Disalin", it: "Copiato", tr: "Kopyalandı", ta: "நகலெடுக்கப்பட்டது", te: "నకలించబడింది", ko: "복사됨", vi: "Đã sao chép", pl: "Skopiowano", ro: "Copiat", nl: "Gekopieerd", el: "Αντιγράφηκε ", th: "คัดลอกแล้ว ", cs: "Zkopírováno ", hu: "Másolva ", sv: "Kopierat ", da: "Kopieret" }) : Lang.match({ en: "Copy", zh: "复制", hi: "कॉपी करें", es: "Copiar", ar: "نسخ", fr: "Copier", de: "Kopieren", ru: "Копировать", pt: "Copiar", ja: "コピー", pa: "ਨਕਲ ਕਰੋ", bn: "কপি করুন", id: "Salin", ur: "کاپی کریں", ms: "Salin", it: "Copia", tr: "Kopyala", ta: "நகலெடுக்கவும்", te: "నకలించు", ko: "복사", vi: "Sao chép", pl: "Kopiuj", ro: "Copiați", nl: "Kopiëren", el: "Αντιγραφή ", th: "คัดลอก ", cs: "Kopírovat ", hu: "Másolás ", sv: "Kopiera ", da: "Kopier" })}
          </WideContrastButton>
        </div>
      </Fragment>
    </form>
  </div>
}

export function CryptoSubaccountExportPage(props: { $entry: KDBX.Inner.KeePassFile.Entry } & { index: number }) {
  const { $entry, index } = props

  const [flipped, setFlipped] = useState(false)

  const title = useMemo(() => {
    return $entry.getStringByKeyOrNull("Title")?.getValueOrThrow().get()
  }, [$entry])

  const color = useMemo(() => {
    return $entry.getStringByKeyOrNull("Color")?.getValueOrThrow().get()
  }, [$entry])

  const seedphrase = useMemo(() => {
    return $entry.getStringByKeyOrNull("SeedPhrase")?.getValueOrThrow().get()
  }, [$entry])

  const [ethereum, setEthereum] = useState<Nullable<string>>()

  const getEthereumOrThrow = useCallback(async () => {
    if (seedphrase == null)
      return

    const seed = new BitcoinSeedKey(await BitcoinSeedPhrase.derive(seedphrase))

    const xsig = await seed.derive(`m/44'/60'/0'/0/${index}`)

    return `0x${xsig.key.toHex()}`
  }, [seedphrase, index])

  useEffect(() => {
    getEthereumOrThrow().then(setEthereum).catch(console.error)
  }, [getEthereumOrThrow])

  const [solana, setSolana] = useState<Nullable<string>>()

  const getSolanaOrThrow = useCallback(async () => {
    if (seedphrase == null)
      return

    const seed = new Ed25519SeedKey(await BitcoinSeedPhrase.derive(seedphrase))

    const xsig = await seed.derive(`m/44'/501'/${index}'/0'`)
    const upub = await Ed25519.publish(xsig.key)

    const concat = new Uint8Array(xsig.key.length + upub.length)

    const cursor = new Cursor(concat)
    cursor.writeOrThrow(xsig.key)
    cursor.writeOrThrow(upub)

    return base58.encode(concat)
  }, [seedphrase, index])

  useEffect(() => {
    getSolanaOrThrow().then(setSolana).catch(console.error)
  }, [getSolanaOrThrow])

  const copyTheEthereum = useCopy(ethereum)
  const copyTheSolana = useCopy(solana)

  return <div className="flex flex-col grow p-6">
    <div className="flex items-center justify-between">
      <h1 className="text-xl font-medium">
        {Lang.match({ en: "Export crypto subaccount", zh: "导出加密子账户", hi: "क्रिप्टो उपखाता निर्यात करें", es: "Exportar subcuenta de criptomonedas", ar: "تصدير الحساب الفرعي المشفر", fr: "Exporter le sous-compte crypto", de: "Krypto-Unterkonto exportieren", ru: "Экспорт крипто-субсчета", pt: "Exportar subconta de criptomoeda", ja: "暗号サブアカウントをエクスポート", pa: "ਕ੍ਰਿਪਟੋ ਉਪਖਾਤਾ ਨਿਰਯਾਤ ਕਰੋ", bn: "ক্রিপ্টো সাবঅ্যাকাউন্ট রপ্তানি করুন", id: "Ekspor subakun kripto", ur: "کرپٹو سب اکاؤنٹ برآمد کریں", ms: "Ekspor subakun kripto", it: "Esporta sottoconto crittografico", tr: "Kripto alt hesabı dışa aktar", ta: "கிரிப்டோ உபகணக்கு ஏற்றுமதி செய்யவும்", te: "క్రిప్టో ఉపఖాతా ఎగుమతి చేయండి", ko: "암호화 하위 계정 내보내기", vi: "Xuất khẩu tài khoản phụ tiền điện tử", pl: "Eksportuj konto podrzędne kryptowalutowe", ro: "Exportați subcontul criptografic", nl: "Crypto subaccount exporteren", el: "Εξαγωγή υπολογαριασμού κρυπτογράφησης ", th: "ส่งออกบัญชีย่อยคริปโต ", cs: "Exportovat krypto podúčet ", hu: "Kripto alszámla exportálása ", sv: "Exportera kryptounderkonto ", da: "Eksporter krypto underkonto" })}
      </h1>
    </div>
    <div className="h-6" />
    <div className="flex flex-col items-center justify-center">
      <CryptoAccountCard
        title={title}
        color={color}
        index={index}
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
          {Lang.match({ en: "Ethereum private key", zh: "以太坊私钥", hi: "एथेरियम निजी कुंजी", es: "Clave privada de Ethereum", ar: "المفتاح الخاص لإيثريوم", fr: "Clé privée Ethereum", de: "Ethereum-Privatschlüssel", ru: "Приватный ключ Ethereum", pt: "Chave privada Ethereum", ja: "イーサリアムの秘密鍵", pa: "ਇਥਰੀਅਮ ਨਿੱਜੀ ਕੁੰਜੀ", bn: "ইথেরিয়াম ব্যক্তিগত চাবি", id: "Kunci pribadi Ethereum", ur: "ایتھریم پرائیویٹ کی", ms: "Kunci pribadi Ethereum", it: "Chiave privata Ethereum", tr: "Ethereum özel anahtarı", ta: "எதீரியம் தனிப்பட்ட விசை", te: "ఎతీరియం ప్రైవేట్ కీ", ko: "이더리움 개인 키", vi: "Khóa riêng Ethereum", pl: "Prywatny klucz Ethereum", ro: "Cheie privată Ethereum", nl: "Ethereum privésleutel", el: "Ιδιωτικό κλειδί Ethereum ", th: "คีย์ส่วนตัวของ Ethereum ", cs: "Soukromý klíč Etherea ", hu: "Ethereum privát kulcs ", sv: "Ethereum-privat nyckel ", da: "Ethereum privat nøgle" })}
        </div>
        <div className="text-default-contrast">
          {Lang.match({ en: "Your Ethereum (EVM, ERC20) private key in hexadecimal format.", zh: "您的以太坊 (EVM, ERC20) 私钥，十六进制格式。", hi: "आपकी एथेरियम (EVM, ERC20) निजी कुंजी हेक्साडेसिमल प्रारूप में।", es: "Su clave privada de Ethereum (EVM, ERC20) en formato hexadecimal.", ar: "مفتاحك الخاص بإيثريوم (EVM, ERC20) بتنسيق سداسي عشري.", fr: "Votre clé privée Ethereum (EVM, ERC20) au format hexadécimal.", de: "Ihr Ethereum (EVM, ERC20) privater Schlüssel im Hexadezimalformat.", ru: "Ваш приватный ключ Ethereum (EVM, ERC20) в шестнадцатеричном формате.", pt: "Sua chave privada Ethereum (EVM, ERC20) em formato hexadecimal.", ja: "あなたのイーサリアム (EVM, ERC20) 秘密鍵は16進数形式です。", pa: "ਤੁਹਾਡਾ ਇਥਰੀਅਮ (EVM, ERC20) ਨਿੱਜੀ ਕੁੰਜੀ ਹੇਕਸਾਡੈਸੀਮਲ ਫਾਰਮੈਟ ਵਿੱਚ।", bn: "আপনার ইথেরিয়াম (EVM, ERC20) ব্যক্তিগত চাবি হেক্সাডেসিমাল ফরম্যাটে।", id: "Kunci pribadi Ethereum (EVM, ERC20) Anda dalam format heksadesimal.", ur: "آپ کی ایثریوم (EVM, ERC20) پرائیویٹ کی ہیکساڈیسمل فارمیٹ میں۔", ms: "Kunci peribadi Ethereum (EVM, ERC20) anda dalam format heksadesimal.", it: "La tua chiave privata Ethereum (EVM, ERC20) in formato esadecimale.", tr: "Ethereum (EVM, ERC20) özel anahtarınız onaltılık formatta.", ta: "உங்கள் எதீரியம் (EVM, ERC20) தனிப்பட்ட விசை ஹெக்ஸாடெசிமல் வடிவத்தில்.", te: "మీ ఎథీరియం (EVM, ERC20) ప్రైవేట్ కీ హెక్సాడెసిమల్ ఫార్మాట్‌లో.", ko: "귀하의 이더리움 (EVM, ERC20) 개인 키는 16진수 형식입니다.", vi: "Khóa riêng Ethereum (EVM, ERC20) của bạn ở định dạng thập lục phân.", pl: "Twój prywatny klucz Ethereum (EVM, ERC20) w formacie szesnastkowym.", ro: "Cheia dvs. privată Ethereum (EVM, ERC20) în format hexadecimal.", nl: "Uw Ethereum (EVM, ERC20) privésleutel in hexadecimale indeling.", el: "Το ιδιωτικό σας κλειδί Ethereum (EVM, ERC20) σε δεκαεξαδική μορφή.", th: "คีย์ส่วนตัว Ethereum (EVM, ERC20) ของคุณในรูปแบบฐานสิบหก.", cs: "Váš soukromý klíč Ethereum (EVM, ERC20) v hexadecimálním formátu.", hu: "Az Ön Ethereum (EVM, ERC20) privát kulcsa hexadecimális formátumban.", sv: "Din Ethereum (EVM, ERC20) privata nyckel i hexadecimalt format.", da: "Din Ethereum (EVM, ERC20) private nøgle i hexadecimalt format." })}
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex flex-col gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <textarea className="w-full focus-visible:outline-none"
            rows={2}
            readOnly
            onFocus={e => flipped ? e.currentTarget.select() : undefined}
            value={flipped ? ethereum?.valueOf() : ethereum?.replaceAll(/./g, "•")} />
        </div>
        <div className="h-2" />
        <div className="flex items-center gap-2">
          <WideContrastButton
            onClick={() => setFlipped(x => !x)}>
            {flipped ? <Outline.EyeSlashIcon className="size-5" /> : <Outline.EyeIcon className="size-5" />}
            {flipped ? Lang.match({ en: "Hide", zh: "隐藏", hi: "छिपाएं", es: "Ocultar", ar: "إخفاء", fr: "Cacher", de: "Verbergen", ru: "Скрыть", pt: "Esconder", ja: "非表示", pa: "ਛੁਪਾਓ", bn: "লুকান", id: "Sembunyikan", ur: "چھپائیں", ms: "Sembunyikan", it: "Nascondi", tr: "Gizle", ta: "மறைவு", te: "దాచు", ko: "숨기기", vi: "Ẩn", pl: "Ukryj", ro: "Ascundeți", nl: "Verbergen", el: "Απόκρυψη ", th: "ซ่อน ", cs: "Skrýt ", hu: "Elrejtés ", sv: "Dölj ", da: "Skjul" }) : Lang.match({ en: "Show", zh: "显示", hi: "दिखाएं", es: "Mostrar", ar: "إظهار", fr: "Afficher", de: "Anzeigen", ru: "Показать", pt: "Mostrar", ja: "表示する", pa: "ਦਿਖਾਓ", bn: "দেখান", id: "Tampilkan", ur: "دکھائیں", ms: "Tampilkan", it: "Mostra", tr: "Göster", ta: "காட்டு", te: "తెరచు", ko: "보이기", vi: "Hiển thị", pl: "Pokaż", ro: "Afișați", nl: "Tonende weergeven ", el: "Εμφάνιση ", th: "แสดง ", cs: "Zobrazit ", hu: "Megjelenítés ", sv: "Visa ", da: "Vis" })}
          </WideContrastButton>
          <WideContrastButton
            onClick={copyTheEthereum.copyOrAlert}>
            {copyTheEthereum.copied ? <Outline.CheckIcon className="size-5" /> : <Outline.DocumentDuplicateIcon className="size-5" />}
            {copyTheEthereum.copied ? Lang.match({ en: "Copied", zh: "已复制", hi: "कॉपी किया गया", es: "Copiado", ar: "تم النسخ", fr: "Copié", de: "Kopiert", ru: "Скопировано", pt: "Copiado", ja: "コピーしました", pa: "ਨਕਲ ਕੀਤਾ", bn: "কপি করা হয়েছে", id: "Disalin", ur: "کاپی کیا گیا", ms: "Disalin", it: "Copiato", tr: "Kopyalandı", ta: "நகலெடுக்கப்பட்டது", te: "నకలించబడింది", ko: "복사됨", vi: "Đã sao chép", pl: "Skopiowano", ro: "Copiat", nl: "Gekopieerd", el: "Αντιγράφηκε ", th: "คัดลอกแล้ว ", cs: "Zkopírováno ", hu: "Másolva ", sv: "Kopierat ", da: "Kopieret" }) : Lang.match({ en: "Copy", zh: "复制", hi: "कॉपी करें", es: "Copiar", ar: "نسخ", fr: "Copier", de: "Kopieren", ru: "Копировать", pt: "Copiar", ja: "コピー", pa: "ਨਕਲ ਕਰੋ", bn: "কপি করুন", id: "Salin", ur: "کاپی کریں", ms: "Salin", it: "Copia", tr: "Kopyala", ta: "நகலெடுக்கவும்", te: "నకలించు", ko: "복사", vi: "Sao chép", pl: "Kopiuj", ro: "Copiați", nl: "Kopiëren ", el: "Αντιγραφή ", th: "คัดลอก ", cs: "Kopírovat ", hu: "Másolás ", sv: "Kopiera ", da: "Kopier" })}
          </WideContrastButton>
        </div>
      </Fragment>
      <Fragment>
        <div className="h-6" />
        <div className="font-medium">
          {Lang.match({ en: "Solana private key", zh: "索拉纳私钥", hi: "सोलाना निजी कुंजी", es: "Clave privada de Solana", ar: "المفتاح الخاص بسولانا", fr: "Clé privée Solana", de: "Solana-Privatschlüssel", ru: "Приватный ключ Solana", pt: "Chave privada Solana", ja: "ソラナの秘密鍵", pa: "ਸੋਲਾਨਾ ਨਿੱਜੀ ਕੁੰਜੀ", bn: "সোলানা ব্যক্তিগত চাবি", id: "Kunci pribadi Solana", ur: "سولانا پرائیویٹ کی", ms: "Kunci pribadi Solana", it: "Chiave privata Solana", tr: "Solana özel anahtarı", ta: "சோலானா தனிப்பட்ட விசை", te: "సోలానా ప్రైవేట్ కీ", ko: "솔라나 개인 키", vi: "Khóa riêng Solana", pl: "Prywatny klucz Solana", ro: "Cheie privată Solana", nl: "Solana privésleutel", el: "Ιδιωτικό κλειδί Solana ", th: "คีย์ส่วนตัวของ Solana ", cs: "Soukromý klíč Solana ", hu: "Solana privát kulcs ", sv: "Solana-privat nyckel ", da: "Solana privat nøgle" })}
        </div>
        <div className="text-default-contrast">
          {Lang.match({ en: "Your Solana (SVM) private key in base58 format.", zh: "您的索拉纳 (SVM) 私钥，base58 格式。", hi: "आपका सोलाना (SVM) निजी कुंजी बेस58 प्रारूप में।", es: "Su clave privada de Solana (SVM) en formato base58.", ar: "مفتاحك الخاص بسولانا (SVM) بتنسيق base58.", fr: "Votre clé privée Solana (SVM) au format base58.", de: "Ihr Solana (SVM) privater Schlüssel im base58-Format.", ru: "Ваш приватный ключ Solana (SVM) в формате base58.", pt: "Sua chave privada Solana (SVM) em formato base58.", ja: "あなたのソラナ (SVM) 秘密鍵はbase58形式です。", pa: "ਤੁਹਾਡਾ ਸੋਲਾਨਾ (SVM) ਨਿੱਜੀ ਕੁੰਜੀ ਬੇਸ58 ਫਾਰਮੈਟ ਵਿੱਚ।", bn: "আপনার সোলানা (SVM) ব্যক্তিগত চাবি বেস58 ফরম্যাটে।", id: "Kunci pribadi Solana (SVM) Anda dalam format base58.", ur: "آپ کا سولانا (SVM) پرائیویٹ کی base58 فارمیٹ میں۔", ms: "Kunci pribadi Solana (SVM) anda dalam format base58.", it: "La tua chiave privata Solana (SVM) in formato base58.", tr: "Solana (SVM) özel anahtarınız base58 formatında.", ta: "உங்கள் சோலானா (SVM) தனிப்பட்ட விசை base58 வடிவத்தில்.", te: "మీ సొలానా (SVM) ప్రైవేట్ కీ బేస్58 ఫార్మాట్‌లో.", ko: "귀하의 솔라나(SVM) 개인 키는 base58 형식입니다.", vi: "Khóa riêng Solana (SVM) của bạn ở định dạng base58.", pl: "Twój prywatny klucz Solana (SVM) w formacie base58.", ro: "Cheia dvs. privată Solana (SVM) în format base58.", nl: "Uw Solana (SVM) privésleutel in base58-formaat.", el: "Το ιδιωτικό σας κλειδί Solana (SVM) σε μορφή base58.", th: "คีย์ส่วนตัว Solana (SVM) ของคุณในรูปแบบ base58.", cs: "Váš soukromý klíč Solana (SVM) v formátu base58.", hu: "Az Ön Solana (SVM) privát kulcsa base58 formátumban.", sv: "Din Solana (SVM) privata nyckel i base58-format.", da: "Din Solana (SVM) private nøgle i base58-format." })}
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex flex-col gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <textarea className="w-full focus-visible:outline-none"
            rows={2}
            readOnly
            onFocus={e => flipped ? e.currentTarget.select() : undefined}
            value={flipped ? solana?.valueOf() : solana?.replaceAll(/./g, "•")} />
        </div>
        <div className="h-2" />
        <div className="flex items-center gap-2">
          <WideContrastButton
            onClick={() => setFlipped(x => !x)}>
            {flipped ? <Outline.EyeSlashIcon className="size-5" /> : <Outline.EyeIcon className="size-5" />}
            {flipped ? Lang.match({ en: "Hide", zh: "隐藏", hi: "छिपाएं", es: "Ocultar", ar: "إخفاء", fr: "Cacher", de: "Verbergen", ru: "Скрыть", pt: "Esconder", ja: "非表示", pa: "ਛੁਪਾਓ", bn: "লুকান", id: "Sembunyikan", ur: "چھپائیں", ms: "Sembunyikan", it: "Nascondi", tr: "Gizle", ta: "மறைவு", te: "దాచు", ko: "숨기기", vi: "Ẩn", pl: "Ukryj", ro: "Ascundeți", nl: "Verbergen", el: "Απόκρυψη ", th: "ซ่อน ", cs: "Skrýt ", hu: "Elrejtés ", sv: "Dölj ", da: "Skjul" }) : Lang.match({ en: "Show", zh: "显示", hi: "दिखाएं", es: "Mostrar", ar: "إظهار", fr: "Afficher", de: "Anzeigen", ru: "Показать", pt: "Mostrar", ja: "表示する", pa: "ਦਿਖਾਓ", bn: "দেখান", id: "Tampilkan", ur: "دکھائیں", ms: "Tampilkan", it: "Mostra", tr: "Göster", ta: "காட்டு", te: "తెరచు", ko: "보이기", vi: "Hiển thị", pl: "Pokaż", ro: "Afișați ", nl: "Tonende weergeven ", el: "Εμφάνιση ", th: "แสดง ", cs: "Zobrazit ", hu: "Megjelenítés ", sv: "Visa ", da: "Vis" })}
          </WideContrastButton>
          <WideContrastButton
            onClick={copyTheSolana.copyOrAlert}>
            {copyTheSolana.copied ? <Outline.CheckIcon className="size-5" /> : <Outline.DocumentDuplicateIcon className="size-5" />}
            {copyTheSolana.copied ? Lang.match({ en: "Copied", zh: "已复制", hi: "कॉपी किया गया", es: "Copiado", ar: "تم النسخ", fr: "Copié", de: "Kopiert", ru: "Скопировано", pt: "Copiado", ja: "コピーしました", pa: "ਨਕਲ ਕੀਤਾ", bn: "কপি করা হয়েছে", id: "Disalin", ur: "کاپی کیا گیا", ms: "Disalin", it: "Copiato", tr: "Kopyalandı", ta: "நகலெடுக்கப்பட்டது", te: "నకలించబడింది", ko: "복사됨", vi: "Đã sao chép", pl: "Skopiowano", ro: "Copiat", nl: "Gekopieerd ", el: "Αντιγράφηκε ", th: "คัดลอกแล้ว ", cs: "Zkopírováno ", hu: "Másolva ", sv: "Kopierat ", da: "Kopieret" }) : Lang.match({ en: "Copy", zh: "复制", hi: "कॉपी करें", es: "Copiar", ar: "نسخ", fr: "Copier", de: "Kopieren", ru: "Копировать", pt: "Copiar", ja: "コピー", pa: "ਨਕਲ ਕਰੋ", bn: "কপি করুন", id: "Salin", ur: "کاپی کریں", ms: "Salin", it: "Copia", tr: "Kopyala", ta: "நகலெடுக்கவும்", te: "నకలించు", ko: "복사 ", vi: "Sao chép ", pl: "Kopiuj ", ro: "Copiați ", nl: "Kopiëren ", el: "Αντιγραφή ", th: "คัดลอก ", cs: "Kopírovat ", hu: "Másolás ", sv: "Kopiera ", da: "Kopier" })}
          </WideContrastButton>
        </div>
      </Fragment>
    </form>
  </div>
}