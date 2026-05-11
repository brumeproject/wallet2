import { InButton, WideContrastButton, WideOppositeButton } from "@/libs/button/mod.tsx";
import { useCopy } from "@/libs/copy/mod.ts";
import { PathBoard } from "@/libs/dialog/board/mod.tsx";
import { PathPaper, WideNakedMenuAnchor } from "@/libs/dialog/paper/mod.tsx";
import { Errors } from "@/libs/errors/mod.ts";
import { Events } from "@/libs/events/mod.ts";
import { Outline } from "@/libs/heroicons/mod.ts";
import { getRecycleBinOrNull } from "@/libs/kdbx/mod.ts";
import { Lang } from "@/libs/lang/mod.ts";
import { Nullable } from "@/libs/nullable/mod.ts";
import { useTotpCode } from "@/libs/totp/mod.ts";
import { PasswordInputAnchor, PasswordMenu, ScanPage, TotpPageAnchor } from "@/mods/app/session/account/password/mod.tsx";
import { Writable } from "@hazae41/binary";
import { SubpathProvider, useAnchorWithCoords, useHashSubpath, usePathContext } from "@hazae41/chemin";
import * as KDBX from "@hazae41/kdbx";
import { useCloseContext } from "@hazae41/react-close-context";
import React, { Fragment, useCallback, useDeferredValue, useMemo, useState } from "react";
import { useSessionContext } from "../../mod.tsx";
import { AccountMenuAnchor, AccountMenuDeleteButton, AccountMenuTrashButton, AccountMenuUntrashButton, ColorAnchor, ColorMenu, KeypairAccountCard } from "../mod.tsx";

React;

export function KeypairAccountAddMenuAnchor() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, "/keypair")

  return <WideNakedMenuAnchor
    href={coords.url.hash}
    onClick={coords.onClick}
    onKeyDown={coords.onKeyDown}>
    <Outline.KeyIcon className="size-5" />
    {Lang.match({ en: "Keypair", zh: "密钥对", hi: "की जोड़ी", es: "Par de claves", ar: "زوج المفاتيح", fr: "Paire de clés", de: "Schlüsselpaar", ru: "Ключевая пара", pt: "Par de chaves", ja: "キーペア", pa: "ਕੀ ਜੋੜ", bn: "কী জোড়া", id: "Pasangan kunci", ur: "جوڑی کلید", ms: "Pasangan kunci", it: "Coppia di chiavi", tr: "Anahtar çifti", ta: "கீபேர்", te: "కీపేర్", ko: "키쌍", vi: "Cặp khóa", pl: "Para kluczy", ro: "Pereche de chei", nl: "Sleutelpaar", el: "Ζεύγος κλειδιών", th: "คู่กุญแจ", cs: "Klíčový pár", hu: "Kulcspár", sv: "Nyckelpar", da: "Nøglepar" })}
  </WideNakedMenuAnchor>
}

export function KeypairAccountAddPage() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const close = useCloseContext().getOrThrow()

  const session = useSessionContext().getOrThrow()

  const [flipped, setFlipped] = useState(false)

  const [$title, setTitle] = useState("")

  const [$pubkey, setPubKey] = useState("")
  const [$sigkey, setSigKey] = useState("")
  const [$username, setUsername] = useState("")
  const [$password, setPassword] = useState("")
  const [$totpseed, setTotpSeed] = useState("")

  const [$notes, setNotes] = useState("")

  const title = useDeferredValue($title)

  const [color, setColor] = useState<Nullable<string>>(["red", "orange", "amber", "yellow", "lime", "green", "emerald", "teal", "cyan", "sky", "blue", "indigo", "violet", "purple", "fuchsia", "pink", "rose"][Math.floor(Math.random() * 16)])

  const pubkey = useDeferredValue($pubkey)
  const sigkey = useDeferredValue($sigkey)
  const username = useDeferredValue($username)
  const password = useDeferredValue($password)
  const totpseed = useDeferredValue($totpseed)
  const totpcode = useTotpCode(totpseed)

  const notes = useDeferredValue($notes)

  const copyTheTotpcode = useCopy(totpcode)

  const encryptOrThrow = useCallback(async () => {
    const { kdbx, comp } = session.value

    const $file = kdbx.inner.content.value
    const $root = $file.getRootOrThrow()

    const $group = $root.getDirectGroupByIndexOrThrow(0)
    const $entry = $group.addEntryOrThrow()

    $entry.addStringOrThrow("Title", title)

    if (color)
      $entry.addStringOrThrow("Color", color)

    if (pubkey)
      $entry.addStringOrThrow("PublicKey", pubkey)

    if (sigkey)
      $entry.addStringOrThrow("PrivateKey", sigkey)

    if (username)
      $entry.addStringOrThrow("UserName", username)

    if (password)
      $entry.addStringOrThrow("Password", password, true)

    if (notes)
      $entry.addStringOrThrow("Notes", notes)

    if (totpseed)
      $entry.addStringOrThrow("otp", totpseed, true)

    return Writable.writeToBytesOrThrow(await kdbx.encryptOrThrow(comp))
  }, [session, title, color, pubkey, sigkey, username, password, totpseed, notes])

  const encryptAndWriteOrAlert = useCallback(() => Promise.try(async () => {
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

  const encryptAndSaveOrAlert = useCallback(() => Promise.try(async () => {
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
    if (!pubkey.length)
      return Lang.match({ en: "Public key is required", zh: "公钥是必需的", hi: "सार्वजनिक कुंजी आवश्यक है", es: "La clave pública es obligatoria", ar: "المفتاح العام مطلوب", fr: "La clé publique est requise", de: "Der öffentliche Schlüssel ist erforderlich", ru: "Требуется открытый ключ", pt: "A chave pública é obrigatória", ja: "公開鍵は必須です", pa: "ਪਬਲਿਕ ਕੀ ਲਾਜ਼ਮੀ ਹੈ", bn: "পাবলিক কী প্রয়োজন", id: "Kunci publik diperlukan", ur: "پبلک کی ضروری ہے", ms: "Kunci publik diperlukan", it: "La chiave pubblica è obbligatoria", tr: "Genel anahtar gereklidir", ta: "பொது விசை தேவைப்படுகிறது", te: "పబ్లిక్ కీ అవసరం", ko: "공개 키가 필요합니다", vi: "Yêu cầu khóa công khai", pl: "Wymagany klucz publiczny", ro: "Cheia publică este obligatorie", nl: "Publieke sleutel is vereist", el: "Το δημόσιο κλειδί είναι υποχρεωτικό", th: "ต้องมีคีย์สาธารณะ", cs: "Veřejný klíč je povinný", hu: "A nyilvános kulcs kötelező", sv: "Offentlig nyckel krävs", da: "Offentlig nøgle er påkrævet" })
    return
  }, [pubkey])

  return <Fragment>
    <SubpathProvider value={hash}>
      {hash.url.pathname === "/color" &&
        <PathPaper>
          <ColorMenu ok={setColor} />
        </PathPaper>}
      {hash.url.pathname === "/password" &&
        <PathPaper>
          <PasswordMenu value={password} onChange={setPassword} />
        </PathPaper>}
      {hash.url.pathname === "/totp" &&
        <PathBoard>
          <ScanPage value={$totpseed} onChange={setTotpSeed} />
        </PathBoard>}
    </SubpathProvider>
    <div className="flex flex-col grow p-6">
      <h1 className="text-xl font-medium">
        {Lang.match({ en: "Add keypair account", zh: "添加密钥对账户", hi: "की जोड़ी खाता जोड़ें", es: "Agregar cuenta de par de claves", ar: "إضافة حساب زوج المفاتيح", fr: "Ajouter un compte de paire de clés", de: "Schlüsselpaar-Konto hinzufügen", ru: "Добавить учетную запись ключевой пары", pt: "Adicionar conta de par de chaves", ja: "キーペアアカウントを追加", pa: "ਕੀ ਜੋੜ ਖਾਤਾ ਸ਼ਾਮਲ ਕਰੋ", bn: "কী জোড়া অ্যাকাউন্ট যোগ করুন", id: "Tambahkan akun pasangan kunci", ur: "جوڑی کلید اکاؤنٹ شامل کریں", ms: "Tambah akun pasangan kunci", it: "Aggiungi account coppia di chiavi", tr: "Anahtar çifti hesabı ekle", ta: "கீபேர் கணக்கு சேர்க்கவும்", te: "కీపేర్ ఖాతాను జోడించండి", ko: "키쌍 계정 추가", vi: "Thêm tài khoản cặp khóa", pl: "Dodaj konto pary kluczy", ro: "Adăugați contul pereche de chei", nl: "Sleutelpaar-account toevoegen", el: "Προσθήκη λογαριασμού ζεύγους κλειδιών", th: "เพิ่มบัญชีคู่กุญแจ", cs: "Přidat účet klíčového páru", hu: "Kulcspár fiók hozzáadása", sv: "Lägg till nyckelparskonto", da: "Tilføj nøglepar-konto" })}
      </h1>
      <div className="h-6" />
      <div className="flex items-center justify-center">
        <KeypairAccountCard
          title={title}
          color={color}
          username={username}
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
          {Lang.match({ en: "Title", zh: "标题", hi: "शीर्षक", es: "Título", ar: "عنوان", fr: "Titre", de: "Titel", ru: "Заголовок", pt: "Título", ja: "タイトル", pa: "ਸਿਰਲੇਖ", bn: "শিরোনাম", id: "Judul", ur: "عنوان", ms: "Tajuk", it: "Titolo", tr: "Başlık", ta: "தலைப்பு", te: "శీర్షిక", ko: "제목", vi: "Tiêu đề", pl: "Tytuł", ro: "Titlu", nl: "Titel", el: "Τίτλος", th: "หัวข้อ", cs: "Název", hu: "Cím", sv: "Titel", da: "Titel" })}
        </div>
        <div className="text-default-contrast">
          {Lang.match({ en: "A name to identify this account.", zh: "用于识别此账户的名称。", hi: "इस खाते की पहचान करने के लिए एक नाम।", es: "Un nombre para identificar esta cuenta.", ar: "اسم لتحديد هذا الحساب.", fr: "Un nom pour identifier ce compte.", de: "Ein Name zur Identifizierung dieses Kontos.", ru: "Имя для идентификации этой учетной записи.", pt: "Um nome para identificar esta conta.", ja: "このアカウントを識別するための名前。", pa: "ਇਸ ਖਾਤੇ ਦੀ ਪਛਾਣ ਕਰਨ ਲਈ ਇੱਕ ਨਾਮ।", bn: "এই অ্যাকাউন্টটি সনাক্ত করার জন্য একটি নাম।", id: "Nama untuk mengidentifikasi akun ini.", ur: "اس اکاؤنٹ کی شناخت کے لیے ایک نام۔", ms: "Nama untuk mengenal pasti akaun ini.", it: "Un nome per identificare questo account.", tr: "Bu hesabı tanımlamak için bir ad.", ta: "இந்த கணக்கை அடையாளம் காண ஒரு பெயர்.", te: "ఈ ఖాతాను గుర్తించడానికి ఒక పేరు.", ko: "이 계정을 식별하기 위한 이름입니다.", vi: "Tên để xác định tài khoản này.", pl: "Nazwa do identyfikacji tego konta.", ro: "Un nume pentru a identifica acest cont.", nl: "Een naam om dit account te identificeren.", el: "Ένα όνομα για να αναγνωρίσετε αυτόν τον λογαριασμό.", th: "ชื่อเพื่อระบุบัญชีนี้", cs: "Název pro identifikaci tohoto účtu.", hu: "Egy név ennek a fióknak az azonosításához.", sv: "Ett namn för att identifiera detta konto.", da: "Et navn til at identificere denne konto." })}
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
          {Lang.match({ en: "Username", zh: "用户名", hi: "उपयोगकर्ता नाम", es: "Nombre de usuario", ar: "اسم المستخدم", fr: "Nom d'utilisateur", de: "Benutzername", ru: "Имя пользователя", pt: "Nome de usuário", ja: "ユーザー名", pa: "ਉਪਭੋਗਤਾ ਨਾਮ", bn: "ব্যবহারকারীর নাম", id: "Nama pengguna", ur: "صارف نام", ms: "Nama pengguna", it: "Nome utente", tr: "Kullanıcı adı", ta: "பயனர்பெயர்", te: "వినియోగదారు పేరు", ko: "사용자 이름", vi: "Tên người dùng", pl: "Nazwa użytkownika", ro: "Nume de utilizator", nl: "Gebruikersnaam", el: "Όνομα χρήστη", th: "ชื่อผู้ใช้", cs: "Uživatelské jméno", hu: "Felhasználónév", sv: "Användarnamn", da: "Brugernavn" })}
        </div>
        <div className="text-default-contrast">
          {Lang.match({ en: "Your username or email.", zh: "您的用户名或电子邮件。", hi: "आपका उपयोगकर्ता नाम या ईमेल।", es: "Su nombre de usuario o correo electrónico.", ar: "اسم المستخدم أو البريد الإلكتروني الخاص بك.", fr: "Votre nom d'utilisateur ou e-mail.", de: "Ihr Benutzername oder Ihre E-Mail.", ru: "Ваше имя пользователя или электронная почта.", pt: "Seu nome de usuário ou e-mail.", ja: "あなたのユーザー名またはメールアドレス。", pa: "ਤੁਹਾਡਾ ਉਪਭੋਗਤਾ ਨਾਮ ਜਾਂ ਈਮੇਲ।", bn: "আপনার ব্যবহারকারীর নাম বা ইমেল।", id: "Nama pengguna atau email Anda.", ur: "آپ کا صارف نام یا ای میل۔", ms: "Nama pengguna atau e-mel anda.", it: "Il tuo nome utente o email.", tr: "Kullanıcı adınız veya e-posta adresiniz.", ta: "உங்கள் பயனர்பெயர் அல்லது மின்னஞ்சல்.", te: "మీ వినియోగదారు పేరు లేదా ఇమెయిల్.", ko: "사용자 이름 또는 이메일.", vi: "Tên người dùng hoặc email của bạn.", pl: "Twoja nazwa użytkownika lub e-mail.", ro: "Numele de utilizator sau e-mailul dvs.", nl: "Uw gebruikersnaam of e-mail.", el: "Το όνομα χρήστη ή το email σας.", th: "ชื่อผู้ใช้หรืออีเมลของคุณ", cs: "Vaše uživatelské jméno nebo e-mail.", hu: "Felhasználóneved vagy e-mail címed.", sv: "Ditt användarnamn eller e-post.", da: "Dit brugernavn eller e-mail." })}
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <input className="w-full focus-visible:outline-none"
            autoComplete="off"
            placeholder="john.doe@mail.com"
            onChange={e => setUsername(e.target.value)}
            value={$username} />
        </div>
        <div className="h-6" />
        <div className="font-medium">
          {Lang.match({ en: "Public key", zh: "公钥", hi: "सार्वजनिक कुंजी", es: "Clave pública", ar: "المفتاح العام", fr: "Clé publique", de: "Öffentlicher Schlüssel", ru: "Публичный ключ", pt: "Chave pública", ja: "公開鍵", pa: "ਪਬਲਿਕ ਕੀ", bn: "পাবলিক কী", id: "Kunci publik", ur: "پبلک کی", ms: "Kunci publik", it: "Chiave pubblica", tr: "Genel anahtar", ta: "பொது விசை", te: "పబ్లిక్ కీ", ko: "공개 키", vi: "Khóa công khai", pl: "Klucz publiczny", ro: "Cheie publică", nl: "Publieke sleutel", el: "Δημόσιο κλειδί", th: "คีย์สาธารณะ", cs: "Veřejný klíč", hu: "Nyilvános kulcs", sv: "Offentlig nyckel", da: "Offentlig nøgle" })}
        </div>
        <div className="text-default-contrast">
          {Lang.match({ en: "Your public key.", zh: "您的公钥。", hi: "आपकी सार्वजनिक कुंजी।", es: "Su clave pública.", ar: "مفتاحك العام.", fr: "Votre clé publique.", de: "Ihr öffentlicher Schlüssel.", ru: "Ваш публичный ключ.", pt: "Sua chave pública.", ja: "あなたの公開鍵。", pa: "ਤੁਹਾਡੀ ਪਬਲਿਕ ਕੀ।", bn: "আপনার পাবলিক কী।", id: "Kunci publik Anda.", ur: "آپ کی پبلک کی۔", ms: "Kunci publik anda.", it: "La tua chiave pubblica.", tr: "Genel anahtarınız.", ta: "உங்கள் பொது விசை.", te: "మీ పబ్లిక్ కీ.", ko: "당신의 공개 키.", vi: "Khóa công khai của bạn.", pl: "Twój klucz publiczny.", ro: "Cheia dvs. publică.", nl: "Uw publieke sleutel.", el: "Το δημόσιο κλειδί σας.", th: "คีย์สาธารณะของคุณ.", cs: "Váš veřejný klíč.", hu: "A nyilvános kulcsod.", sv: "Din offentliga nyckel.", da: "Din offentlige nøgle." })}
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex flex-col gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <textarea className="w-full focus-visible:outline-none"
            rows={3}
            autoComplete="off"
            onChange={e => setPubKey(e.target.value)}
            value={$pubkey} />
        </div>
        <div className="h-6" />
        <div className="font-medium">
          {Lang.match({ en: "Private key", zh: "私钥", hi: "निजी कुंजी", es: "Clave privada", ar: "المفتاح الخاص", fr: "Clé privée", de: "Privater Schlüssel", ru: "Приватный ключ", pt: "Chave privada", ja: "秘密鍵", pa: "ਨਿੱਜੀ ਕੀ", bn: "প্রাইভেট কী", id: "Kunci pribadi", ur: "نجی کی", ms: "Kunci pribadi", it: "Chiave privata", tr: "Özel anahtar", ta: "தனிப்பட்ட விசை", te: "ప్రైవేట్ కీ", ko: "개인 키", vi: "Khóa riêng tư", pl: "Klucz prywatny", ro: "Cheie privată", nl: "Privésleutel", el: "Ιδιωτικό κλειδί", th: "คีย์ส่วนตัว", cs: "Soukromý klíč", hu: "Privát kulcs", sv: "Privat nyckel", da: "Privat nøgle" })}
        </div>
        <div className="text-default-contrast">
          {Lang.match({ en: "Your private key.", zh: "您的私钥。", hi: "आपकी निजी कुंजी।", es: "Su clave privada.", ar: "مفتاحك الخاص.", fr: "Votre clé privée.", de: "Ihr privater Schlüssel.", ru: "Ваш приватный ключ.", pt: "Sua chave privada.", ja: "あなたの秘密鍵。", pa: "ਤੁਹਾਡੀ ਨਿੱਜੀ ਕੀ।", bn: "আপনার প্রাইভেট কী।", id: "Kunci pribadi Anda.", ur: "آپ کی نجی کی۔", ms: "Kunci pribadi anda.", it: "La tua chiave privata.", tr: "Özel anahtarınız.", ta: "உங்கள் தனிப்பட்ட விசை.", te: "మీ ప్రైవేట్ కీ.", ko: "당신의 개인 키.", vi: "Khóa riêng tư của bạn.", pl: "Twój klucz prywatny.", ro: "Cheia dvs. privată.", nl: "Uw privésleutel.", el: "Το ιδιωτικό σας κλειδί.", th: "คีย์ส่วนตัวของคุณ.", cs: "Váš soukromý klíč.", hu: "A privát kulcsod.", sv: "Din privata nyckel.", da: "Din private nøgle." })}
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex flex-col gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <textarea className="w-full focus-visible:outline-none"
            rows={9}
            autoComplete="off"
            onChange={e => setSigKey(e.target.value)}
            value={flipped ? $sigkey : $sigkey.replaceAll(/./g, "•")} />
        </div>
        <div className="h-2" />
        <div className="flex items-center gap-2">
          <WideContrastButton
            onClick={() => setFlipped(x => !x)}>
            {flipped ? <Outline.EyeSlashIcon className="size-5" /> : <Outline.EyeIcon className="size-5" />}
            {flipped ? Lang.match({ en: "Hide", zh: "隐藏", hi: "छिपाएं", es: "Ocultar", ar: "إخفاء", fr: "Cacher", de: "Verstecken", ru: "Скрыть", pt: "Esconder", ja: "隠す", pa: "ਛੁਪਾਓ", bn: "লুকান", id: "Sembunyikan", ur: "چھپائیں", ms: "Sembunyikan", it: "Nascondi", tr: "Gizle", ta: "மறை", te: "దాచు", ko: "숨기기", vi: "Ẩn đi", pl: "Ukryj", ro: "Ascundeți", nl: "Verbergen", el: "Κρύψτε το", th: "ซ่อน", cs: "Skrýt", hu: "Elrejtés", sv: "Dölj", da: "Skjul" }) : Lang.match({ en: "Show", zh: "显示", hi: "दिखाएं", es: "Mostrar", ar: "إظهار", fr: "Afficher", de: "Anzeigen", ru: "Показать", pt: "Mostrar", ja: "表示する", pa: "ਦਿਖਾਓ", bn: "দেখান", id: "Tampilkan", ur: "دکھائیں", ms: "Tampilkan", it: "Mostra", tr: "Göster", ta: "காட்டு", te: "చూపించు", ko: "보이기", vi: "Hiển thị ra ngoài ", pl: "Pokaż ", ro: "Arată ", nl: "Tonen ", el: "Εμφάνιση ", th: "แสดง ", cs: "Zobrazit ", hu: "Megjelenítés ", sv: "Visa ", da: "Vis" })}
          </WideContrastButton>
        </div>
        <div className="h-6" />
        <div className="font-medium">
          {Lang.match({ en: "Password", zh: "密码", hi: "पासवर्ड", es: "Contraseña", ar: "كلمة المرور", fr: "Mot de passe", de: "Passwort", ru: "Пароль", pt: "Senha", ja: "パスワード", pa: "ਪਾਸਵਰਡ", bn: "পাসওয়ার্ড", id: "Kata sandi", ur: "پاس ورڈ", ms: "Kata laluan", it: "Password", tr: "Parola", ta: "கடவுச்சொல்", te: "పాస్వర్డ్", ko: "비밀번호", vi: "Mật khẩu", pl: "Hasło", ro: "Parolă", nl: "Wachtwoord", el: "Κωδικός πρόσβασης", th: "รหัสผ่าน", cs: "Heslo", hu: "Jelszó", sv: "Lösenord", da: "Adgangskode" })}
        </div>
        <div className="text-default-contrast">
          {Lang.match({ en: "Your password.", zh: "您的密码。", hi: "आपका पासवर्ड।", es: "Su contraseña.", ar: "كلمة المرور الخاصة بك.", fr: "Votre mot de passe.", de: "Ihr Passwort.", ru: "Ваш пароль.", pt: "Sua senha.", ja: "あなたのパスワード。", pa: "ਤੁਹਾਡਾ ਪਾਸਵਰਡ।", bn: "আপনার পাসওয়ার্ড।", id: "Kata sandi Anda.", ur: "آپ کا پاس ورڈ۔", ms: "Kata laluan anda.", it: "La tua password.", tr: "Parolanız.", ta: "உங்கள் கடவுச்சொல்.", te: "మీ పాస్వర్డ్.", ko: "당신의 비밀번호.", vi: "Mật khẩu của bạn.", pl: "Twoje hasło.", ro: "Parola dvs.", nl: "Uw wachtwoord.", el: "Ο κωδικός πρόσβασής σας.", th: "รหัสผ่านของคุณ.", cs: "Vaše heslo.", hu: "A jelszavad.", sv: "Ditt lösenord.", da: "Din adgangskode." })}
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <input className="w-full focus-visible:outline-none"
            autoComplete="off"
            type={flipped ? "text" : "password"}
            onChange={e => setPassword(e.target.value)}
            value={$password} />
          <div className="flex items-center gap-2">
            <button className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none"
              type="button"
              onClick={() => setFlipped(x => !x)}>
              <InButton>
                {flipped ? <Outline.EyeSlashIcon className="size-5" /> : <Outline.EyeIcon className="size-5" />}
              </InButton>
            </button>
            <PasswordInputAnchor />
          </div>
        </div>
        <div className="h-6" />
        <div className="font-medium">
          {Lang.match({ en: "One-time passcode", zh: "一次性密码", hi: "वन-टाइम पासकोड", es: "Código de un solo uso", ar: "رمز المرور لمرة واحدة", fr: "Code à usage unique", de: "Einmal-Passcode", ru: "Одноразовый пароль", pt: "Código de uso único", ja: "ワンタイムパスコード", pa: "ਇੱਕ ਵਾਰੀ ਪਾਸਕੋਡ", bn: "একবারের পাসকোড", id: "Kode sekali pakai", ur: "ایک وقت کا پاس کوڈ", ms: "Kod sekali pakai", it: "Codice monouso", tr: "Tek kullanımlık şifre", ta: "ஒரு முறை கடவுச்சொல்", te: "ఒకసారి పాస్కోడ్", ko: "일회용 패스코드", vi: "Mật mã một lần", pl: "Jednorazowy kod dostępu", ro: "Parolă de unică folosință", nl: "Eenmalige toegangscode", el: "Κωδικός πρόσβασης μίας χρήσης", th: "รหัสผ่านใช้ครั้งเดียว", cs: "Jednorázový přístupový kód", hu: "Egyszer használatos jelszó", sv: "Engångslösenord", da: "Engangskode" })}
        </div>
        <div className="text-default-contrast">
          {Lang.match({ en: "Your time-based one-time passcode.", zh: "您的基于时间的一次性密码。", hi: "आपका समय-आधारित वन-टाइम पासकोड।", es: "Su código de un solo uso basado en el tiempo.", ar: "رمز المرور لمرة واحدة المستند إلى الوقت الخاص بك.", fr: "Votre code à usage unique basé sur le temps.", de: "Ihr zeitbasierter Einmal-Passcode.", ru: "Ваш одноразовый пароль на основе времени.", pt: "Seu código de uso único baseado no tempo.", ja: "あなたの時間ベースのワンタイムパスコード。", pa: "ਤੁਹਾਡਾ ਸਮੇਂ-ਅਧਾਰਿਤ ਇੱਕ ਵਾਰੀ ਪਾਸਕੋਡ।", bn: "আপনার সময়-ভিত্তিক একবারের পাসকোড।", id: "Kode sekali pakai berbasis waktu Anda.", ur: "آپ کا وقت پر مبنی ایک وقت کا پاس کوڈ۔", ms: "Kod sekali pakai berasaskan masa anda.", it: "Il tuo codice monouso basato sul tempo.", tr: "Zaman tabanlı tek kullanımlık şifreniz.", ta: "உங்கள் நேர அடிப்படையிலான ஒருமுறை கடவுச்சொல்.", te: "మీ సమయ ఆధారిత ఒకసారి పాస్కోడ్.", ko: "귀하의 시간 기반 일회용 비밀번호.", vi: "Mã một lần dựa trên thời gian của bạn.", pl: "Twój czasowy jednorazowy kod dostępu.", ro: "Codul dvs. de unică folosință bazat pe timp.", nl: "Uw tijdgebaseerde eenmalige toegangscode.", el: "Ο χρονικά βασισμένος κωδικός πρόσβασής σας.", th: "รหัสผ่านใช้ครั้งเดียวตามเวลา", cs: "Váš časově založený jednorázový přístupový kód.", hu: "Az időalapú egyszer használatos jelszavad.", sv: "Din tidsbaserade engångskod.", da: "Din tidsbaserede engangskode." })}
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <input className="w-full focus-visible:outline-none"
            autoComplete="off"
            type={flipped ? "text" : "password"}
            placeholder="otpauth://..."
            onChange={e => setTotpSeed(e.target.value)}
            value={$totpseed} />
          <div className="flex items-center gap-2">
            <button className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none"
              type="button"
              onClick={() => setFlipped(x => !x)}>
              <InButton>
                {flipped ? <Outline.EyeSlashIcon className="size-5" /> : <Outline.EyeIcon className="size-5" />}
              </InButton>
            </button>
            <TotpPageAnchor />
          </div>
        </div>
        <div className="h-2" />
        <input className="p-8 rounded-xl bg-default-contrast text-center focus-visible:outline-none text-6xl font-mono tracking-widest"
          readOnly
          onClick={copyTheTotpcode.copyOrAlert}
          value={totpcode ? (copyTheTotpcode.copied ? "COPIED" : totpcode) : "------"} />
        <div className="h-6" />
        <div className="font-medium">
          {Lang.match({ en: "Notes", zh: "备注", hi: "नोट्स", es: "Notas", ar: "ملاحظات", fr: "Notes", de: "Notizen", ru: "Заметки", pt: "Notas", ja: "ノート", pa: "ਨੋਟਸ", bn: "নোটস", id: "Catatan", ur: "نوٹس", ms: "Catatan", it: "Note", tr: "Notlar", ta: "குறிப்புகள்", te: "గమనికలు", ko: "노트", vi: "Ghi chú", pl: "Notatki", ro: "Note", nl: "Notities", el: "Σημειώσεις", th: "บันทึกย่อ", cs: "Poznámky", hu: "Jegyzetek", sv: "Anteckningar", da: "Noter" })}
        </div>
        <div className="text-default-contrast">
          {Lang.match({ en: "Any additional information.", zh: "任何附加信息。", hi: "कोई अतिरिक्त जानकारी।", es: "Cualquier información adicional.", ar: "أي معلومات إضافية.", fr: "Toute information supplémentaire.", de: "Alle zusätzlichen Informationen.", ru: "Любая дополнительная информация.", pt: "Qualquer informação adicional.", ja: "追加情報。", pa: "ਕੋਈ ਵੀ ਵਾਧੂ ਜਾਣਕਾਰੀ।", bn: "যেকোনও অতিরিক্ত তথ্য।", id: "Informasi tambahan apa pun.", ur: "کوئی اضافی معلومات۔", ms: "Sebarang maklumat tambahan.", it: "Qualsiasi informazione aggiuntiva.", tr: "Herhangi bir ek bilgi.", ta: "எந்தவொரு கூடுதல் தகவலும்.", te: "ఏదైనా అదనపు సమాచారం.", ko: "추가 정보.", vi: "Bất kỳ thông tin bổ sung nào.", pl: "Wszelkie dodatkowe informacje.", ro: "Orice informație suplimentară.", nl: "Eventuele aanvullende informatie.", el: "Οποιαδήποτε επιπλέον πληροφορία.", th: "ข้อมูลเพิ่มเติมใด ๆ.", cs: "Jakékoli další informace.", hu: "Bármilyen további információ.", sv: "Eventuell ytterligare information.", da: "Eventuelle yderligere oplysninger." })}
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex flex-col gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <textarea className="w-full resize-none focus-visible:outline-none"
            rows={6}
            placeholder={Lang.match({ en: "I use this account for...", zh: "我使用这个账户来……", hi: "मैं इस खाते का उपयोग करता हूं...", es: "Uso esta cuenta para...", ar: "أستخدم هذا الحساب ل...", fr: "J'utilise ce compte pour...", de: "Ich benutze dieses Konto für...", ru: "Я использую эту учетную запись для...", pt: "Eu uso esta conta para...", ja: "このアカウントは...のために使用します", pa: "ਮੈਂ ਇਸ ਖਾਤੇ ਨੂੰ ... ਲਈ ਵਰਤਦਾ ਹਾਂ", bn: "আমি এই অ্যাকাউন্টটি ... জন্য ব্যবহার করি", id: "Saya menggunakan akun ini untuk...", ur: "میں اس اکاؤنٹ کو ... کے لیے استعمال کرتا ہوں", ms: "Saya menggunakan akun ini untuk...", it: "Uso questo account per...", tr: "Bu hesabı ... için kullanıyorum", ta: "நான் இந்த கணக்கை ... க்காக பயன்படுத்துகிறேன்", te: "నేను ఈ ఖాతాను ... కోసం ఉపయోగిస్తున్నాను", ko: "이 계정을 ...에 사용합니다.", vi: "Tôi sử dụng tài khoản này cho...", pl: "Używam tego konta do...", ro: "Folosesc acest cont pentru...", nl: "Ik gebruik dit account voor...", el: "Χρησιμοποιώ αυτόν τον λογαριασμό για...", th: "ฉันใช้บัญชีนี้สำหรับ...", cs: "Používám tento účet pro...", hu: "Ezt a fiókot arra használom, hogy...", sv: "Jag använder det här kontot för...", da: "Jeg bruger denne konto til..." })}
            onChange={e => setNotes(e.target.value)}
            value={$notes} />
        </div>
        <div className="h-8" />
        <div className="flex items-center flex-wrap-reverse gap-2">
          {session.value.user.fsfh != null &&
            <WideOppositeButton
              type="button"
              disabled={error != null}
              onClick={encryptAndWriteOrAlert}>
              {error != null ? error : Lang.match({ en: "Save", zh: "保存", hi: "सहेजें", es: "Guardar", ar: "حفظ", fr: "Enregistrer", de: "Speichern", ru: "Сохранить", pt: "Salvar", ja: "保存", pa: "ਸੰਭਾਲੋ", bn: "সংরক্ষণ করুন", id: "Simpan", ur: "محفوظ کریں", ms: "Simpan", it: "Salva", tr: "Kaydet", ta: "சேமிக்கவும்", te: "సేవ్ చేయండి", ko: "저장", vi: "Lưu", pl: "Zapisz", ro: "Salvează", nl: "Opslaan", el: "Αποθήκευση", th: "บันทึก", cs: "Uložit", hu: "Mentés", sv: "Spara", da: "Gem" })}
            </WideOppositeButton>}
          {session.value.user.fsfh == null &&
            <WideOppositeButton
              type="button"
              disabled={error != null}
              onClick={encryptAndSaveOrAlert}>
              {error != null ? error : Lang.match({ en: "Save", zh: "保存", hi: "सहेजें", es: "Guardar", ar: "حفظ", fr: "Enregistrer", de: "Speichern", ru: "Сохранить", pt: "Salvar", ja: "保存", pa: "ਸੰਭਾਲੋ", bn: "সংরক্ষণ করুন", id: "Simpan", ur: "محفوظ کریں", ms: "Simpan", it: "Salva", tr: "Kaydet", ta: "சேமிக்கவும்", te: "సేవ్ చేయండి", ko: "저장", vi: "Lưu", pl: "Zapisz", ro: "Salvează", nl: "Opslaan", el: "Αποθήκευση", th: "บันทึก", cs: "Uložit", hu: "Mentés", sv: "Spara", da: "Gem" })}
            </WideOppositeButton>}
        </div>
      </form>
    </div>
  </Fragment>
}

export function KeypairAccountPage(props: { $entry: KDBX.Inner.KeePassFile.Entry }) {
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

  const pubkey = useMemo(() => {
    return $entry.getStringByKeyOrNull("PublicKey")?.getValueOrThrow().get()
  }, [$entry])

  const sigkey = useMemo(() => {
    return $entry.getStringByKeyOrNull("PrivateKey")?.getValueOrThrow().get()
  }, [$entry])

  const username = useMemo(() => {
    return $entry.getStringByKeyOrNull("UserName")?.getValueOrThrow().get()
  }, [$entry])

  const password = useMemo(() => {
    return $entry.getStringByKeyOrNull("Password")?.getValueOrThrow().get()
  }, [$entry])

  const totpseed = useMemo(() => {
    return $entry.getStringByKeyOrNull("otp")?.getValueOrThrow().get()
  }, [$entry])

  const totpcode = useTotpCode(totpseed)

  const notes = useMemo(() => {
    return $entry.getStringByKeyOrNull("Notes")?.getValueOrThrow().get()
  }, [$entry])

  const copyThePubKey = useCopy(pubkey)
  const copyTheSigKey = useCopy(sigkey)
  const copyTheUsername = useCopy(username)
  const copyThePassword = useCopy(password)
  const copyTheTotpcode = useCopy(totpcode)

  const savePubKeyOrAlert = useCallback(() => Promise.try(async () => {
    const content = pubkey || ""

    const file = new File([content], "key.pub", { type: "application/octet-stream" })

    if (/iPad|iPhone|iPod/.test(navigator.platform) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) {
      await navigator.share({ files: [file] })
    } else {
      const url = URL.createObjectURL(file)

      const a = document.createElement("a") as HTMLAnchorElement
      a.href = url
      a.download = "key.pub"

      document.body.appendChild(a)

      a.click()

      document.body.removeChild(a)

      URL.revokeObjectURL(url)
    }
  }).catch(Errors.display), [pubkey])

  const saveSigKeyOrAlert = useCallback(() => Promise.try(async () => {
    const content = sigkey || ""

    const file = new File([content], "key", { type: "application/octet-stream" })

    if (/iPad|iPhone|iPod/.test(navigator.platform) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) {
      await navigator.share({ files: [file] })
    } else {
      const url = URL.createObjectURL(file)

      const a = document.createElement("a") as HTMLAnchorElement
      a.href = url
      a.download = "key"

      document.body.appendChild(a)

      a.click()

      document.body.removeChild(a)

      URL.revokeObjectURL(url)
    }
  }).catch(Errors.display), [pubkey])

  return <Fragment>
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
    <div className="flex flex-col grow p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium">
          {Lang.match({ en: "Keypair account", zh: "密钥对账户", hi: "कीपेर खाता", es: "Cuenta de par de claves", ar: "حساب زوج المفاتيح", fr: "Compte de paire de clés", de: "Schlüsselpaar-Konto", ru: "Учетная запись ключевой пары", pt: "Conta de par de chaves", ja: "キーペアアカウント", pa: "ਕੀਪੇਅਰ ਖਾਤਾ", bn: "কিপেয়ার অ্যাকাউন্ট", id: "Akun pasangan kunci", ur: "کی پیئر اکاؤنٹ", ms: "Akun pasangan kunci", it: "Account di coppia di chiavi", tr: "Çift Anahtar Hesabı", ta: "கீபேர் கணக்கு", te: "కీపేర్ ఖాతా", ko: "키페어 계정", vi: "Tài khoản cặp khóa", pl: "Konto pary kluczy", ro: "Cont de pereche de chei", nl: "Sleutelpaaraccount", el: "Λογαριασμός ζεύγους κλειδιών", th: "บัญชีคู่กุญแจ", cs: "Účet páru klíčů", hu: "Kulcspár fiók", sv: "Nyckelparskonto", da: "Nøglepar-konto" })}
        </h1>
        <AccountMenuAnchor />
      </div>
      <div className="h-6" />
      <div className="flex items-center justify-center">
        <KeypairAccountCard
          title={title}
          color={color}
          username={username}
          flip={flipped}
          onFlipChange={setFlipped} />
      </div>
      <form className="grow flex flex-col"
        onSubmit={Events.preventDefault}>
        <input className="hidden"
          autoComplete="off"
          name="username" />
        {username && <Fragment>
          <div className="h-6" />
          <div className="font-medium">
            {Lang.match({ en: "Username", zh: "用户名", hi: "उपयोगकर्ता नाम", es: "Nombre de usuario", ar: "اسم المستخدم", fr: "Nom d'utilisateur", de: "Benutzername", ru: "Имя пользователя", pt: "Nome de usuário", ja: "ユーザー名", pa: "ਉਪਭੋਗਤਾ ਨਾਮ", bn: "ব্যবহারকারীর নাম", id: "Nama pengguna", ur: "صارف نام", ms: "Nama pengguna", it: "Nome utente", tr: "Kullanıcı adı", ta: "பயனர்பெயர்", te: "వినియోగదారు పేరు", ko: "사용자 이름", vi: "Tên người dùng", pl: "Nazwa użytkownika", ro: "Nume de utilizator", nl: "Gebruikersnaam", el: "Όνομα χρήστη", th: "ชื่อผู้ใช้", cs: "Uživatelské jméno", hu: "Felhasználónév", sv: "Användarnamn", da: "Brugernavn" })}
          </div>
          <div className="text-default-contrast">
            {Lang.match({ en: "Your username or email.", zh: "您的用户名或电子邮件。", hi: "आपका उपयोगकर्ता नाम या ईमेल।", es: "Su nombre de usuario o correo electrónico.", ar: "اسم المستخدم أو البريد الإلكتروني الخاص بك.", fr: "Votre nom d'utilisateur ou e-mail.", de: "Ihr Benutzername oder Ihre E-Mail.", ru: "Ваше имя пользователя или электронная почта.", pt: "Seu nome de usuário ou e-mail.", ja: "あなたのユーザー名またはメールアドレス。", pa: "ਤੁਹਾਡਾ ਉਪਭੋਗਤਾ ਨਾਮ ਜਾਂ ਈਮੇਲ।", bn: "আপনার ব্যবহারকারীর নাম বা ইমেল।", id: "Nama pengguna atau email Anda.", ur: "آپ کا صارف نام یا ای میل۔", ms: "Nama pengguna atau e-mel anda.", it: "Il tuo nome utente o email.", tr: "Kullanıcı adınız veya e-posta adresiniz.", ta: "உங்கள் பயனர்பெயர் அல்லது மின்னஞ்சல்.", te: "మీ వినియోగదారు పేరు లేదా ఇమెయిల్.", ko: "사용자 이름 또는 이메일.", vi: "Tên người dùng hoặc email của bạn.", pl: "Twoja nazwa użytkownika lub e-mail.", ro: "Numele de utilizator sau e-mailul dvs.", nl: "Uw gebruikersnaam of e-mail.", el: "Το όνομα χρήστη ή το email σας.", th: "ชื่อผู้ใช้หรืออีเมลของคุณ.", cs: "Vaše uživatelské jméno nebo e-mail.", hu: "A felhasználóneved vagy e-mailed.", sv: "Ditt användarnamn eller e-post.", da: "Dit brugernavn eller e-mail." })}
          </div>
          <div className="h-4" />
          <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
            <input className="w-full focus-visible:outline-none"
              readOnly
              autoComplete="off"
              onFocus={e => e.currentTarget.select()}
              value={username} />
            <div className="flex items-center gap-2">
              <button className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none"
                type="button"
                onClick={copyTheUsername.copyOrAlert}>
                <InButton>
                  {copyTheUsername.copied ? <Outline.CheckIcon className="size-5" /> : <Outline.DocumentDuplicateIcon className="size-5" />}
                </InButton>
              </button>
            </div>
          </div>
        </Fragment>}
        {pubkey && <Fragment>
          <div className="h-6" />
          <div className="font-medium">
            {Lang.match({ en: "Public key", zh: "公钥", hi: "सार्वजनिक कुंजी", es: "Clave pública", ar: "المفتاح العام", fr: "Clé publique", de: "Öffentlicher Schlüssel", ru: "Публичный ключ", pt: "Chave pública", ja: "公開鍵", pa: "ਪਬਲਿਕ ਕੀ", bn: "পাবলিক কী", id: "Kunci publik", ur: "پبلک کی", ms: "Kunci awam", it: "Chiave pubblica", tr: "Açık anahtar", ta: "பொது விசை", te: "పబ్లిక్ కీ", ko: "공개 키", vi: "Khóa công khai", pl: "Klucz publiczny", ro: "Cheie publică", nl: "Publieke sleutel", el: "Δημόσιο κλειδί", th: "คีย์สาธารณะ", cs: "Veřejný klíč", hu: "Nyilvános kulcs", sv: "Offentlig nyckel", da: "Offentlig nøgle" })}
          </div>
          <div className="text-default-contrast">
            {Lang.match({ en: "Your public key.", zh: "您的公钥。", hi: "आपकी सार्वजनिक कुंजी।", es: "Su clave pública.", ar: "المفتاح العام الخاص بك.", fr: "Votre clé publique.", de: "Ihr öffentlicher Schlüssel.", ru: "Ваш публичный ключ.", pt: "Sua chave pública.", ja: "あなたの公開鍵。", pa: "ਤੁਹਾਡੀ ਪਬਲਿਕ ਕੀ।", bn: "আপনার পাবলিক কী।", id: "Kunci publik Anda.", ur: "آپ کی پبلک کی۔", ms: "Kunci awam anda.", it: "La tua chiave pubblica.", tr: "Açık anahtarınız.", ta: "உங்கள் பொது விசை.", te: "మీ పబ్లిక్ కీ.", ko: "당신의 공개 키.", vi: "Khóa công khai của bạn.", pl: "Twój klucz publiczny.", ro: "Cheia dvs. publică.", nl: "Uw publieke sleutel.", el: "Το δημόσιο κλειδί σας.", th: "คีย์สาธารณะของคุณ.", cs: "Váš veřejný klíč.", hu: "A nyilvános kulcsod.", sv: "Din offentliga nyckel.", da: "Din offentlige nøgle." })}
          </div>
          <div className="h-4" />
          <div className="bg-default-contrast po-2 rounded-xl flex flex-col gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
            <textarea className="w-full focus-visible:outline-none"
              rows={3}
              readOnly
              onFocus={e => e.currentTarget.select()}
              value={pubkey || ""} />
          </div>
          <div className="h-2" />
          <div className="flex items-center gap-2">
            <WideContrastButton
              onClick={copyThePubKey.copyOrAlert}>
              {copyThePubKey.copied ? <Outline.CheckIcon className="size-5" /> : <Outline.DocumentDuplicateIcon className="size-5" />}
              {copyThePubKey.copied ? Lang.match({ en: "Copied", zh: "已复制", hi: "कॉपी किया गया", es: "Copiado", ar: "تم النسخ", fr: "Copié", de: "Kopiert", ru: "Скопировано", pt: "Copiado", ja: "コピーしました", pa: "ਨਕਲ ਕੀਤਾ", bn: "কপি করা হয়েছে", id: "Disalin", ur: "نقل کیا گیا", ms: "Disalin", it: "Copiato", tr: "Kopyalandı", ta: "நகலெடுக்கப்பட்டது", te: "నకలు చేయబడింది", ko: "복사됨", vi: "Đã sao chép", pl: "Skopiowano", ro: "Copiat", nl: "Gekopieerd", el: "Αντιγράφηκε", th: "คัดลอกแล้ว", cs: "Zkopírováno", hu: "Másolva", sv: "Kopierad", da: "Kopieret" }) : Lang.match({ en: "Copy", zh: "复制", hi: "कॉपी", es: "Copiar", ar: "نسخ", fr: "Copier", de: "Kopieren", ru: "Копировать", pt: "Copiar", ja: "コピー", pa: "ਨਕਲ ਕਰੋ", bn: "কপি করুন", id: "Salin", ur: "نقل کریں", ms: "Salin", it: "Copia", tr: "Kopyala", ta: "நகலெடுக்கவும்", te: "నకలు చేయండి", ko: "복사", vi: "Sao chép", pl: "Kopiuj", ro: "Copiați", nl: "Kopiëren", el: "Αντιγραφή", th: "คัดลอก", cs: "Kopírovat", hu: "Másolás", sv: "Kopiera", da: "Kopier" })}
            </WideContrastButton>
            <WideContrastButton
              onClick={savePubKeyOrAlert}>
              <Outline.ArrowDownTrayIcon className="size-5" />
              {Lang.match({ en: "Save", zh: "保存", hi: "सहेजें", es: "Guardar", ar: "حفظ", fr: "Enregistrer", de: "Speichern", ru: "Сохранить", pt: "Salvar", ja: "保存", pa: "ਸੰਭਾਲੋ", bn: "সংরক্ষণ করুন", id: "Simpan", ur: "محفوظ کریں", ms: "Simpan", it: "Salva", tr: "Kaydet", ta: "சேமிக்கவும்", te: "సేవ్ చేయండి", ko: "저장", vi: "Lưu", pl: "Zapisz", ro: "Salvează", nl: "Opslaan", el: "Αποθήκευση", th: "บันทึก", cs: "Uložit", hu: "Mentés", sv: "Spara", da: "Gem" })}
            </WideContrastButton>
          </div>
        </Fragment>}
        {sigkey && <Fragment>
          <div className="h-6" />
          <div className="font-medium">
            {Lang.match({ en: "Private key", zh: "私钥", hi: "निजी कुंजी", es: "Clave privada", ar: "المفتاح الخاص", fr: "Clé privée", de: "Privater Schlüssel", ru: "Приватный ключ", pt: "Chave privada", ja: "秘密鍵", pa: "ਪ੍ਰਾਈਵੇਟ ਕੀ", bn: "প্রাইভেট কী", id: "Kunci pribadi", ur: "پرائیویٹ کی", ms: "Kunci peribadi", it: "Chiave privata", tr: "Özel anahtar", ta: "தனிப்பட்ட விசை", te: "ప్రైవేట్ కీ", ko: "개인 키", vi: "Khóa riêng", pl: "Klucz prywatny", ro: "Cheie privată", nl: "Privésleutel", el: "Ιδιωτικό κλειδί", th: "คีย์ส่วนตัว", cs: "Soukromý klíč", hu: "Privát kulcs", sv: "Privat nyckel", da: "Privat nøgle" })}
          </div>
          <div className="text-default-contrast">
            {Lang.match({ en: "Your private key.", zh: "您的私钥。", hi: "आपकी निजी कुंजी।", es: "Su clave privada.", ar: "المفتاح الخاص بك.", fr: "Votre clé privée.", de: "Ihr privater Schlüssel.", ru: "Ваш приватный ключ.", pt: "Sua chave privada.", ja: "あなたの秘密鍵。", pa: "ਤੁਹਾਡੀ ਪ੍ਰਾਈਵੇਟ ਕੀ।", bn: "আপনার প্রাইভেট কী।", id: "Kunci pribadi Anda.", ur: "آپ کی پرائیویٹ کی۔", ms: "Kunci peribadi anda.", it: "La tua chiave privata.", tr: "Özel anahtarınız.", ta: "உங்கள் தனிப்பட்ட விசை.", te: "మీ ప్రైవేట్ కీ.", ko: "당신의 개인 키.", vi: "Khóa riêng của bạn.", pl: "Twój klucz prywatny.", ro: "Cheia dvs. privată.", nl: "Uw privésleutel.", el: "Το ιδιωτικό σας κλειδί.", th: "คีย์ส่วนตัวของคุณ.", cs: "Váš soukromý klíč.", hu: "A privát kulcsod.", sv: "Din privata nyckel.", da: "Din private nøgle." })}
          </div>
          <div className="h-4" />
          <div className="bg-default-contrast po-2 rounded-xl flex flex-col gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
            <textarea className="w-full focus-visible:outline-none"
              rows={9}
              readOnly
              onFocus={e => flipped ? e.currentTarget.select() : undefined}
              value={flipped ? sigkey : sigkey?.replaceAll(/./g, "•")} />
          </div>
          <div className="h-2" />
          <div className="flex items-center gap-2">
            <WideContrastButton
              onClick={() => setFlipped(x => !x)}>
              {flipped ? <Outline.EyeSlashIcon className="size-5" /> : <Outline.EyeIcon className="size-5" />}
              {flipped ? Lang.match({ en: "Hide", zh: "隐藏", hi: "छिपाएं", es: "Ocultar", ar: "إخفاء", fr: "Masquer", de: "Verstecken", ru: "Скрыть", pt: "Ocultar", ja: "非表示", pa: "ਛੁਪਾਓ", bn: "লুকান", id: "Sembunyikan", ur: "چھپائیں", ms: "Sembunyikan", it: "Nascondi", tr: "Gizle", ta: "மறை", te: "దాచు", ko: "숨기기", vi: "Ẩn", pl: "Ukryj", ro: "Ascunde", nl: "Verbergen", el: "Απόκρυψη", th: "ซ่อน", cs: "Skrýt", hu: "Elrejt", sv: "Dölj", da: "Skjul" }) : Lang.match({ en: "Show", zh: "显示", hi: "दिखाएँ", es: "Mostrar", ar: "إظهار", fr: "Afficher", de: "Anzeigen", ru: "Показать", pt: "Mostrar", ja: "表示", pa: "ਦਿਖਾਓ", bn: "দেখান", id: "Tampilkan", ur: "دکھائیں", ms: "Tunjukkan", it: "Mostra", tr: "Göster", ta: "காட்டு", te: "చూపించు", ko: "보이기", vi: "Hiển thị", pl: "Pokaż", ro: "Afișa", nl: "Tonen", el: "Εμφάνιση", th: "แสดง", cs: "Zobrazit", hu: "Mutasd", sv: "Visa", da: "Vis" })}
            </WideContrastButton>
            <WideContrastButton
              onClick={copyTheSigKey.copyOrAlert}>
              {copyTheSigKey.copied ? <Outline.CheckIcon className="size-5" /> : <Outline.DocumentDuplicateIcon className="size-5" />}
              {copyTheSigKey.copied ? Lang.match({ en: "Copied", zh: "已复制", hi: "कॉपी किया गया", es: "Copiado", ar: "تم النسخ", fr: "Copié", de: "Kopiert", ru: "Скопировано", pt: "Copiado", ja: "コピーしました", pa: "ਨਕਲ ਕੀਤਾ", bn: "কপি করা হয়েছে", id: "Disalin", ur: "نقل کیا گیا", ms: "Disalin", it: "Copiato", tr: "Kopyalandı", ta: "நகலெடுக்கப்பட்டது", te: "నకలు చేయబడింది", ko: "복사됨", vi: "Đã sao chép", pl: "Skopiowano", ro: "Copiat", nl: "Gekopieerd", el: "Αντιγράφηκε", th: "คัดลอกแล้ว", cs: "Zkopírováno", hu: "Másolva", sv: "Kopierad", da: "Kopieret" }) : Lang.match({ en: "Copy", zh: "复制", hi: "कॉपी", es: "Copiar", ar: "نسخ", fr: "Copier", de: "Kopieren", ru: "Копировать", pt: "Copiar", ja: "コピー", pa: "ਨਕਲ ਕਰੋ", bn: "কপি করুন", id: "Salin", ur: "نقل کریں", ms: "Salin", it: "Copia", tr: "Kopyala", ta: "நகலெடுக்கவும்", te: "నకలు చేయండి", ko: "복사", vi: "Sao chép", pl: "Kopiuj", ro: "Copiați", nl: "Kopiëren", el: "Αντιγραφή", th: "คัดลอก", cs: "Kopírovat", hu: "Másolás", sv: "Kopiera", da: "Kopier" })}
            </WideContrastButton>
            <WideContrastButton
              onClick={saveSigKeyOrAlert}>
              <Outline.ArrowDownTrayIcon className="size-5" />
              {Lang.match({ en: "Save", zh: "保存", hi: "सहेजें", es: "Guardar", ar: "حفظ", fr: "Enregistrer", de: "Speichern", ru: "Сохранить", pt: "Salvar", ja: "保存", pa: "ਸੰਭਾਲੋ", bn: "সংরক্ষণ করুন", id: "Simpan", ur: "محفوظ کریں", ms: "Simpan", it: "Salva", tr: "Kaydet", ta: "சேமிக்கவும்", te: "సేవ్ చేయండి", ko: "저장", vi: "Lưu", pl: "Zapisz", ro: "Salvează", nl: "Opslaan", el: "Αποθήκευση", th: "บันทึก", cs: "Uložit", hu: "Mentés", sv: "Spara", da: "Gem" })}
            </WideContrastButton>
          </div>
        </Fragment>}
        {password && <Fragment>
          <div className="h-6" />
          <div className="font-medium">
            {Lang.match({ en: "Password", zh: "密码", hi: "पासवर्ड", es: "Contraseña", ar: "كلمة المرور", fr: "Mot de passe", de: "Passwort", ru: "Пароль", pt: "Senha", ja: "パスワード", pa: "ਪਾਸਵਰਡ", bn: "পাসওয়ার্ড", id: "Kata sandi", ur: "پاس ورڈ", ms: "Kata sandi", it: "Password", tr: "Parola", ta: "கடவுச்சொல்", te: "పాస్వర్డ్", ko: "비밀번호", vi: "Mật khẩu", pl: "Hasło", ro: "Parolă", nl: "Wachtwoord", el: "Κωδικός πρόσβασης", th: "รหัสผ่าน", cs: "Heslo", hu: "Jelszó", sv: "Lösenord", da: "Adgangskode" })}
          </div>
          <div className="text-default-contrast">
            {Lang.match({ en: "Your password.", zh: "您的密码。", hi: "आपका पासवर्ड।", es: "Su contraseña.", ar: "كلمة المرور الخاصة بك.", fr: "Votre mot de passe.", de: "Ihr Passwort.", ru: "Ваш пароль.", pt: "Sua senha.", ja: "あなたのパスワード。", pa: "ਤੁਹਾਡਾ ਪਾਸਵਰਡ।", bn: "আপনার পাসওয়ার্ড।", id: "Kata sandi Anda.", ur: "آپ کا پاس ورڈ۔", ms: "Kata sandi anda.", it: "La tua password.", tr: "Şifreniz.", ta: "உங்கள் கடவுச்சொல்.", te: "మీ పాస్వర్డ్.", ko: "귀하의 비밀번호입니다.", vi: "Mật khẩu của bạn.", pl: "Twoje hasło.", ro: "Parola ta.", nl: "Uw wachtwoord.", el: "Ο κωδικός σας.", th: "รหัสผ่านของคุณ.", cs: "Vaše heslo.", hu: "A jelszavad.", sv: "Ditt lösenord.", da: "Din adgangskode." })}
          </div>
          <div className="h-4" />
          <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
            <input className="w-full focus-visible:outline-none"
              readOnly
              autoComplete="off"
              onFocus={e => e.currentTarget.select()}
              type={flipped ? "text" : "password"}
              value={password} />
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
                onClick={copyThePassword.copyOrAlert}>
                <InButton>
                  {copyThePassword.copied ? <Outline.CheckIcon className="size-5" /> : <Outline.DocumentDuplicateIcon className="size-5" />}
                </InButton>
              </button>
            </div>
          </div>
        </Fragment>}
        {totpseed && <Fragment>
          <div className="h-6" />
          <div className="font-medium">
            {Lang.match({ en: "One-time passcode", zh: "一次性密码", hi: "वन-टाइम पासकोड", es: "Código de un solo uso", ar: "رمز المرور لمرة واحدة", fr: "Code à usage unique", de: "Einmal-Passcode", ru: "Одноразовый пароль", pt: "Código de uso único", ja: "ワンタイムパスコード", pa: "ਇੱਕ ਵਾਰੀ ਪਾਸਕੋਡ", bn: "একবারের পাসকোড", id: "Kode sekali pakai", ur: "ایک وقت کا پاس کوڈ", ms: "Kod sekali pakai", it: "Codice monouso", tr: "Tek kullanımlık şifre", ta: "ஒரு முறை கடவுச்சொல்", te: "ఒకసారి పాస్కోడ్", ko: "일회용 패스코드", vi: "Mật mã một lần", pl: "Jednorazowy kod dostępu", ro: "Parolă de unică folosință", nl: "Eenmalige toegangscode", el: "Κωδικός πρόσβασης μίας χρήσης", th: "รหัสผ่านใช้ครั้งเดียว", cs: "Jednorázový přístupový kód", hu: "Egyszer használatos jelszó", sv: "Engångslösenord", da: "Engangskode" })}
          </div>
          <div className="text-default-contrast">
            {Lang.match({ en: "Your time-based one-time passcode.", zh: "您的基于时间的一次性密码。", hi: "आपका समय-आधारित वन-टाइम पासकोड।", es: "Su código de un solo uso basado en el tiempo.", ar: "رمز المرور لمرة واحدة المستند إلى الوقت الخاص بك.", fr: "Votre code à usage unique basé sur le temps.", de: "Ihr zeitbasierter Einmal-Passcode.", ru: "Ваш одноразовый пароль на основе времени.", pt: "Seu código de uso único baseado no tempo.", ja: "あなたの時間ベースのワンタイムパスコード。", pa: "ਤੁਹਾਡਾ ਸਮੇਂ-ਅਧਾਰਿਤ ਇੱਕ ਵਾਰੀ ਪਾਸਕੋਡ।", bn: "আপনার সময়-ভিত্তিক একবারের পাসকোড।", id: "Kode sekali pakai berbasis waktu Anda.", ur: "آپ کا وقت پر مبنی ایک وقت کا پاس کوڈ۔", ms: "Kod sekali pakai berasaskan masa anda.", it: "Il tuo codice monouso basato sul tempo.", tr: "Zaman tabanlı tek kullanımlık şifreniz.", ta: "உங்கள் நேர அடிப்படையிலான ஒருமுறை கடவுச்சொல்.", te: "మీ సమయ ఆధారిత ఒకసారి పాస్కోడ్.", ko: "귀하의 시간 기반 일회용 비밀번호.", vi: "Mã một lần dựa trên thời gian của bạn.", pl: "Twój czasowy jednorazowy kod dostępu.", ro: "Codul dvs. de unică folosință bazat pe timp.", nl: "Uw tijdgebaseerde eenmalige toegangscode.", el: "Ο χρονικά βασισμένος κωδικός πρόσβασής σας.", th: "รหัสผ่านใช้ครั้งเดียวตามเวลา", cs: "Váš časově založený jednorázový přístupový kód.", hu: "Az időalapú egyszer használatos jelszavad.", sv: "Din tidsbaserade engångskod.", da: "Din tidsbaserede engangskode." })}
          </div>
          <div className="h-4" />
          <input className="p-8 rounded-xl bg-default-contrast text-center focus-visible:outline-none text-6xl font-mono tracking-widest"
            readOnly
            autoComplete="off"
            onClick={copyTheTotpcode.copyOrAlert}
            value={totpcode ? (copyTheTotpcode.copied ? "COPIED" : totpcode) : "------"} />
        </Fragment>}
        {notes && <Fragment>
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
              readOnly
              rows={6}
              value={notes} />
          </div>
        </Fragment>}
      </form>
    </div>
  </Fragment>
}