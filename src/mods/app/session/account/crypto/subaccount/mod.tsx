import { WideContrastButton } from "@/libs/button/mod.tsx";
import { FlipCard } from "@/libs/card/mod.tsx";
import { chainlist } from "@/libs/chainlist/mod.ts";
import { useCopy } from "@/libs/copy/mod.ts";
import { Ed25519 } from "@/libs/ed25519/mod.ts";
import { Events } from "@/libs/events/mod.ts";
import { Outline } from "@/libs/heroicons/mod.ts";
import { Lang } from "@/libs/lang/mod.ts";
import { WideNakedMenuAnchor } from "@/libs/menu/mod.tsx";
import { Nullable } from "@/libs/nullable/mod.ts";
import { CryptoSessionAddAnchor, CryptoSessionAddPage, CryptoSessionAnchor } from "@/mods/app/session/account/crypto/session/mod.tsx";
import { useSessionContext } from "@/mods/app/session/mod.tsx";
import { base58 } from "@hazae41/base58";
import { BitcoinSeedPhrase } from "@hazae41/broca";
import { SubpathProvider, useAnchorWithCoords, useHashSubpath, usePathContext } from "@hazae41/chemin";
import { BitcoinSeedKey, Ed25519SeedKey } from "@hazae41/clade";
import { Cursor } from "@hazae41/cursor";
import * as KDBX from "@hazae41/kdbx";
import { keccak256 } from "@hazae41/keccak256";
import { IrnClient, WalletConnect, WcPairing, WcPairingParams, WcSession, WcSessionProposeParams, WcSessionProposeResult } from "@hazae41/latrine";
import { PathBoard, PathPaper } from "@hazae41/modal";
import { secp256k1 } from "@hazae41/secp256k1";
import React, { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { AccountMenuAnchor } from "../../mod.tsx";

React;

export interface WcSessionData {
  readonly jwk: string
  readonly tpc: string
  readonly key: string
}

export function CryptoSubaccountAnchor(props: { $entry: KDBX.Inner.KeePassFile.Entry } & { index: number }) {
  const { $entry, index } = props

  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, `/subaccount/${index}`)

  const title = useMemo(() => {
    return $entry.getStringByKeyOrNull("Title")?.getValueOrNull()?.get()
  }, [$entry])

  const color = useMemo(() => {
    return $entry.getStringByKeyOrNull("Color")?.getValueOrNull()?.get()
  }, [$entry])

  return <Fragment>
    <SubpathProvider value={hash}>
      {hash.url.pathname === `/subaccount/${index}` &&
        <PathBoard>
          <CryptoSubaccountPage $entry={$entry} subaccount={index} />
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
            #{index + 1}
          </div>
        </div>
        <div className="not-@[12rem]:hidden h-4 grow" />
        <div className="not-@[12rem]:hidden flex flex-wrap items-center gap-2">
          <div className="bg-default-contrast rounded-xl po-1 flex items-center gap-2">
            <Outline.BanknotesIcon className="size-5" />
            {Lang.match({ en: "Crypto", zh: "加密货币", hi: "क्रिप्टो", es: "Cripto", ar: "تشفير", fr: "Crypto", de: "Krypto", ru: "Крипто", pt: "Cripto", ja: "暗号通貨", pa: "ਕ੍ਰਿਪਟੋ", bn: "ক্রিপ্টো", id: "Kripto", ur: "کرپٹو", ms: "Kripto", it: "Cripto", tr: "Kripto", ta: "கிரிப்டோ", te: "క్రిప్టో", ko: "암호화폐", vi: "Tiền điện tử", pl: "Krypto", ro: "Cripto", nl: "Crypto", el: "Κρυπτο", th: "คริปโต", cs: "Krypto", hu: "Kripto", sv: "Krypto", da: "Krypto" })}
          </div>
        </div>
      </div>
    </a>
  </Fragment>
}

export function CryptoSubaccountPage(props: { $entry: KDBX.Inner.KeePassFile.Entry } & { subaccount: number }) {
  const { $entry, subaccount } = props

  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const session = useSessionContext().getOrThrow()

  const [flipped, setFlipped] = useState(false)

  const title = useMemo(() => {
    return $entry.getStringByKeyOrNull("Title")?.getValueOrNull()?.get()
  }, [$entry])

  const color = useMemo(() => {
    return $entry.getStringByKeyOrNull("Color")?.getValueOrNull()?.get()
  }, [$entry])

  const seedphrase = useMemo(() => {
    return $entry.getStringByKeyOrThrow("SeedPhrase").getValueOrThrow().get()
  }, [$entry])

  const subentries = useMemo(() => {
    return [...session.value.kdbx.inner.content.value.document.querySelectorAll("Entry")].filter(e => !e.closest("History")).map(e => new KDBX.Inner.KeePassFile.Entry(e)).filter(e => e.getStringByKeyOrNull("Parent")?.getValueOrNull()?.get() === $entry.getUuidOrThrow().toString()).filter(e => e.getStringByKeyOrNull("Index")?.getValueOrNull()?.get() === subaccount.toString())
  }, [session, $entry, subaccount])

  const getEthereumAddressOrThrow = useCallback(async () => {
    const seed = new BitcoinSeedKey(await BitcoinSeedPhrase.derive(seedphrase))
    const xsig = await seed.derive(`m/44'/60'/0'/0/${subaccount}`)
    const upub = secp256k1.SecretKey.import(xsig.key).publish().export(false)

    return `0x${keccak256.digest(upub.slice(1)).slice(-20).toHex()}`
  }, [seedphrase, subaccount])

  const getSolanaAddressOrThrow = useCallback(async () => {
    const seed = new Ed25519SeedKey(await BitcoinSeedPhrase.derive(seedphrase))
    const xsig = await seed.derive(`m/44'/501'/${subaccount}'/0'`)
    const upub = await Ed25519.publish(xsig.key)

    return base58.encode(upub)
  }, [seedphrase, subaccount])

  const respond = useCallback(async (url: string, signal = new AbortController().signal): Promise<Nullable<WcSessionData>> => {
    await using stack = new AsyncDisposableStack()

    const cleaner = new AbortController()
    stack.defer(() => cleaner.abort())

    const ethereum = await getEthereumAddressOrThrow()
    const solana = await getSolanaAddressOrThrow()

    const sticky = crypto.getRandomValues(new Uint8Array(32))
    const client = await IrnClient.open(WalletConnect.RELAY, sticky, "c6c9bacd35afa3eb9e6cccf6d8464395")

    stack.defer(() => client.close())

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

    await session.open()

    let success = false

    stack.defer(async () => success ? undefined : await session.close())
    stack.defer(async () => success ? undefined : await session.delete())

    const relay = session.channel.client.relay

    const { requiredNamespaces, optionalNamespaces } = proposal

    const chains = chainlist.map(chain => chain.chainId)

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
          "eth_signTypedData_v4",
          "eth_sendTransaction"
        ],
        events: [],
      },
      solana: {
        accounts: [
          `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp:${solana}`,
        ],
        chains: [
          "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",
        ],
        methods: [
          "solana_signMessage",
          "solana_signTransaction",
        ],
        events: [],
      }
    }

    const metadata = { name: "Brume Wallet", description: "The secure and private wallet", url: "http://wallet.brume.tech", icons: ["http://wallet.brume.tech/appicon.png"] }
    const controller = { publicKey: new Uint8Array(await crypto.subtle.exportKey("raw", pairing.keypair.publicKey)).toHex(), metadata }

    const expiry = Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60)

    await session.settle({ relay, namespaces, requiredNamespaces, optionalNamespaces, pairingTopic: pairing.channel.topic, controller, expiry })

    success = true

    await session.close()

    const jwk = sticky.toBase64()
    const tpc = session.channel.topic
    const key = session.channel.key.toBase64()

    return { jwk, tpc, key }
  }, [seedphrase])

  return <Fragment>
    <SubpathProvider value={hash}>
      {hash.url.pathname === "/+" &&
        <PathPaper>
          <CryptoSubaccountMenu $entry={$entry} subaccount={subaccount} />
        </PathPaper>}
      {hash.url.pathname === "/session" &&
        <PathBoard>
          <CryptoSessionAddPage $entry={$entry} subaccount={subaccount} respond={respond} />
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
        <FlipCard
          type={Lang.match({ en: "Crypto", zh: "加密货币", hi: "क्रिप्टो", es: "Cripto", ar: "تشفير", fr: "Crypto", de: "Krypto", ru: "Крипто", pt: "Cripto", ja: "暗号通貨", pa: "ਕ੍ਰਿਪਟੋ", bn: "ক্রিপ্টো", id: "Kripto", ur: "کرپٹو", ms: "Kripto", it: "Cripto", tr: "Kripto", ta: "கிரிப்டோ", te: "క్రిప్టో", ko: "암호화폐", vi: "Tiền điện tử", pl: "Krypto", ro: "Cripto", nl: "Crypto", el: "Κρυπτο", th: "คริปโต", cs: "Krypto", hu: "Kripto", sv: "Krypto", da: "Krypto" })}
          title={title}
          color={color}
          index={subaccount}
          icon={<Outline.BanknotesIcon className="size-5" />}
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
            {Lang.match({ en: "Your sessions. Each session links your subaccount to some app that can see your address and send you signature requests.", zh: "您的会话。每个会话将您的子账户链接到某些应用程序，这些应用程序可以看到您的地址并向您发送签名请求。", hi: "आपके सत्र। प्रत्येक सत्र आपके उपखाते को कुछ ऐप से लिंक करता है जो आपके पते को देख सकता है और आपको हस्ताक्षर अनुरोध भेज सकता है।", es: "Tus sesiones. Cada sesión vincula tu subcuenta a alguna aplicación que puede ver tu dirección y enviarte solicitudes de firma.", ar: "جلساتك. كل جلسة تربط حسابك الفرعي ببعض التطبيقات التي يمكنها رؤية عنوانك وإرسال طلبات توقيع لك.", fr: "Vos sessions. Chaque session lie votre sous-compte à une application qui peut voir votre adresse et vous envoyer des demandes de signature.", de: "Ihre Sitzungen. Jede Sitzung verbindet Ihr Unterkonto mit einer App, die Ihre Adresse sehen und Ihnen Signaturanfragen senden kann.", ru: "Ваши сессии. Каждая сессия связывает ваш субсчет с некоторым приложением, которое может видеть ваш адрес и отправлять вам запросы на подпись.", pt: "Suas sessões. Cada sessão vincula sua subconta a algum aplicativo que pode ver seu endereço e enviar solicitações de assinatura para você.", ja: "あなたのセッション。各セッションは、あなたのサブアカウントを、あなたのアドレスを見ることができ、署名要求を送ることができるいくつかのアプリにリンクします。", pa: "ਤੁਹਾਡੇ ਸੈਸ਼ਨ। ਹਰ ਸੈਸ਼ਨ ਤੁਹਾਡੇ ਉਪਖਾਤੇ ਨੂੰ ਕੁਝ ਐਪ ਨਾਲ ਜੋੜਦਾ ਹੈ ਜੋ ਤੁਹਾਡੇ ਪਤੇ ਨੂੰ ਦੇਖ ਸਕਦਾ ਹੈ ਅਤੇ ਤੁਹਾਨੂੰ ਸਾਈਨਿੰਗ ਬੇਨਤੀਆਂ ਭੇਜ ਸਕਦਾ ਹੈ।", bn: "আপনার সেশন। প্রতিটি সেশন আপনার সাবঅ্যাকাউন্টকে কিছু অ্যাপের সাথে যুক্ত করে যা আপনার ঠিকানা দেখতে পারে এবং আপনাকে স্বাক্ষর অনুরোধ পাঠাতে পারে।", id: "Sesi Anda. Setiap sesi menghubungkan subakun Anda ke beberapa aplikasi yang dapat melihat alamat Anda dan mengirimkan permintaan tanda tangan kepada Anda.", ur: "آپ کے سیشنز۔ ہر سیشن آپ کے سب اکاؤنٹ کو کچھ ایپ سے جوڑتا ہے جو آپ کے ایڈریس کو دیکھ سکتا ہے اور آپ کو دستخط کی درخواستیں بھیج سکتا ہے۔", ms: "Sesi Anda. Setiap sesi menghubungkan subakun Anda ke beberapa aplikasi yang dapat melihat alamat Anda dan mengirimkan permintaan tanda tangan kepada Anda.", it: "Le tue sessioni. Ogni sessione collega il tuo sottoconto a qualche app che può vedere il tuo indirizzo e inviarti richieste di firma.", tr: "Oturumlarınız. Her oturum, alt hesabınızı adresinizi görebilen ve size imza istekleri gönderebilen bazı uygulamalara bağlar.", ta: "உங்கள் அமர்வுகள். ஒவ்வொரு அமர்வும் உங்கள் உபகணக்கை உங்கள் முகவரியை பார்க்கக்கூடிய மற்றும் உங்களுக்கு கையொப்ப கோரிக்கைகளை அனுப்பக்கூடிய சில செயலிகளுடன் இணைக்கிறது.", te: "మీ సెషన్లు. ప్రతి సెషన్ మీ ఉపఖాతాను మీ చిరునామాను చూడగలిగే మరియు మీకు సంతకం అభ్యర్థనలను పంపగల కొన్ని యాప్‌లతో లింక్ చేస్తుంది.", ko: "귀하의 세션입니다. 각 세션은 귀하의 하위 계정을 귀하의 주소를 볼 수 있고 귀하에게 서명 요청을 보낼 수 있는 일부 앱에 연결합니다.", vi: "Các phiên của bạn. Mỗi phiên liên kết tài khoản phụ của bạn với một số ứng dụng có thể xem địa chỉ của bạn và gửi yêu cầu ký cho bạn.", pl: "Twoje sesje. Każda sesja łączy Twój subkonto z jakąś aplikacją, która może zobaczyć Twój adres i wysłać Ci prośby o podpis.", ro: "Sesiunile tale. Fiecare sesiune leagă subcontul tău de unele aplicații care îți pot vedea adresa și îți pot trimite cereri de semnătură.", nl: "Uw sessies. Elke sessie koppelt uw subaccount aan een app die uw adres kan zien en u handtekeningverzoeken kan sturen.", el: "Οι συνεδρίες σας. Κάθε συνεδρία συνδέει τον υπολογαριασμό σας με κάποια εφαρμογή που μπορεί να δει τη διεύθυνσή σας και να σας στείλει αιτήματα υπογραφής. ", th: "เซสชันของคุณ แต่ละเซสชันเชื่อมโยงบัญชีย่อยของคุณกับแอปบางตัวที่สามารถเห็นที่อยู่ของคุณและส่งคำขอลายเซ็นให้คุณได้ ", cs: "Vaše sezení. Každé sezení propojuje váš podúčet s nějakou aplikací, která může vidět vaši adresu a posílat vám požadavky na podpis. ", hu: "Munkameneteid. Minden munkamenet összekapcsolja az alszámládat egy olyan alkalmazással, amely láthatja a címedet és aláírási kérelmeket küldhet neked. ", sv: "Dina sessioner. Varje session länkar ditt underkonto till någon app som kan se din adress och skicka signaturförfrågningar till dig. ", da: "Dine sessioner. Hver session forbinder din underkonto til en app, der kan se din adresse og sende dig signaturforespørgsler." })}
          </div>
          <div className="h-4" />
          <div className="grow flex flex-col overflow-y-auto border border-default-contrast rounded-xl p-1">
            <div className="grow flex flex-col overflow-y-scroll overscroll-y-none p-5">
              <div className="grow grid grid-cols-[repeat(auto-fit,min(20rem,100%))] justify-center content-center gap-4">
                {subentries.map($subentry =>
                  <Fragment key={$subentry.getUuidOrThrow().getOrThrow()}>
                    <CryptoSessionAnchor $entry={$entry} subaccount={subaccount} $subentry={$subentry} />
                  </Fragment>)}
                <CryptoSessionAddAnchor />
              </div>
            </div>
          </div>
        </Fragment>
      </form>
    </div>
  </Fragment>
}

export function CryptoSubaccountMenu(props: { $entry: KDBX.Inner.KeePassFile.Entry } & { subaccount: number }) {
  const { $entry, subaccount } = props

  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  return <Fragment>
    <SubpathProvider value={hash}>
      {hash.url.pathname === "/address" &&
        <PathBoard>
          <CryptoSubaccountAddressPage $entry={$entry} subaccount={subaccount} />
        </PathBoard>}
      {hash.url.pathname === "/export" &&
        <PathBoard>
          <CryptoSubaccountExportPage $entry={$entry} subaccount={subaccount} />
        </PathBoard>}
    </SubpathProvider>
    <div className="flex flex-col text-left gap-2">
      <CryptoSubaccountAddressMenuAnchor />
      <CryptoSubaccountExportMenuAnchor />
    </div>
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

export function CryptoSubaccountAddressPage(props: { $entry: KDBX.Inner.KeePassFile.Entry } & { subaccount: number }) {
  const { $entry, subaccount } = props

  const [flipped, setFlipped] = useState(false)

  const title = useMemo(() => {
    return $entry.getStringByKeyOrNull("Title")?.getValueOrNull()?.get()
  }, [$entry])

  const color = useMemo(() => {
    return $entry.getStringByKeyOrNull("Color")?.getValueOrNull()?.get()
  }, [$entry])

  const seedphrase = useMemo(() => {
    return $entry.getStringByKeyOrThrow("SeedPhrase").getValueOrThrow().get()
  }, [$entry])

  const [ethereum, setEthereum] = useState<Nullable<string>>()
  const [solana, setSolana] = useState<Nullable<string>>()

  const getEthereumAddressOrThrow = useCallback(async () => {
    const seed = new BitcoinSeedKey(await BitcoinSeedPhrase.derive(seedphrase))
    const xsig = await seed.derive(`m/44'/60'/0'/0/${subaccount}`)
    const upub = secp256k1.SecretKey.import(xsig.key).publish().export(false)

    return `0x${keccak256.digest(upub.slice(1)).slice(-20).toHex()}`
  }, [seedphrase, subaccount])

  const getSolanaAddressOrThrow = useCallback(async () => {
    const seed = new Ed25519SeedKey(await BitcoinSeedPhrase.derive(seedphrase))
    const xsig = await seed.derive(`m/44'/501'/${subaccount}'/0'`)
    const upub = await Ed25519.publish(xsig.key)

    return base58.encode(upub)
  }, [seedphrase, subaccount])

  useEffect(() => {
    getEthereumAddressOrThrow().then(setEthereum).catch(console.error)
  }, [getEthereumAddressOrThrow])

  useEffect(() => {
    getSolanaAddressOrThrow().then(setSolana).catch(console.error)
  }, [getSolanaAddressOrThrow])

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
      <FlipCard
        type={Lang.match({ en: "Crypto", zh: "加密货币", hi: "क्रिप्टो", es: "Cripto", ar: "تشفير", fr: "Crypto", de: "Krypto", ru: "Крипто", pt: "Cripto", ja: "暗号通貨", pa: "ਕ੍ਰਿਪਟੋ", bn: "ক্রিপ্টো", id: "Kripto", ur: "کرپٹو", ms: "Kripto", it: "Cripto", tr: "Kripto", ta: "கிரிப்டோ", te: "క్రిప్టో", ko: "암호화폐", vi: "Tiền điện tử", pl: "Krypto", ro: "Cripto", nl: "Crypto", el: "Κρυπτο", th: "คริปโต", cs: "Krypto", hu: "Kripto", sv: "Krypto", da: "Krypto" })}
        title={title}
        color={color}
        index={subaccount}
        icon={<Outline.BanknotesIcon className="size-5" />}
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
        <div className="flex items-center flex-wrap-reverse gap-2">
          <WideContrastButton
            onClick={copyTheEthereum.copyOrDisplay}>
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
        <div className="flex items-center flex-wrap-reverse gap-2">
          <WideContrastButton
            onClick={copyTheSolana.copyOrDisplay}>
            {copyTheSolana.copied ? <Outline.CheckIcon className="size-5" /> : <Outline.DocumentDuplicateIcon className="size-5" />}
            {copyTheSolana.copied ? Lang.match({ en: "Copied", zh: "已复制", hi: "कॉपी किया गया", es: "Copiado", ar: "تم النسخ", fr: "Copié", de: "Kopiert", ru: "Скопировано", pt: "Copiado", ja: "コピーしました", pa: "ਨਕਲ ਕੀਤਾ", bn: "কপি করা হয়েছে", id: "Disalin", ur: "کاپی کیا گیا", ms: "Disalin", it: "Copiato", tr: "Kopyalandı", ta: "நகலெடுக்கப்பட்டது", te: "నకలించబడింది", ko: "복사됨", vi: "Đã sao chép", pl: "Skopiowano", ro: "Copiat", nl: "Gekopieerd", el: "Αντιγράφηκε ", th: "คัดลอกแล้ว ", cs: "Zkopírováno ", hu: "Másolva ", sv: "Kopierat ", da: "Kopieret" }) : Lang.match({ en: "Copy", zh: "复制", hi: "कॉपी करें", es: "Copiar", ar: "نسخ", fr: "Copier", de: "Kopieren", ru: "Копировать", pt: "Copiar", ja: "コピー", pa: "ਨਕਲ ਕਰੋ", bn: "কপি করুন", id: "Salin", ur: "کاپی کریں", ms: "Salin", it: "Copia", tr: "Kopyala", ta: "நகலெடுக்கவும்", te: "నకలించు", ko: "복사", vi: "Sao chép", pl: "Kopiuj", ro: "Copiați", nl: "Kopiëren", el: "Αντιγραφή ", th: "คัดลอก ", cs: "Kopírovat ", hu: "Másolás ", sv: "Kopiera ", da: "Kopier" })}
          </WideContrastButton>
        </div>
      </Fragment>
    </form>
  </div>
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

export function CryptoSubaccountExportPage(props: { $entry: KDBX.Inner.KeePassFile.Entry } & { subaccount: number }) {
  const { $entry, subaccount } = props

  const [flipped, setFlipped] = useState(false)

  const title = useMemo(() => {
    return $entry.getStringByKeyOrNull("Title")?.getValueOrNull()?.get()
  }, [$entry])

  const color = useMemo(() => {
    return $entry.getStringByKeyOrNull("Color")?.getValueOrNull()?.get()
  }, [$entry])

  const seedphrase = useMemo(() => {
    return $entry.getStringByKeyOrThrow("SeedPhrase").getValueOrThrow().get()
  }, [$entry])

  const [ethereum, setEthereum] = useState<Nullable<string>>()
  const [solana, setSolana] = useState<Nullable<string>>()

  const getEthereumKeyOrThrow = useCallback(async () => {
    const seed = new BitcoinSeedKey(await BitcoinSeedPhrase.derive(seedphrase))
    const xsig = await seed.derive(`m/44'/60'/0'/0/${subaccount}`)

    return `0x${xsig.key.toHex()}`
  }, [seedphrase, subaccount])

  const getSolanaKeyOrThrow = useCallback(async () => {
    const seed = new Ed25519SeedKey(await BitcoinSeedPhrase.derive(seedphrase))
    const xsig = await seed.derive(`m/44'/501'/${subaccount}'/0'`)
    const upub = await Ed25519.publish(xsig.key)

    const concat = new Uint8Array(xsig.key.length + upub.length)

    const cursor = new Cursor(concat)
    cursor.write(xsig.key)
    cursor.write(upub)

    return base58.encode(concat)
  }, [seedphrase, subaccount])

  useEffect(() => {
    getEthereumKeyOrThrow().then(setEthereum).catch(console.error)
  }, [getEthereumKeyOrThrow])

  useEffect(() => {
    getSolanaKeyOrThrow().then(setSolana).catch(console.error)
  }, [getSolanaKeyOrThrow])

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
      <FlipCard
        type={Lang.match({ en: "Crypto", zh: "加密货币", hi: "क्रिप्टो", es: "Cripto", ar: "تشفير", fr: "Crypto", de: "Krypto", ru: "Крипто", pt: "Cripto", ja: "暗号通貨", pa: "ਕ੍ਰਿਪਟੋ", bn: "ক্রিপ্টো", id: "Kripto", ur: "کرپٹو", ms: "Kripto", it: "Cripto", tr: "Kripto", ta: "கிரிப்டோ", te: "క్రిప్టో", ko: "암호화폐", vi: "Tiền điện tử", pl: "Krypto", ro: "Cripto", nl: "Crypto", el: "Κρυπτο", th: "คริปโต", cs: "Krypto", hu: "Kripto", sv: "Krypto", da: "Krypto" })}
        title={title}
        color={color}
        index={subaccount}
        icon={<Outline.BanknotesIcon className="size-5" />}
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
          <textarea className="w-full data-[redacted=true]:blur-xs focus-visible:outline-none"
            rows={2}
            readOnly
            onFocus={e => flipped ? e.currentTarget.select() : undefined}
            value={ethereum?.valueOf()}
            data-redacted={!flipped} />
        </div>
        <div className="h-2" />
        <div className="flex items-center flex-wrap-reverse gap-2">
          <WideContrastButton
            onClick={() => setFlipped(x => !x)}>
            {flipped ? <Outline.EyeSlashIcon className="size-5" /> : <Outline.EyeIcon className="size-5" />}
            {flipped ? Lang.match({ en: "Hide", zh: "隐藏", hi: "छिपाएं", es: "Ocultar", ar: "إخفاء", fr: "Cacher", de: "Verbergen", ru: "Скрыть", pt: "Esconder", ja: "非表示", pa: "ਛੁਪਾਓ", bn: "লুকান", id: "Sembunyikan", ur: "چھپائیں", ms: "Sembunyikan", it: "Nascondi", tr: "Gizle", ta: "மறைவு", te: "దాచు", ko: "숨기기", vi: "Ẩn", pl: "Ukryj", ro: "Ascundeți", nl: "Verbergen", el: "Απόκρυψη ", th: "ซ่อน ", cs: "Skrýt ", hu: "Elrejtés ", sv: "Dölj ", da: "Skjul" }) : Lang.match({ en: "Show", zh: "显示", hi: "दिखाएं", es: "Mostrar", ar: "إظهار", fr: "Afficher", de: "Anzeigen", ru: "Показать", pt: "Mostrar", ja: "表示する", pa: "ਦਿਖਾਓ", bn: "দেখান", id: "Tampilkan", ur: "دکھائیں", ms: "Tampilkan", it: "Mostra", tr: "Göster", ta: "காட்டு", te: "తెరచు", ko: "보이기", vi: "Hiển thị", pl: "Pokaż", ro: "Afișați", nl: "Tonende weergeven ", el: "Εμφάνιση ", th: "แสดง ", cs: "Zobrazit ", hu: "Megjelenítés ", sv: "Visa ", da: "Vis" })}
          </WideContrastButton>
          <WideContrastButton
            onClick={copyTheEthereum.copyOrDisplay}>
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
          <textarea className="w-full data-[redacted=true]:blur-xs focus-visible:outline-none"
            rows={2}
            readOnly
            onFocus={e => flipped ? e.currentTarget.select() : undefined}
            value={solana?.valueOf()}
            data-redacted={!flipped} />
        </div>
        <div className="h-2" />
        <div className="flex items-center flex-wrap-reverse gap-2">
          <WideContrastButton
            onClick={() => setFlipped(x => !x)}>
            {flipped ? <Outline.EyeSlashIcon className="size-5" /> : <Outline.EyeIcon className="size-5" />}
            {flipped ? Lang.match({ en: "Hide", zh: "隐藏", hi: "छिपाएं", es: "Ocultar", ar: "إخفاء", fr: "Cacher", de: "Verbergen", ru: "Скрыть", pt: "Esconder", ja: "非表示", pa: "ਛੁਪਾਓ", bn: "লুকান", id: "Sembunyikan", ur: "چھپائیں", ms: "Sembunyikan", it: "Nascondi", tr: "Gizle", ta: "மறைவு", te: "దాచు", ko: "숨기기", vi: "Ẩn", pl: "Ukryj", ro: "Ascundeți", nl: "Verbergen", el: "Απόκρυψη ", th: "ซ่อน ", cs: "Skrýt ", hu: "Elrejtés ", sv: "Dölj ", da: "Skjul" }) : Lang.match({ en: "Show", zh: "显示", hi: "दिखाएं", es: "Mostrar", ar: "إظهار", fr: "Afficher", de: "Anzeigen", ru: "Показать", pt: "Mostrar", ja: "表示する", pa: "ਦਿਖਾਓ", bn: "দেখান", id: "Tampilkan", ur: "دکھائیں", ms: "Tampilkan", it: "Mostra", tr: "Göster", ta: "காட்டு", te: "తెరచు", ko: "보이기", vi: "Hiển thị", pl: "Pokaż", ro: "Afișați ", nl: "Tonende weergeven ", el: "Εμφάνιση ", th: "แสดง ", cs: "Zobrazit ", hu: "Megjelenítés ", sv: "Visa ", da: "Vis" })}
          </WideContrastButton>
          <WideContrastButton
            onClick={copyTheSolana.copyOrDisplay}>
            {copyTheSolana.copied ? <Outline.CheckIcon className="size-5" /> : <Outline.DocumentDuplicateIcon className="size-5" />}
            {copyTheSolana.copied ? Lang.match({ en: "Copied", zh: "已复制", hi: "कॉपी किया गया", es: "Copiado", ar: "تم النسخ", fr: "Copié", de: "Kopiert", ru: "Скопировано", pt: "Copiado", ja: "コピーしました", pa: "ਨਕਲ ਕੀਤਾ", bn: "কপি করা হয়েছে", id: "Disalin", ur: "کاپی کیا گیا", ms: "Disalin", it: "Copiato", tr: "Kopyalandı", ta: "நகலெடுக்கப்பட்டது", te: "నకలించబడింది", ko: "복사됨", vi: "Đã sao chép", pl: "Skopiowano", ro: "Copiat", nl: "Gekopieerd ", el: "Αντιγράφηκε ", th: "คัดลอกแล้ว ", cs: "Zkopírováno ", hu: "Másolva ", sv: "Kopierat ", da: "Kopieret" }) : Lang.match({ en: "Copy", zh: "复制", hi: "कॉपी करें", es: "Copiar", ar: "نسخ", fr: "Copier", de: "Kopieren", ru: "Копировать", pt: "Copiar", ja: "コピー", pa: "ਨਕਲ ਕਰੋ", bn: "কপি করুন", id: "Salin", ur: "کاپی کریں", ms: "Salin", it: "Copia", tr: "Kopyala", ta: "நகலெடுக்கவும்", te: "నకలించు", ko: "복사 ", vi: "Sao chép ", pl: "Kopiuj ", ro: "Copiați ", nl: "Kopiëren ", el: "Αντιγραφή ", th: "คัดลอก ", cs: "Kopírovat ", hu: "Másolás ", sv: "Kopiera ", da: "Kopier" })}
          </WideContrastButton>
        </div>
      </Fragment>
    </form>
  </div>
}