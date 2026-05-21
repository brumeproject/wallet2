import { InButton, WideOppositeButton } from "@/libs/button/mod.tsx";
import { FlipCard } from "@/libs/card/mod.tsx";
import { useCopy } from "@/libs/copy/mod.ts";
import { PathPaper, WideNakedMenuAnchor } from "@/libs/dialog/paper/mod.tsx";
import { Errors } from "@/libs/errors/mod.ts";
import { Events } from "@/libs/events/mod.ts";
import { Outline } from "@/libs/heroicons/mod.ts";
import { getRecycleBinOrNull } from "@/libs/kdbx/mod.ts";
import { Lang } from "@/libs/lang/mod.ts";
import { Nullable } from "@/libs/nullable/mod.ts";
import { Spinner } from "@/libs/spinner/mod.tsx";
import { useSubmit } from "@/libs/task/mod.ts";
import { Writable } from "@hazae41/binary";
import { SubpathProvider, useAnchorWithCoords, useHashSubpath, usePathContext } from "@hazae41/chemin";
import * as KDBX from "@hazae41/kdbx";
import { useCloseContext } from "@hazae41/react-close-context";
import React, { Fragment, useCallback, useDeferredValue, useMemo, useState } from "react";
import { useSessionContext } from "../../mod.tsx";
import { AccountMenuAnchor, AccountMenuDeleteButton, AccountMenuTrashButton, AccountMenuUntrashButton, ColorAnchor, ColorMenu } from "../mod.tsx";

React;

export function CardAccountAddMenuAnchor() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, "/card")

  return <WideNakedMenuAnchor
    href={coords.url.hash}
    onClick={coords.onClick}
    onKeyDown={coords.onKeyDown}>
    <Outline.CreditCardIcon className="size-5" />
    {Lang.match({ en: "Card", zh: "卡片", hi: "कार्ड", es: "Tarjeta", ar: "بطاقة", fr: "Carte", de: "Karte", ru: "Карта", pt: "Cartão", ja: "カード", pa: "ਕਾਰਡ", bn: "কার্ড", id: "Kartu", ur: "کارڈ", ms: "Kad", it: "Carta", tr: "Kart", ta: "கார்டு", te: "కార్డు", ko: "카드", vi: "Thẻ", pl: "Karta", ro: "Card", nl: "Kaart", el: "Κάρτα", th: "บัตรเครดิต", cs: "Karta", hu: "Kártya", sv: "Kort", da: "Kort" })}
  </WideNakedMenuAnchor>
}

export function CardAccountAddPage() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const close = useCloseContext().getOrThrow()

  const session = useSessionContext().getOrThrow()

  const [flipped, setFlipped] = useState(false)

  const [$title, setTitle] = useState("")

  const [$num, setNum] = useState("")
  const [$hol, setHol] = useState("")
  const [$exp, setExp] = useState("")
  const [$cvv, setCvv] = useState("")
  const [$pin, setPin] = useState("")

  const [$notes, setNotes] = useState("")

  const title = useDeferredValue($title)

  const [color, setColor] = useState<Nullable<string>>(["red", "orange", "amber", "yellow", "lime", "green", "emerald", "teal", "cyan", "sky", "blue", "indigo", "violet", "purple", "fuchsia", "pink", "rose"][Math.floor(Math.random() * 16)])

  const num = useDeferredValue($num)
  const hol = useDeferredValue($hol)
  const exp = useDeferredValue($exp)
  const cvv = useDeferredValue($cvv)
  const pin = useDeferredValue($pin)

  const notes = useDeferredValue($notes)

  const encryptOrThrow = useCallback(async () => {
    const { kdbx, comp } = session.value

    const $file = kdbx.inner.content.value
    const $root = $file.getRootOrThrow()

    const $group = $root.getDirectGroupByIndexOrThrow(0)
    const $entry = $group.addEntryOrThrow()

    $entry.addStringOrThrow("Title", title)

    if (color)
      $entry.addStringOrThrow("Color", color)

    if (num)
      $entry.addStringOrThrow("CardNumber", num)

    if (hol)
      $entry.addStringOrThrow("CardHolder", hol)

    if (exp)
      $entry.addStringOrThrow("ExpiryDate", exp)

    if (cvv)
      $entry.addStringOrThrow("CVV", cvv, true)

    if (pin)
      $entry.addStringOrThrow("PIN", pin, true)

    if (notes)
      $entry.addStringOrThrow("Notes", notes)

    return Writable.writeToBytesOrThrow(await kdbx.encryptOrThrow(comp))
  }, [session, title, color, num, hol, exp, cvv, pin, notes])

  const writeOrDisplay = useSubmit(() => Promise.try(async () => {
    const fsfh = session.value.user.fsfh

    if (fsfh == null)
      return

    const content = await encryptOrThrow()

    const writable = await fsfh.createWritable()
    await writable.write(content)
    await writable.close()

    session.update()

    close()
  }).catch(Errors.display), [encryptOrThrow, close])

  const saveOrDisplay = useSubmit(() => Promise.try(async () => {
    const content = await encryptOrThrow()

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
  }).catch(Errors.display), [encryptOrThrow, close])

  const error = useMemo(() => {
    if (!num.length)
      return Lang.match({ en: "Number is required", zh: "号码是必需的", hi: "नंबर आवश्यक है", es: "El número es obligatorio", ar: "الرقم مطلوب", fr: "Le numéro est requis", de: "Nummer ist erforderlich", ru: "Требуется номер", pt: "Número é obrigatório", ja: "番号は必須です", pa: "ਨੰਬਰ ਲਾਜ਼ਮੀ ਹੈ", bn: "নম্বর প্রয়োজন", id: "Nomor wajib diisi", ur: "نمبر ضروری ہے", ms: "Nombor wajib diisi", it: "Il numero è obbligatorio", tr: "Numara gereklidir", ta: "எண் தேவை", te: "నంబర్ అవసరం", ko: "번호는 필수입니다.", vi: "Số là bắt buộc.", pl: "Numer jest wymagany.", ro: "Numărul este obligatoriu.", nl: "Nummer is verplicht.", el: "Ο αριθμός είναι υποχρεωτικός.", th: "หมายเลขเป็นสิ่งจำเป็น", cs: "Číslo je povinné.", hu: "A szám megadása kötelező.", sv: "Numret är obligatoriskt.", da: "Nummer er påkrævet." })
    return
  }, [num])

  return <Fragment>
    <SubpathProvider value={hash}>
      {hash.url.pathname === "/color" &&
        <PathPaper>
          <ColorMenu ok={setColor} />
        </PathPaper>}
    </SubpathProvider>
    <div className="flex flex-col grow p-6">
      <h1 className="text-xl font-medium">
        {Lang.match({ en: "Add card account", zh: "添加卡片账户", hi: "कार्ड खाता जोड़ें", es: "Agregar cuenta de tarjeta", ar: "إضافة حساب بطاقة", fr: "Ajouter un compte de carte", de: "Kartenkonto hinzufügen", ru: "Добавить карточный счет", pt: "Adicionar conta de cartão", ja: "カードアカウントを追加", pa: "ਕਾਰਡ ਖਾਤਾ ਸ਼ਾਮਲ ਕਰੋ", bn: "কার্ড অ্যাকাউন্ট যোগ করুন", id: "Tambahkan akun kartu", ur: "کارڈ اکاؤنٹ شامل کریں", ms: "Tambah akun kartu", it: "Aggiungi account carta", tr: "Kart hesabı ekle", ta: "கார்டு கணக்கைச் சேர்க்கவும்", te: "కార్డు ఖాతాను జోడించండి", ko: "카드 계정 추가", vi: "Thêm tài khoản thẻ", pl: "Dodaj konto karty", ro: "Adăugați contul cardului", nl: "Kaartaccount toevoegen", el: "Προσθήκη λογαριασμού κάρτας", th: "เพิ่มบัญชีบัตรเครดิตของคุณ", cs: "Přidat účet karty.", hu: "Kártya fiók hozzáadása.", sv: "Lägg till kortkonto.", da: "Tilføj kortkonto." })}
      </h1>
      <div className="h-6" />
      <div className="flex items-center justify-center">
        <FlipCard
          type={Lang.match({ en: "Card", zh: "卡片", hi: "कार्ड", es: "Tarjeta", ar: "بطاقة", fr: "Carte", de: "Karte", ru: "Карта", pt: "Cartão", ja: "カード", pa: "ਕਾਰਡ", bn: "কার্ড", id: "Kartu", ur: "کارڈ", ms: "Kad", it: "Carta", tr: "Kart", ta: "கார்டு", te: "కార్డు", ko: "카드", vi: "Thẻ", pl: "Karta", ro: "Card", nl: "Kaart", el: "Κάρτα", th: "บัตร", cs: "Karta", hu: "Kártya", sv: "Kort", da: "Kort" })}
          title={title}
          subtitle={num}
          color={color}
          icon={<Outline.CreditCardIcon className="size-5" />}
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
          {Lang.match({ en: "Title", zh: "标题", hi: "शीर्षक", es: "Título", ar: "عنوان", fr: "Titre", de: "Titel", ru: "Заголовок", pt: "Título", ja: "タイトル", pa: "ਸਿਰਲੇਖ", bn: "শিরোনাম", id: "Judul", ur: "عنوان", ms: "Tajuk", it: "Titolo", tr: "Başlık", ta: "தலைப்பு", te: "శీర్షిక", ko: "제목", vi: "Tiêu đề", pl: "Tytuł", ro: "Titlu", nl: "Titel", el: "Τίτλος", th: "ชื่อเรื่อง", cs: "Název", hu: "Cím", sv: "Titel", da: "Titel" })}
        </div>
        <div className="text-default-contrast">
          {Lang.match({ en: "A name to identify this account.", zh: "用于识别此账户的名称。", hi: "इस खाते की पहचान करने के लिए एक नाम।", es: "Un nombre para identificar esta cuenta.", ar: "اسم لتحديد هذا الحساب.", fr: "Un nom pour identifier ce compte.", de: "Ein Name zur Identifizierung dieses Kontos.", ru: "Имя для идентификации этого аккаунта.", pt: "Um nome para identificar esta conta.", ja: "このアカウントを識別するための名前。", pa: "ਇਸ ਖਾਤੇ ਦੀ ਪਛਾਣ ਕਰਨ ਲਈ ਇੱਕ ਨਾਮ।", bn: "এই অ্যাকাউন্টটি সনাক্ত করার জন্য একটি নাম।", id: "Nama untuk mengidentifikasi akun ini.", ur: "اس اکاؤنٹ کی شناخت کے لیے ایک نام۔", ms: "Nama untuk mengenal pasti akaun ini.", it: "Un nome per identificare questo account.", tr: "Bu hesabı tanımlamak için bir ad.", ta: "இந்த கணக்கை அடையாளம் காண ஒரு பெயர்.", te: "ఈ ఖాతాను గుర్తించడానికి ఒక పేరు.", ko: "이 계정을 식별하기 위한 이름.", vi: "Tên để xác định tài khoản này.", pl: "Nazwa do identyfikacji tego konta.", ro: "Un nume pentru a identifica acest cont.", nl: "Een naam om dit account te identificeren.", el: "Ένα όνομα για να αναγνωρίσετε αυτόν τον λογαριασμό.", th: "ชื่อเพื่อระบุบัญชีนี้", cs: "Název pro identifikaci tohoto účtu.", hu: "Egy név ennek a fióknak az azonosításához.", sv: "Ett namn för att identifiera detta konto.", da: "Et navn til at identificere denne konto." })}
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <input className="w-full focus-visible:outline-none"
            autoComplete="off"
            placeholder={Lang.match({ en: "Untitled", zh: "未命名", hi: "बिना शीर्षक के", es: "Sin título", ar: "بدون عنوان", fr: "Sans titre", de: "Unbenannt", ru: "Без названия", pt: "Sem título", ja: "タイトルなし", pa: "ਬਿਨਾਂ ਸਿਰਲੇਖ ਦੇ", bn: "শিরোনামহীন", id: "Tanpa judul", ur: "بغیر عنوان کے", ms: "Tanpa judul", it: "Senza titolo", tr: "Başlıksız", ta: "தலைப்பு இல்லாமல்", te: "శీర్షికలేని", ko: "제목 없음", vi: "Không tiêu đề", pl: "Bez tytułu", ro: "Fără titlu", nl: "Naamloos", el: "Χωρίς τίτλο ", th: "ไม่มีชื่อเรื่อง ", cs: "Nezvaný ", hu: "Névtelen ", sv: "Namnlös ", da: "Navnløs" })}
            onChange={e => setTitle(e.target.value)}
            value={$title} />
          <div className="flex items-center gap-2">
            <ColorAnchor color={color} />
          </div>
        </div>
        <div className="h-6" />
        <div className="font-medium">
          {Lang.match({ en: "Number", zh: "号码", hi: "संख्या", es: "Número", ar: "رقم", fr: "Numéro", de: "Nummer", ru: "Номер", pt: "Número", ja: "番号", pa: "ਨੰਬਰ", bn: "নম্বর", id: "Nomor", ur: "نمبر", ms: "Nombor", it: "Numero", tr: "Numara", ta: "எண்", te: "సంఖ్య", ko: "번호", vi: "Số", pl: "Numer", ro: "Număr", nl: "Nummer", el: "Αριθμός", th: "หมายเลข", cs: "Číslo", hu: "Szám", sv: "Nummer", da: "Nummer" })}
        </div>
        <div className="text-default-contrast">
          {Lang.match({ en: "Your card number.", zh: "您的卡号。", hi: "आपका कार्ड नंबर।", es: "Su número de tarjeta.", ar: "رقم بطاقتك.", fr: "Votre numéro de carte.", de: "Ihre Kartennummer.", ru: "Номер вашей карты.", pt: "O número do seu cartão.", ja: "あなたのカード番号。", pa: "ਤੁਹਾਡਾ ਕਾਰਡ ਨੰਬਰ।", bn: "আপনার কার্ড নম্বর।", id: "Nomor kartu Anda.", ur: "آپ کا کارڈ نمبر۔", ms: "Nombor kad anda.", it: "Il tuo numero di carta.", tr: "Kart numaranız.", ta: "உங்கள் கார்டு எண்.", te: "మీ కార్డ్ నంబర్.", ko: "귀하의 카드 번호.", vi: "Số thẻ của bạn.", pl: "Twój numer karty.", ro: "Numărul cardului dvs.", nl: "Uw kaartnummer.", el: "Ο αριθμός της κάρτας σας.", th: "หมายเลขบัตรของคุณ", cs: "Vaše číslo karty.", hu: "A kártya száma.", sv: "Ditt kortnummer.", da: "Dit kortnummer." })}
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <input className="w-full focus-visible:outline-none"
            autoComplete="off"
            placeholder="1234 5678 9012 3456"
            onChange={e => setNum(e.target.value)}
            value={$num} />
        </div>
        <div className="h-6" />
        <div className="font-medium">
          {Lang.match({ en: "Holder", zh: "持卡人", hi: "धारक", es: "Titular", ar: "صاحب البطاقة", fr: "Titulaire", de: "Inhaber", ru: "Держатель", pt: "Titular", ja: "カード名義人", pa: "ਹੋਲਡਰ", bn: "ধারক", id: "Pemegang", ur: "ہولڈر", ms: "Pemegang", it: "Titolare", tr: "Kart Sahibi", ta: "ஹோல்டர்", te: "హోల్డర్", ko: "홀더", vi: "Chủ thẻ", pl: "Posiadacz", ro: "Titular", nl: "Houder", el: "Κάτοχος", th: "ผู้ถือ", cs: "Držitel", hu: "Tulajdonos", sv: "Innehavare", da: "Indehaver" })}
        </div>
        <div className="text-default-contrast">
          {Lang.match({ en: "Your card holder name.", zh: "您的卡片持有人姓名。", hi: "आपके कार्ड धारक का नाम।", es: "El nombre del titular de su tarjeta.", ar: "اسم حامل بطاقتك.", fr: "Le nom du titulaire de votre carte.", de: "Der Name des Karteninhabers.", ru: "Имя держателя вашей карты.", pt: "O nome do titular do seu cartão.", ja: "あなたのカード名義人の名前。", pa: "ਤੁਹਾਡੇ ਕਾਰਡ ਹੋਲਡਰ ਦਾ ਨਾਮ।", bn: "আপনার কার্ডের ধারকের নাম।", id: "Nama pemegang kartu Anda.", ur: "آپ کے کارڈ ہولڈر کا نام۔", ms: "Nama pemegang kad anda.", it: "Il nome del titolare della tua carta.", tr: "Kart sahibinizin adı.", ta: "உங்கள் கார்டு ஹோல்டரின் பெயர்.", te: "మీ కార్డ్ హోల్డర్ పేరు.", ko: "귀하의 카드 소지자 이름.", vi: "Tên chủ thẻ của bạn.", pl: "Imię i nazwisko posiadacza karty.", ro: "Numele titularului cardului dvs.", nl: "De naam van de kaarthouder.", el: "Το όνομα του κατόχου της κάρτας σας.", th: "ชื่อผู้ถือบัตรของคุณ", cs: "Jméno držitele karty.", hu: "A kártya tulajdonosának neve.", sv: "Kortinnehavarens namn.", da: "Navnet på kortindehaveren." })}
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <input className="w-full focus-visible:outline-none"
            autoComplete="off"
            placeholder="Satoshi Nakamoto"
            onChange={e => setHol(e.target.value)}
            value={$hol} />
        </div>
        <div className="h-6" />
        <div className="font-medium">
          {Lang.match({ en: "Expiry", zh: "到期", hi: "समाप्ति", es: "Vencimiento", ar: "تاريخ الانتهاء", fr: "Expiration", de: "Ablauf", ru: "Срок действия", pt: "Validade", ja: "有効期限", pa: "ਮਿਆਦ", bn: "মেয়াদ শেষ", id: "Kedaluwarsa", ur: "اختتام", ms: "Tamat", it: "Scadenza", tr: "Son Kullanma Tarihi", ta: "காலாவதி", te: "కాలపరిమితి", ko: "만료", vi: "Hết hạn", pl: "Ważność", ro: "Expirare", nl: "Vervaldatum", el: "Λήξη", th: "วันหมดอายุ", cs: "Platnost", hu: "Lejárat", sv: "Utgång", da: "Udløb" })}
        </div>
        <div className="text-default-contrast">
          {Lang.match({ en: "Your card expiry date.", zh: "您的卡片到期日期。", hi: "आपके कार्ड की समाप्ति तिथि।", es: "La fecha de vencimiento de su tarjeta.", ar: "تاريخ انتهاء صلاحية بطاقتك.", fr: "La date d'expiration de votre carte.", de: "Das Ablaufdatum Ihrer Karte.", ru: "Срок действия вашей карты.", pt: "A data de validade do seu cartão.", ja: "あなたのカードの有効期限。", pa: "ਤੁਹਾਡੇ ਕਾਰਡ ਦੀ ਮਿਆਦ ਦੀ ਤਾਰੀਖ।", bn: "আপনার কার্ডের মেয়াদ শেষের তারিখ।", id: "Tanggal kedaluwarsa kartu Anda.", ur: "آپ کے کارڈ کی میعاد ختم ہونے کی تاریخ۔", ms: "Tarikh tamat kad anda.", it: "La data di scadenza della tua carta.", tr: "Kartınızın son kullanma tarihi.", ta: "உங்கள் கார்டு காலாவதி தேதி.", te: "మీ కార్డ్ గడువు తేదీ.", ko: "귀하의 카드 만료 날짜.", vi: "Ngày hết hạn thẻ của bạn.", pl: "Data ważności Twojej karty.", ro: "Data de expirare a cardului dvs.", nl: "De vervaldatum van uw kaart.", el: "Η ημερομηνία λήξης της κάρτας σας.", th: "วันหมดอายุบัตรของคุณ", cs: "Datum vypršení platnosti vaší karty.", hu: "A kártya lejárati dátuma.", sv: "Ditt korts utgångsdatum.", da: "Dit korts udløbsdato." })}
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <input className="w-full focus-visible:outline-none"
            autoComplete="off"
            placeholder="12/34"
            onChange={e => setExp(e.target.value)}
            value={$exp} />
        </div>
        <div className="h-6" />
        <div className="font-medium">
          {Lang.match({ en: "CVV", zh: "CVV", hi: "CVV", es: "CVV", ar: "CVV", fr: "CVV", de: "CVV", ru: "CVV", pt: "CVV", ja: "CVV", pa: "CVV", bn: "CVV", id: "CVV", ur: "CVV", ms: "CVV", it: "CVV", tr: "CVV", ta: "CVV", te: "CVV", ko: "CVV", vi: "CVV", pl: "CVV", ro: "CVV", nl: "CVV", el: "CVV", th: "CVV", cs: "CVV", hu: "CVV", sv: "CVV", da: "CVV" })}
        </div>
        <div className="text-default-contrast">
          {Lang.match({ en: "Your card verification value.", zh: "您的卡片验证码。", hi: "आपके कार्ड का सत्यापन मूल्य।", es: "El valor de verificación de su tarjeta.", ar: "قيمة التحقق من بطاقتك.", fr: "La valeur de vérification de votre carte.", de: "Der Überprüfungswert Ihrer Karte.", ru: "Значение проверки вашей карты.", pt: "O valor de verificação do seu cartão.", ja: "あなたのカードの確認値。", pa: "ਤੁਹਾਡੇ ਕਾਰਡ ਦੀ ਜਾਂਚ ਮੁੱਲ।", bn: "আপনার কার্ডের যাচাইকরণ মান।", id: "Nilai verifikasi kartu Anda.", ur: "آپ کے کارڈ کی تصدیقی قیمت۔", ms: "Nilai pengesahan kad anda.", it: "Il valore di verifica della tua carta.", tr: "Kartınızın doğrulama değeri.", ta: "உங்கள் கார்டு சரிபார்ப்பு மதிப்பு.", te: "మీ కార్డ్ ధృవీకరణ విలువ.", ko: "귀하의 카드 확인 값.", vi: "Giá trị xác minh thẻ của bạn.", pl: "Wartość weryfikacyjna Twojej karty.", ro: "Valoarea de verificare a cardului dvs.", nl: "De verificatiewaarde van uw kaart.", el: "Η τιμή επαλήθευσης της κάρτας σας.", th: "ค่าการตรวจสอบบัตรของคุณ", cs: "Hodnota ověření vaší karty.", hu: "A kártya ellenőrző értéke.", sv: "Ditt korts verifieringsvärde.", da: "Dit korts verificeringsværdi." })}
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <input className="w-full focus-visible:outline-none"
            autoComplete="off"
            type={flipped ? "text" : "password"}
            placeholder="123"
            onChange={e => setCvv(e.target.value)}
            value={$cvv} />
          <div className="flex items-center gap-2">
            <button className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none"
              type="button"
              onClick={() => setFlipped(x => !x)}>
              <InButton>
                {flipped ? <Outline.EyeSlashIcon className="size-5" /> : <Outline.EyeIcon className="size-5" />}
              </InButton>
            </button>
          </div>
        </div>
        <div className="h-6" />
        <div className="font-medium">
          {Lang.match({ en: "PIN", zh: "PIN", hi: "PIN", es: "PIN", ar: "PIN", fr: "PIN", de: "PIN", ru: "PIN", pt: "PIN", ja: "PIN", pa: "PIN", bn: "PIN", id: "PIN", ur: "PIN", ms: "PIN", it: "PIN", tr: "PIN", ta: "PIN", te: "PIN", ko: "PIN", vi: "PIN", pl: "PIN", ro: "PIN", nl: "PIN", el: "PIN", th: "PIN", cs: "PIN", hu: "PIN", sv: "PIN", da: "PIN" })}
        </div>
        <div className="text-default-contrast">
          {Lang.match({ en: "Your card personal identification number.", zh: "您的卡片个人识别码。", hi: "आपके कार्ड का व्यक्तिगत पहचान संख्या।", es: "El número de identificación personal de su tarjeta.", ar: "رقم التعريف الشخصي لبطاقتك.", fr: "Le numéro d'identification personnel de votre carte.", de: "Ihre persönliche Identifikationsnummer Ihrer Karte.", ru: "Персональный идентификационный номер вашей карты.", pt: "O número de identificação pessoal do seu cartão.", ja: "あなたのカードの個人識別番号。", pa: "ਤੁਹਾਡੇ ਕਾਰਡ ਦਾ ਨਿੱਜੀ ਪਛਾਣ ਨੰਬਰ।", bn: "আপনার কার্ডের ব্যক্তিগত শনাক্তকরণ নম্বর।", id: "Nomor identifikasi pribadi kartu Anda.", ur: "آپ کے کارڈ کا ذاتی شناختی نمبر۔", ms: "Nombor pengenalan peribadi kad anda.", it: "Il numero di identificazione personale della tua carta.", tr: "Kartınızın kişisel tanımlama numarası.", ta: "உங்கள் கார்டின் தனிப்பட்ட அடையாள எண்.", te: "మీ కార్డ్ వ్యక్తిగత గుర్తింపు సంఖ్య.", ko: "귀하의 카드 개인 식별 번호.", vi: "Số nhận dạng cá nhân của thẻ của bạn.", pl: "Twój osobisty numer identyfikacyjny karty.", ro: "Numărul de identificare personal al cardului dvs.", nl: "Uw persoonlijke identificatienummer van uw kaart.", el: "Ο προσωπικός αριθμός αναγνώρισης της κάρτας σας.", th: "หมายเลขประจำตัวส่วนบุคคลของบัตรของคุณ", cs: "Osobní identifikační číslo vaší karty.", hu: "A kártya személyes azonosító száma.", sv: "Ditt korts personliga identifikationsnummer.", da: "Dit korts personlige identifikationsnummer." })}
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <input className="w-full focus-visible:outline-none"
            autoComplete="off"
            type={flipped ? "text" : "password"}
            placeholder="123456"
            onChange={e => setPin(e.target.value)}
            value={$pin} />
          <div className="flex items-center gap-2">
            <button className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none"
              type="button"
              onClick={() => setFlipped(x => !x)}>
              <InButton>
                {flipped ? <Outline.EyeSlashIcon className="size-5" /> : <Outline.EyeIcon className="size-5" />}
              </InButton>
            </button>
          </div>
        </div>
        <div className="h-6" />
        <div className="font-medium">
          {Lang.match({ en: "Notes", zh: "备注", hi: "नोट्स", es: "Notas", ar: "ملاحظات", fr: "Notes", de: "Notizen", ru: "Заметки", pt: "Notas", ja: "メモ", pa: "ਨੋਟਸ", bn: "নোটস", id: "Catatan", ur: "نوٹس", ms: "Nota", it: "Note", tr: "Notlar", ta: "குறிப்புகள்", te: "గమనికలు", ko: "메모", vi: "Ghi chú", pl: "Notatki", ro: "Note", nl: "Notities", el: "Σημειώσεις", th: "บันทึก", cs: "Poznámky", hu: "Jegyzetek", sv: "Anteckningar", da: "Noter" })}
        </div>
        <div className="text-default-contrast">
          {Lang.match({ en: "Any additional information.", zh: "任何附加信息。", hi: "कोई अतिरिक्त जानकारी।", es: "Cualquier información adicional.", ar: "أي معلومات إضافية.", fr: "Toute information supplémentaire.", de: "Alle zusätzlichen Informationen.", ru: "Любая дополнительная информация.", pt: "Qualquer informação adicional.", ja: "追加情報。", pa: "ਕੋਈ ਵੀ ਵਾਧੂ ਜਾਣਕਾਰੀ।", bn: "যেকোনও অতিরিক্ত তথ্য।", id: "Informasi tambahan apa pun.", ur: "کوئی اضافی معلومات۔", ms: "Sebarang maklumat tambahan.", it: "Qualsiasi informazione aggiuntiva.", tr: "Herhangi bir ek bilgi.", ta: "எந்தவொரு கூடுதல் தகவலும்.", te: "ఏదైనా అదనపు సమాచారం.", ko: "추가 정보.", vi: "Bất kỳ thông tin bổ sung nào.", pl: "Wszelkie dodatkowe informacje.", ro: "Orice informație suplimentară.", nl: "Eventuele aanvullende informatie.", el: "Οποιαδήποτε επιπλέον πληροφορία.", th: "ข้อมูลเพิ่มเติมใด ๆ.", cs: "Jakékoli další informace.", hu: "Bármilyen további információ.", sv: "Eventuell ytterligare information.", da: "Eventuelle yderligere oplysninger." })}
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex flex-col gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <textarea className="w-full resize-none focus-visible:outline-none"
            rows={6}
            placeholder={Lang.match({ en: "I use this account for...", zh: "我使用此账户用于...", hi: "मैं इस खाते का उपयोग करता हूँ...", es: "Uso esta cuenta para...", ar: "أستخدم هذا الحساب لـ...", fr: "J'utilise ce compte pour...", de: "Ich benutze dieses Konto für...", ru: "Я использую этот аккаунт для...", pt: "Eu uso esta conta para...", ja: "このアカウントを使用する理由は...", pa: "ਮੈਂ ਇਸ ਖਾਤੇ ਨੂੰ ਇਸ ਲਈ ਵਰਤਦਾ ਹਾਂ...", bn: "আমি এই অ্যাকাউন্টটি ব্যবহার করি...", id: "Saya menggunakan akun ini untuk...", ur: "میں اس اکاؤنٹ کو استعمال کرتا ہوں...", ms: "Saya menggunakan akaun ini untuk...", it: "Uso questo account per...", tr: "Bu hesabı kullanıyorum...", ta: "நான் இந்த கணக்கை பயன்படுத்துகிறேன்...", te: "నేను ఈ ఖాతాను ఉపయోగిస్తున్నాను...", ko: "이 계정을 사용하는 이유는...", vi: "Tôi sử dụng tài khoản này để...", pl: "Używam tego konta do...", ro: "Folosesc acest cont pentru...", nl: "Ik gebruik dit account voor...", el: "Χρησιμοποιώ αυτόν τον λογαριασμό για...", th: "ฉันใช้บัญชีนี้สำหรับ...", cs: "Používám tento účet pro...", hu: "Ezt a fiókot használom...", sv: "Jag använder detta konto för...", da: "Jeg bruger denne konto til..." })}
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
              {writeOrDisplay.running === true && <Spinner className="size-5 animate-spin" />}
              {writeOrDisplay.running === false && (error != null ? error : Lang.match({ en: "Save", zh: "保存", hi: "सहेजें", es: "Guardar", ar: "حفظ", fr: "Enregistrer", de: "Speichern", ru: "Сохранить", pt: "Salvar", ja: "保存", pa: "ਸੰਭਾਲੋ", bn: "সংরক্ষণ করুন", id: "Simpan", ur: "محفوظ کریں", ms: "Simpan", it: "Salva", tr: "Kaydet", ta: "சேமிக்கவும்", te: "సేవ్ చేయండి", ko: "저장", vi: "Lưu", pl: "Zapisz", ro: "Salvează", nl: "Opslaan", el: "Αποθήκευση", th: "บันทึก", cs: "Uložit", hu: "Mentés", sv: "Spara", da: "Gem" }))}
            </WideOppositeButton>}
          {session.value.user.fsfh == null &&
            <WideOppositeButton
              type="button"
              disabled={saveOrDisplay.running || error != null}
              onClick={saveOrDisplay.execute}>
              {saveOrDisplay.running === true && <Spinner className="size-5 animate-spin" />}
              {saveOrDisplay.running === false && (error != null ? error : Lang.match({ en: "Save", zh: "保存", hi: "सहेजें", es: "Guardar", ar: "حفظ", fr: "Enregistrer", de: "Speichern", ru: "Сохранить", pt: "Salvar", ja: "保存", pa: "ਸੰਭਾਲੋ", bn: "সংরক্ষণ করুন", id: "Simpan", ur: "محفوظ کریں", ms: "Simpan", it: "Salva", tr: "Kaydet", ta: "சேமிக்கவும்", te: "సేవ్ చేయండి", ko: "저장", vi: "Lưu", pl: "Zapisz", ro: "Salvează", nl: "Opslaan", el: "Αποθήκευση", th: "บันทึก", cs: "Uložit", hu: "Mentés", sv: "Spara", da: "Gem" }))}
            </WideOppositeButton>}
        </div>
      </form>
    </div>
  </Fragment>
}

export function CardAccountPage(props: { $entry: KDBX.Inner.KeePassFile.Entry }) {
  const { $entry } = props

  const close = useCloseContext().getOrThrow()

  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const session = useSessionContext().getOrThrow()

  const [flipped, setFlipped] = useState(false)

  const title = useMemo(() => {
    return $entry.getStringByKeyOrNull("Title")?.getValueOrThrow().get()
  }, [$entry])

  const color = useMemo(() => {
    return $entry.getStringByKeyOrNull("Color")?.getValueOrThrow().get()
  }, [$entry])

  const trashed = useMemo(() => {
    const { kdbx } = session.value

    const $file = kdbx.inner.content.value
    const $trash = getRecycleBinOrNull($file)

    if ($trash == null)
      return false

    return $trash.element.contains($entry.element)
  }, [session, $entry])

  const num = useMemo(() => {
    return $entry.getStringByKeyOrNull("CardNumber")?.getValueOrThrow().get()
  }, [$entry])

  const hol = useMemo(() => {
    return $entry.getStringByKeyOrNull("CardHolder")?.getValueOrThrow().get()
  }, [$entry])

  const exp = useMemo(() => {
    return $entry.getStringByKeyOrNull("ExpiryDate")?.getValueOrThrow().get()
  }, [$entry])

  const cvv = useMemo(() => {
    return $entry.getStringByKeyOrNull("CVV")?.getValueOrThrow().get()
  }, [$entry])

  const pin = useMemo(() => {
    return $entry.getStringByKeyOrNull("PIN")?.getValueOrThrow().get()
  }, [$entry])

  const notes = useMemo(() => {
    return $entry.getStringByKeyOrNull("Notes")?.getValueOrThrow().get()
  }, [$entry])

  const copyTheNum = useCopy(num)
  const copyTheHol = useCopy(hol)
  const copyTheExp = useCopy(exp)
  const copyTheCvv = useCopy(cvv)
  const copyThePin = useCopy(pin)

  return <div className="flex flex-col grow p-6">
    <SubpathProvider value={hash}>
      {hash.url.pathname === "/+" &&
        <PathPaper>
          <div className="flex flex-col text-left gap-2">
            {/* <WideNakedMenuButton>
              <Outline.PencilIcon className="size-5" />
              Edit
            </WideNakedMenuButton> */}
            {trashed === false && <AccountMenuTrashButton $entry={$entry} close={close} />}
            {trashed === true && <AccountMenuUntrashButton $entry={$entry} close={close} />}
            {trashed === true && <AccountMenuDeleteButton $entry={$entry} close={close} />}
          </div>
        </PathPaper>}
    </SubpathProvider>
    <div className="flex items-center justify-between">
      <h1 className="text-xl font-medium">
        {Lang.match({ en: "Card account", zh: "卡片账户", hi: "कार्ड खाता", es: "Cuenta de tarjeta", ar: "حساب البطاقة", fr: "Compte de carte", de: "Kartenkonto", ru: "Карта аккаунта", pt: "Conta do cartão", ja: "カードアカウント", pa: "ਕਾਰਡ ਖਾਤਾ", bn: "কার্ড অ্যাকাউন্ট", id: "Akun kartu", ur: "کارڈ اکاؤنٹ", ms: "Akun kartu", it: "Account carta", tr: "Kart hesabı", ta: "கார்டு கணக்கு", te: "కార్డు ఖాతా", ko: "카드 계정", vi: "Tài khoản thẻ", pl: "Konto karty", ro: "Cont de card", nl: "Kaartaccount", el: "Λογαριασμός κάρτας", th: "บัญชีบัตรเครดิต", cs: "Kreditní karta účet", hu: "Kártya fiók", sv: "Kortkonto", da: "Kortkonto" })}
      </h1>
      <AccountMenuAnchor />
    </div>
    <div className="h-6" />
    <div className="flex items-center justify-center">
      <FlipCard
        type={Lang.match({ en: "Card", zh: "卡片", hi: "कार्ड", es: "Tarjeta", ar: "بطاقة", fr: "Carte", de: "Karte", ru: "Карта", pt: "Cartão", ja: "カード", pa: "ਕਾਰਡ", bn: "কার্ড", id: "Kartu", ur: "کارڈ", ms: "Kad", it: "Carta", tr: "Kart", ta: "கார்டு", te: "కార్డు", ko: "카드", vi: "Thẻ", pl: "Karta", ro: "Card", nl: "Kaart", el: "Κάρτα", th: "บัตร", cs: "Karta", hu: "Kártya", sv: "Kort", da: "Kort" })}
        title={title}
        subtitle={num}
        color={color}
        icon={<Outline.CreditCardIcon className="size-5" />}
        flip={flipped}
        onFlipChange={setFlipped} />
    </div>
    <form className="grow flex flex-col"
      onSubmit={Events.preventDefault}>
      <input className="hidden"
        autoComplete="off"
        name="username" />
      {num && <Fragment>
        <div className="h-6" />
        <div className="font-medium">
          {Lang.match({ en: "Number", zh: "号码", hi: "नंबर", es: "Número", ar: "رقم", fr: "Numéro", de: "Nummer", ru: "Номер", pt: "Número", ja: "番号", pa: "ਨੰਬਰ", bn: "নম্বর", id: "Nomor", ur: "نمبر", ms: "Nomor", it: "Numero", tr: "Numara", ta: "எண்", te: "సంఖ్య", ko: "번호", vi: "Số", pl: "Numer", ro: "Număr", nl: "Nummer", el: "Αριθμός", th: "หมายเลข", cs: "Číslo", hu: "Szám", sv: "Nummer", da: "Nummer" })}
        </div>
        <div className="text-default-contrast">
          {Lang.match({ en: "Your card number.", zh: "您的卡号。", hi: "आपका कार्ड नंबर।", es: "El número de su tarjeta.", ar: "رقم بطاقتك.", fr: "Votre numéro de carte.", de: "Ihre Kartennummer.", ru: "Номер вашей карты.", pt: "O número do seu cartão.", ja: "あなたのカード番号。", pa: "ਤੁਹਾਡਾ ਕਾਰਡ ਨੰਬਰ।", bn: "আপনার কার্ড নম্বর।", id: "Nomor kartu Anda.", ur: "آپ کا کارڈ نمبر۔", ms: "Nomor kartu Anda.", it: "Il numero della tua carta.", tr: "Kart numaranız.", ta: "உங்கள் கார்டு எண்.", te: "మీ కార్డు సంఖ్య.", ko: "카드 번호입니다.", vi: "Số thẻ của bạn.", pl: "Numer twojej karty.", ro: "Numărul cardului dvs.", nl: "Uw kaartnummer.", el: "Ο αριθμός της κάρτας σας.", th: "หมายเลขบัตรของคุณ", cs: "Vaše číslo karty.", hu: "A kártya száma.", sv: "Ditt kortnummer.", da: "Dit kortnummer." })}
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <input className="w-full focus-visible:outline-none"
            readOnly
            autoComplete="off"
            onFocus={e => e.currentTarget.select()}
            value={num} />
          <div className="flex items-center gap-2">
            <button className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none"
              type="button"
              onClick={copyTheNum.copyOrDisplay}>
              <InButton>
                {copyTheNum.copied ? <Outline.CheckIcon className="size-5" /> : <Outline.DocumentDuplicateIcon className="size-5" />}
              </InButton>
            </button>
          </div>
        </div>
      </Fragment>}
      {hol && <Fragment>
        <div className="h-6" />
        <div className="font-medium">
          {Lang.match({ en: "Holder", zh: "持卡人", hi: "धारक", es: "Titular", ar: "صاحب البطاقة", fr: "Titulaire", de: "Inhaber", ru: "Держатель", pt: "Titular", ja: "カード所有者", pa: "ਹੋਲਡਰ", bn: "হোল্ডার", id: "Pemegang", ur: "ہولڈر", ms: "Pemegang", it: "Titolare", tr: "Sahip", ta: "கார்டு வைத்திருப்பவர்", te: "హోల్డర్", ko: "홀더", vi: "Chủ thẻ", pl: "Posiadacz karty", ro: "Titularul cardului", nl: "Houder", el: "Κάτοχος κάρτας", th: "ผู้ถือบัตรเครดิต", cs: "Držitel karty.", hu: "Kártyabirtokos.", sv: "Innehavare.", da: "Indehaver." })}
        </div>
        <div className="text-default-contrast">
          {Lang.match({ en: "Your card holder name.", zh: "您的卡片持有人姓名。", hi: "आपका कार्ड धारक नाम।", es: "El nombre del titular de su tarjeta.", ar: "اسم حامل البطاقة الخاصة بك.", fr: "Le nom du titulaire de votre carte.", de: "Der Name des Karteninhabers.", ru: "Имя держателя вашей карты.", pt: "O nome do titular do seu cartão.", ja: "あなたのカード所有者の名前。", pa: "ਤੁਹਾਡਾ ਕਾਰਡ ਹੋਲਡਰ ਨਾਮ।", bn: "আপনার কার্ড হোল্ডারের নাম।", id: "Nama pemegang kartu Anda.", ur: "آپ کے کارڈ ہولڈر کا نام۔", ms: "Nama pemegang kad anda.", it: "Il nome del titolare della tua carta.", tr: "Kart sahibinin adı.", ta: "உங்கள் கார்டு ஹோல்டர் பெயர்.", te: "మీ కార్డు హోల్డర్ పేరు.", ko: "카드 소유자 이름입니다.", vi: "Tên chủ thẻ của bạn.", pl: "Nazwa posiadacza karty.", ro: "Numele titularului cardului dvs.", nl: "De naam van de kaarthouder.", el: "Το όνομα του κατόχου της κάρτας σας.", th: "ชื่อผู้ถือบัตรของคุณ", cs: "Jméno držitele karty.", hu: "A kártya tulajdonosának neve.", sv: "Kortinnehavarens namn.", da: "Kortindehaverens navn." })}
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <input className="w-full focus-visible:outline-none"
            readOnly
            autoComplete="off"
            onFocus={e => e.currentTarget.select()}
            value={hol} />
          <div className="flex items-center gap-2">
            <button className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none"
              type="button"
              onClick={copyTheHol.copyOrDisplay}>
              <InButton>
                {copyTheHol.copied ? <Outline.CheckIcon className="size-5" /> : <Outline.DocumentDuplicateIcon className="size-5" />}
              </InButton>
            </button>
          </div>
        </div>
      </Fragment>}
      {exp && <Fragment>
        <div className="h-6" />
        <div className="font-medium">
          {Lang.match({ en: "Expiry", zh: "到期", hi: "समाप्ति", es: "Vencimiento", ar: "تاريخ الانتهاء", fr: "Expiration", de: "Ablauf", ru: "Срок действия", pt: "Validade", ja: "有効期限", pa: "ਮਿਆਦ", bn: "মেয়াদ শেষ", id: "Kedaluwarsa", ur: "اختتامی تاریخ", ms: "Tamat tempoh", it: "Scadenza", tr: "Son kullanma tarihi", ta: "காலாவதி", te: "కాలపరిమితి", ko: "만료", vi: "Hết hạn", pl: "Wygasa", ro: "Expirare", nl: "Vervaldatum", el: "Ημερομηνία λήξης", th: "วันหมดอายุ", cs: "Datum vypršení platnosti", hu: "Lejárat", sv: "Utgångsdatum", da: "Udløbsdato" })}
        </div>
        <div className="text-default-contrast">
          {Lang.match({ en: "Your card expiry date.", zh: "您的卡片到期日期。", hi: "आपका कार्ड समाप्ति तिथि।", es: "La fecha de vencimiento de su tarjeta.", ar: "تاريخ انتهاء صلاحية بطاقتك.", fr: "La date d'expiration de votre carte.", de: "Das Ablaufdatum Ihrer Karte.", ru: "Дата истечения срока действия вашей карты.", pt: "A data de validade do seu cartão.", ja: "あなたのカードの有効期限。", pa: "ਤੁਹਾਡਾ ਕਾਰਡ ਮਿਆਦ ਦੀ ਤਾਰੀਖ।", bn: "আপনার কার্ডের মেয়াদ শেষ হওয়ার তারিখ।", id: "Tanggal kedaluwarsa kartu Anda.", ur: "آپ کے کارڈ کی تاریخ ختم ہونے کی تاریخ۔", ms: "Tarikh tamat tempoh kad anda.", it: "La data di scadenza della tua carta.", tr: "Kartınızın son kullanma tarihi.", ta: "உங்கள் கார்டு காலாவதி தேதி.", te: "మీ కార్డు కాలపరిమితి తేదీ.", ko: "카드 만료 날짜입니다.", vi: "Ngày hết hạn thẻ của bạn.", pl: "Data wygaśnięcia twojej karty.", ro: "Data expirării cardului dvs.", nl: "De vervaldatum van uw kaart.", el: "Η ημερομηνία λήξης της κάρτας σας.", th: "วันหมดอายุของบัตรของคุณ", cs: "Datum vypršení platnosti vaší karty.", hu: "A kártya lejárati dátuma.", sv: "Ditt korts utgångsdatum.", da: "Udløbsdato for dit kort." })}
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <input className="w-full focus-visible:outline-none"
            readOnly
            autoComplete="off"
            onFocus={e => e.currentTarget.select()}
            value={exp} />
          <div className="flex items-center gap-2">
            <button className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none"
              type="button"
              onClick={copyTheExp.copyOrDisplay}>
              <InButton>
                {copyTheExp.copied ? <Outline.CheckIcon className="size-5" /> : <Outline.DocumentDuplicateIcon className="size-5" />}
              </InButton>
            </button>
          </div>
        </div>
      </Fragment>}
      {cvv && <Fragment>
        <div className="h-6" />
        <div className="font-medium">
          {Lang.match({ en: "CVV", zh: "CVV", hi: "CVV", es: "CVV", ar: "CVV", fr: "CVV", de: "CVV", ru: "CVV", pt: "CVV", ja: "CVV", pa: "CVV", bn: "CVV", id: "CVV", ur: "CVV", ms: "CVV", it: "CVV", tr: "CVV", ta: "CVV", te: "CVV", ko: "CVV", vi: "CVV", pl: "CVV", ro: "CVV", nl: "CVV", el: "CVV", th: "CVV", cs: "CVV", hu: "CVV", sv: "CVV", da: "CVV" })}
        </div>
        <div className="text-default-contrast">
          {Lang.match({ en: "Your card verification value.", zh: "您的卡片验证值。", hi: "आपका कार्ड सत्यापन मूल्य।", es: "El valor de verificación de su tarjeta.", ar: "قيمة التحقق من بطاقتك.", fr: "La valeur de vérification de votre carte.", de: "Der Überprüfungswert Ihrer Karte.", ru: "Значение проверки вашей карты.", pt: "O valor de verificação do seu cartão.", ja: "あなたのカードの確認値。", pa: "ਤੁਹਾਡਾ ਕਾਰਡ ਵੈਰੀਫਿਕੇਸ਼ਨ ਮੁੱਲ।", bn: "আপনার কার্ড যাচাইকরণ মান।", id: "Nilai verifikasi kartu Anda.", ur: "آپ کے کارڈ کی تصدیقی قیمت۔", ms: "Nilai pengesahan kad anda.", it: "Il valore di verifica della tua carta.", tr: "Kartınızın doğrulama değeri.", ta: "உங்கள் கார்டு சரிபார்ப்பு மதிப்பு.", te: "మీ కార్డు ధృవీకరణ విలువ.", ko: "카드 확인 값입니다.", vi: "Giá trị xác minh thẻ của bạn.", pl: "Wartość weryfikacji twojej karty.", ro: "Valoarea de verificare a cardului dvs.", nl: "De verificatiewaarde van uw kaart.", el: "Η τιμή επαλήθευσης της κάρτας σας.", th: "ค่าการตรวจสอบบัตรของคุณ", cs: "Hodnota ověření vaší karty.", hu: "A kártya ellenőrző értéke.", sv: "Ditt korts verifieringsvärde.", da: "Dit korts verificeringsværdi." })}
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <input className="w-full focus-visible:outline-none"
            readOnly
            autoComplete="off"
            type={flipped ? "text" : "password"}
            onFocus={e => e.currentTarget.select()}
            value={cvv} />
          <div className="flex items-center gap-2">
            <button className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none"
              type="button"
              onClick={() => setFlipped(x => !x)}>
              <InButton>
                {flipped ? <Outline.EyeSlashIcon className="size-5" /> : <Outline.EyeIcon className="size-5" />}
              </InButton>
            </button>
            <button className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none"
              type="button"
              onClick={copyTheCvv.copyOrDisplay}>
              <InButton>
                {copyTheCvv.copied ? <Outline.CheckIcon className="size-5" /> : <Outline.DocumentDuplicateIcon className="size-5" />}
              </InButton>
            </button>
          </div>
        </div>
      </Fragment>}
      {pin && <Fragment>
        <div className="h-6" />
        <div className="font-medium">
          {Lang.match({ en: "PIN", zh: "PIN", hi: "PIN", es: "PIN", ar: "PIN", fr: "PIN", de: "PIN", ru: "PIN", pt: "PIN", ja: "PIN", pa: "PIN", bn: "PIN", id: "PIN", ur: "PIN", ms: "PIN", it: "PIN", tr: "PIN", ta: "PIN", te: "PIN", ko: "PIN", vi: "PIN", pl: "PIN", ro: "PIN", nl: "PIN", el: "PIN", th: "รหัส PIN", cs: "PIN kód", hu: "PIN kód", sv: "PIN-kod", da: "PIN-kode" })}
        </div>
        <div className="text-default-contrast">
          {Lang.match({ en: "Your card personal identification number.", zh: "您的卡片个人识别号码。", hi: "आपका कार्ड व्यक्तिगत पहचान संख्या।", es: "El número de identificación personal de su tarjeta.", ar: "رقم التعريف الشخصي لبطاقتك.", fr: "Le numéro d'identification personnel de votre carte.", de: "Ihre persönliche Identifikationsnummer der Karte.", ru: "Ваш личный идентификационный номер карты.", pt: "O número de identificação pessoal do seu cartão.", ja: "あなたのカードの個人識別番号。", pa: "ਤੁਹਾਡਾ ਕਾਰਡ ਨਿੱਜੀ ਪਛਾਣ ਨੰਬਰ।", bn: "আপনার কার্ডের ব্যক্তিগত শনাক্তকরণ নম্বর।", id: "Nomor identifikasi pribadi kartu Anda.", ur: "آپ کے کارڈ کا ذاتی شناختی نمبر۔", ms: "Nombor pengenalan peribadi kad anda.", it: "Il numero di identificazione personale della tua carta.", tr: "Kartınızın kişisel tanımlama numarası.", ta: "உங்கள் கார்டின் தனிப்பட்ட அடையாள எண்.", te: "మీ కార్డు వ్యక్తిగత గుర్తింపు సంఖ్య.", ko: "카드 개인 식별 번호입니다.", vi: "Số nhận dạng cá nhân của thẻ của bạn.", pl: "Twój osobisty numer identyfikacyjny karty.", ro: "Numărul de identificare personal al cardului dvs.", nl: "Uw persoonlijke identificatienummer van uw kaart.", el: "Ο προσωπικός αριθμός αναγνώρισης της κάρτας σας.", th: "หมายเลขประจำตัวส่วนบุคคลของบัตรของคุณ", cs: "Vaše osobní identifikační číslo karty.", hu: "A kártya személyes azonosító száma.", sv: "Ditt korts personliga identifikationsnummer.", da: "Dit korts personlige identifikationsnummer." })}
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <input className="w-full focus-visible:outline-none"
            readOnly
            autoComplete="off"
            type={flipped ? "text" : "password"}
            onFocus={e => e.currentTarget.select()}
            value={pin} />
          <div className="flex items-center gap-2">
            <button className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none"
              type="button"
              onClick={() => setFlipped(x => !x)}>
              <InButton>
                {flipped ? <Outline.EyeSlashIcon className="size-5" /> : <Outline.EyeIcon className="size-5" />}
              </InButton>
            </button>
            <button className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none"
              type="button"
              onClick={copyThePin.copyOrDisplay}>
              <InButton>
                {copyThePin.copied ? <Outline.CheckIcon className="size-5" /> : <Outline.DocumentDuplicateIcon className="size-5" />}
              </InButton>
            </button>
          </div>
        </div>
      </Fragment>}
      {notes && <Fragment>
        <div className="h-6" />
        <div className="font-medium">
          {Lang.match({ en: "Notes", zh: "备注", hi: "नोट्स", es: "Notas", ar: "ملاحظات", fr: "Remarques", de: "Notizen", ru: "Заметки", pt: "Notas", ja: "ノート", pa: "ਨੋਟਸ", bn: "নোটস", id: "Catatan", ur: "نوٹس", ms: "Catatan", it: "Note", tr: "Notlar", ta: "குறிப்புகள்", te: "గమనికలు", ko: "노트", vi: "Ghi chú", pl: "Notatki", ro: "Note", nl: "Notities", el: "Σημειώσεις", th: "บันทึกย่อ", cs: "Poznámky", hu: "Jegyzetek", sv: "Anteckningar", da: "Noter" })}
        </div>
        <div className="text-default-contrast">
          {Lang.match({ en: "Any additional information.", zh: "任何附加信息。", hi: "कोई अतिरिक्त जानकारी।", es: "Cualquier información adicional.", ar: "أي معلومات إضافية.", fr: "Toute information supplémentaire.", de: "Alle zusätzlichen Informationen.", ru: "Любая дополнительная информация.", pt: "Qualquer informação adicional.", ja: "追加情報。", pa: "ਕੋਈ ਵੀ ਵਾਧੂ ਜਾਣਕਾਰੀ।", bn: "যেকোনও অতিরিক্ত তথ্য।", id: "Informasi tambahan apa pun.", ur: "کوئی اضافی معلومات۔", ms: "Sebarang maklumat tambahan.", it: "Qualsiasi informazione aggiuntiva.", tr: "Herhangi bir ek bilgi.", ta: "எந்தவொரு கூடுதல் தகவலும்.", te: "ఏదైనా అదనపు సమాచారం.", ko: "추가 정보.", vi: "Bất kỳ thông tin bổ sung nào.", pl: "Wszelkie dodatkowe informacje.", ro: "Orice informație suplimentară.", nl: "Eventuele aanvullende informatie.", el: "Οποιαδήποτε επιπλέον πληροφορία.", th: "ข้อมูลเพิ่มเติมใด ๆ", cs: "Jakékoli další informace.", hu: "Bármilyen további információ.", sv: "Eventuell ytterligare information.", da: "Eventuelle yderligere oplysninger." })}
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex flex-col gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <textarea className="w-full resize-none focus-visible:outline-none"
            readOnly
            rows={6}
            value={notes} />
        </div>
      </Fragment>}
    </form>
  </div>
}