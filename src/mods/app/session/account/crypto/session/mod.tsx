import { InOther } from "@/libs/anchor/mod.tsx";
import { InButton, WideOppositeButton } from "@/libs/button/mod.tsx";
import { FlipCard } from "@/libs/card/mod.tsx";
import { Errors } from "@/libs/errors/mod.ts";
import { Events } from "@/libs/events/mod.ts";
import { Outline } from "@/libs/heroicons/mod.ts";
import { Lang } from "@/libs/lang/mod.ts";
import { WideNakedMenuButton } from "@/libs/menu/mod.tsx";
import { Nullable } from "@/libs/nullable/mod.ts";
import { useOnline } from "@/libs/online/mod.ts";
import { Spinner } from "@/libs/spinner/mod.tsx";
import { useSubmit } from "@/libs/submit/mod.ts";
import { CryptoRequest, CryptoRequestAnchor } from "@/mods/app/session/account/crypto/request/mod.tsx";
import { WcSessionData } from "@/mods/app/session/account/crypto/subaccount/mod.tsx";
import { ScanPage } from "@/mods/app/session/account/password/mod.tsx";
import { useSessionContext } from "@/mods/app/session/mod.tsx";
import { Writable } from "@hazae41/binary";
import { SubpathProvider, useAnchorWithCoords, useHashSubpath, usePathContext } from "@hazae41/chemin";
import * as KDBX from "@hazae41/kdbx";
import { IrnClient, WalletConnect, WcChannel, WcSession, WcSessionRequestParams, WcUnsupportedMethodsError } from "@hazae41/latrine";
import { PathBoard, PathPaper } from "@hazae41/modal";
import { useCloseContext } from "@hazae41/react-close-context";
import React, { Fragment, useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";
import { AccountMenuAnchor } from "../../mod.tsx";

React;

export function CryptoSessionAddAnchor() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, "/session")

  return <a className="group w-[min(20rem,100%)] aspect-video rounded-xl border-2 border-default-contrast select-none hover:scale-105 focus-visible:outline-none focus-visible:scale-105 transition-transform"
    href={coords.url.hash}
    onClick={coords.onClick}
    onKeyDown={coords.onKeyDown}>
    <InOther>
      <Outline.PlusIcon className="size-8" />
    </InOther>
  </a>
}

export function CryptoSessionAddPage(props: { $entry: KDBX.Inner.KeePassFile.Entry } & { subaccount: number } & { respond(url: string, signal?: AbortSignal): Promise<Nullable<WcSessionData>> }) {
  const { $entry, subaccount, respond } = props

  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const close = useCloseContext().getOrThrow()

  const session = useSessionContext().getOrThrow()

  const [flipped, setFlipped] = useState(false)

  const subtitle = useMemo(() => {
    return $entry.getStringByKeyOrNull("Title")?.getValueOrNull()?.get()
  }, [$entry])

  const color = useMemo(() => {
    return $entry.getStringByKeyOrNull("Color")?.getValueOrNull()?.get()
  }, [$entry])

  const [$title, setTitle] = useState("")

  const [$url, setUrl] = useState("")

  const [$notes, setNotes] = useState("")

  const title = useDeferredValue($title)

  const url = useDeferredValue($url)

  const notes = useDeferredValue($notes)

  const encrypt = useCallback(async () => {
    const { kdbx, comp } = session.value

    await new Promise(ok => requestIdleCallback(ok))

    const data = await respond(url)

    if (data == null)
      return

    const { jwk, tpc, key } = data

    const $file = kdbx.inner.content.value
    const $root = $file.getRootOrThrow()

    const $group = $root.getDirectGroupByIndexOrThrow(0)

    const $subentry = $group.push()

    $subentry.push("Parent", $entry.getUuidOrThrow().toString())
    $subentry.push("Index", subaccount.toString())

    $subentry.push("Title", title)

    if (color)
      $subentry.push("Color", color)

    if (notes)
      $subentry.push("Notes", notes)

    if (jwk)
      $subentry.push("WalletConnectJwk", jwk, true)

    if (tpc)
      $subentry.push("WalletConnectTpc", tpc, true)

    if (key)
      $subentry.push("WalletConnectKey", key, true)

    return Writable.writeToBytes(await kdbx.encrypt(comp))
  }, [$entry, session, title, color, notes, respond, url])

  const writeOrDisplay = useSubmit(() => Promise.try(async () => {
    const fsfh = session.value.user.fsfh

    if (fsfh == null)
      return

    const content = await encrypt()

    if (content == null)
      return

    const writable = await fsfh.createWritable()
    await writable.write(content)
    await writable.close()

    session.update()

    close()
  }).catch(Errors.display), [encrypt, close])

  const saveOrDisplay = useSubmit(() => Promise.try(async () => {
    const content = await encrypt()

    if (content == null)
      return

    const file = new File([content], "wallet.kdbx", { type: "application/kdbx" })

    if (/iPad|iPhone|iPod/.test(navigator.platform) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) {
      await navigator.share({ files: [file] })
    } else {
      const url = URL.createObjectURL(file)

      const a = document.createElement("a") as HTMLAnchorElement
      a.href = url
      a.download = "wallet.kdbx"

      document.body.appendChild(a)

      a.click()

      document.body.removeChild(a)

      URL.revokeObjectURL(url)
    }

    session.update()

    close()
  }).catch(Errors.display), [encrypt, close])

  const error = useMemo(() => {
    if (!url.length)
      return Lang.match({ en: "WalletConnect code is required", zh: "需要 WalletConnect 代码", hi: "WalletConnect कोड आवश्यक है", es: "Se requiere código WalletConnect", ar: "رمز WalletConnect مطلوب", fr: "Le code WalletConnect est requis", de: "WalletConnect-Code ist erforderlich", ru: "Требуется код WalletConnect", pt: "Código WalletConnect é obrigatório", ja: "WalletConnectコードが必要です", pa: "WalletConnect ਕੋਡ ਦੀ ਲੋੜ ਹੈ", bn: "WalletConnect কোড প্রয়োজন", id: "Kode WalletConnect diperlukan", ur: "والٹ کنیکٹ کوڈ ضروری ہے", ms: "Kode WalletConnect diperlukan", it: "Il codice WalletConnect è obbligatorio", tr: "WalletConnect kodu gereklidir", ta: "WalletConnect குறியீடு தேவை", te: "WalletConnect కోడ్ అవసరం", ko: "WalletConnect 코드가 필요합니다.", vi: "Mã WalletConnect là bắt buộc.", pl: "Kod WalletConnect jest wymagany.", ro: "Codul WalletConnect este obligatoriu.", nl: "WalletConnect-code is verplicht.", el: "Ο κωδικός WalletConnect είναι υποχρεωτικός. ", th: "รหัส WalletConnect จำเป็นต้องใช้ ", cs: "Kód WalletConnect je povinný. ", hu: "A WalletConnect kód megadása kötelező. ", sv: "WalletConnect-kod krävs. ", da: "WalletConnect-kode er påkrævet." })
    return
  }, [url])

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
        <FlipCard
          type="WalletConnect"
          title={title}
          subtitle={subtitle}
          color={color}
          index={subaccount}
          icon={<Outline.LinkIcon className="size-5" />}
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
            placeholder={Lang.match({ en: "Untitled", zh: "未命名", hi: "बिना शीर्षक के", es: "Sin título", ar: "بدون عنوان", fr: "Sans titre", de: "Unbenannt", ru: "Без названия", pt: "Sem título", ja: "タイトルなし", pa: "ਬਿਨਾਂ ਸਿਰਲੇਖ ਦੇ", bn: "শিরোনামহীন", id: "Tanpa judul", ur: "بغیر عنوان کے", ms: "Tanpa judul", it: "Senza titolo", tr: "Başlıksız", ta: "தலைப்பு இல்லாமல்", te: "శీర్షికలేని", ko: "제목 없음", vi: "Không tiêu đề", pl: "Bez tytułu", ro: "Fără titlu", nl: "Naamloos", el: "Χωρίς τίτλο ", th: "ไม่มีชื่อเรื่อง ", cs: "Nezvaný ", hu: "Névtelen ", sv: "Namnlös ", da: "Navnløs" })}
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
            <UrlInputAnchor />
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
        <div className="bg-default-contrast p-1 rounded-xl flex flex-col gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <textarea className="po-2 w-full resize-none focus-visible:outline-none"
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
              disabled={writeOrDisplay.running || error != null}
              onClick={writeOrDisplay.execute}>
              {writeOrDisplay.running ? <Spinner className="size-5 animate-spin" /> : <Outline.ArrowDownTrayIcon className="size-5" />}
              {error != null ? error : Lang.match({ en: "Save", zh: "保存", hi: "सहेजें", es: "Guardar", ar: "حفظ", fr: "Enregistrer", de: "Speichern", ru: "Сохранить", pt: "Salvar", ja: "保存", pa: "ਸੰਭਾਲੋ", bn: "সংরক্ষণ করুন", id: "Simpan", ur: "محفوظ کریں", ms: "Simpan", it: "Salva", tr: "Kaydet", ta: "சேமிக்கவும்", te: "సేవ్ చేయండి", ko: "저장", vi: "Lưu", pl: "Zapisz", ro: "Salvează", nl: "Opslaan", el: "Αποθήκευση ", th: "บันทึก ", cs: "Uložit ", hu: "Mentés ", sv: "Spara ", da: "Gem" })}
            </WideOppositeButton>}
          {session.value.user.fsfh == null &&
            <WideOppositeButton
              type="button"
              disabled={saveOrDisplay.running || error != null}
              onClick={saveOrDisplay.execute}>
              {saveOrDisplay.running ? <Spinner className="size-5 animate-spin" /> : <Outline.ArrowDownTrayIcon className="size-5" />}
              {error != null ? error : Lang.match({ en: "Save", zh: "保存", hi: "सहेजें", es: "Guardar", ar: "حفظ", fr: "Enregistrer", de: "Speichern", ru: "Сохранить", pt: "Salvar", ja: "保存", pa: "ਸੰਭਾਲੋ", bn: "সংরক্ষণ করুন", id: "Simpan", ur: "محفوظ کریں", ms: "Simpan", it: "Salva", tr: "Kaydet", ta: "சேமிக்கவும்", te: "సేవ్ చేయండి", ko: "저장", vi: "Lưu", pl: "Zapisz", ro: "Salvează", nl: "Opslaan", el: "Αποθήκευση ", th: "บันทึก ", cs: "Uložit ", hu: "Mentés ", sv: "Spara ", da: "Gem" })}
            </WideOppositeButton>}
        </div>
      </form>
    </div>
  </Fragment>
}

export function CryptoSessionAnchor(props: { $entry: KDBX.Inner.KeePassFile.Entry } & { subaccount: number } & { $subentry: KDBX.Inner.KeePassFile.Entry }) {
  const { $entry, subaccount, $subentry } = props

  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const uuid = useMemo(() => {
    return $subentry.getUuidOrThrow().getOrThrow()
  }, [$subentry])

  const title = useMemo(() => {
    return $subentry.getStringByKeyOrNull("Title")?.getValueOrNull()?.get()
  }, [$subentry])

  const subtitle = useMemo(() => {
    return $entry.getStringByKeyOrNull("Title")?.getValueOrNull()?.get()
  }, [$entry])

  const color = useMemo(() => {
    return $entry.getStringByKeyOrNull("Color")?.getValueOrNull()?.get()
  }, [$entry])

  const coords = useAnchorWithCoords(hash, `/session/${uuid}`)

  return <Fragment>
    <SubpathProvider value={hash}>
      {hash.url.pathname === `/session/${uuid}` &&
        <PathBoard>
          <CryptoSessionPage $entry={$entry} subaccount={subaccount} $subentry={$subentry} />
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
            <Outline.LinkIcon className="size-5" />
            WalletConnect
          </div>
        </div>
      </div>
    </a>
  </Fragment>
}

export function CryptoSessionPage(props: { $entry: KDBX.Inner.KeePassFile.Entry } & { subaccount: number } & { $subentry: KDBX.Inner.KeePassFile.Entry }) {
  const { $entry, subaccount, $subentry } = props

  const close = useCloseContext().getOrThrow()

  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

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

  const jwk = useMemo(() => {
    return $subentry.getStringByKeyOrNull("WalletConnectJwk")?.getValueOrNull()?.get()
  }, [$subentry])

  const tpc = useMemo(() => {
    return $subentry.getStringByKeyOrNull("WalletConnectTpc")?.getValueOrNull()?.get()
  }, [$subentry])

  const key = useMemo(() => {
    return $subentry.getStringByKeyOrNull("WalletConnectKey")?.getValueOrNull()?.get()
  }, [$subentry])

  const online = useOnline()

  const [session, setSession] = useState<Nullable<WcSession>>()
  const [requests, setRequests] = useState<Array<CryptoRequest>>([])

  const connectOrThrow = useCallback(async () => {
    if (jwk == null)
      return
    if (tpc == null)
      return
    if (key == null)
      return

    const sticky = Uint8Array.fromBase64(jwk)
    const client = await IrnClient.open(WalletConnect.RELAY, sticky, "c6c9bacd35afa3eb9e6cccf6d8464395")

    const channel = new WcChannel(client, tpc, Uint8Array.fromBase64(key))
    const session = new WcSession(channel)

    const onRequest = async (params: WcSessionRequestParams<unknown>) => {
      const { request } = params

      if (request.method === "eth_sendTransaction")
        return await handle(params)
      if (request.method === "eth_signTypedData_v4")
        return await handle(params)
      if (request.method === "personal_sign")
        return await handle(params)
      if (request.method === "solana_signTransaction")
        return await handle(params)
      if (request.method === "solana_signMessage")
        return await handle(params)

      throw new WcUnsupportedMethodsError()
    }

    const handle = async (params: WcSessionRequestParams<unknown>) => {
      using stack = new DisposableStack()

      const { promise, resolve, reject } = Promise.withResolvers<unknown>()

      setRequests(x => [...x, { params, resolve, reject }])

      stack.defer(() => setRequests(x => x.filter(y => y.params !== params)))

      return await promise
    }

    session.addEventListener("request", event => event.respondWith(onRequest(event.data)), { signal: session.closing })
    session.addEventListener("close", () => setSession(undefined), { signal: session.closing })

    await session.open()

    setSession(session)
  }, [jwk, tpc, key])

  useEffect(() => {
    if (!online)
      return
    if (session != null)
      return
    connectOrThrow().catch(console.error)
  }, [session, online, connectOrThrow])

  useEffect(() => () => {
    session?.channel.client.socket.close()
  }, [session])

  return <Fragment>
    <SubpathProvider value={hash}>
      {hash.url.pathname === "/+" &&
        <PathPaper>
          <CryptoSessionMenu $entry={$entry} subaccount={subaccount} $subentry={$subentry} session={session} close={close} />
        </PathPaper>}
    </SubpathProvider>
    <div className="flex flex-col grow p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium">
          {Lang.match({ en: "Crypto session", zh: "加密会话", hi: "क्रिप्टो सत्र", es: "Sesión de criptomonedas", ar: "الجلسة المشفرة", fr: "Session crypto", de: "Krypto-Sitzung", ru: "Крипто-сессия", pt: "Sessão de criptomoeda", ja: "暗号セッション", pa: "ਕ੍ਰਿਪਟੋ ਸੈਸ਼ਨ", bn: "ক্রিপ্টো সেশন", id: "Sesi Kripto", ur: "کرپٹو سیشن", ms: "Sesi Kripto", it: "Sessione crittografica", tr: "Kripto oturumu", ta: "கிரிப்டோ அமர்வு", te: "క్రిప్టో సెషన్", ko: "암호화 세션", vi: "Phiên tiền điện tử", pl: "Sesja kryptowalutowa", ro: "Sesiune criptografică", nl: "Crypto sessie", el: "Συνεδρία κρυπτογράφησης ", th: "เซสชันคริปโต ", cs: "Krypto sezení ", hu: "Kripto munkamenet ", sv: "Krypto-session ", da: "Krypto-session" })}
        </h1>
        <AccountMenuAnchor />
      </div>
      <div className="h-6" />
      <div className="flex flex-col items-center justify-center">
        <FlipCard
          type="WalletConnect"
          title={title}
          subtitle={subtitle}
          color={color}
          index={subaccount}
          icon={<Outline.LinkIcon className="size-5" />}
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
          <div className="flex items-center gap-2">
            {(online === true && session != null) &&
              <span className="relative flex size-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex size-3 rounded-full bg-red-500" />
              </span>}
            {(online === false || session == null) &&
              <Fragment>
                <span className="size-3 rounded-full border-2 border-red-500" />
              </Fragment>}
            <div className="font-medium">
              {Lang.match({ en: "Requests", zh: "请求", hi: "अनुरोध", es: "Solicitudes", ar: "الطلبات", fr: "Requêtes", de: "Anfragen", ru: "Запросы", pt: "Solicitações", ja: "リクエスト", pa: "ਬੇਨਤੀਆਂ", bn: "অনুরোধসমূহ", id: "Permintaan", ur: "درخواستیں", ms: "Permintaan", it: "Richieste", tr: "İstekler", ta: "கோரிக்கைகள்", te: "అభ్యర్థనలు", ko: "요청 사항", vi: "Yêu cầu", pl: "Żądania", ro: "Cereri", nl: "Verzoeken", el: "Αιτήματα ", th: "คำขอ ", cs: "Požadavky ", hu: "Kérések ", sv: "Förfrågningar ", da: "Anmodninger" })}
            </div>
          </div>
          <div className="text-default-contrast">
            {Lang.match({ en: "Your requests will appear here. Only approve requests you understand.", zh: "您的请求将显示在这里。仅批准您理解的请求。", hi: "आपके अनुरोध यहां दिखाई देंगे। केवल उन अनुरोधों को मंजूरी दें जिन्हें आप समझते हैं।", es: "Sus solicitudes aparecerán aquí. Solo apruebe las solicitudes que entienda.", ar: "ستظهر طلباتك هنا. فقط وافق على الطلبات التي تفهمها.", fr: "Vos demandes apparaîtront ici. N'approuvez que les demandes que vous comprenez.", de: "Ihre Anfragen werden hier angezeigt. Genehmigen Sie nur Anfragen, die Sie verstehen.", ru: "Ваши запросы будут отображаться здесь. Одобряйте только те запросы, которые вы понимаете.", pt: "Suas solicitações aparecerão aqui. Aprove apenas as solicitações que você entende.", ja: "あなたのリクエストはここに表示されます。理解できるリクエストのみを承認してください。", pa: "ਤੁਹਾਡੇ ਬੇਨਤੀ ਇੱਥੇ ਦਿਖਾਈ ਦੇਣਗੀਆਂ। ਸਿਰਫ ਉਹ ਬੇਨਤੀਆਂ ਮਨਜ਼ੂਰ ਕਰੋ ਜੋ ਤੁਸੀਂ ਸਮਝਦੇ ਹੋ।", bn: "আপনার অনুরোধগুলি এখানে প্রদর্শিত হবে। শুধুমাত্র সেই অনুরোধগুলি অনুমোদন করুন যা আপনি বুঝতে পারেন।", id: "Permintaan Anda akan muncul di sini. Hanya setujui permintaan yang Anda pahami.", ur: "آپ کی درخواستیں یہاں ظاہر ہوں گی۔ صرف ان درخواستوں کو منظور کریں جنہیں آپ سمجھتے ہیں۔", ms: "Permintaan Anda akan muncul di sini. Hanya setujui permintaan yang Anda pahami.", it: "Le tue richieste appariranno qui. Approva solo le richieste che comprendi.", tr: "İstekleriniz burada görünecektir. Yalnızca anladığınız istekleri onaylayın.", ta: "உங்கள் கோரிக்கைகள் இங்கே தோன்றும். நீங்கள் புரிந்துகொள்ளும் கோரிக்கைகளை மட்டுமே ஒப்புக்கொள்ளுங்கள்.", te: "మీ అభ్యర్థనలు ఇక్కడ కనిపిస్తాయి. మీరు అర్థం చేసుకున్న అభ్యర్థనలను మాత్రమే ఆమోదించండి.", ko: "귀하의 요청이 여기에 표시됩니다. 이해하는 요청만 승인하십시오.", vi: "Yêu cầu của bạn sẽ xuất hiện ở đây. Chỉ chấp thuận các yêu cầu mà bạn hiểu.", pl: "Twoje żądania pojawią się tutaj. Zatwierdzaj tylko te żądania, które rozumiesz.", ro: "Cererile dvs. vor apărea aici. Aprobați doar cererile pe care le înțelegeți.", nl: "Uw verzoeken verschijnen hier. Keur alleen verzoeken goed die u begrijpt.", el: "Τα αιτήματά σας θα εμφανίζονται εδώ. Εγκρίνετε μόνο τα αιτήματα που καταλαβαίνετε. ", th: "คำขอของคุณจะปรากฏที่นี่ โปรดอนุมัติคำขอที่คุณเข้าใจเท่านั้น ", cs: "Vaše požadavky se zde zobrazí. Schvalte pouze požadavky, kterým rozumíte. ", hu: "Kérései itt jelennek meg. Csak azokat a kéréseket hagyja jóvá, amelyeket megért. ", sv: "Dina förfrågningar kommer att visas här. Godkänn endast förfrågningar som du förstår. ", da: "Dine anmodninger vises her. Godkend kun anmodninger, som du forstår." })}
          </div>
          <div className="h-4" />
          <div className="grow flex flex-col overflow-y-auto border border-default-contrast rounded-xl p-1">
            <div className="grow flex flex-col overflow-y-scroll overscroll-y-none p-6">
              <div className="grow grid grid-cols-[repeat(auto-fit,min(20rem,100%))] justify-center content-center gap-4">
                {requests.map((data, index) =>
                  <Fragment key={index}>
                    <CryptoRequestAnchor index={index} $entry={$entry} subaccount={subaccount} $subentry={$subentry} request={data} />
                  </Fragment>)}
                {requests.length === 0 &&
                  <Fragment>
                    <div className="group w-[min(20rem,100%)] aspect-video rounded-xl border-2 border-dashed border-default-contrast select-none" />
                  </Fragment>}
              </div>
            </div>
          </div>
        </Fragment>
      </form>
    </div>
  </Fragment>
}

export function CryptoSessionMenu(props: { $entry: KDBX.Inner.KeePassFile.Entry } & { subaccount: number } & { $subentry: KDBX.Inner.KeePassFile.Entry } & { session: Nullable<WcSession> } & { close(force: boolean): void }) {
  const { $entry, subaccount, $subentry, close } = props

  const session = useSessionContext().getOrThrow()

  const encrypt = useCallback(async () => {
    const { kdbx, comp } = session.value

    await new Promise(ok => requestIdleCallback(ok))

    $subentry.element.parentNode?.removeChild($subentry.element)

    return Writable.writeToBytes(await kdbx.encrypt(comp))
  }, [session, $subentry])

  const writeOrDisplay = useSubmit(() => Promise.try(async () => {
    const fsfh = session.value.user.fsfh

    if (fsfh == null)
      return

    const content = await encrypt()

    if (content == null)
      return

    const writable = await fsfh.createWritable()
    await writable.write(content)
    await writable.close()

    close(true)

    session.update()
  }).catch(Errors.display), [encrypt, close])

  const saveOrDisplay = useSubmit(() => Promise.try(async () => {
    const content = await encrypt()

    if (content == null)
      return

    const file = new File([content], "wallet.kdbx", { type: "application/kdbx" })

    if (/iPad|iPhone|iPod/.test(navigator.platform) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) {
      await navigator.share({ files: [file] })
    } else {
      const url = URL.createObjectURL(file)

      const a = document.createElement("a") as HTMLAnchorElement
      a.href = url
      a.download = "wallet.kdbx"

      document.body.appendChild(a)

      a.click()

      document.body.removeChild(a)

      URL.revokeObjectURL(url)

      await new Promise(ok => setTimeout(ok, 300))
    }

    close(true)

    session.update()
  }).catch(Errors.display), [encrypt, close])

  return <Fragment>
    <div className="flex flex-col gap-2">
      {session.value.user.fsfh != null &&
        <WideNakedMenuButton
          type="button"
          disabled={writeOrDisplay.running}
          onClick={writeOrDisplay.execute}>
          {writeOrDisplay.running ? <Spinner className="size-5 animate-spin" /> : <Outline.LinkSlashIcon className="size-5" />}
          {Lang.match({ en: "Destroy", zh: "销毁", hi: "नष्ट करें", es: "Destruir", ar: "تدمير", fr: "Détruire", de: "Zerstören", ru: "Уничтожить", pt: "Destruir", ja: "破棄", pa: "ਨਸ਼ਟ ਕਰੋ", bn: "ধ্বংস করুন", id: "Hancurkan", ur: "تباہ کریں", ms: "Hancurkan", it: "Distruggi", tr: "Yık", ta: "நசுக்கவும்", te: "నాశనం చేయండి", ko: "파괴하다", vi: "Hủy bỏ", pl: "Zniszczyć", ro: "Distrugeți", nl: "Vernietigen", el: "Καταστρέψτε ", th: "ทำลาย ", cs: "Zničit ", hu: "Megsemmisít ", sv: "Förstöra ", da: "Ødelæg" })}
        </WideNakedMenuButton>}
      {session.value.user.fsfh == null &&
        <WideNakedMenuButton
          type="button"
          disabled={saveOrDisplay.running}
          onClick={saveOrDisplay.execute}>
          {saveOrDisplay.running ? <Spinner className="size-5 animate-spin" /> : <Outline.LinkSlashIcon className="size-5" />}
          {Lang.match({ en: "Destroy", zh: "销毁", hi: "नष्ट करें", es: "Destruir", ar: "تدمير", fr: "Détruire", de: "Zerstören", ru: "Уничтожить", pt: "Destruir", ja: "破棄", pa: "ਨਸ਼ਟ ਕਰੋ", bn: "ধ্বংস করুন", id: "Hancurkan", ur: "تباہ کریں", ms: "Hancurkan", it: "Distruggi", tr: "Yık", ta: "நசுக்கவும்", te: "నాశనం చేయండి", ko: "파괴하다", vi: "Hủy bỏ", pl: "Zniszczyć", ro: "Distrugeți", nl: "Vernietigen", el: "Καταστρέψτε ", th: "ทำลาย ", cs: "Zničit ", hu: "Megsemmisít ", sv: "Förstöra ", da: "Ødelæg" })}
        </WideNakedMenuButton>}
    </div>
  </Fragment>
}

export function UrlInputAnchor() {
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
