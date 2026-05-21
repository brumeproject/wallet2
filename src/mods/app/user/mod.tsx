// deno-lint-ignore-file no-window

import { InOther, OppositeAnchor } from "@/libs/anchor/mod.tsx";
import { InButton, WideOppositeButton } from "@/libs/button/mod.tsx";
import { PathBoard } from "@/libs/dialog/board/mod.tsx";
import { PathPaper, WideNakedMenuAnchor, WideNakedMenuButton } from "@/libs/dialog/paper/mod.tsx";
import { Errors } from "@/libs/errors/mod.ts";
import { Events } from "@/libs/events/mod.ts";
import { useAutoFocus } from "@/libs/focus/mod.ts";
import { Outline } from "@/libs/heroicons/mod.ts";
import { Lang } from "@/libs/lang/mod.ts";
import { Nullable } from "@/libs/nullable/mod.ts";
import { Spinner } from "@/libs/spinner/mod.tsx";
import { useStoreContext } from "@/libs/store/mod.tsx";
import { useSubmit } from "@/libs/task/mod.ts";
import { Readable, Unknown, Writable } from "@hazae41/binary";
import { SubpathProvider, useAnchorWithCoords, useHashSubpath, usePathContext } from "@hazae41/chemin";
import * as KDBX from "@hazae41/kdbx";
import { useCloseContext } from "@hazae41/react-close-context";
import { Result } from "@hazae41/result-and-option";
import { webAuthnStorage } from "@hazae41/webauthnstorage";
import React, { DragEvent, Fragment, KeyboardEvent, useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";
import { SessionData } from "../session/mod.tsx";

React;

export interface UserData {
  readonly uuid: string
  readonly name: string
  readonly fsfh?: Nullable<FileSystemFileHandle>
  readonly auth?: Nullable<Uint8Array<ArrayBuffer>>
}

export function UserLoginButton() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, "/login")

  return <OppositeAnchor
    href={coords.url.hash}
    onClick={coords.onClick}
    onKeyDown={coords.onKeyDown}>
    <Outline.UsersIcon className="size-5" />
    {Lang.match({ en: "Start", zh: "开始", hi: "शुरू करें", es: "Comenzar", ar: "ابدأ", fr: "Démarrer", de: "Starten", ru: "Начать", pt: "Iniciar", ja: "開始", pa: "ਸ਼ੁਰੂ ਕਰੋ", bn: "শুরু করুন", id: "Mulai", ur: "شروع کریں", ms: "Mulai", it: "Inizia", tr: "Başla", ta: "தொடக்கம்", te: "ప్రారంభించండి", ko: "시작", vi: "Bắt đầu", pl: "Rozpocznij", ro: "Începe", nl: "Begin", el: "Έναρξη", th: "เริ่มต้น", cs: "Začít", hu: "Indítás", sv: "Starta", da: "Start" })}
  </OppositeAnchor>
}

export function UserLoginMenu(props: { login(session: SessionData): void }) {
  const { login } = props

  const store = useStoreContext().getOrThrow()

  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const [users, setUsers] = useState<Array<UserData>>()

  const getUsers = useCallback(async () => {
    return await store.value.getOrThrow().getOrThrow<Array<UserData>>("users") || []
  }, [store])

  useEffect(() => {
    if (store == null)
      return
    if (store.value.isErr())
      return
    getUsers().then(setUsers).catch(console.error)
  }, [store])

  return <Fragment>
    <SubpathProvider value={hash}>
      {hash.url.pathname === "/add" &&
        <PathPaper>
          <UserAddMenu />
        </PathPaper>}
    </SubpathProvider>
    <div className="flex flex-col text-left gap-2">
      {users?.map(user =>
        <Fragment key={user.uuid}>
          <UserItem
            login={login}
            user={user} />
        </Fragment>)}
      <UserAddButton />
    </div>
  </Fragment>
}

function UserAddButton() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, "/add")

  return <WideNakedMenuAnchor
    href={coords.url.hash}
    onClick={coords.onClick}
    onKeyDown={coords.onKeyDown}>
    <div className="rounded-full size-6 flex justify-center items-center border-2 border-dashed border-default-contrast">
      <Outline.PlusIcon className="size-4" />
    </div>
    {Lang.match({ en: "Add", zh: "添加", hi: "जोड़ें", es: "Agregar", ar: "إضافة", fr: "Ajouter", de: "Hinzufügen", ru: "Добавить", pt: "Adicionar", ja: "追加", pa: "ਸ਼ਾਮਲ ਕਰੋ", bn: "যোগ করুন", id: "Tambah", ur: "شامل کریں", ms: "Tambah", it: "Aggiungi", tr: "Ekle", ta: "சேர்க்கவும்", te: "చేరండి", ko: "추가", vi: "Thêm vào", pl: "Dodaj", ro: "Adăugați", nl: "Toevoegen", el: "Προσθήκη", th: "เพิ่ม", cs: "Přidat", hu: "Hozzáadás", sv: "Lägg till", da: "Tilføj" })}
  </WideNakedMenuAnchor>
}

function UserAddMenu() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  return <Fragment>
    <SubpathProvider value={hash}>
      {hash.url.pathname === "/import" &&
        <PathBoard>
          {"showOpenFilePicker" in window === true &&
            <UserImportFsfhPage />}
          {"showOpenFilePicker" in window === false &&
            <UserImportFilePage />}
        </PathBoard>}
      {hash.url.pathname === "/create" &&
        <PathBoard>
          <UserCreatePage />
        </PathBoard>}
    </SubpathProvider>
    <div className="flex flex-col text-left gap-2">
      <UserCreateButton />
      <UserImportButton />
    </div>
  </Fragment>
}

function UserCreateButton() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, "/create")

  return <WideNakedMenuAnchor
    href={coords.url.hash}
    onClick={coords.onClick}
    onKeyDown={coords.onKeyDown}>
    <Outline.SparklesIcon className="size-5" />
    {Lang.match({ en: "Create", zh: "创建", hi: "बनाएं", es: "Crear", ar: "إنشاء", fr: "Créer", de: "Erstellen", ru: "Создать", pt: "Criar", ja: "作成", pa: "ਬਣਾਓ", bn: "তৈরি করুন", id: "Buat", ur: "بنائیں", ms: "Buat", it: "Crea", tr: "Oluştur", ta: "உருவாக்கவும்", te: "సృష్టించండి", ko: "생성", vi: "Tạo mới", pl: "Utwórz", ro: "Creați", nl: "Maken", el: "Δημιουργία", th: "สร้างใหม่", cs: "Vytvořit", hu: "Létrehozás", sv: "Skapa", da: "Opret" })}
  </WideNakedMenuAnchor>
}

function UserImportButton() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, "/import")

  return <WideNakedMenuAnchor
    href={coords.url.hash}
    onClick={coords.onClick}
    onKeyDown={coords.onKeyDown}>
    <Outline.ArrowDownOnSquareIcon className="size-5" />
    {Lang.match({ en: "Import", zh: "导入", hi: "आयात करें", es: "Importar", ar: "استيراد", fr: "Importer", de: "Importieren", ru: "Импортировать", pt: "Importar", ja: "インポート", pa: "ਆਯਾਤ ਕਰੋ", bn: "আমদানি করুন", id: "Impor", ur: "درآمد کریں", ms: "Impor", it: "Importa", tr: "İçe aktar", ta: "இறக்குமதி செய்யவும்", te: "దిగుమతి చేయండి", ko: "가져오기", vi: "Nhập khẩu", pl: "Importuj", ro: "Importați", nl: "Importeren", el: "Εισαγωγή", th: "นำเข้า", cs: "Importovat", hu: "Importálás", sv: "Importera", da: "Importer" })}
  </WideNakedMenuAnchor>
}

function UserImportFilePage() {
  const close = useCloseContext().getOrThrow()
  const store = useStoreContext().getOrThrow()

  const [flipped, setFlipped] = useState(false)

  const [$name, setName] = useState("")
  const [$pass, setPass] = useState("")

  const name = useDeferredValue($name || "Satoshi")
  const pass = useDeferredValue($pass)

  const [file, setFile] = useState<Nullable<File>>()

  const loadOrDisplay = useSubmit(() => Promise.try(async () => {
    if (file == null)
      return

    const data = new Uint8Array(await file.arrayBuffer())

    const encrypted = Readable.readFromBytesOrThrow(KDBX.Database.Encrypted, data)
    const composite = await KDBX.CompositeKey.digestOrThrow(await KDBX.PasswordKey.digestOrThrow(new TextEncoder().encode(pass)))

    await encrypted.decryptOrThrow(composite)

    const uuid = crypto.randomUUID()

    const auth = await Result.runAndWrap(async () => {
      return await webAuthnStorage.createOrThrow(uuid.slice(0, 8), composite.value.bytes)
    }).then(r => r.inspectErrSync(console.log).getOrNull())

    const stale = await store.value.getOrThrow().getOrThrow<Array<UserData>>("users") || []

    const fresh = [...stale, { uuid, name, auth } satisfies UserData]

    await store.value.getOrThrow().setOrThrow("users", fresh)

    store.update()

    close()
  }).catch(Errors.display), [store, name, file, pass, close])

  const error = useMemo(() => {
    if (file == null)
      return Lang.match({ en: "File is required", zh: "文件是必需的", hi: "फ़ाइल आवश्यक है", es: "Se requiere archivo", ar: "الملف مطلوب", fr: "Le fichier est requis", de: "Datei ist erforderlich", ru: "Требуется файл", pt: "Arquivo é obrigatório", ja: "ファイルが必要です", pa: "ਫਾਇਲ ਲੋੜੀਂਦੀ ਹੈ", bn: "ফাইল প্রয়োজন", id: "File diperlukan", ur: "فائل ضروری ہے", ms: "File diperlukan", it: "Il file è richiesto", tr: "Dosya gereklidir", ta: "கோப்பு தேவை", te: "ఫైల్ అవసరం", ko: "파일이 필요합니다", vi: "Cần tệp", pl: "Plik jest wymagany", ro: "Fișierul este necesar", nl: "Bestand is vereist", el: "Το αρχείο είναι απαραίτητο", th: "ต้องการไฟล์", cs: "Soubor je povinný", hu: "A fájl szükséges", sv: "Fil krävs", da: "Fil er påkrævet" })
    if (!pass.length)
      return Lang.match({ en: "Password is required", zh: "密码是必需的", hi: "पासवर्ड आवश्यक है", es: "Se requiere contraseña", ar: "كلمة المرور مطلوبة", fr: "Le mot de passe est requis", de: "Passwort ist erforderlich", ru: "Требуется пароль", pt: "Senha é obrigatória", ja: "パスワードが必要です", pa: "ਪਾਸਵਰਡ ਲੋੜੀਂਦਾ ਹੈ", bn: "পাসওয়ার্ড প্রয়োজন", id: "Kata sandi diperlukan", ur: "پاس ورڈ ضروری ہے", ms: "Kata sandi diperlukan", it: "La password è richiesta", tr: "Parola gereklidir", ta: "கடவுச்சொல் தேவை", te: "పాస్వర్డ్ అవసరం", ko: "비밀번호가 필요합니다", vi: "Cần mật khẩu", pl: "Hasło jest wymagane", ro: "Parola este necesară", nl: "Wachtwoord is vereist", el: "Ο κωδικός πρόσβασης είναι απαραίτητος", th: "ต้องการรหัสผ่าน", cs: "Heslo je povinné", hu: "A jelszó szükséges", sv: "Lösenord krävs", da: "Adgangskode er påkrævet" })
    return
  }, [file, pass])

  return <div className="flex flex-col grow p-6">
    <h1 className="text-xl font-medium">
      {Lang.match({ en: "Import user", zh: "导入用户", hi: "उपयोगकर्ता आयात करें", es: "Importar usuario", ar: "استيراد مستخدم", fr: "Importer un utilisateur", de: "Benutzer importieren", ru: "Импортировать пользователя", pt: "Importar usuário", ja: "ユーザーをインポート", pa: "ਉਪਭੋਗਤਾ ਆਯਾਤ ਕਰੋ", bn: "ব্যবহারকারী আমদানি করুন", id: "Impor pengguna", ur: "صارف درآمد کریں", ms: "Impor pengguna", it: "Importa utente", tr: "Kullanıcı içe aktar", ta: "பயனரை இறக்குமதி செய்யவும்", te: "వినియోగదారుని దిగుమతి చేయండి", ko: "사용자 가져오기", vi: "Nhập người dùng", pl: "Importuj użytkownika", ro: "Importă utilizator", nl: "Importeer gebruiker", el: "Εισαγωγή χρήστη", th: "นำเข้าผู้ใช้", cs: "Importovat uživatele", hu: "Felhasználó importálása", sv: "Importera användare", da: "Importer bruger" })}
    </h1>
    <form className="grow flex flex-col"
      onSubmit={Events.preventDefault}>
      <input className="hidden"
        autoComplete="off"
        name="username" />
      <div className="h-6" />
      <div className="font-medium">
        {Lang.match({ en: "Name", zh: "名称", hi: "नाम", es: "Nombre", ar: "اسم", fr: "Nom", de: "Name", ru: "Имя", pt: "Nome", ja: "名前", pa: "ਨਾਮ", bn: "নাম", id: "Nama", ur: "نام", ms: "Nama", it: "Nome", tr: "İsim", ta: "பெயர்", te: "పేరు", ko: "이름", vi: "Tên", pl: "Nazwa", ro: "Nume", nl: "Naam", el: "Όνομα", th: "ชื่อ", cs: "Jméno", hu: "Név", sv: "Namn", da: "Navn" })}
      </div>
      <div className="text-default-contrast">
        {Lang.match({ en: "Will be used locally for display purposes.", zh: "将被本地使用，仅用于显示。", hi: "स्थानीय रूप से प्रदर्शन उद्देश्यों के लिए उपयोग किया जाएगा।", es: "Se usará localmente para fines de visualización.", ar: "سيتم استخدامه محليًا لأغراض العرض.", fr: "Sera utilisé localement à des fins d'affichage.", de: "Wird lokal für Anzeigezwecke verwendet.", ru: "Будет использоваться локально для отображения.", pt: "Será usado localmente para fins de exibição.", ja: "表示目的でローカルに使用されます。", pa: "ਡਿਸਪਲੇਅ ਦੇ ਉਦੇਸ਼ਾਂ ਲਈ ਸਥਾਨਕ ਤੌਰ 'ਤੇ ਵਰਤਿਆ ਜਾਵੇਗਾ।", bn: "প্রদর্শন উদ্দেশ্যে স্থানীয়ভাবে ব্যবহৃত হবে।", id: "Akan digunakan secara lokal untuk tujuan tampilan.", ur: "ڈسپلے کے مقاصد کے لیے مقامی طور پر استعمال کیا جائے گا۔", ms: "Akan digunakan secara lokal untuk tujuan tampilan.", it: "Sarà usato localmente per scopi di visualizzazione.", tr: "Görüntüleme amaçları için yerel olarak kullanılacaktır.", ta: "காட்சிப்படுத்தும் நோக்கங்களுக்காக உள்ளூரில் பயன்படுத்தப்படும்.", te: "ప్రదర్శన లక్ష్యాల కోసం స్థానికంగా ఉపయోగించబడుతుంది.", ko: "디스플레이 목적으로 로컬에서 사용됩니다.", vi: "Sẽ được sử dụng cục bộ cho mục đích hiển thị.", pl: "Będzie używany lokalnie do celów wyświetlania.", ro: "Va fi folosit local pentru scopuri de afișare.", nl: "Zal lokaal worden gebruikt voor weergavedoeleinden.", el: "Θα χρησιμοποιείται τοπικά για σκοπούς εμφάνισης.", th: "จะใช้ในพื้นที่สำหรับวัตถุประสงค์ในการแสดงผล", cs: "Bude používán lokálně pro zobrazení.", hu: "Helyileg lesz használva megjelenítési célokra.", sv: "Kommer att användas lokalt för visningsändamål.", da: "Vil blive brugt lokalt til visningsformål." })}
      </div>
      <div className="h-4" />
      <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
        <input className="w-full focus-visible:outline-none"
          autoComplete="off"
          placeholder="Satoshi"
          value={$name}
          onChange={e => setName(e.target.value)} />
      </div>
      <div className="h-6" />
      <div className="font-medium">
        {Lang.match({ en: "File", zh: "文件", hi: "फ़ाइल", es: "Archivo", ar: "ملف", fr: "Fichier", de: "Datei", ru: "Файл", pt: "Arquivo", ja: "ファイル", pa: "ਫਾਇਲ", bn: "ফাইল", id: "Berkas", ur: "فائل", ms: "Berkas", it: "File", tr: "Dosya", ta: "கோப்பு", te: "ఫైల్", ko: "파일", vi: "Tệp", pl: "Plik", ro: "Fișier", nl: "Bestand", el: "Αρχείο", th: "ไฟล์", cs: "Soubor", hu: "Fájl", sv: "Fil", da: "Fil" })}
      </div>
      <div className="text-default-contrast">
        {Lang.match({ en: "Your existing KDBX file.", zh: "您现有的 KDBX 文件。", hi: "आपकी मौजूदा KDBX फ़ाइल।", es: "Su archivo KDBX existente.", ar: "ملف KDBX الحالي الخاص بك.", fr: "Votre fichier KDBX existant.", de: "Ihre vorhandene KDBX-Datei.", ru: "Ваш существующий файл KDBX.", pt: "Seu arquivo KDBX existente.", ja: "既存の KDBX ファイル。", pa: "ਤੁਹਾਡੀ ਮੌਜੂਦਾ KDBX ਫਾਇਲ।", bn: "আপনার বিদ্যমান KDBX ফাইল।", id: "File KDBX Anda yang ada.", ur: "آپ کی موجودہ KDBX فائل۔", ms: "File KDBX Anda yang ada.", it: "Il tuo file KDBX esistente.", tr: "Mevcut KDBX dosyanız.", ta: "உங்கள் தற்போதைய KDBX கோப்பு.", te: "మీ ప్రస్తుత KDBX ఫైల్.", ko: "기존 KDBX 파일입니다.", vi: "Tệp KDBX hiện có của bạn.", pl: "Twój istniejący plik KDBX.", ro: "Fișierul KDBX existent.", nl: "Uw bestaande KDBX-bestand.", el: "Το υπάρχον αρχείο KDBX σας.", th: "ไฟล์ KDBX ที่มีอยู่ของคุณ", cs: "Váš stávající soubor KDBX.", hu: "A meglévő KDBX fájlod.", sv: "Din befintliga KDBX-fil.", da: "Din eksisterende KDBX-fil." })}
      </div>
      <div className="h-4" />
      <div className="relative bg-default-contrast rounded-xl [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
        <input className="absolute inset-0 opacity-0 cursor-pointer"
          type="file"
          accept="application/octet-stream,.kdbx"
          onChange={e => setFile(e.target.files?.item(0))} />
        {file != null &&
          <div className="po-2">
            {file.name}
          </div>}
        {file == null &&
          <div className="po-2">
            {Lang.match({ en: "Pick or drop file here", zh: "在此处选择或拖放文件", hi: "यहां फ़ाइल चुनें या ड्रॉप करें", es: "Seleccione o suelte el archivo aquí", ar: "اختر أو اسقط الملف هنا", fr: "Choisissez ou déposez le fichier ici", de: "Datei hier auswählen oder ablegen", ru: "Выберите или перетащите файл сюда", pt: "Escolha ou solte o arquivo aqui", ja: "ここでファイルを選択またはドロップ", pa: "ਇੱਥੇ ਫਾਇਲ ਚੁਣੋ ਜਾਂ ਡਰੌਪ ਕਰੋ", bn: "এখানে ফাইল নির্বাচন করুন বা ড্রপ করুন", id: "Pilih atau jatuhkan file di sini", ur: "فائل یہاں منتخب کریں یا ڈراپ کریں", ms: "Pilih atau jatuhkan file di sini", it: "Scegli o trascina il file qui", tr: "Dosyayı buraya seçin veya bırakın", ta: "கோப்பை இங்கே தேர்ந்தெடுக்கவும் அல்லது விடவும்", te: "ఫైల్‌ను ఇక్కడ ఎంచుకోండి లేదా డ్రాప్ చేయండి", ko: "여기에 파일을 선택하거나 드롭하세요", vi: "Chọn hoặc thả tệp ở đây", pl: "Wybierz lub upuść plik tutaj", ro: "Alegeți sau aruncați fișierul aici", nl: "Kies of drop het bestand hier", el: "Επιλέξτε ή ρίξτε το αρχείο εδώ", th: "เลือกหรือวางไฟล์ที่นี่", cs: "Vyberte nebo přetáhněte soubor sem", hu: "Válassza ki vagy dobja ide a fájlt", sv: "Välj eller släpp filen här", da: "Vælg eller slip filen her" })}
          </div>}
      </div>
      <div className="h-6" />
      <div className="font-medium">
        {Lang.match({ en: "Password", zh: "密码", hi: "पासवर्ड", es: "Contraseña", ar: "كلمة المرور", fr: "Mot de passe", de: "Passwort", ru: "Пароль", pt: "Senha", ja: "パスワード", pa: "ਪਾਸਵਰਡ", bn: "পাসওয়ার্ড", id: "Kata sandi", ur: "پاس ورڈ", ms: "Kata sandi", it: "Password", tr: "Parola", ta: "கடவுச்சொல்", te: "పాస్వర్డ్", ko: "비밀번호", vi: "Mật khẩu", pl: "Hasło", ro: "Parolă", nl: "Wachtwoord", el: "Κωδικός πρόσβασης", th: "รหัสผ่าน", cs: "Heslo", hu: "Jelszó", sv: "Lösenord", da: "Adgangskode" })}
      </div>
      <div className="text-default-contrast">
        {Lang.match({ en: "Your existing password to decrypt the file.", zh: "您现有的密码用于解密文件。", hi: "फ़ाइल को डिक्रिप्ट करने के लिए आपका मौजूदा पासवर्ड।", es: "Su contraseña existente para descifrar el archivo.", ar: "كلمة المرور الحالية الخاصة بك لفك تشفير الملف.", fr: "Votre mot de passe existant pour déchiffrer le fichier.", de: "Ihr vorhandenes Passwort zum Entschlüsseln der Datei.", ru: "Ваш существующий пароль для расшифровки файла.", pt: "Sua senha existente para descriptografar o arquivo.", ja: "ファイルを復号化するための既存のパスワード。", pa: "ਫਾਇਲ ਨੂੰ ਡੀਕ੍ਰਿਪਟ ਕਰਨ ਲਈ ਤੁਹਾਡਾ ਮੌਜੂਦਾ ਪਾਸਵਰਡ।", bn: "ফাইল ডিক্রিপ্ট করার জন্য আপনার বিদ্যমান পাসওয়ার্ড।", id: "Kata sandi Anda yang ada untuk mendekripsi file.", ur: "فائل کو ڈی کرپٹ کرنے کے لیے آپ کا موجودہ پاس ورڈ۔", ms: "Kata sandi Anda yang ada untuk mendekripsi file.", it: "La tua password esistente per decriptare il file.", tr: "Dosyayı şifre çözmek için mevcut parolanız.", ta: "கோப்பை குறியாக்கம்解除 செய்ய உங்கள் தற்போதைய கடவுச்சொல்.", te: "ఫైల్‌ను డీక్రిప్ట్ చేయడానికి మీ ప్రస్తుత పాస్వర్డ్.", ko: "파일을 복호화하기 위한 기존 비밀번호입니다.", vi: "Mật khẩu hiện có của bạn để giải mã tệp.", pl: "Twoje istniejące hasło do odszyfrowania pliku.", ro: "Parola existentă pentru decriptarea fișierului.", nl: "Uw bestaande wachtwoord om het bestand te ontsleutelen.", el: "Ο υπάρχων κωδικός πρόσβασής σας για την αποκρυπτογράφηση του αρχείου.", th: "รหัสผ่านที่มีอยู่ของคุณเพื่อถอดรหัสไฟล์", cs: "Váš stávající heslo pro dešifrování souboru.", hu: "A meglévő jelszavad a fájl de kódolásához.", sv: "Ditt befintliga lösenord för att dekryptera filen.", da: "Din eksisterende adgangskode til at dekryptere filen." })}
      </div>
      <div className="h-4" />
      <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
        <input className="w-full focus-visible:outline-none"
          autoComplete="off"
          type={flipped ? "text" : "password"}
          value={$pass}
          onChange={e => setPass(e.target.value)} />
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
      <div className="h-8 grow" />
      <div className="flex items-center flex-wrap-reverse gap-2">
        <WideOppositeButton
          type="button"
          disabled={loadOrDisplay.running || error != null}
          onClick={loadOrDisplay.execute}>
          {loadOrDisplay.running === true && <Spinner className="size-6 animate-spin" />}
          {loadOrDisplay.running === false && (error != null ? error : Lang.match({ en: "Open", zh: "打开", hi: "खोलें", es: "Abrir", ar: "فتح", fr: "Ouvrir", de: "Öffnen", ru: "Открыть", pt: "Abrir", ja: "開く", pa: "ਖੋਲ੍ਹੋ", bn: "খুলুন", id: "Buka", ur: "کھولیں", ms: "Buka", it: "Apri", tr: "Aç", ta: "திறக்கவும்", te: "తెరవండి", ko: "열기", vi: "Mở", pl: "Otwórz", ro: "Deschideți", nl: "Openen", el: "Άνοιγμα", th: "เปิด", cs: "Otevřít", hu: "Megnyitás", sv: "Öppna", da: "Åbn" }))}
        </WideOppositeButton>
      </div>
    </form>
  </div>
}

function UserImportFsfhPage() {
  const close = useCloseContext().getOrThrow()
  const store = useStoreContext().getOrThrow()

  const [flipped, setFlipped] = useState(false)

  const [$name, setName] = useState("")
  const [$pass, setPass] = useState("")

  const name = useDeferredValue($name || "Satoshi")
  const pass = useDeferredValue($pass)

  const [fsfh, setFsfh] = useState<FileSystemFileHandle>()

  const pickOrDisplay = useCallback(() => Promise.try(async () => {
    const [fsfh] = await window.showOpenFilePicker!({ id: "root", startIn: "documents", types: [{ description: "KDBX", accept: { "application/kdbx": [".kdbx"] } }] })

    if (fsfh == null)
      return
    if (fsfh.kind !== "file")
      return

    setFsfh(fsfh)
  }).catch(Errors.display), [])

  const dropOrDisplay = useCallback((e: DragEvent<HTMLButtonElement>) => Promise.try(async () => {
    e.preventDefault()

    const [item] = e.dataTransfer.items as unknown as Iterable<DataTransferItem>

    const fsfh = await item.getAsFileSystemHandle!()

    if (fsfh.kind !== "file")
      return

    setFsfh(fsfh)
  }).catch(Errors.display), [])

  const openOrDisplay = useSubmit(() => Promise.try(async () => {
    if (fsfh == null)
      return

    const file = await fsfh.getFile()
    const data = new Uint8Array(await file.arrayBuffer())

    const encrypted = Readable.readFromBytesOrThrow(KDBX.Database.Encrypted, data)
    const composite = await KDBX.CompositeKey.digestOrThrow(await KDBX.PasswordKey.digestOrThrow(new TextEncoder().encode(pass)))

    await encrypted.decryptOrThrow(composite)

    const uuid = crypto.randomUUID()

    const auth = await Result.runAndWrap(async () => {
      return await webAuthnStorage.createOrThrow(uuid.slice(0, 8), composite.value.bytes)
    }).then(r => r.inspectErrSync(console.log).getOrNull())

    const stale = await store.value.getOrThrow().getOrThrow<Array<UserData>>("users") || []

    const fresh = [...stale, { uuid, name, fsfh, auth } satisfies UserData]

    await store.value.getOrThrow().setOrThrow("users", fresh)

    store.update()

    close()
  }).catch(Errors.display), [store, name, fsfh, pass, close])

  const error = useMemo(() => {
    if (fsfh == null)
      return Lang.match({ en: "File is required", zh: "文件是必需的", hi: "फ़ाइल आवश्यक है", es: "Se requiere archivo", ar: "الملف مطلوب", fr: "Le fichier est requis", de: "Datei ist erforderlich", ru: "Требуется файл", pt: "Arquivo é obrigatório", ja: "ファイルが必要です", pa: "ਫਾਇਲ ਲੋੜੀਂਦੀ ਹੈ", bn: "ফাইল প্রয়োজন", id: "File diperlukan", ur: "فائل ضروری ہے", ms: "File diperlukan", it: "Il file è richiesto", tr: "Dosya gereklidir", ta: "கோப்பு தேவை", te: "ఫైల్ అవసరం", ko: "파일이 필요합니다", vi: "Cần tệp", pl: "Plik jest wymagany", ro: "Fișierul este necesar", nl: "Bestand is vereist", el: "Το αρχείο είναι απαραίτητο", th: "ต้องการไฟล์", cs: "Soubor je povinný", hu: "A fájl szükséges", sv: "Fil krävs", da: "Fil er påkrævet" })
    if (!pass.length)
      return Lang.match({ en: "Password is required", zh: "密码是必需的", hi: "पासवर्ड आवश्यक है", es: "Se requiere contraseña", ar: "كلمة المرور مطلوبة", fr: "Le mot de passe est requis", de: "Passwort ist erforderlich", ru: "Требуется пароль", pt: "Senha é obrigatória", ja: "パスワードが必要です", pa: "ਪਾਸਵਰਡ ਲੋੜੀਂਦਾ ਹੈ", bn: "পাসওয়ার্ড প্রয়োজন", id: "Kata sandi diperlukan", ur: "پاس ورڈ ضروری ہے", ms: "Kata sandi diperlukan", it: "La password è richiesta", tr: "Parola gereklidir", ta: "கடவுச்சொல் தேவை", te: "పాస్వర్డ్ అవసరం", ko: "비밀번호가 필요합니다", vi: "Cần mật khẩu", pl: "Hasło jest wymagane", ro: "Parola este necesară", nl: "Wachtwoord is vereist", el: "Ο κωδικός πρόσβασης είναι απαραίτητος", th: "ต้องการรหัสผ่าน", cs: "Heslo je povinné", hu: "A jelszó szükséges", sv: "Lösenord krävs", da: "Adgangskode er påkrævet" })
    return
  }, [fsfh, pass])

  return <div className="flex flex-col grow p-6">
    <h1 className="text-xl font-medium">
      {Lang.match({ en: "Import user", zh: "导入用户", hi: "उपयोगकर्ता आयात करें", es: "Importar usuario", ar: "استيراد مستخدم", fr: "Importer un utilisateur", de: "Benutzer importieren", ru: "Импортировать пользователя", pt: "Importar usuário", ja: "ユーザーをインポート", pa: "ਉਪਭੋਗਤਾ ਆਯਾਤ ਕਰੋ", bn: "ব্যবহারকারী আমদানি করুন", id: "Impor pengguna", ur: "صارف درآمد کریں", ms: "Impor pengguna", it: "Importa utente", tr: "Kullanıcı içe aktar", ta: "பயனரை இறக்குமதி செய்யவும்", te: "వినియోగదారుని దిగుమతి చేయండి", ko: "사용자 가져오기", vi: "Nhập người dùng", pl: "Importuj użytkownika", ro: "Importă utilizator", nl: "Importeer gebruiker", el: "Εισαγωγή χρήστη", th: "นำเข้าผู้ใช้", cs: "Importovat uživatele", hu: "Felhasználó importálása", sv: "Importera användare", da: "Importer bruger" })}
    </h1>
    <form className="grow flex flex-col"
      onSubmit={Events.preventDefault}>
      <input className="hidden"
        autoComplete="off"
        name="username" />
      <div className="h-6" />
      <div className="font-medium">
        {Lang.match({ en: "Name", zh: "名称", hi: "नाम", es: "Nombre", ar: "اسم", fr: "Nom", de: "Name", ru: "Имя", pt: "Nome", ja: "名前", pa: "ਨਾਮ", bn: "নাম", id: "Nama", ur: "نام", ms: "Nama", it: "Nome", tr: "İsim", ta: "பெயர்", te: "పేరు", ko: "이름", vi: "Tên", pl: "Nazwa", ro: "Nume", nl: "Naam", el: "Όνομα", th: "ชื่อ", cs: "Jméno", hu: "Név", sv: "Namn", da: "Navn" })}
      </div>
      <div className="text-default-contrast">
        {Lang.match({ en: "Will be used locally for display purposes.", zh: "将被本地使用，仅用于显示。", hi: "स्थानीय रूप से प्रदर्शन उद्देश्यों के लिए उपयोग किया जाएगा।", es: "Se usará localmente para fines de visualización.", ar: "سيتم استخدامه محليًا لأغراض العرض.", fr: "Sera utilisé localement à des fins d'affichage.", de: "Wird lokal für Anzeigezwecke verwendet.", ru: "Будет использоваться локально для отображения.", pt: "Será usado localmente para fins de exibição.", ja: "表示目的でローカルに使用されます。", pa: "ਡਿਸਪਲੇਅ ਦੇ ਉਦੇਸ਼ਾਂ ਲਈ ਸਥਾਨਕ ਤੌਰ 'ਤੇ ਵਰਤਿਆ ਜਾਵੇਗਾ।", bn: "প্রদর্শন উদ্দেশ্যে স্থানীয়ভাবে ব্যবহৃত হবে।", id: "Akan digunakan secara lokal untuk tujuan tampilan.", ur: "ڈسپلے کے مقاصد کے لیے مقامی طور پر استعمال کیا جائے گا۔", ms: "Akan digunakan secara lokal untuk tujuan tampilan.", it: "Sarà usato localmente per scopi di visualizzazione.", tr: "Görüntüleme amaçları için yerel olarak kullanılacaktır.", ta: "காட்சிப்படுத்தும் நோக்கங்களுக்காக உள்ளூரில் பயன்படுத்தப்படும்.", te: "ప్రదర్శన లక్ష్యాల కోసం స్థానికంగా ఉపయోగించబడుతుంది.", ko: "디스플레이 목적으로 로컬에서 사용됩니다.", vi: "Sẽ được sử dụng cục bộ cho mục đích hiển thị.", pl: "Będzie używany lokalnie do celów wyświetlania.", ro: "Va fi folosit local pentru scopuri de afișare.", nl: "Zal lokaal worden gebruikt voor weergavedoeleinden.", el: "Θα χρησιμοποιείται τοπικά για σκοπούς εμφάνισης.", th: "จะใช้ในพื้นที่สำหรับวัตถุประสงค์ในการแสดงผล", cs: "Bude používán lokálně pro zobrazení.", hu: "Helyileg lesz használva megjelenítési célokra.", sv: "Kommer att användas lokalt för visningsändamål.", da: "Vil blive brugt lokalt til visningsformål." })}
      </div>
      <div className="h-4" />
      <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
        <input className="w-full focus-visible:outline-none"
          autoComplete="off"
          placeholder="Satoshi"
          value={$name}
          onChange={e => setName(e.target.value)} />
      </div>
      <div className="h-6" />
      <div className="font-medium">
        {Lang.match({ en: "File", zh: "文件", hi: "फ़ाइल", es: "Archivo", ar: "ملف", fr: "Fichier", de: "Datei", ru: "Файл", pt: "Arquivo", ja: "ファイル", pa: "ਫਾਇਲ", bn: "ফাইল", id: "Berkas", ur: "فائل", ms: "Berkas", it: "File", tr: "Dosya", ta: "கோப்பு", te: "ఫైల్", ko: "파일", vi: "Tệp", pl: "Plik", ro: "Fișier", nl: "Bestand", el: "Αρχείο", th: "ไฟล์", cs: "Soubor", hu: "Fájl", sv: "Fil", da: "Fil" })}
      </div>
      <div className="text-default-contrast">
        {Lang.match({ en: "Your existing KDBX file.", zh: "您现有的 KDBX 文件。", hi: "आपकी मौजूदा KDBX फ़ाइल।", es: "Su archivo KDBX existente.", ar: "ملف KDBX الحالي الخاص بك.", fr: "Votre fichier KDBX existant.", de: "Ihre vorhandene KDBX-Datei.", ru: "Ваш существующий файл KDBX.", pt: "Seu arquivo KDBX existente.", ja: "既存の KDBX ファイル。", pa: "ਤੁਹਾਡੀ ਮੌਜੂਦਾ KDBX ਫਾਇਲ।", bn: "আপনার বিদ্যমান KDBX ফাইল।", id: "File KDBX Anda yang ada.", ur: "آپ کی موجودہ KDBX فائل۔", ms: "File KDBX Anda yang ada.", it: "Il tuo file KDBX esistente.", tr: "Mevcut KDBX dosyanız.", ta: "உங்கள் தற்போதைய KDBX கோப்பு.", te: "మీ ప్రస్తుత KDBX ఫైల్.", ko: "기존 KDBX 파일입니다.", vi: "Tệp KDBX hiện có của bạn.", pl: "Twój istniejący plik KDBX.", ro: "Fișierul KDBX existent.", nl: "Uw bestaande KDBX-bestand.", el: "Το υπάρχον αρχείο KDBX σας.", th: "ไฟล์ KDBX ที่มีอยู่ของคุณ", cs: "Váš stávající soubor KDBX.", hu: "A meglévő KDBX fájlod.", sv: "Din befintliga KDBX-fil.", da: "Din eksisterende KDBX-fil." })}
      </div>
      <div className="h-4" />
      <div className="relative bg-default-contrast rounded-xl [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
        {"showOpenFilePicker" in window === true &&
          <button className="absolute inset-0 opacity-0 cursor-pointer"
            type="button"
            onClick={pickOrDisplay}
            onDragOver={Events.preventDefault}
            onDrop={dropOrDisplay} />}
        {fsfh != null &&
          <div className="po-2">
            {fsfh.name}
          </div>}
        {fsfh == null &&
          <div className="po-2">
            {Lang.match({ en: "Pick or drop file here", zh: "在此处选择或拖放文件", hi: "यहां फ़ाइल चुनें या ड्रॉप करें", es: "Seleccione o suelte el archivo aquí", ar: "اختر أو اسقط الملف هنا", fr: "Choisissez ou déposez le fichier ici", de: "Datei hier auswählen oder ablegen", ru: "Выберите или перетащите файл сюда", pt: "Escolha ou solte o arquivo aqui", ja: "ここでファイルを選択またはドロップ", pa: "ਇੱਥੇ ਫਾਇਲ ਚੁਣੋ ਜਾਂ ਡਰੌਪ ਕਰੋ", bn: "এখানে ফাইল নির্বাচন করুন বা ড্রপ করুন", id: "Pilih atau jatuhkan file di sini", ur: "فائل یہاں منتخب کریں یا ڈراپ کریں", ms: "Pilih atau jatuhkan file di sini", it: "Scegli o trascina il file qui", tr: "Dosyayı buraya seçin veya bırakın", ta: "கோப்பை இங்கே தேர்ந்தெடுக்கவும் அல்லது விடவும்", te: "ఫైల్‌ను ఇక్కడ ఎంచుకోండి లేదా డ్రాప్ చేయండి", ko: "여기에 파일을 선택하거나 드롭하세요", vi: "Chọn hoặc thả tệp ở đây", pl: "Wybierz lub upuść plik tutaj", ro: "Alegeți sau aruncați fișierul aici", nl: "Kies of drop het bestand hier", el: "Επιλέξτε ή ρίξτε το αρχείο εδώ", th: "เลือกหรือวางไฟล์ที่นี่", cs: "Vyberte nebo přetáhněte soubor sem", hu: "Válassza ki vagy dobja ide a fájlt", sv: "Välj eller släpp filen här", da: "Vælg eller slip filen her" })}
          </div>}
      </div>
      <div className="h-6" />
      <div className="font-medium">
        {Lang.match({ en: "Password", zh: "密码", hi: "पासवर्ड", es: "Contraseña", ar: "كلمة المرور", fr: "Mot de passe", de: "Passwort", ru: "Пароль", pt: "Senha", ja: "パスワード", pa: "ਪਾਸਵਰਡ", bn: "পাসওয়ার্ড", id: "Kata sandi", ur: "پاس ورڈ", ms: "Kata sandi", it: "Password", tr: "Parola", ta: "கடவுச்சொல்", te: "పాస్వర్డ్", ko: "비밀번호", vi: "Mật khẩu", pl: "Hasło", ro: "Parolă", nl: "Wachtwoord", el: "Κωδικός πρόσβασης", th: "รหัสผ่าน", cs: "Heslo", hu: "Jelszó", sv: "Lösenord", da: "Adgangskode" })}
      </div>
      <div className="text-default-contrast">
        {Lang.match({ en: "Your existing password to decrypt the file.", zh: "您现有的密码用于解密文件。", hi: "फ़ाइल को डिक्रिप्ट करने के लिए आपका मौजूदा पासवर्ड।", es: "Su contraseña existente para descifrar el archivo.", ar: "كلمة المرور الحالية الخاصة بك لفك تشفير الملف.", fr: "Votre mot de passe existant pour déchiffrer le fichier.", de: "Ihr vorhandenes Passwort zum Entschlüsseln der Datei.", ru: "Ваш существующий пароль для расшифровки файла.", pt: "Sua senha existente para descriptografar o arquivo.", ja: "ファイルを復号化するための既存のパスワード。", pa: "ਫਾਇਲ ਨੂੰ ਡੀਕ੍ਰਿਪਟ ਕਰਨ ਲਈ ਤੁਹਾਡਾ ਮੌਜੂਦਾ ਪਾਸਵਰਡ।", bn: "ফাইল ডিক্রিপ্ট করার জন্য আপনার বিদ্যমান পাসওয়ার্ড।", id: "Kata sandi Anda yang ada untuk mendekripsi file.", ur: "فائل کو ڈی کرپٹ کرنے کے لیے آپ کا موجودہ پاس ورڈ۔", ms: "Kata sandi Anda yang ada untuk mendekripsi file.", it: "La tua password esistente per decriptare il file.", tr: "Dosyayı şifre çözmek için mevcut parolanız.", ta: "கோப்பை குறியாக்கம்解除 செய்ய உங்கள் தற்போதைய கடவுச்சொல்.", te: "ఫైల్‌ను డీక్రిప్ట్ చేయడానికి మీ ప్రస్తుత పాస్వర్డ్.", ko: "파일을 복호화하기 위한 기존 비밀번호입니다.", vi: "Mật khẩu hiện có của bạn để giải mã tệp.", pl: "Twoje istniejące hasło do odszyfrowania pliku.", ro: "Parola existentă pentru decriptarea fișierului.", nl: "Uw bestaande wachtwoord om het bestand te ontsleutelen.", el: "Ο υπάρχων κωδικός πρόσβασής σας για την αποκρυπτογράφηση του αρχείου.", th: "รหัสผ่านที่มีอยู่ของคุณเพื่อถอดรหัสไฟล์", cs: "Váš stávající heslo pro dešifrování souboru.", hu: "A meglévő jelszavad a fájl de kódolásához.", sv: "Ditt befintliga lösenord för att dekryptera filen.", da: "Din eksisterende adgangskode til at dekryptere filen." })}
      </div>
      <div className="h-4" />
      <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
        <input className="w-full focus-visible:outline-none"
          autoComplete="off"
          type={flipped ? "text" : "password"}
          value={$pass}
          onChange={e => setPass(e.target.value)} />
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
      <div className="h-8 grow" />
      <div className="flex items-center flex-wrap-reverse gap-2">
        <WideOppositeButton
          type="button"
          disabled={openOrDisplay.running || error != null}
          onClick={openOrDisplay.execute}>
          {openOrDisplay.running === true && <Spinner className="size-6 animate-spin" />}
          {openOrDisplay.running === false && (error != null ? error : Lang.match({ en: "Open", zh: "打开", hi: "खोलें", es: "Abrir", ar: "فتح", fr: "Ouvrir", de: "Öffnen", ru: "Открыть", pt: "Abrir", ja: "開く", pa: "ਖੋਲ੍ਹੋ", bn: "খুলুন", id: "Buka", ur: "کھولیں", ms: "Buka", it: "Apri", tr: "Aç", ta: "திறக்கவும்", te: "తెరవండి", ko: "열기", vi: "Mở", pl: "Otwórz", ro: "Deschideți", nl: "Openen", el: "Άνοιγμα", th: "เปิด", cs: "Otevřít", hu: "Megnyitás", sv: "Öppna", da: "Åbn" }))}
        </WideOppositeButton>
      </div>
    </form>
  </div>
}

function UserCreatePage() {
  const close = useCloseContext().getOrThrow()
  const store = useStoreContext().getOrThrow()

  const [flipped, setFlipped] = useState(false)

  const [$name, setName] = useState("")
  const [$pass, setPass] = useState("")

  const name = useDeferredValue($name || "Satoshi")
  const pass = useDeferredValue($pass)

  const xml = useMemo(() => `
    <KeePassFile>
      <Meta>
        <Generator>Brume</Generator>
        <DatabaseName>${name}</DatabaseName>
        <HistoryMaxItems>10</HistoryMaxItems>
        <HistoryMaxSize>6291456</HistoryMaxSize>
        <RecycleBinEnabled>True</RecycleBinEnabled>
        <RecycleBinUUID>KitVu0Z+S26bU0ek9ghs7g==</RecycleBinUUID>
      </Meta>
      <Root>
        <Group>
          <Name>Fresh</Name>
          <UUID>H2qgo3GARAW5tSvIO/mYtQ==</UUID>
        </Group>
        <Group>
          <Name>Trash</Name>
          <UUID>KitVu0Z+S26bU0ek9ghs7g==</UUID>
        </Group>
      </Root>
    </KeePassFile>
  `.trim(), [name])

  const innerizeOrThrow = useCallback(() => {
    const document = new DOMParser().parseFromString(xml, "text/xml")

    const headers = KDBX.Inner.Headers.createOrThrow(KDBX.Inner.Cipher.ChaCha20)
    const content = KDBX.Inner.ContentWithBytes.computeOrThrow(new KDBX.Inner.KeePassFile(document))

    return new KDBX.Inner.HeadersAndContentWithBytes(headers, content)
  }, [xml])

  const outerizeOrThrow = useCallback(async (composite: KDBX.CompositeKey) => {
    const cipher = KDBX.Outer.Cipher.Aes256Cbc
    const compression = KDBX.Outer.Compression.Gzip

    const seed = new Unknown(crypto.getRandomValues(new Uint8Array(32)) as Uint8Array<ArrayBuffer> & { length: 32 })
    const iv = new Unknown(crypto.getRandomValues(new Uint8Array(cipher.IV.length)))
    const kdf = KDBX.Outer.KdfParameters.Argon2d.createOrThrow()

    const headers = KDBX.Outer.Headers.initOrThrow({ cipher, compression, seed, iv, kdf })
    const wrapper = new KDBX.Outer.MagicAndVersionAndHeaders(new KDBX.Outer.Version(4, 0), headers)

    const derived = await headers.deriveOrThrow(composite)

    const bytes = KDBX.Outer.MagicAndVersionAndHeadersWithBytes.computeOrThrow(wrapper)
    const hashs = await KDBX.Outer.MagicAndVersionAndHeadersWithBytesWithHashAndHmac.computeOrThrow(bytes, derived)

    return new KDBX.Outer.MagicAndVersionAndHeadersWithBytesWithHashAndHmacWithKeys(hashs, derived)
  }, [])

  const pickOrDisplay = useSubmit(() => Promise.try(async () => {
    const fsfh = await window.showSaveFilePicker!({ id: "root", startIn: "documents", suggestedName: `wallet.kdbx`, types: [{ description: "KDBX", accept: { "application/kdbx": [".kdbx"] } }] })

    const composite = await KDBX.CompositeKey.digestOrThrow(await KDBX.PasswordKey.digestOrThrow(new TextEncoder().encode(pass)))

    const inner = innerizeOrThrow()
    const outer = await outerizeOrThrow(composite)

    const decrypted = new KDBX.Database.Decrypted(outer, inner)
    const encrypted = await decrypted.encryptOrThrow(composite)

    const content = Writable.writeToBytesOrThrow(encrypted)

    const writable = await fsfh.createWritable()
    await writable.write(content)
    await writable.close()

    const uuid = crypto.randomUUID()

    const auth = await Result.runAndWrap(async () => {
      return await webAuthnStorage.createOrThrow(uuid.slice(0, 8), composite.value.bytes)
    }).then(r => r.inspectErrSync(console.log).getOrNull())

    const stale = await store.value.getOrThrow().getOrThrow<Array<UserData>>("users") || []

    const fresh = [...stale, { uuid, name, fsfh, auth } satisfies UserData]

    await store.value.getOrThrow().setOrThrow("users", fresh)

    store.update()

    close()
  }).catch(Errors.display), [store, pass, innerizeOrThrow, outerizeOrThrow, close])

  const saveOrDisplay = useSubmit(() => Promise.try(async () => {
    const composite = await KDBX.CompositeKey.digestOrThrow(await KDBX.PasswordKey.digestOrThrow(new TextEncoder().encode(pass)))

    const inner = innerizeOrThrow()
    const outer = await outerizeOrThrow(composite)

    const decrypted = new KDBX.Database.Decrypted(outer, inner)
    const encrypted = await decrypted.encryptOrThrow(composite)

    const content = Writable.writeToBytesOrThrow(encrypted)

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

    const uuid = crypto.randomUUID()

    const auth = await Result.runAndWrap(async () => {
      return await webAuthnStorage.createOrThrow(uuid.slice(0, 8), composite.value.bytes)
    }).then(r => r.inspectErrSync(console.log).getOrNull())

    const stale = await store.value.getOrThrow().getOrThrow<Array<UserData>>("users") || []

    const fresh = [...stale, { uuid, name, auth } satisfies UserData]

    await store.value.getOrThrow().setOrThrow("users", fresh)

    store.update()

    close()
  }).catch(Errors.display), [store, pass, innerizeOrThrow, outerizeOrThrow, close])

  const error = useMemo(() => {
    if (!pass.length)
      return Lang.match({ en: "Password is required", zh: "密码是必需的", hi: "पासवर्ड आवश्यक है", es: "Se requiere contraseña", ar: "كلمة المرور مطلوبة", fr: "Le mot de passe est requis", de: "Passwort ist erforderlich", ru: "Требуется пароль", pt: "Senha é obrigatória", ja: "パスワードが必要です", pa: "ਪਾਸਵਰਡ ਲੋੜੀਂਦਾ ਹੈ", bn: "পাসওয়ার্ড প্রয়োজন", id: "Kata sandi diperlukan", ur: "پاس ورڈ ضروری ہے", ms: "Kata sandi diperlukan", it: "La password è richiesta", tr: "Parola gereklidir", ta: "கடவுச்சொல் தேவை", te: "పాస్వర్డ్ అవసరం", ko: "비밀번호가 필요합니다", vi: "Cần mật khẩu", pl: "Hasło jest wymagane", ro: "Parola este necesară", nl: "Wachtwoord is vereist", el: "Ο κωδικός πρόσβασης είναι απαραίτητος", th: "ต้องการรหัสผ่าน", cs: "Heslo je povinné", hu: "A jelszó szükséges", sv: "Lösenord krävs", da: "Adgangskode er påkrævet" })
    return
  }, [pass])

  return <div className="flex flex-col grow p-6">
    <h1 className="text-xl font-medium">
      {Lang.match({ en: "Create user", zh: "创建用户", hi: "उपयोगकर्ता बनाएं", es: "Crear usuario", ar: "إنشاء مستخدم", fr: "Créer un utilisateur", de: "Benutzer erstellen", ru: "Создать пользователя", pt: "Criar usuário", ja: "ユーザーを作成", pa: "ਉਪਭੋਗਤਾ ਬਣਾਓ", bn: "ব্যবহারকারী তৈরি করুন", id: "Buat pengguna", ur: "صارف بنائیں", ms: "Buat pengguna", it: "Crea utente", tr: "Kullanıcı oluştur", ta: "பயனரை உருவாக்கவும்", te: "వినియోగదారుని సృష్టించండి", ko: "사용자 만들기", vi: "Tạo người dùng", pl: "Utwórz użytkownika", ro: "Creează utilizator", nl: "Maak gebruiker", el: "Δημιουργία χρήστη", th: "สร้างผู้ใช้", cs: "Vytvořit uživatele", hu: "Felhasználó létrehozása", sv: "Skapa användare", da: "Opret bruger" })}
    </h1>
    <form className="grow flex flex-col"
      onSubmit={Events.preventDefault}>
      <input className="hidden"
        autoComplete="off"
        name="username" />
      <div className="h-6" />
      <div className="font-medium">
        {Lang.match({ en: "Name", zh: "名称", hi: "नाम", es: "Nombre", ar: "اسم", fr: "Nom", de: "Name", ru: "Имя", pt: "Nome", ja: "名前", pa: "ਨਾਮ", bn: "নাম", id: "Nama", ur: "نام", ms: "Nama", it: "Nome", tr: "İsim", ta: "பெயர்", te: "పేరు", ko: "이름", vi: "Tên", pl: "Nazwa", ro: "Nume", nl: "Naam", el: "Όνομα", th: "ชื่อ", cs: "Jméno", hu: "Név", sv: "Namn", da: "Navn" })}
      </div>
      <div className="text-default-contrast">
        {Lang.match({ en: "Will be used locally for display purposes.", zh: "将被本地使用，仅用于显示。", hi: "स्थानीय रूप से प्रदर्शन उद्देश्यों के लिए उपयोग किया जाएगा।", es: "Se usará localmente para fines de visualización.", ar: "سيتم استخدامه محليًا لأغراض العرض.", fr: "Sera utilisé localement à des fins d'affichage.", de: "Wird lokal für Anzeigezwecke verwendet.", ru: "Будет использоваться локально для отображения.", pt: "Será usado localmente para fins de exibição.", ja: "表示目的でローカルに使用されます。", pa: "ਡਿਸਪਲੇਅ ਦੇ ਉਦੇਸ਼ਾਂ ਲਈ ਸਥਾਨਕ ਤੌਰ 'ਤੇ ਵਰਤਿਆ ਜਾਵੇਗਾ।", bn: "প্রদর্শন উদ্দেশ্যে স্থানীয়ভাবে ব্যবহৃত হবে।", id: "Akan digunakan secara lokal untuk tujuan tampilan.", ur: "ڈسپلے کے مقاصد کے لیے مقامی طور پر استعمال کیا جائے گا۔", ms: "Akan digunakan secara lokal untuk tujuan tampilan.", it: "Sarà usato localmente per scopi di visualizzazione.", tr: "Görüntüleme amaçları için yerel olarak kullanılacaktır.", ta: "காட்சிப்படுத்தும் நோக்கங்களுக்காக உள்ளூரில் பயன்படுத்தப்படும்.", te: "ప్రదర్శన లక్ష్యాల కోసం స్థానికంగా ఉపయోగించబడుతుంది.", ko: "디스플레이 목적으로 로컬에서 사용됩니다.", vi: "Sẽ được sử dụng cục bộ cho mục đích hiển thị.", pl: "Będzie używany lokalnie do celów wyświetlania.", ro: "Va fi folosit local pentru scopuri de afișare.", nl: "Zal lokaal worden gebruikt voor weergavedoeleinden.", el: "Θα χρησιμοποιείται τοπικά για σκοπούς εμφάνισης.", th: "จะใช้ในพื้นที่สำหรับวัตถุประสงค์ในการแสดงผล", cs: "Bude používán lokálně pro zobrazení.", hu: "Helyileg lesz használva megjelenítési célokra.", sv: "Kommer att användas lokalt för visningsändamål.", da: "Vil blive brugt lokalt til visningsformål." })}
      </div>
      <div className="h-4" />
      <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
        <input className="w-full focus-visible:outline-none"
          autoComplete="off"
          placeholder="Satoshi"
          value={$name}
          onChange={e => setName(e.target.value)} />
      </div>
      <div className="h-6" />
      <div className="font-medium">
        {Lang.match({ en: "Password", zh: "密码", hi: "पासवर्ड", es: "Contraseña", ar: "كلمة المرور", fr: "Mot de passe", de: "Passwort", ru: "Пароль", pt: "Senha", ja: "パスワード", pa: "ਪਾਸਵਰਡ", bn: "পাসওয়ার্ড", id: "Kata sandi", ur: "پاس ورڈ", ms: "Kata sandi", it: "Password", tr: "Parola", ta: "கடவுச்சொல்", te: "పాస్వర్డ్", ko: "비밀번호", vi: "Mật khẩu", pl: "Hasło", ro: "Parolă", nl: "Wachtwoord", el: "Κωδικός πρόσβασης", th: "รหัสผ่าน", cs: "Heslo", hu: "Jelszó", sv: "Lösenord", da: "Adgangskode" })}
      </div>
      <div className="text-default-contrast">
        {Lang.match({ en: "A password to encrypt the created file.", zh: "用于加密创建的文件的密码。", hi: "बनाई गई फ़ाइल को एन्क्रिप्ट करने के लिए एक पासवर्ड।", es: "Una contraseña para cifrar el archivo creado.", ar: "كلمة مرور لتشفير الملف الذي تم إنشاؤه.", fr: "Un mot de passe pour chiffrer le fichier créé.", de: "Ein Passwort zum Verschlüsseln der erstellten Datei.", ru: "Пароль для шифрования созданного файла.", pt: "Uma senha para criptografar o arquivo criado.", ja: "作成されたファイルを暗号化するためのパスワード。", pa: "ਬਣਾਈ ਗਈ ਫਾਇਲ ਨੂੰ ਇੰਕ੍ਰਿਪਟ ਕਰਨ ਲਈ ਇੱਕ ਪਾਸਵਰਡ।", bn: "তৈরি করা ফাইলটি এনক্রিপ্ট করার জন্য একটি পাসওয়ার্ড।", id: "Kata sandi untuk mengenkripsi file yang dibuat.", ur: "بنائی گئی فائل کو انکرپٹ کرنے کے لیے ایک پاس ورڈ۔", ms: "Kata sandi untuk mengenkripsi file yang dibuat.", it: "Una password per crittografare il file creato.", tr: "Oluşturulan dosyayı şifrelemek için bir parola.", ta: "உருவாக்கப்பட்ட கோப்பை குறியாக்கம் செய்ய ஒரு கடவுச்சொல்.", te: "సృష్టించబడిన ఫైల్‌ను గుప్తీకరించడానికి ఒక పాస్వర్డ్.", ko: "생성된 파일을 암호화하기 위한 비밀번호입니다.", vi: "Mật khẩu để mã hóa tệp đã tạo.", pl: "Hasło do zaszyfrowania utworzonego pliku.", ro: "O parolă pentru a cripta fișerul creat.", nl: "Een wachtwoord om het gemaakte bestand te versleutelen.", el: "Ένας κωδικός πρόσβασης για την κρυπτογράφηση του δημιουργημένου αρχείου.", th: "รหัสผ่านเพื่อเข้ารหัสไฟล์ที่สร้างขึ้น", cs: "Heslo pro šifrování vytvořeného souboru.", hu: "Egy jelszó a létrehozott fájl titkosításához.", sv: "Ett lösenord för att kryptera den skapade filen.", da: "En adgangskode til at kryptere den oprettede fil." })}
      </div>
      <div className="h-4" />
      <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
        <input className="w-full focus-visible:outline-none"
          autoComplete="off"
          type={flipped ? "text" : "password"}
          value={$pass}
          onChange={e => setPass(e.target.value)} />
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
      <div className="h-8 grow" />
      <div className="flex items-center flex-wrap-reverse gap-2">
        {"showSaveFilePicker" in window === true &&
          <WideOppositeButton
            type="button"
            disabled={pickOrDisplay.running || error != null}
            onClick={pickOrDisplay.execute}>
            {pickOrDisplay.running === true && <Spinner className="size-6 animate-spin" />}
            {pickOrDisplay.running === false && (error != null ? error : Lang.match({ en: "Save", zh: "保存", hi: "सहेजें", es: "Guardar", ar: "حفظ", fr: "Enregistrer", de: "Speichern", ru: "Сохранить", pt: "Salvar", ja: "保存", pa: "ਸੰਭਾਲੋ", bn: "সংরক্ষণ করুন", id: "Simpan", ur: "محفوظ کریں", ms: "Simpan", it: "Salva", tr: "Kaydet", ta: "சேமிக்கவும்", te: "సేవ్ చేయండి", ko: "저장", vi: "Lưu", pl: "Zapisz", ro: "Salvează", nl: "Opslaan", el: "Αποθήκευση", th: "บันทึก", cs: "Uložit", hu: "Mentés", sv: "Spara", da: "Gem" }))}
          </WideOppositeButton>}
        {"showSaveFilePicker" in window === false &&
          <WideOppositeButton
            type="button"
            disabled={saveOrDisplay.running || error != null}
            onClick={saveOrDisplay.execute}>
            {saveOrDisplay.running === true && <Spinner className="size-6 animate-spin" />}
            {saveOrDisplay.running === false && (error != null ? error : Lang.match({ en: "Save", zh: "保存", hi: "सहेजें", es: "Guardar", ar: "حفظ", fr: "Enregistrer", de: "Speichern", ru: "Сохранить", pt: "Salvar", ja: "保存", pa: "ਸੰਭਾਲੋ", bn: "সংরক্ষণ করুন", id: "Simpan", ur: "محفوظ کریں", ms: "Simpan", it: "Salva", tr: "Kaydet", ta: "சேமிக்கவும்", te: "సేవ్ చేయండి", ko: "저장", vi: "Lưu", pl: "Zapisz", ro: "Salvează", nl: "Opslaan", el: "Αποθήκευση", th: "บันทึก", cs: "Uložit", hu: "Mentés", sv: "Spara", da: "Gem" }))}
          </WideOppositeButton>}
      </div>
    </form>
  </div>
}

function UserItem(props: { user: UserData } & { login(session: SessionData): void }) {
  const { user, login } = props

  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, `/${user.uuid}`)

  return <Fragment>
    <SubpathProvider value={hash}>
      {hash.url.pathname === `/${user.uuid}` &&
        <PathBoard>
          <UserLoginPage user={user} login={login} />
        </PathBoard>}
      {hash.url.pathname === `/${user.uuid}/+` &&
        <PathPaper>
          <UserMenu user={user} />
        </PathPaper>}
    </SubpathProvider>
    <div className="relative group flex-1 rounded-xl hover:bg-default-double-contrast [&:has(:focus-visible)]:bg-default-double-contrast">
      <a className="absolute inset-0 opacity-0 cursor-pointer"
        href={coords.url.hash}
        onClick={coords.onClick}
        onKeyDown={coords.onKeyDown} />
      <div className="po-2 flex items-center justify-start">
        <div className="flex items-center gap-4">
          <div className="rounded-full size-6 flex justify-center items-center border border-default-contrast bg-opposite text-opposite">
            {user.name.slice(0, 1).toUpperCase()}
          </div>
          {user.name}
        </div>
        <div className="w-8 grow" />
        <div className="flex items-center gap-2">
          <UserMenuButton user={user} />
        </div>
      </div>
    </div>
  </Fragment>
}

function UserLoginPage(props: { user: UserData } & { login(session: SessionData): void }) {
  const { user, login } = props

  const close = useCloseContext().getOrThrow()

  const [flipped, setFlipped] = useState(false)

  const [$pass, setPass] = useState("")

  const pass = useDeferredValue($pass)

  const [auth, setAuth] = useState<Nullable<Uint8Array<ArrayBuffer> & { length: 32 }>>()

  const [picker1, setPicker1] = useState<Nullable<HTMLInputElement>>()
  const [picker2, setPicker2] = useState<Nullable<HTMLInputElement>>()

  const [file1, setFile1] = useState<Nullable<File>>()
  const [file2, setFile2] = useState<Nullable<File>>()

  const loadOrDisplay1 = useCallback(() => Promise.try(async () => {
    if (file1 == null)
      return
    if (!pass)
      return

    const data = new Uint8Array(await file1.arrayBuffer())

    const composite = await KDBX.CompositeKey.digestOrThrow(await KDBX.PasswordKey.digestOrThrow(new TextEncoder().encode(pass)))
    const encrypted = Readable.readFromBytesOrThrow(KDBX.Database.Encrypted, data)
    const decrypted = await encrypted.decryptOrThrow(composite)

    login({ user, comp: composite, kdbx: decrypted })

    close()
  }).catch(Errors.display), [user, login, file1, pass, close])

  const loadOrDisplay2 = useCallback(() => Promise.try(async () => {
    if (file2 == null)
      return
    if (auth == null)
      return

    const data = new Uint8Array(await file2.arrayBuffer())

    const composite = new KDBX.CompositeKey(new Unknown(auth))
    const encrypted = Readable.readFromBytesOrThrow(KDBX.Database.Encrypted, data)
    const decrypted = await encrypted.decryptOrThrow(composite)

    login({ user, comp: composite, kdbx: decrypted })

    close()
  }).catch(Errors.display), [user, login, file2, auth, close])

  useEffect(() => {
    if (file1 == null)
      return
    if (!pass)
      return
    loadOrDisplay1().catch(console.error)
  }, [file1, pass, loadOrDisplay1])

  useEffect(() => {
    if (file2 == null)
      return
    if (auth == null)
      return
    loadOrDisplay2().catch(console.error)
  }, [file2, auth, loadOrDisplay2])

  const openOrDisplay1 = useCallback(() => Promise.try(async () => {
    if (user.fsfh == null)
      return
    if (!pass)
      return

    await user.fsfh.requestPermission({ mode: "readwrite" })

    const file = await user.fsfh.getFile()
    const data = new Uint8Array(await file.arrayBuffer())

    const composite = await KDBX.CompositeKey.digestOrThrow(await KDBX.PasswordKey.digestOrThrow(new TextEncoder().encode(pass)))
    const encrypted = Readable.readFromBytesOrThrow(KDBX.Database.Encrypted, data)
    const decrypted = await encrypted.decryptOrThrow(composite)

    login({ user, comp: composite, kdbx: decrypted })

    close()
  }).catch(Errors.display), [user, login, pass, close])

  const openOrDisplay2 = useCallback((stored: Uint8Array<ArrayBuffer> & { length: 32 }) => Promise.try(async () => {
    if (user.auth == null)
      return
    if (user.fsfh == null)
      return
    if (stored == null)
      return

    await user.fsfh.requestPermission({ mode: "readwrite" })

    const file = await user.fsfh.getFile()
    const data = new Uint8Array(await file.arrayBuffer())

    const composite = new KDBX.CompositeKey(new Unknown(stored))
    const encrypted = Readable.readFromBytesOrThrow(KDBX.Database.Encrypted, data)
    const decrypted = await encrypted.decryptOrThrow(composite)

    login({ user, comp: composite, kdbx: decrypted })

    close()
  }).catch(Errors.display), [user, login, auth, close])

  const onKeyDown = useCallback(async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter")
      return

    if (user.fsfh == null) {
      picker1!.click()
      return
    }

    await openOrDisplay1()
  }, [user, openOrDisplay1, picker1])

  const onPassClick = useCallback(async () => {
    if (user.auth == null)
      return

    if (user.fsfh == null) {
      picker2!.click()

      setAuth(await webAuthnStorage.getOrThrow(user.auth) as Uint8Array<ArrayBuffer> & { length: 32 })

      return
    }

    await openOrDisplay2(await webAuthnStorage.getOrThrow(user.auth) as Uint8Array<ArrayBuffer> & { length: 32 })
  }, [user, openOrDisplay2, picker2])

  return <div className="flex flex-col items-center justify-center grow p-6 py-24">
    <div className="rounded-full size-16 text-4xl flex justify-center items-center border border-default-contrast bg-opposite text-opposite">
      {user.name.slice(0, 1).toUpperCase()}
    </div>
    <div className="h-4" />
    <h1 className="text-xl font-medium">
      {user.name}
    </h1>
    <div className="h-6" />
    <form className="grow flex flex-col items-center"
      onSubmit={Events.preventDefault}>
      <input className="hidden"
        autoComplete="off"
        name="username" />
      <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
        <input className="w-full focus-visible:outline-none"
          autoComplete="off"
          type={flipped ? "text" : "password"}
          placeholder={Lang.match({ en: "Password", zh: "密码", hi: "पासवर्ड", es: "Contraseña", ar: "كلمة المرور", fr: "Mot de passe", de: "Passwort", ru: "Пароль", pt: "Senha", ja: "パスワード", pa: "ਪਾਸਵਰਡ", bn: "পাসওয়ার্ড", id: "Kata sandi", ur: "پاس ورڈ", ms: "Kata sandi", it: "Password", tr: "Parola", ta: "கடவுச்சொல்", te: "పాస్వర్డ్", ko: "비밀번호", vi: "Mật khẩu", pl: "Hasło", ro: "Parolă", nl: "Wachtwoord", el: "Κωδικός πρόσβασης", th: "รหัสผ่าน", cs: "Heslo", hu: "Jelszó", sv: "Lösenord", da: "Adgangskode" })}
          value={$pass}
          onChange={e => setPass(e.currentTarget.value)}
          onKeyDown={onKeyDown}
          ref={useAutoFocus()} />
        <div className="flex items-center gap-2">
          <button className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none"
            type="button"
            onClick={() => setFlipped(x => !x)}>
            <InButton>
              {flipped ? <Outline.EyeSlashIcon className="size-5" /> : <Outline.EyeIcon className="size-5" />}
            </InButton>
          </button>
          {user.auth != null &&
            <button className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none"
              type="button"
              onClick={onPassClick}>
              <InButton>
                <Outline.FingerPrintIcon className="size-5" />
              </InButton>
            </button>}
        </div>
      </div>
      {user.fsfh == null &&
        <input className="hidden"
          type="file"
          accept="application/octet-stream,.kdbx"
          onChange={e => setFile1(e.currentTarget.files?.[0])}
          ref={setPicker1} />}
      {user.fsfh == null &&
        <input className="hidden"
          type="file"
          accept="application/octet-stream,.kdbx"
          onChange={e => setFile2(e.currentTarget.files?.[0])}
          ref={setPicker2} />}
    </form>
  </div>
}

function UserMenuButton(props: { user: UserData }) {
  const { user } = props

  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, `/${user.uuid}/+`)

  return <a className="group z-10 rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none"
    href={coords.url.hash}
    onClick={coords.onClick}
    onKeyDown={coords.onKeyDown}>
    <InOther>
      <Outline.EllipsisVerticalIcon className="size-6" />
    </InOther>
  </a>
}

function UserMenu(props: { user: UserData }) {
  const { user } = props

  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  return <Fragment>
    <SubpathProvider value={hash}>
      {hash.url.pathname === "/reimport" &&
        <PathBoard>
          {"showOpenFilePicker" in window === true &&
            <UserReimportFsfhPage user={user} />}
          {"showOpenFilePicker" in window === false &&
            <UserReimportFilePage user={user} />}
        </PathBoard>}
    </SubpathProvider>
    <div className="flex flex-col text-left gap-2">
      <UserReimportButton />
      <UserRemoveButton user={user} />
    </div>
  </Fragment>
}

function UserReimportButton() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, "/reimport")

  return <WideNakedMenuAnchor
    href={coords.url.hash}
    onClick={coords.onClick}
    onKeyDown={coords.onKeyDown}>
    <Outline.ArrowDownOnSquareIcon className="size-5" />
    {Lang.match({ en: "Reimport", zh: "重新导入", hi: "पुनः आयात करें", es: "Reimportar", ar: "إعادة الاستيراد", fr: "Réimporter", de: "Neu importieren", ru: "Повторный импорт", pt: "Reimportar", ja: "再インポート", pa: "ਮੁੜ ਆਯਾਤ ਕਰੋ", bn: "পুনরায় আমদানি করুন", id: "Impor ulang", ur: "دوبارہ درآمد کریں", ms: "Impor ulang", it: "Reimporta", tr: "Yeniden içe aktar", ta: "மீண்டும் இறக்குமதி செய்யவும்", te: "మళ్లీ దిగుమతి చేయండి", ko: "다시 가져오기", vi: "Nhập lại", pl: "Ponowny import", ro: "Reimportați", nl: "Opnieuw importeren", el: "Επαναεισαγωγή", th: "นำเข้าใหม่", cs: "Znovu importovat", hu: "Újraimportálás", sv: "Importera om", da: "Genimporter" })}
  </WideNakedMenuAnchor>
}

function UserReimportFilePage(props: { user: UserData }) {
  const { user } = props

  const close = useCloseContext().getOrThrow()
  const store = useStoreContext().getOrThrow()

  const [flipped, setFlipped] = useState(false)

  const [$name, setName] = useState(user.name)
  const [$pass, setPass] = useState("")

  const name = useDeferredValue($name || "Satoshi")
  const pass = useDeferredValue($pass)

  const [file, setFile] = useState<Nullable<File>>()

  const loadOrDisplay = useSubmit(() => Promise.try(async () => {
    if (file == null)
      return

    const data = new Uint8Array(await file.arrayBuffer())

    const encrypted = Readable.readFromBytesOrThrow(KDBX.Database.Encrypted, data)
    const composite = await KDBX.CompositeKey.digestOrThrow(await KDBX.PasswordKey.digestOrThrow(new TextEncoder().encode(pass)))

    await encrypted.decryptOrThrow(composite)

    const uuid = user.uuid

    const auth = await Result.runAndWrap(async () => {
      return await webAuthnStorage.createOrThrow(uuid.slice(0, 8), composite.value.bytes)
    }).then(r => r.inspectErrSync(console.log).getOrNull())

    const stale = await store.value.getOrThrow().getOrThrow<Array<UserData>>("users") || []

    const fresh = stale.map(x => x.uuid === user.uuid ? { uuid, name, auth } : x)

    await store.value.getOrThrow().setOrThrow("users", fresh)

    store.update()

    close()
  }).catch(Errors.display), [user, store, name, file, pass, close])

  const error = useMemo(() => {
    if (file == null)
      return Lang.match({ en: "File is required", zh: "文件是必需的", hi: "फ़ाइल आवश्यक है", es: "Se requiere archivo", ar: "الملف مطلوب", fr: "Le fichier est requis", de: "Datei ist erforderlich", ru: "Требуется файл", pt: "Arquivo é obrigatório", ja: "ファイルが必要です", pa: "ਫਾਇਲ ਲੋੜੀਂਦੀ ਹੈ", bn: "ফাইল প্রয়োজন", id: "Berkas diperlukan", ur: "فائل ضروری ہے", ms: "Berkas diperlukan", it: "Il file è richiesto", tr: "Dosya gereklidir", ta: "கோப்பு தேவை", te: "ఫైల్ అవసరం", ko: "파일이 필요합니다.", vi: "Cần tệp tin.", pl: "Plik jest wymagany.", ro: "Fișierul este necesar.", nl: "Bestand is vereist.", el: "Το αρχείο είναι απαραίτητο.", th: "ต้องการไฟล์", cs: "Soubor je povinný.", hu: "A fájl szükséges.", sv: "Fil krävs.", da: "Fil er påkrævet." })
    if (!pass.length)
      return Lang.match({ en: "Password is required", zh: "密码是必需的", hi: "पासवर्ड आवश्यक है", es: "Se requiere contraseña", ar: "كلمة المرور مطلوبة", fr: "Le mot de passe est requis", de: "Passwort ist erforderlich", ru: "Требуется пароль", pt: "Senha é obrigatória", ja: "パスワードが必要です", pa: "ਪਾਸਵਰਡ ਲੋੜੀਂਦਾ ਹੈ", bn: "পাসওয়ার্ড প্রয়োজন", id: "Kata sandi diperlukan", ur: "پاس ورڈ ضروری ہے", ms: "Kata sandi diperlukan", it: "La password è richiesta", tr: "Parola gereklidir", ta: "கடவுச்சொல் தேவை", te: "పాస్వర్డ్ అవసరం", ko: "비밀번호가 필요합니다.", vi: "Cần mật khẩu.", pl: "Hasło jest wymagane.", ro: "Parola este necesară.", nl: "Wachtwoord is vereist.", el: "Ο κωδικός πρόσβασης είναι απαραίτητος.", th: "ต้องการรหัสผ่าน", cs: "Heslo je povinné.", hu: "A jelszó szükséges.", sv: "Lösenord krävs.", da: "Adgangskode er påkrævet." })
    return
  }, [file, pass])

  return <div className="flex flex-col grow p-6">
    <h1 className="text-xl font-medium">
      {Lang.match({ en: "Reimport user", zh: "重新导入用户", hi: "उपयोगकर्ता को पुनः आयात करें", es: "Reimportar usuario", ar: "إعادة استيراد المستخدم", fr: "Réimporter l'utilisateur", de: "Benutzer erneut importieren", ru: "Повторный импорт пользователя", pt: "Reimportar usuário", ja: "ユーザーを再インポート", pa: "ਉਪਭੋਗਤਾ ਨੂੰ ਦੁਬਾਰਾ ਆਯਾਤ ਕਰੋ", bn: "ব্যবহারকারী পুনরায় আমদানি করুন", id: "Impor ulang pengguna", ur: "صارف کو دوبارہ درآمد کریں", ms: "Impor ulang pengguna", it: "Reimporta utente", tr: "Kullanıcıyı yeniden içe aktar", ta: "பயனரை மீண்டும் இறக்குமதி செய்க", te: "వినియోగదారుని మళ్లీ దిగుమతి చేయండి", ko: "사용자 재수입", vi: "Nhập lại người dùng", pl: "Ponowny import użytkownika", ro: "Reimportă utilizatorul", nl: "Gebruiker opnieuw importeren", el: "Επαναφορά χρήστη", th: "นำเข้าผู้ใช้ใหม่", cs: "Znovu importovat uživatele", hu: "Felhasználó újraimportálása", sv: "Importera om användare", da: "Genimporter bruger" })}
    </h1>
    <form className="grow flex flex-col"
      onSubmit={Events.preventDefault}>
      <input className="hidden"
        autoComplete="off"
        name="username" />
      <div className="h-6" />
      <div className="font-medium">
        {Lang.match({ en: "Name", zh: "名称", hi: "नाम", es: "Nombre", ar: "اسم", fr: "Nom", de: "Name", ru: "Имя", pt: "Nome", ja: "名前", pa: "ਨਾਮ", bn: "নাম", id: "Nama", ur: "نام", ms: "Nama", it: "Nome", tr: "İsim", ta: "பெயர்", te: "పేరు", ko: "이름", vi: "Tên", pl: "Nazwa", ro: "Nume", nl: "Naam", el: "Όνομα", th: "ชื่อ", cs: "Jméno", hu: "Név", sv: "Namn", da: "Navn" })}
      </div>
      <div className="text-default-contrast">
        {Lang.match({ en: "Will be used locally for display purposes.", zh: "将被本地使用，仅用于显示。", hi: "स्थानीय रूप से प्रदर्शन उद्देश्यों के लिए उपयोग किया जाएगा।", es: "Se usará localmente para fines de visualización.", ar: "سيتم استخدامه محليًا لأغراض العرض.", fr: "Sera utilisé localement à des fins d'affichage.", de: "Wird lokal für Anzeigezwecke verwendet.", ru: "Будет использоваться локально для отображения.", pt: "Será usado localmente para fins de exibição.", ja: "表示目的でローカルに使用されます。", pa: "ਡਿਸਪਲੇਅ ਦੇ ਉਦੇਸ਼ਾਂ ਲਈ ਸਥਾਨਕ ਤੌਰ 'ਤੇ ਵਰਤਿਆ ਜਾਵੇਗਾ।", bn: "প্রদর্শন উদ্দেশ্যে স্থানীয়ভাবে ব্যবহৃত হবে।", id: "Akan digunakan secara lokal untuk tujuan tampilan.", ur: "ڈسپلے کے مقاصد کے لیے مقامی طور پر استعمال کیا جائے گا۔", ms: "Akan digunakan secara lokal untuk tujuan tampilan.", it: "Sarà usato localmente per scopi di visualizzazione.", tr: "Görüntüleme amaçları için yerel olarak kullanılacaktır.", ta: "காட்சிப்படுத்தும் நோக்கங்களுக்காக உள்ளூரில் பயன்படுத்தப்படும்.", te: "ప్రదర్శన లక్ష్యాల కోసం స్థానికంగా ఉపయోగించబడుతుంది.", ko: "디스플레이 목적으로 로컬에서 사용됩니다.", vi: "Sẽ được sử dụng cục bộ cho mục đích hiển thị.", pl: "Będzie używany lokalnie do celów wyświetlania.", ro: "Va fi folosit local pentru scopuri de afișare.", nl: "Zal lokaal worden gebruikt voor weergavedoeleinden.", el: "Θα χρησιμοποιείται τοπικά για σκοπούς εμφάνισης.", th: "จะใช้ในพื้นที่สำหรับวัตถุประสงค์ในการแสดงผล", cs: "Bude používán lokálně pro zobrazení.", hu: "Helyileg lesz használva megjelenítési célokra.", sv: "Kommer att användas lokalt för visningsändamål.", da: "Vil blive brugt lokalt til visningsformål." })}
      </div>
      <div className="h-4" />
      <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
        <input className="w-full focus-visible:outline-none"
          autoComplete="off"
          placeholder="Satoshi"
          value={$name}
          onChange={e => setName(e.target.value)} />
      </div>
      <div className="h-6" />
      <div className="font-medium">
        {Lang.match({ en: "File", zh: "文件", hi: "फ़ाइल", es: "Archivo", ar: "ملف", fr: "Fichier", de: "Datei", ru: "Файл", pt: "Arquivo", ja: "ファイル", pa: "ਫਾਇਲ", bn: "ফাইল", id: "Berkas", ur: "فائل", ms: "Berkas", it: "File", tr: "Dosya", ta: "கோப்பு", te: "ఫైల్", ko: "파일", vi: "Tệp", pl: "Plik", ro: "Fișier", nl: "Bestand", el: "Αρχείο", th: "ไฟล์", cs: "Soubor", hu: "Fájl", sv: "Fil", da: "Fil" })}
      </div>
      <div className="text-default-contrast">
        {Lang.match({ en: "Your existing KDBX file.", zh: "您现有的 KDBX 文件。", hi: "आपकी मौजूदा KDBX फ़ाइल।", es: "Su archivo KDBX existente.", ar: "ملف KDBX الحالي الخاص بك.", fr: "Votre fichier KDBX existant.", de: "Ihre vorhandene KDBX-Datei.", ru: "Ваш существующий файл KDBX.", pt: "Seu arquivo KDBX existente.", ja: "既存の KDBX ファイル。", pa: "ਤੁਹਾਡੀ ਮੌਜੂਦਾ KDBX ਫਾਇਲ।", bn: "আপনার বিদ্যমান KDBX ফাইল।", id: "File KDBX Anda yang ada.", ur: "آپ کی موجودہ KDBX فائل۔", ms: "File KDBX Anda yang ada.", it: "Il tuo file KDBX esistente.", tr: "Mevcut KDBX dosyanız.", ta: "உங்கள் தற்போதைய KDBX கோப்பு.", te: "మీ ప్రస్తుత KDBX ఫైల్.", ko: "기존 KDBX 파일입니다.", vi: "Tệp KDBX hiện có của bạn.", pl: "Twój istniejący plik KDBX.", ro: "Fișierul KDBX existent.", nl: "Uw bestaande KDBX-bestand.", el: "Το υπάρχον αρχείο KDBX σας.", th: "ไฟล์ KDBX ที่มีอยู่ของคุณ", cs: "Váš stávající soubor KDBX.", hu: "A meglévő KDBX fájlod.", sv: "Din befintliga KDBX-fil.", da: "Din eksisterende KDBX-fil." })}
      </div>
      <div className="h-4" />
      <div className="relative bg-default-contrast rounded-xl [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
        <input className="absolute inset-0 opacity-0 cursor-pointer"
          type="file"
          accept="application/octet-stream,.kdbx"
          onChange={e => setFile(e.target.files?.item(0))} />
        {file != null &&
          <div className="po-2">
            {file.name}
          </div>}
        {file == null &&
          <div className="po-2">
            {Lang.match({ en: "Pick or drop file here", zh: "在此处选择或拖放文件", hi: "यहां फ़ाइल चुनें या ड्रॉप करें", es: "Seleccione o suelte el archivo aquí", ar: "اختر أو اسقط الملف هنا", fr: "Choisissez ou déposez le fichier ici", de: "Datei hier auswählen oder ablegen", ru: "Выберите или перетащите файл сюда", pt: "Escolha ou solte o arquivo aqui", ja: "ここでファイルを選択またはドロップ", pa: "ਇੱਥੇ ਫਾਇਲ ਚੁਣੋ ਜਾਂ ਡਰੌਪ ਕਰੋ", bn: "এখানে ফাইল নির্বাচন করুন বা ড্রপ করুন", id: "Pilih atau jatuhkan file di sini", ur: "فائل یہاں منتخب کریں یا ڈراپ کریں", ms: "Pilih atau jatuhkan file di sini", it: "Scegli o trascina il file qui", tr: "Dosyayı buraya seçin veya bırakın", ta: "கோப்பை இங்கே தேர்ந்தெடுக்கவும் அல்லது விடவும்", te: "ఫైల్‌ను ఇక్కడ ఎంచుకోండి లేదా డ్రాప్ చేయండి", ko: "여기에 파일을 선택하거나 드롭하세요", vi: "Chọn hoặc thả tệp ở đây", pl: "Wybierz lub upuść plik tutaj", ro: "Alegeți sau aruncați fișierul aici", nl: "Kies of drop het bestand hier", el: "Επιλέξτε ή ρίξτε το αρχείο εδώ", th: "เลือกหรือวางไฟล์ที่นี่", cs: "Vyberte nebo přetáhněte soubor sem", hu: "Válassza ki vagy dobja ide a fájlt", sv: "Välj eller släpp filen här", da: "Vælg eller slip filen her" })}
          </div>}
      </div>
      <div className="h-6" />
      <div className="font-medium">
        {Lang.match({ en: "Password", zh: "密码", hi: "पासवर्ड", es: "Contraseña", ar: "كلمة المرور", fr: "Mot de passe", de: "Passwort", ru: "Пароль", pt: "Senha", ja: "パスワード", pa: "ਪਾਸਵਰਡ", bn: "পাসওয়ার্ড", id: "Kata sandi", ur: "پاس ورڈ", ms: "Kata sandi", it: "Password", tr: "Parola", ta: "கடவுச்சொல்", te: "పాస్వర్డ్", ko: "비밀번호", vi: "Mật khẩu", pl: "Hasło", ro: "Parolă", nl: "Wachtwoord", el: "Κωδικός πρόσβασης", th: "รหัสผ่าน", cs: "Heslo", hu: "Jelszó", sv: "Lösenord", da: "Adgangskode" })}
      </div>
      <div className="text-default-contrast">
        {Lang.match({ en: "Your existing password to decrypt the file.", zh: "用于解密文件的现有密码。", hi: "फ़ाइल को डिक्रिप्ट करने के लिए आपका मौजूदा पासवर्ड।", es: "Su contraseña existente para descifrar el archivo.", ar: "كلمة المرور الحالية الخاصة بك لفك تشفير الملف.", fr: "Votre mot de passe existant pour déchiffrer le fichier.", de: "Ihr vorhandenes Passwort zum Entschlüsseln der Datei.", ru: "Ваш существующий пароль для расшифровки файла.", pt: "Sua senha existente para descriptografar o arquivo.", ja: "ファイルを復号化するための既存のパスワード。", pa: "ਫਾਇਲ ਨੂੰ ਡਿਕ੍ਰਿਪਟ ਕਰਨ ਲਈ ਤੁਹਾਡਾ ਮੌਜੂਦਾ ਪਾਸਵਰਡ।", bn: "ফাইল ডিক্রিপ্ট করতে আপনার বিদ্যমান পাসওয়ার্ড।", id: "Kata sandi Anda yang ada untuk mendekripsi file.", ur: "فائل کو ڈی کرپٹ کرنے کے لیے آپ کا موجودہ پاس ورڈ۔", ms: "Kata sandi sedia ada anda untuk menyahsulit fail.", it: "La tua password esistente per decrittografare il file.", tr: "Dosyayı çözmek için mevcut şifreniz.", ta: "கோப்பை டிக்ரிப்ட் செய்ய உங்கள் தற்போதைய கடவுச்சொல்.", te: "ఫైల్‌ను డీక్రిప్ట్ చేయడానికి మీ ప్రస్తుత పాస్వర్డ్.", ko: "파일을 복호화하기 위한 기존 비밀번호입니다.", vi: "Mật khẩu hiện có của bạn để giải mã tệp.", pl: "Twoje istniejące hasło do odszyfrowania pliku.", ro: "Parola dvs. existentă pentru a decripta fișierul.", nl: "Uw bestaande wachtwoord om het bestand te ontsleutelen.", el: "Ο υπάρχων κωδικός πρόσβασής σας για την αποκρυπτογράφηση του αρχείου.", th: "รหัสผ่านที่มีอยู่ของคุณเพื่อถอดรหัสไฟล์", cs: "Vaše stávající heslo pro dešifrování souboru.", hu: "A meglévő jelszavad a fájl dekódolásához.", sv: "Ditt befintliga lösenord för att dekryptera filen.", da: "Din eksisterende adgangskode til at dekryptere filen." })}
      </div>
      <div className="h-4" />
      <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
        <input className="w-full focus-visible:outline-none"
          autoComplete="off"
          type={flipped ? "text" : "password"}
          value={$pass}
          onChange={e => setPass(e.target.value)} />
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
      <div className="h-8 grow" />
      <div className="flex items-center flex-wrap-reverse gap-2">
        <WideOppositeButton
          type="button"
          disabled={loadOrDisplay.running || error != null}
          onClick={loadOrDisplay.execute}>
          {loadOrDisplay.running === true && <Spinner className="size-6 animate-spin" />}
          {loadOrDisplay.running === false && (error != null ? error : Lang.match({ en: "Open", zh: "打开", hi: "खोलें", es: "Abrir", ar: "فتح", fr: "Ouvrir", de: "Öffnen", ru: "Открыть", pt: "Abrir", ja: "開く", pa: "ਖੋਲ੍ਹੋ", bn: "খুলুন", id: "Buka", ur: "کھولیں", ms: "Buka", it: "Apri", tr: "Aç", ta: "திறக்கவும்", te: "తెరవండి", ko: "열기", vi: "Mở", pl: "Otwórz", ro: "Deschideți", nl: "Openen", el: "Άνοιγμα", th: "เปิดไฟล์", cs: "Otevřít", hu: "Megnyitás", sv: "Öppna", da: "Åbn" }))}
        </WideOppositeButton>
      </div>
    </form>
  </div>
}

function UserReimportFsfhPage(props: { user: UserData }) {
  const { user } = props

  const close = useCloseContext().getOrThrow()
  const store = useStoreContext().getOrThrow()

  const [flipped, setFlipped] = useState(false)

  const [$name, setName] = useState(user.name)
  const [$pass, setPass] = useState("")

  const name = useDeferredValue($name || "Satoshi")
  const pass = useDeferredValue($pass)

  const [fsfh, setFsfh] = useState<Nullable<FileSystemFileHandle>>(user.fsfh)

  const pickOrDisplay = useCallback(() => Promise.try(async () => {
    const [fsfh] = await window.showOpenFilePicker!({ id: "root", startIn: "documents", types: [{ description: "KDBX", accept: { "application/kdbx": [".kdbx"] } }] })

    if (fsfh == null)
      return
    if (fsfh.kind !== "file")
      return

    setFsfh(fsfh)
  }).catch(Errors.display), [])

  const dropOrDisplay = useCallback((e: DragEvent<HTMLButtonElement>) => Promise.try(async () => {
    e.preventDefault()

    const [item] = e.dataTransfer.items as unknown as Iterable<DataTransferItem>

    const fsfh = await item.getAsFileSystemHandle!()

    if (fsfh.kind !== "file")
      return

    setFsfh(fsfh)
  }).catch(Errors.display), [])

  const openOrDisplay = useSubmit(() => Promise.try(async () => {
    if (fsfh == null)
      return

    const file = await fsfh.getFile()
    const data = new Uint8Array(await file.arrayBuffer())

    const encrypted = Readable.readFromBytesOrThrow(KDBX.Database.Encrypted, data)
    const composite = await KDBX.CompositeKey.digestOrThrow(await KDBX.PasswordKey.digestOrThrow(new TextEncoder().encode(pass)))

    await encrypted.decryptOrThrow(composite)

    const uuid = user.uuid

    const auth = await Result.runAndWrap(async () => {
      return await webAuthnStorage.createOrThrow(uuid.slice(0, 8), composite.value.bytes)
    }).then(r => r.inspectErrSync(console.log).getOrNull())

    const stale = await store.value.getOrThrow().getOrThrow<Array<UserData>>("users") || []

    const fresh = stale.map(x => x.uuid === user.uuid ? { uuid, name, fsfh, auth } : x)

    await store.value.getOrThrow().setOrThrow("users", fresh)

    store.update()

    close()
  }).catch(Errors.display), [user, store, name, fsfh, pass, close])

  const error = useMemo(() => {
    if (fsfh == null)
      return Lang.match({ en: "File is required", zh: "文件是必需的", hi: "फ़ाइल आवश्यक है", es: "Se requiere archivo", ar: "الملف مطلوب", fr: "Le fichier est requis", de: "Datei ist erforderlich", ru: "Требуется файл", pt: "Arquivo é obrigatório", ja: "ファイルが必要です", pa: "ਫਾਇਲ ਲੋੜੀਂਦੀ ਹੈ", bn: "ফাইল প্রয়োজন", id: "Berkas diperlukan", ur: "فائل ضروری ہے", ms: "Berkas diperlukan", it: "Il file è richiesto", tr: "Dosya gereklidir", ta: "கோப்பு தேவை", te: "ఫైల్ అవసరం", ko: "파일이 필요합니다.", vi: "Cần tệp tin.", pl: "Plik jest wymagany.", ro: "Fișierul este necesar.", nl: "Bestand is vereist.", el: "Το αρχείο είναι απαραίτητο.", th: "ต้องการไฟล์", cs: "Soubor je povinný.", hu: "A fájl szükséges.", sv: "Fil krävs.", da: "Fil er påkrævet." })
    if (!pass.length)
      return Lang.match({ en: "Password is required", zh: "密码是必需的", hi: "पासवर्ड आवश्यक है", es: "Se requiere contraseña", ar: "كلمة المرور مطلوبة", fr: "Le mot de passe est requis", de: "Passwort ist erforderlich", ru: "Требуется пароль", pt: "Senha é obrigatória", ja: "パスワードが必要です", pa: "ਪਾਸਵਰਡ ਲੋੜੀਂਦਾ ਹੈ", bn: "পাসওয়ার্ড প্রয়োজন", id: "Kata sandi diperlukan", ur: "پاس ورڈ ضروری ہے", ms: "Kata sandi diperlukan", it: "La password è richiesta", tr: "Parola gereklidir", ta: "கடவுச்சொல் தேவை", te: "పాస్వర్డ్ అవసరం", ko: "비밀번호가 필요합니다.", vi: "Cần mật khẩu.", pl: "Hasło jest wymagane.", ro: "Parola este necesară.", nl: "Wachtwoord is vereist.", el: "Ο κωδικός πρόσβασης είναι απαραίτητος.", th: "ต้องการรหัสผ่าน", cs: "Heslo je povinné.", hu: "A jelszó szükséges.", sv: "Lösenord krävs.", da: "Adgangskode er påkrævet." })
    return
  }, [fsfh, pass])

  return <div className="flex flex-col grow p-6">
    <h1 className="text-xl font-medium">
      {Lang.match({ en: "Reimport user", zh: "重新导入用户", hi: "उपयोगकर्ता को पुनः आयात करें", es: "Reimportar usuario", ar: "إعادة استيراد المستخدم", fr: "Réimporter l'utilisateur", de: "Benutzer erneut importieren", ru: "Повторный импорт пользователя", pt: "Reimportar usuário", ja: "ユーザーを再インポート", pa: "ਉਪਭੋਗਤਾ ਨੂੰ ਦੁਬਾਰਾ ਆਯਾਤ ਕਰੋ", bn: "ব্যবহারকারী পুনরায় আমদানি করুন", id: "Impor ulang pengguna", ur: "صارف کو دوبارہ درآمد کریں", ms: "Impor ulang pengguna", it: "Reimporta utente", tr: "Kullanıcıyı yeniden içe aktar", ta: "பயனரை மீண்டும் இறக்குமதி செய்க", te: "వినియోగదారుని మళ్లీ దిగుమతి చేయండి", ko: "사용자 재가져오기", vi: "Nhập lại người dùng", pl: "Ponownie zaimportuj użytkownika", ro: "Reimportați utilizatorul", nl: "Gebruiker opnieuw importeren", el: "Επαναφορά χρήστη", th: "นำเข้าผู้ใช้ใหม่อีกครั้ง", cs: "Znovu importovat uživatele", hu: "Felhasználó újraimportálása", sv: "Importera om användare", da: "Genimporter bruger" })}
    </h1>
    <form className="grow flex flex-col"
      onSubmit={Events.preventDefault}>
      <input className="hidden"
        autoComplete="off"
        name="username" />
      <div className="h-6" />
      <div className="font-medium">
        {Lang.match({ en: "Name", zh: "名称", hi: "नाम", es: "Nombre", ar: "اسم", fr: "Nom", de: "Name", ru: "Имя", pt: "Nome", ja: "名前", pa: "ਨਾਮ", bn: "নাম", id: "Nama", ur: "نام", ms: "Nama", it: "Nome", tr: "İsim", ta: "பெயர்", te: "పేరు", ko: "이름", vi: "Tên", pl: "Nazwa", ro: "Nume", nl: "Naam", el: "Όνομα", th: "ชื่อ", cs: "Jméno", hu: "Név", sv: "Namn", da: "Navn" })}
      </div>
      <div className="text-default-contrast">
        {Lang.match({ en: "Will be used locally for display purposes.", zh: "将被本地使用，仅用于显示。", hi: "स्थानीय रूप से प्रदर्शन उद्देश्यों के लिए उपयोग किया जाएगा।", es: "Se usará localmente para fines de visualización.", ar: "سيتم استخدامه محليًا لأغراض العرض.", fr: "Sera utilisé localement à des fins d'affichage.", de: "Wird lokal für Anzeigezwecke verwendet.", ru: "Будет использоваться локально для отображения.", pt: "Será usado localmente para fins de exibição.", ja: "表示目的でローカルに使用されます。", pa: "ਡਿਸਪਲੇਅ ਦੇ ਉਦੇਸ਼ਾਂ ਲਈ ਸਥਾਨਕ ਤੌਰ 'ਤੇ ਵਰਤਿਆ ਜਾਵੇਗਾ।", bn: "প্রদর্শন উদ্দেশ্যে স্থানীয়ভাবে ব্যবহৃত হবে।", id: "Akan digunakan secara lokal untuk tujuan tampilan.", ur: "ڈسپلے کے مقاصد کے لیے مقامی طور پر استعمال کیا جائے گا۔", ms: "Akan digunakan secara lokal untuk tujuan tampilan.", it: "Sarà usato localmente per scopi di visualizzazione.", tr: "Görüntüleme amaçları için yerel olarak kullanılacaktır.", ta: "காட்சிப்படுத்தும் நோக்கங்களுக்காக உள்ளூரில் பயன்படுத்தப்படும்.", te: "ప్రదర్శన లక్ష్యాల కోసం స్థానికంగా ఉపయోగించబడుతుంది.", ko: "디스플레이 목적으로 로컬에서 사용됩니다.", vi: "Sẽ được sử dụng cục bộ cho mục đích hiển thị.", pl: "Będzie używany lokalnie do celów wyświetlania.", ro: "Va fi folosit local pentru scopuri de afișare.", nl: "Zal lokaal worden gebruikt voor weergavedoeleinden.", el: "Θα χρησιμοποιείται τοπικά για σκοπούς εμφάνισης.", th: "จะใช้ในพื้นที่สำหรับวัตถุประสงค์ในการแสดงผล", cs: "Bude používán lokálně pro zobrazení.", hu: "Helyileg lesz használva megjelenítési célokra.", sv: "Kommer att användas lokalt för visningsändamål.", da: "Vil blive brugt lokalt til visningsformål." })}
      </div>
      <div className="h-4" />
      <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
        <input className="w-full focus-visible:outline-none"
          autoComplete="off"
          placeholder="Satoshi"
          value={$name}
          onChange={e => setName(e.target.value)} />
      </div>
      <div className="h-6" />
      <div className="font-medium">
        {Lang.match({ en: "File", zh: "文件", hi: "फ़ाइल", es: "Archivo", ar: "ملف", fr: "Fichier", de: "Datei", ru: "Файл", pt: "Arquivo", ja: "ファイル", pa: "ਫਾਇਲ", bn: "ফাইল", id: "Berkas", ur: "فائل", ms: "Berkas", it: "File", tr: "Dosya", ta: "கோப்பு", te: "ఫైల్", ko: "파일", vi: "Tệp", pl: "Plik", ro: "Fișier", nl: "Bestand", el: "Αρχείο", th: "ไฟล์", cs: "Soubor", hu: "Fájl", sv: "Fil", da: "Fil" })}
      </div>
      <div className="text-default-contrast">
        {Lang.match({ en: "Your existing KDBX file.", zh: "您现有的 KDBX 文件。", hi: "आपकी मौजूदा KDBX फ़ाइल।", es: "Su archivo KDBX existente.", ar: "ملف KDBX الحالي الخاص بك.", fr: "Votre fichier KDBX existant.", de: "Ihre vorhandene KDBX-Datei.", ru: "Ваш существующий файл KDBX.", pt: "Seu arquivo KDBX existente.", ja: "既存の KDBX ファイル。", pa: "ਤੁਹਾਡੀ ਮੌਜੂਦਾ KDBX ਫਾਇਲ।", bn: "আপনার বিদ্যমান KDBX ফাইল।", id: "File KDBX Anda yang ada.", ur: "آپ کی موجودہ KDBX فائل۔", ms: "File KDBX Anda yang ada.", it: "Il tuo file KDBX esistente.", tr: "Mevcut KDBX dosyanız.", ta: "உங்கள் தற்போதைய KDBX கோப்பு.", te: "మీ ప్రస్తుత KDBX ఫైల్.", ko: "기존 KDBX 파일입니다.", vi: "Tệp KDBX hiện có của bạn.", pl: "Twój istniejący plik KDBX.", ro: "Fișierul KDBX existent.", nl: "Uw bestaande KDBX-bestand.", el: "Το υπάρχον αρχείο KDBX σας.", th: "ไฟล์ KDBX ที่มีอยู่ของคุณ", cs: "Váš stávající soubor KDBX.", hu: "A meglévő KDBX fájlod.", sv: "Din befintliga KDBX-fil.", da: "Din eksisterende KDBX-fil." })}
      </div>
      <div className="h-4" />
      <div className="relative bg-default-contrast rounded-xl [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
        {"showOpenFilePicker" in window === true &&
          <button className="absolute inset-0 opacity-0 cursor-pointer"
            type="button"
            onClick={pickOrDisplay}
            onDragOver={Events.preventDefault}
            onDrop={dropOrDisplay} />}
        {fsfh != null &&
          <div className="po-2">
            {fsfh.name}
          </div>}
        {fsfh == null &&
          <div className="po-2">
            {Lang.match({ en: "Pick or drop file here", zh: "在此处选择或拖放文件", hi: "यहां फ़ाइल चुनें या ड्रॉप करें", es: "Seleccione o suelte el archivo aquí", ar: "اختر أو اسقط الملف هنا", fr: "Choisissez ou déposez le fichier ici", de: "Datei hier auswählen oder ablegen", ru: "Выберите или перетащите файл сюда", pt: "Escolha ou solte o arquivo aqui", ja: "ここでファイルを選択またはドロップ", pa: "ਇੱਥੇ ਫਾਇਲ ਚੁਣੋ ਜਾਂ ਡਰੌਪ ਕਰੋ", bn: "এখানে ফাইল নির্বাচন করুন বা ড্রপ করুন", id: "Pilih atau jatuhkan file di sini", ur: "فائل یہاں منتخب کریں یا ڈراپ کریں", ms: "Pilih atau jatuhkan file di sini", it: "Scegli o trascina il file qui", tr: "Dosyayı buraya seçin veya bırakın", ta: "கோப்பை இங்கே தேர்ந்தெடுக்கவும் அல்லது விடவும்", te: "ఫైల్‌ను ఇక్కడ ఎంచుకోండి లేదా డ్రాప్ చేయండి", ko: "여기에 파일을 선택하거나 드롭하세요", vi: "Chọn hoặc thả tệp ở đây", pl: "Wybierz lub upuść plik tutaj", ro: "Alegeți sau aruncați fișierul aici", nl: "Kies of drop het bestand hier", el: "Επιλέξτε ή ρίξτε το αρχείο εδώ", th: "เลือกหรือวางไฟล์ที่นี่", cs: "Vyberte nebo přetáhněte soubor sem", hu: "Válassza ki vagy dobja ide a fájlt", sv: "Välj eller släpp filen här", da: "Vælg eller slip filen her" })}
          </div>}
      </div>
      <div className="h-6" />
      <div className="font-medium">
        {Lang.match({ en: "Password", zh: "密码", hi: "पासवर्ड", es: "Contraseña", ar: "كلمة المرور", fr: "Mot de passe", de: "Passwort", ru: "Пароль", pt: "Senha", ja: "パスワード", pa: "ਪਾਸਵਰਡ", bn: "পাসওয়ার্ড", id: "Kata sandi", ur: "پاس ورڈ", ms: "Kata sandi", it: "Password", tr: "Parola", ta: "கடவுச்சொல்", te: "పాస్వర్డ్", ko: "비밀번호", vi: "Mật khẩu", pl: "Hasło", ro: "Parolă", nl: "Wachtwoord", el: "Κωδικός πρόσβασης", th: "รหัสผ่าน", cs: "Heslo", hu: "Jelszó", sv: "Lösenord", da: "Adgangskode" })}
      </div>
      <div className="text-default-contrast">
        {Lang.match({ en: "Your existing password to decrypt the file.", zh: "您现有的密码用于解密文件。", hi: "फ़ाइल को डिक्रिप्ट करने के लिए आपका मौजूदा पासवर्ड।", es: "Su contraseña existente para descifrar el archivo.", ar: "كلمة المرور الحالية الخاصة بك لفك تشفير الملف.", fr: "Votre mot de passe existant pour déchiffrer le fichier.", de: "Ihr vorhandenes Passwort zum Entschlüsseln der Datei.", ru: "Ваш существующий пароль для расшифровки файла.", pt: "Sua senha existente para descriptografar o arquivo.", ja: "ファイルを復号化するための既存のパスワード。", pa: "ਫਾਇਲ ਨੂੰ ਡਿਕ੍ਰਿਪਟ ਕਰਨ ਲਈ ਤੁਹਾਡਾ ਮੌਜੂਦਾ ਪਾਸਵਰਡ।", bn: "ফাইল ডিক্রিপ্ট করতে আপনার বিদ্যমান পাসওয়ার্ড।", id: "Kata sandi Anda yang ada untuk mendekripsi file.", ur: "فائل کو ڈی کرپٹ کرنے کے لیے آپ کا موجودہ پاس ورڈ۔", ms: "Kata laluan sedia ada anda untuk menyahsulit fail.", it: "La tua password esistente per decrittografare il file.", tr: "Dosyayı çözmek için mevcut şifreniz.", ta: "கோப்பை டிக்ரிப்ட் செய்ய உங்கள் தற்போதைய கடவுச்சொல்.", te: "ఫైల్‌ను డీక్రిప్ట్ చేయడానికి మీ ప్రస్తుత పాస్వర్డ్.", ko: "파일을 복호화하기 위한 기존 비밀번호입니다.", vi: "Mật khẩu hiện có của bạn để giải mã tệp.", pl: "Twoje istniejące hasło do odszyfrowania pliku.", ro: "Parola dvs. existentă pentru a decripta fișierul.", nl: "Uw bestaande wachtwoord om het bestand te ontsleutelen.", el: "Ο υπάρχων κωδικός σας για την αποκρυπτογράφηση του αρχείου.", th: "รหัสผ่านที่มีอยู่ของคุณเพื่อถอดรหัสไฟล์", cs: "Váš stávající heslo pro dešifrování souboru.", hu: "A meglévő jelszavad a fájl dekódolásához.", sv: "Ditt befintliga lösenord för att dekryptera filen.", da: "Din eksisterende adgangskode til at dekryptere filen." })}
      </div>
      <div className="h-4" />
      <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
        <input className="w-full focus-visible:outline-none"
          autoComplete="off"
          type={flipped ? "text" : "password"}
          value={$pass}
          onChange={e => setPass(e.target.value)} />
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
      <div className="h-8 grow" />
      <div className="flex items-center flex-wrap-reverse gap-2">
        <WideOppositeButton
          type="button"
          disabled={openOrDisplay.running || error != null}
          onClick={openOrDisplay.execute}>
          {openOrDisplay.running === true && <Spinner className="size-6 animate-spin" />}
          {openOrDisplay.running === false && (error != null ? error : Lang.match({ en: "Open", zh: "打开", hi: "खोलें", es: "Abrir", ar: "فتح", fr: "Ouvrir", de: "Öffnen", ru: "Открыть", pt: "Abrir", ja: "開く", pa: "ਖੋਲ੍ਹੋ", bn: "খুলুন", id: "Buka", ur: "کھولیں", ms: "Buka", it: "Apri", tr: "Aç", ta: "திறக்கவும்", te: "తెరవండి", ko: "열기", vi: "Mở", pl: "Otwórz", ro: "Deschideți", nl: "Openen", el: "Άνοιγμα", th: "เปิดไฟล์", cs: "Otevřít", hu: "Megnyitás", sv: "Öppna", da: "Åbn" }))}
        </WideOppositeButton>
      </div>
    </form>
  </div>
}

function UserRemoveButton(props: { user: UserData }) {
  const { user } = props

  const close = useCloseContext().getOrThrow()
  const store = useStoreContext().getOrThrow()

  const removeOrDisplay = useSubmit(() => Promise.try(async () => {
    if (!confirm(Lang.match({ en: "Are you sure you want to remove this user?", zh: "您确定要删除此用户吗？", hi: "क्या आप वाकई इस उपयोगकर्ता को हटाना चाहते हैं?", es: "¿Estás seguro de que deseas eliminar este usuario?", ar: "هل أنت متأكد أنك تريد إزالة هذا المستخدم؟", fr: "Êtes-vous sûr de vouloir supprimer cet utilisateur ?", de: "Sind Sie sicher, dass Sie diesen Benutzer entfernen möchten?", ru: "Вы уверены, что хотите удалить этого пользователя?", pt: "Tem certeza de que deseja remover este usuário?", ja: "このユーザーを削除してもよろしいですか？", pa: "ਕੀ ਤੁਸੀਂ ਯਕੀਨਨ ਇਸ ਉਪਭੋਗਤਾ ਨੂੰ ਹਟਾਉਣਾ ਚਾਹੁੰਦੇ ਹੋ?", bn: "আপনি কি সত্যিই এই ব্যবহারকারীকে সরাতে চান?", id: "Apakah Anda yakin ingin menghapus pengguna ini?", ur: "کیا آپ واقعی اس صارف کو ہٹانا چاہتے ہیں؟", ms: "Adakah anda pasti mahu menghapus pengguna ini?", it: "Sei sicuro di voler rimuovere questo utente?", tr: "Bu kullanıcıyı kaldırmak istediğinizden emin misiniz?", ta: "நீங்கள் உண்மையில் இந்த பயனரை அகற்ற விரும்புகிறீர்களா?", te: "మీరు నిజంగా ఈ వినియోగదారుని తొలగించాలనుకుంటున్నారా?", ko: "이 사용자를 정말로 제거하시겠습니까?", vi: "Bạn có chắc chắn muốn xóa người dùng này không?", pl: "Czy na pewno chcesz usunąć tego użytkownika?", ro: "Ești sigur că vrei să ștergi acest utilizator?", nl: "Weet je zeker dat je deze gebruiker wilt verwijderen?", el: "Είστε βέβαιοι ότι θέλετε να αφαιρέσετε αυτόν τον χρήστη;", th: "คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้นี้", cs: "Opravdu chcete tohoto uživatele odstranit?", hu: "Biztos benne, hogy el akarja távolítani ezt a felhasználót?", sv: "Är du säker på att du vill ta bort den här användaren?", da: "Er du sikker på, at du vil fjerne denne bruger?" })))
      return

    const stale = await store.value.getOrThrow().getOrThrow<Array<UserData>>("users") || []

    const fresh = stale.filter(x => x.uuid !== user.uuid)

    await store.value.getOrThrow().setOrThrow("users", fresh)

    store.update()

    close()
  }).catch(Errors.display), [store, user, close])

  return <WideNakedMenuButton
    type="button"
    disabled={removeOrDisplay.running}
    onClick={removeOrDisplay.execute}>
    {removeOrDisplay.running ? <Spinner className="size-6 animate-spin" /> : <Outline.TrashIcon className="size-5" />}
    {Lang.match({ en: "Remove", zh: "删除", hi: "हटाएं", es: "Eliminar", ar: "إزالة", fr: "Supprimer", de: "Entfernen", ru: "Удалить", pt: "Remover", ja: "削除", pa: "ਹਟਾਓ", bn: "অপসারণ করুন", id: "Hapus", ur: "ہٹائیں", ms: "Hapus", it: "Rimuovi", tr: "Kaldır", ta: "அகற்று", te: "తొలగించు", ko: "제거하다", vi: "Xóa bỏ", pl: "Usuń", ro: "Eliminați", nl: "Verwijderen", el: "Αφαίρεση", th: "ลบออก", cs: "Odstranit", hu: "Eltávolítás", sv: "Ta bort", da: "Fjern" })}
  </WideNakedMenuButton>
}