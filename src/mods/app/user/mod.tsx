// deno-lint-ignore-file no-window

import { InAnchor, OppositeAnchor } from "@/libs/anchor/mod.tsx";
import { InButton, WideOppositeButton } from "@/libs/button/mod.tsx";
import { PathBoard } from "@/libs/dialog/board/mod.tsx";
import { PathPaper, WideNakedMenuAnchor, WideNakedMenuButton } from "@/libs/dialog/paper/mod.tsx";
import { Errors } from "@/libs/errors/mod.ts";
import { Events } from "@/libs/events/mod.ts";
import { useAutoFocus } from "@/libs/focus/mod.ts";
import { Outline } from "@/libs/heroicons/mod.ts";
import { Lang } from "@/libs/lang/mod.ts";
import { Nullable } from "@/libs/nullable/mod.ts";
import { useStoreContext } from "@/libs/store/mod.tsx";
import { Readable, Unknown, Writable } from "@hazae41/binary";
import { SubpathProvider, useAnchorWithCoords, useHashSubpath, usePathContext } from "@hazae41/chemin";
import * as KDBX from "@hazae41/kdbx";
import { useCloseContext } from "@hazae41/react-close-context";
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
    <Outline.LockClosedIcon className="size-5" />
    {Lang.match({
      en: "Start",
      zh: "开始",
      hi: "शुरू करें",
      es: "Comenzar",
      ar: "ابدأ",
      fr: "Démarrer",
      de: "Starten",
      ru: "Начать",
      pt: "Iniciar",
      ja: "開始",
      pa: "ਸ਼ੁਰੂ ਕਰੋ",
      bn: "শুরু করুন",
      id: "Mulai",
      ur: "شروع کریں",
      ms: "Mulai",
      it: "Inizia",
      tr: "Başla",
      ta: "தொடக்கம்",
      te: "ప్రారంభించండి",
      ko: "시작",
      vi: "Bắt đầu",
      pl: "Rozpocznij",
      ro: "Începe",
      nl: "Begin",
      el: "Έναρξη",
      th: "เริ่มต้น",
      cs: "Začít",
      hu: "Indítás",
      sv: "Starta",
      da: "Start",
    })}
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
    <div className="rounded-full size-7 flex justify-center items-center border-2 border-dashed border-default-contrast">
      <Outline.PlusIcon className="size-4" />
    </div>
    {Lang.match({
      en: "Add user",
      zh: "添加用户",
      hi: "उपयोगकर्ता जोड़ें",
      es: "Agregar usuario",
      ar: "إضافة مستخدم",
      fr: "Ajouter un utilisateur",
      de: "Benutzer hinzufügen",
      ru: "Добавить пользователя",
      pt: "Adicionar usuário",
      ja: "ユーザーを追加",
      pa: "ਉਪਭੋਗਤਾ ਸ਼ਾਮਲ ਕਰੋ",
      bn: "ব্যবহারকারী যোগ করুন",
      id: "Tambah pengguna",
      ur: "صارف شامل کریں",
      ms: "Tambah pengguna",
      it: "Aggiungi utente",
      tr: "Kullanıcı ekle",
      ta: "பயனரைச் சேர்க்கவும்",
      te: "వినియోగదారుని జోడించండి",
      ko: "사용자 추가",
      vi: "Thêm người dùng",
      pl: "Dodaj użytkownika",
      ro: "Adaugă utilizator",
      nl: "Gebruiker toevoegen",
      el: "Προσθήκη χρήστη",
      th: "เพิ่มผู้ใช้",
      cs: "Přidat uživatele",
      hu: "Felhasználó hozzáadása",
      sv: "Lägg till användare",
      da: "Tilføj bruger",
    })}
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
    {Lang.match({
      en: "Create user",
      zh: "创建用户",
      hi: "उपयोगकर्ता बनाएं",
      es: "Crear usuario",
      ar: "إنشاء مستخدم",
      fr: "Créer un utilisateur",
      de: "Benutzer erstellen",
      ru: "Создать пользователя",
      pt: "Criar usuário",
      ja: "ユーザーを作成",
      pa: "ਉਪਭੋਗਤਾ ਬਣਾਓ",
      bn: "ব্যবহারকারী তৈরি করুন",
      id: "Buat pengguna",
      ur: "صارف بنائیں",
      ms: "Buat pengguna",
      it: "Crea utente",
      tr: "Kullanıcı oluştur",
      ta: "பயனரை உருவாக்கவும்",
      te: "వినియోగదారుని సృష్టించండి",
      ko: "사용자 만들기",
      vi: "Tạo người dùng",
      pl: "Utwórz użytkownika",
      ro: "Creează utilizator",
      nl: "Maak gebruiker",
      el: "Δημιουργία χρήστη",
      th: "สร้างผู้ใช้",
      cs: "Vytvořit uživatele",
      hu: "Felhasználó létrehozása",
      sv: "Skapa användare",
      da: "Opret bruger",
    })}
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
    {Lang.match({
      en: "Import user",
      zh: "导入用户",
      hi: "उपयोगकर्ता आयात करें",
      es: "Importar usuario",
      ar: "استيراد مستخدم",
      fr: "Importer un utilisateur",
      de: "Benutzer importieren",
      ru: "Импортировать пользователя",
      pt: "Importar usuário",
      ja: "ユーザーをインポート",
      pa: "ਉਪਭੋਗਤਾ ਆਯਾਤ ਕਰੋ",
      bn: "ব্যবহারকারী আমদানি করুন",
      id: "Impor pengguna",
      ur: "صارف درآمد کریں",
      ms: "Impor pengguna",
      it: "Importa utente",
      tr: "Kullanıcı içe aktar",
      ta: "பயனரை இறக்குமதி செய்யவும்",
      te: "వినియోగదారుని దిగుమతి చేయండి",
      ko: "사용자 가져오기",
      vi: "Nhập người dùng",
      pl: "Importuj użytkownika",
      ro: "Importă utilizator",
      nl: "Importeer gebruiker",
      el: "Εισαγωγή χρήστη",
      th: "นำเข้าผู้ใช้",
      cs: "Importovat uživatele",
      hu: "Felhasználó importálása",
      sv: "Importera användare",
      da: "Importer bruger",
    })}
  </WideNakedMenuAnchor>
}

function UserImportFilePage() {
  const close = useCloseContext().getOrThrow()
  const store = useStoreContext().getOrThrow()

  const [flipped, setFlipped] = useState(false)

  const [$name, setName] = useState("")
  const [$pass, setPass] = useState("")

  const name = useDeferredValue($name || "Anon")
  const pass = useDeferredValue($pass)

  const [file, setFile] = useState<Nullable<File>>()

  const loadOrAlert = useCallback(() => Promise.try(async () => {
    if (file == null)
      return

    const data = new Uint8Array(await file.arrayBuffer())

    const encrypted = Readable.readFromBytesOrThrow(KDBX.Database.Encrypted, data)
    const composite = await KDBX.CompositeKey.digestOrThrow(await KDBX.PasswordKey.digestOrThrow(new TextEncoder().encode(pass)))

    await encrypted.decryptOrThrow(composite)

    if (!confirm("Do you want to create a passkey?")) {
      const uuid = crypto.randomUUID()

      const stale = await store.value.getOrThrow().getOrThrow<Array<UserData>>("users") || []

      const fresh = [...stale, { uuid, name } satisfies UserData]

      await store.value.getOrThrow().setOrThrow("users", fresh)

      store.update()

      close()

      return
    }

    const uuid = crypto.randomUUID()

    const auth = await webAuthnStorage.createOrThrow(uuid.slice(0, 8), composite.value.bytes)

    const stale = await store.value.getOrThrow().getOrThrow<Array<UserData>>("users") || []

    const fresh = [...stale, { uuid, name, auth } satisfies UserData]

    await store.value.getOrThrow().setOrThrow("users", fresh)

    store.update()

    close()
  }).catch(Errors.display), [store, name, file, pass, close])

  const error = useMemo(() => {
    if (file == null)
      return "File is required"
    if (!pass.length)
      return "Password is required"
    return
  }, [file, pass])

  return <div className="flex flex-col grow p-6">
    <h1 className="text-xl font-medium">
      {Lang.match({
        en: "Import user",
        zh: "导入用户",
        hi: "उपयोगकर्ता आयात करें",
        es: "Importar usuario",
        ar: "استيراد مستخدم",
        fr: "Importer un utilisateur",
        de: "Benutzer importieren",
        ru: "Импортировать пользователя",
        pt: "Importar usuário",
        ja: "ユーザーをインポート",
        pa: "ਉਪਭੋਗਤਾ ਆਯਾਤ ਕਰੋ",
        bn: "ব্যবহারকারী আমদানি করুন",
        id: "Impor pengguna",
        ur: "صارف درآمد کریں",
        ms: "Impor pengguna",
        it: "Importa utente",
        tr: "Kullanıcı içe aktar",
        ta: "பயனரை இறக்குமதி செய்யவும்",
        te: "వినియోగదారుని దిగుమతి చేయండి",
        ko: "사용자 가져오기",
        vi: "Nhập người dùng",
        pl: "Importuj użytkownika",
        ro: "Importă utilizator",
        nl: "Importeer gebruiker",
        el: "Εισαγωγή χρήστη",
        th: "นำเข้าผู้ใช้",
        cs: "Importovat uživatele",
        hu: "Felhasználó importálása",
        sv: "Importera användare",
        da: "Importer bruger",
      })}
    </h1>
    <form className="grow flex flex-col"
      onSubmit={Events.preventDefault}>
      <input className="hidden"
        autoComplete="off"
        name="username" />
      <div className="h-6" />
      <div className="font-medium">
        {Lang.match({
          en: "Name",
          zh: "名称",
          hi: "नाम",
          es: "Nombre",
          ar: "اسم",
          fr: "Nom",
          de: "Name",
          ru: "Имя",
          pt: "Nome",
          ja: "名前",
          pa: "ਨਾਮ",
          bn: "নাম",
          id: "Nama",
          ur: "نام",
          ms: "Nama",
          it: "Nome",
          tr: "İsim",
          ta: "பெயர்",
          te: "పేరు",
          ko: "이름",
          vi: "Tên",
          pl: "Nazwa",
          ro: "Nume",
          nl: "Naam",
          el: "Όνομα",
          th: "ชื่อ",
          cs: "Jméno",
          hu: "Név",
          sv: "Namn",
          da: "Navn",
        })}
      </div>
      <div className="text-default-contrast">
        {Lang.match({
          en: "Will be used locally for display purposes.",
          zh: "将被本地使用，仅用于显示。",
          hi: "स्थानीय रूप से प्रदर्शन उद्देश्यों के लिए उपयोग किया जाएगा।",
          es: "Se usará localmente para fines de visualización.",
          ar: "سيتم استخدامه محليًا لأغراض العرض.",
          fr: "Sera utilisé localement à des fins d'affichage.",
          de: "Wird lokal für Anzeigezwecke verwendet.",
          ru: "Будет использоваться локально для отображения.",
          pt: "Será usado localmente para fins de exibição.",
          ja: "表示目的でローカルに使用されます。",
          pa: "ਡਿਸਪਲੇਅ ਦੇ ਉਦੇਸ਼ਾਂ ਲਈ ਸਥਾਨਕ ਤੌਰ 'ਤੇ ਵਰਤਿਆ ਜਾਵੇਗਾ।",
          bn: "প্রদর্শন উদ্দেশ্যে স্থানীয়ভাবে ব্যবহৃত হবে।",
          id: "Akan digunakan secara lokal untuk tujuan tampilan.",
          ur: "ڈسپلے کے مقاصد کے لیے مقامی طور پر استعمال کیا جائے گا۔",
          ms: "Akan digunakan secara lokal untuk tujuan tampilan.",
          it: "Sarà usato localmente per scopi di visualizzazione.",
          tr: "Görüntüleme amaçları için yerel olarak kullanılacaktır.",
          ta: "காட்சிப்படுத்தும் நோக்கங்களுக்காக உள்ளூரில் பயன்படுத்தப்படும்.",
          te: "ప్రదర్శన లక్ష్యాల కోసం స్థానికంగా ఉపయోగించబడుతుంది.",
          ko: "디스플레이 목적으로 로컬에서 사용됩니다.",
          vi: "Sẽ được sử dụng cục bộ cho mục đích hiển thị.",
          pl: "Będzie używany lokalnie do celów wyświetlania.",
          ro: "Va fi folosit local pentru scopuri de afișare.",
          nl: "Zal lokaal worden gebruikt voor weergavedoeleinden.",
          el: "Θα χρησιμοποιείται τοπικά για σκοπούς εμφάνισης.",
          th: "จะใช้ในพื้นที่สำหรับวัตถุประสงค์ในการแสดงผล",
          cs: "Bude používán lokálně pro zobrazení.",
          hu: "Helyileg lesz használva megjelenítési célokra.",
          sv: "Kommer att användas lokalt för visningsändamål.",
          da: "Vil blive brugt lokalt til visningsformål.",
        })}
      </div>
      <div className="h-4" />
      <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
        <input className="w-full focus-visible:outline-none"
          autoComplete="off"
          placeholder="Anon"
          value={$name}
          onChange={e => setName(e.target.value)} />
      </div>
      <div className="h-6" />
      <div className="font-medium">
        {Lang.match({
          en: "File",
          zh: "文件",
          hi: "फ़ाइल",
          es: "Archivo",
          ar: "ملف",
          fr: "Fichier",
          de: "Datei",
          ru: "Файл",
          pt: "Arquivo",
          ja: "ファイル",
          pa: "ਫਾਇਲ",
          bn: "ফাইল",
          id: "Berkas",
          ur: "فائل",
          ms: "Berkas",
          it: "File",
          tr: "Dosya",
          ta: "கோப்பு",
          te: "ఫైల్",
          ko: "파일",
          vi: "Tệp",
          pl: "Plik",
          ro: "Fișier",
          nl: "Bestand",
          el: "Αρχείο",
          th: "ไฟล์",
          cs: "Soubor",
          hu: "Fájl",
          sv: "Fil",
          da: "Fil",
        })}
      </div>
      <div className="text-default-contrast">
        {Lang.match({
          en: "Your existing KDBX file.",
          zh: "您现有的 KDBX 文件。",
          hi: "आपकी मौजूदा KDBX फ़ाइल।",
          es: "Tu archivo KDBX existente.",
          ar: "ملف KDBX الحالي الخاص بك.",
          fr: "Votre fichier KDBX existant.",
          de: "Ihre vorhandene KDBX-Datei.",
          ru: "Ваш существующий файл KDBX.",
          pt: "Seu arquivo KDBX existente.",
          ja: "既存の KDBX ファイル。",
          pa: "ਤੁਹਾਡੀ ਮੌਜੂਦਾ KDBX ਫਾਇਲ।",
          bn: "আপনার বিদ্যমান KDBX ফাইল।",
          id: "File KDBX Anda yang ada.",
          ur: "آپ کی موجودہ KDBX فائل۔",
          ms: "File KDBX Anda yang ada.",
          it: "Il tuo file KDBX esistente.",
          tr: "Mevcut KDBX dosyanız.",
          ta: "உங்கள் தற்போதைய KDBX கோப்பு.",
          te: "మీ ప్రస్తుత KDBX ఫైల్.",
          ko: "기존 KDBX 파일입니다.",
          vi: "Tệp KDBX hiện có của bạn.",
          pl: "Twój istniejący plik KDBX.",
          ro: "Fișierul KDBX existent.",
          nl: "Uw bestaande KDBX-bestand.",
          el: "Το υπάρχον αρχείο KDBX σας.",
          th: "ไฟล์ KDBX ที่มีอยู่ของคุณ",
          cs: "Váš stávající soubor KDBX.",
          hu: "A meglévő KDBX fájlod.",
          sv: "Din befintliga KDBX-fil.",
          da: "Din eksisterende KDBX-fil.",
        })}
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
            {Lang.match({
              en: "Pick or drop file here",
              zh: "在此处选择或拖放文件",
              hi: "यहां फ़ाइल चुनें या ड्रॉप करें",
              es: "Seleccione o suelte el archivo aquí",
              ar: "اختر أو اسقط الملف هنا",
              fr: "Choisissez ou déposez le fichier ici",
              de: "Datei hier auswählen oder ablegen",
              ru: "Выберите или перетащите файл сюда",
              pt: "Escolha ou solte o arquivo aqui",
              ja: "ここでファイルを選択またはドロップ",
              pa: "ਇੱਥੇ ਫਾਇਲ ਚੁਣੋ ਜਾਂ ਡਰੌਪ ਕਰੋ",
              bn: "এখানে ফাইল নির্বাচন করুন বা ড্রপ করুন",
              id: "Pilih atau jatuhkan file di sini",
              ur: "فائل یہاں منتخب کریں یا ڈراپ کریں",
              ms: "Pilih atau jatuhkan file di sini",
              it: "Scegli o trascina il file qui",
              tr: "Dosyayı buraya seçin veya bırakın",
              ta: "கோப்பை இங்கே தேர்ந்தெடுக்கவும் அல்லது விடவும்",
              te: "ఫైల్‌ను ఇక్కడ ఎంచుకోండి లేదా డ్రాప్ చేయండి",
              ko: "여기에 파일을 선택하거나 드롭하세요",
              vi: "Chọn hoặc thả tệp ở đây",
              pl: "Wybierz lub upuść plik tutaj",
              ro: "Alegeți sau aruncați fișierul aici",
              nl: "Kies of drop het bestand hier",
              el: "Επιλέξτε ή ρίξτε το αρχείο εδώ",
              th: "เลือกหรือวางไฟล์ที่นี่",
              cs: "Vyberte nebo přetáhněte soubor sem",
              hu: "Válassza ki vagy dobja ide a fájlt",
              sv: "Välj eller släpp filen här",
              da: "Vælg eller slip filen her",
            })}
          </div>}
      </div>
      <div className="h-6" />
      <div className="font-medium">
        Password
      </div>
      <div className="text-default-contrast">
        Your existing password to decrypt the file.&lrm;
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
          disabled={error != null}
          onClick={loadOrAlert}>
          {error != null ? error : "Open"}
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

  const name = useDeferredValue($name || "Anon")
  const pass = useDeferredValue($pass)

  const [fsfh, setFsfh] = useState<FileSystemFileHandle>()

  const pickOrAlert = useCallback(() => Promise.try(async () => {
    const [fsfh] = await window.showOpenFilePicker!({ id: "root", startIn: "documents", types: [{ description: "KDBX", accept: { "application/kdbx": [".kdbx"] } }] })

    if (fsfh == null)
      return
    if (fsfh.kind !== "file")
      return

    setFsfh(fsfh)
  }).catch(Errors.display), [])

  const dropOrAlert = useCallback((e: DragEvent<HTMLButtonElement>) => Promise.try(async () => {
    e.preventDefault()

    const [item] = e.dataTransfer.items as unknown as Iterable<DataTransferItem>

    const fsfh = await item.getAsFileSystemHandle!()

    if (fsfh.kind !== "file")
      return

    setFsfh(fsfh)
  }).catch(Errors.display), [])

  const openOrAlert = useCallback(() => Promise.try(async () => {
    if (fsfh == null)
      return

    const file = await fsfh.getFile()
    const data = new Uint8Array(await file.arrayBuffer())

    const encrypted = Readable.readFromBytesOrThrow(KDBX.Database.Encrypted, data)
    const composite = await KDBX.CompositeKey.digestOrThrow(await KDBX.PasswordKey.digestOrThrow(new TextEncoder().encode(pass)))

    await encrypted.decryptOrThrow(composite)

    if (!confirm("Do you want to create a passkey?")) {
      const uuid = crypto.randomUUID()

      const stale = await store.value.getOrThrow().getOrThrow<Array<UserData>>("users") || []

      const fresh = [...stale, { uuid, name, fsfh } satisfies UserData]

      await store.value.getOrThrow().setOrThrow("users", fresh)

      store.update()

      close()

      return
    }

    const uuid = crypto.randomUUID()

    const auth = await webAuthnStorage.createOrThrow(uuid.slice(0, 8), composite.value.bytes)

    const stale = await store.value.getOrThrow().getOrThrow<Array<UserData>>("users") || []

    const fresh = [...stale, { uuid, name, fsfh, auth } satisfies UserData]

    await store.value.getOrThrow().setOrThrow("users", fresh)

    store.update()

    close()
  }).catch(Errors.display), [store, name, fsfh, pass, close])

  const error = useMemo(() => {
    if (fsfh == null)
      return "File is required"
    if (!pass.length)
      return "Password is required"
    return
  }, [fsfh, pass])

  return <div className="flex flex-col grow p-6">
    <h1 className="text-xl font-medium">
      {Lang.match({
        en: "Import user",
        zh: "导入用户",
        hi: "उपयोगकर्ता आयात करें",
        es: "Importar usuario",
        ar: "استيراد مستخدم",
        fr: "Importer un utilisateur",
        de: "Benutzer importieren",
        ru: "Импортировать пользователя",
        pt: "Importar usuário",
        ja: "ユーザーをインポート",
        pa: "ਉਪਭੋਗਤਾ ਆਯਾਤ ਕਰੋ",
        bn: "ব্যবহারকারী আমদানি করুন",
        id: "Impor pengguna",
        ur: "صارف درآمد کریں",
        ms: "Impor pengguna",
        it: "Importa utente",
        tr: "Kullanıcı içe aktar",
        ta: "பயனரை இறக்குமதி செய்யவும்",
        te: "వినియోగదారుని దిగుమతి చేయండి",
        ko: "사용자 가져오기",
        vi: "Nhập người dùng",
        pl: "Importuj użytkownika",
        ro: "Importă utilizator",
        nl: "Importeer gebruiker",
        el: "Εισαγωγή χρήστη",
        th: "นำเข้าผู้ใช้",
        cs: "Importovat uživatele",
        hu: "Felhasználó importálása",
        sv: "Importera användare",
        da: "Importer bruger",
      })}
    </h1>
    <form className="grow flex flex-col"
      onSubmit={Events.preventDefault}>
      <input className="hidden"
        autoComplete="off"
        name="username" />
      <div className="h-6" />
      <div className="font-medium">
        {Lang.match({
          en: "Name",
          zh: "名称",
          hi: "नाम",
          es: "Nombre",
          ar: "اسم",
          fr: "Nom",
          de: "Name",
          ru: "Имя",
          pt: "Nome",
          ja: "名前",
          pa: "ਨਾਮ",
          bn: "নাম",
          id: "Nama",
          ur: "نام",
          ms: "Nama",
          it: "Nome",
          tr: "İsim",
          ta: "பெயர்",
          te: "పేరు",
          ko: "이름",
          vi: "Tên",
          pl: "Nazwa",
          ro: "Nume",
          nl: "Naam",
          el: "Όνομα",
          th: "ชื่อ",
          cs: "Jméno",
          hu: "Név",
          sv: "Namn",
          da: "Navn",
        })}
      </div>
      <div className="text-default-contrast">
        {Lang.match({
          en: "Will be used locally for display purposes.",
          zh: "将被本地使用，仅用于显示。",
          hi: "स्थानीय रूप से प्रदर्शन उद्देश्यों के लिए उपयोग किया जाएगा।",
          es: "Se usará localmente para fines de visualización.",
          ar: "سيتم استخدامه محليًا لأغراض العرض.",
          fr: "Sera utilisé localement à des fins d'affichage.",
          de: "Wird lokal für Anzeigezwecke verwendet.",
          ru: "Будет использоваться локально для отображения.",
          pt: "Será usado localmente para fins de exibição.",
          ja: "表示目的でローカルに使用されます。",
          pa: "ਡਿਸਪਲੇਅ ਦੇ ਉਦੇਸ਼ਾਂ ਲਈ ਸਥਾਨਕ ਤੌਰ 'ਤੇ ਵਰਤਿਆ ਜਾਵੇਗਾ।",
          bn: "প্রদর্শন উদ্দেশ্যে স্থানীয়ভাবে ব্যবহৃত হবে।",
          id: "Akan digunakan secara lokal untuk tujuan tampilan.",
          ur: "ڈسپلے کے مقاصد کے لیے مقامی طور پر استعمال کیا جائے گا۔",
          ms: "Akan digunakan secara lokal untuk tujuan tampilan.",
          it: "Sarà usato localmente per scopi di visualizzazione.",
          tr: "Görüntüleme amaçları için yerel olarak kullanılacaktır.",
          ta: "காட்சிப்படுத்தும் நோக்கங்களுக்காக உள்ளூரில் பயன்படுத்தப்படும்.",
          te: "ప్రదర్శన లక్ష్యాల కోసం స్థానికంగా ఉపయోగించబడుతుంది.",
          ko: "디스플레이 목적으로 로컬에서 사용됩니다.",
          vi: "Sẽ được sử dụng cục bộ cho mục đích hiển thị.",
          pl: "Będzie używany lokalnie do celów wyświetlania.",
          ro: "Va fi folosit local pentru scopuri de afișare.",
          nl: "Zal lokaal worden gebruikt voor weergavedoeleinden.",
          el: "Θα χρησιμοποιείται τοπικά για σκοπούς εμφάνισης.",
          th: "จะใช้ในพื้นที่สำหรับวัตถุประสงค์ในการแสดงผล",
          cs: "Bude používán lokálně pro zobrazení.",
          hu: "Helyileg lesz használva megjelenítési célokra.",
          sv: "Kommer att användas lokalt för visningsändamål.",
          da: "Vil blive brugt lokalt til visningsformål.",
        })}
      </div>
      <div className="h-4" />
      <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
        <input className="w-full focus-visible:outline-none"
          autoComplete="off"
          placeholder="Anon"
          value={$name}
          onChange={e => setName(e.target.value)} />
      </div>
      <div className="h-6" />
      <div className="font-medium">
        {Lang.match({
          en: "File",
          zh: "文件",
          hi: "फ़ाइल",
          es: "Archivo",
          ar: "ملف",
          fr: "Fichier",
          de: "Datei",
          ru: "Файл",
          pt: "Arquivo",
          ja: "ファイル",
          pa: "ਫਾਇਲ",
          bn: "ফাইল",
          id: "Berkas",
          ur: "فائل",
          ms: "Berkas",
          it: "File",
          tr: "Dosya",
          ta: "கோப்பு",
          te: "ఫైల్",
          ko: "파일",
          vi: "Tệp",
          pl: "Plik",
          ro: "Fișier",
          nl: "Bestand",
          el: "Αρχείο",
          th: "ไฟล์",
          cs: "Soubor",
          hu: "Fájl",
          sv: "Fil",
          da: "Fil",
        })}
      </div>
      <div className="text-default-contrast">
        {Lang.match({
          en: "Your existing KDBX file.",
          zh: "您现有的 KDBX 文件。",
          hi: "आपकी मौजूदा KDBX फ़ाइल।",
          es: "Tu archivo KDBX existente.",
          ar: "ملف KDBX الحالي الخاص بك.",
          fr: "Votre fichier KDBX existant.",
          de: "Ihre vorhandene KDBX-Datei.",
          ru: "Ваш существующий файл KDBX.",
          pt: "Seu arquivo KDBX existente.",
          ja: "既存の KDBX ファイル。",
          pa: "ਤੁਹਾਡੀ ਮੌਜੂਦਾ KDBX ਫਾਇਲ।",
          bn: "আপনার বিদ্যমান KDBX ফাইল।",
          id: "File KDBX Anda yang ada.",
          ur: "آپ کی موجودہ KDBX فائل۔",
          ms: "File KDBX Anda yang ada.",
          it: "Il tuo file KDBX esistente.",
          tr: "Mevcut KDBX dosyanız.",
          ta: "உங்கள் தற்போதைய KDBX கோப்பு.",
          te: "మీ ప్రస్తుత KDBX ఫైల్.",
          ko: "기존 KDBX 파일입니다.",
          vi: "Tệp KDBX hiện có của bạn.",
          pl: "Twój istniejący plik KDBX.",
          ro: "Fișierul KDBX existent.",
          nl: "Uw bestaande KDBX-bestand.",
          el: "Το υπάρχον αρχείο KDBX σας.",
          th: "ไฟล์ KDBX ที่มีอยู่ของคุณ",
          cs: "Váš stávající soubor KDBX.",
          hu: "A meglévő KDBX fájlod.",
          sv: "Din befintliga KDBX-fil.",
          da: "Din eksisterende KDBX-fil.",
        })}
      </div>
      <div className="h-4" />
      <div className="relative bg-default-contrast rounded-xl [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
        {"showOpenFilePicker" in window === true &&
          <button className="absolute inset-0 opacity-0 cursor-pointer"
            type="button"
            onClick={pickOrAlert}
            onDragOver={Events.preventDefault}
            onDrop={dropOrAlert} />}
        {fsfh != null &&
          <div className="po-2">
            {fsfh.name}
          </div>}
        {fsfh == null &&
          <div className="po-2">
            {Lang.match({
              en: "Pick or drop file here",
              zh: "在此处选择或拖放文件",
              hi: "यहां फ़ाइल चुनें या ड्रॉप करें",
              es: "Seleccione o suelte el archivo aquí",
              ar: "اختر أو اسقط الملف هنا",
              fr: "Choisissez ou déposez le fichier ici",
              de: "Datei hier auswählen oder ablegen",
              ru: "Выберите или перетащите файл сюда",
              pt: "Escolha ou solte o arquivo aqui",
              ja: "ここでファイルを選択またはドロップ",
              pa: "ਇੱਥੇ ਫਾਇਲ ਚੁਣੋ ਜਾਂ ਡਰੌਪ ਕਰੋ",
              bn: "এখানে ফাইল নির্বাচন করুন বা ড্রপ করুন",
              id: "Pilih atau jatuhkan file di sini",
              ur: "فائل یہاں منتخب کریں یا ڈراپ کریں",
              ms: "Pilih atau jatuhkan file di sini",
              it: "Scegli o trascina il file qui",
              tr: "Dosyayı buraya seçin veya bırakın",
              ta: "கோப்பை இங்கே தேர்ந்தெடுக்கவும் அல்லது விடவும்",
              te: "ఫైల్‌ను ఇక్కడ ఎంచుకోండి లేదా డ్రాప్ చేయండి",
              ko: "여기에 파일을 선택하거나 드롭하세요",
              vi: "Chọn hoặc thả tệp ở đây",
              pl: "Wybierz lub upuść plik tutaj",
              ro: "Alegeți sau aruncați fișierul aici",
              nl: "Kies of drop het bestand hier",
              el: "Επιλέξτε ή ρίξτε το αρχείο εδώ",
              th: "เลือกหรือวางไฟล์ที่นี่",
              cs: "Vyberte nebo přetáhněte soubor sem",
              hu: "Válassza ki vagy dobja ide a fájlt",
              sv: "Välj eller släpp filen här",
              da: "Vælg eller slip filen her",
            })}
          </div>}
      </div>
      <div className="h-6" />
      <div className="font-medium">
        Password
      </div>
      <div className="text-default-contrast">
        Your existing password to decrypt the file.&lrm;
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
          disabled={error != null}
          onClick={openOrAlert}>
          {error != null ? error : "Open"}
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

  const name = useDeferredValue($name || "Anon")
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

  const encryptOrThrow = useCallback(async () => {
    const composite = await KDBX.CompositeKey.digestOrThrow(await KDBX.PasswordKey.digestOrThrow(new TextEncoder().encode(pass)))

    const inner = innerizeOrThrow()
    const outer = await outerizeOrThrow(composite)

    const decrypted = new KDBX.Database.Decrypted(outer, inner)
    const encrypted = await decrypted.encryptOrThrow(composite)

    return Writable.writeToBytesOrThrow(encrypted)
  }, [pass, innerizeOrThrow, outerizeOrThrow])

  const pickOrAlert = useCallback(() => Promise.try(async () => {
    const fsfh = await window.showSaveFilePicker!({ id: "root", startIn: "documents", suggestedName: `wallet.kdbx`, types: [{ description: "KDBX", accept: { "application/kdbx": [".kdbx"] } }] })

    const content = await encryptOrThrow()

    const writable = await fsfh.createWritable()
    await writable.write(content)
    await writable.close()

    const uuid = crypto.randomUUID()

    const stale = await store.value.getOrThrow().getOrThrow<Array<UserData>>("users") || []

    const fresh = [...stale, { uuid, name, fsfh } satisfies UserData]

    await store.value.getOrThrow().setOrThrow("users", fresh)

    store.update()

    close()
  }).catch(Errors.display), [store, encryptOrThrow, close])

  const saveOrAlert = useCallback(() => Promise.try(async () => {
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

    const uuid = crypto.randomUUID()

    const stale = await store.value.getOrThrow().getOrThrow<Array<UserData>>("users") || []

    const fresh = [...stale, { uuid, name } satisfies UserData]

    await store.value.getOrThrow().setOrThrow("users", fresh)

    store.update()

    close()
  }).catch(Errors.display), [store, encryptOrThrow, close])

  const error = useMemo(() => {
    if (!pass.length)
      return "Password is required"
    return
  }, [pass])

  return <div className="flex flex-col grow p-6">
    <h1 className="text-xl font-medium">
      {Lang.match({
        en: "Create user",
        zh: "创建用户",
        hi: "उपयोगकर्ता बनाएं",
        es: "Crear usuario",
        ar: "إنشاء مستخدم",
        fr: "Créer un utilisateur",
        de: "Benutzer erstellen",
        ru: "Создать пользователя",
        pt: "Criar usuário",
        ja: "ユーザーを作成",
        pa: "ਉਪਭੋਗਤਾ ਬਣਾਓ",
        bn: "ব্যবহারকারী তৈরি করুন",
        id: "Buat pengguna",
        ur: "صارف بنائیں",
        ms: "Buat pengguna",
        it: "Crea utente",
        tr: "Kullanıcı oluştur",
        ta: "பயனரை உருவாக்கவும்",
        te: "వినియోగదారుని సృష్టించండి",
        ko: "사용자 만들기",
        vi: "Tạo người dùng",
        pl: "Utwórz użytkownika",
        ro: "Creează utilizator",
        nl: "Maak gebruiker",
        el: "Δημιουργία χρήστη",
        th: "สร้างผู้ใช้",
        cs: "Vytvořit uživatele",
        hu: "Felhasználó létrehozása",
        sv: "Skapa användare",
        da: "Opret bruger",
      })}
    </h1>
    <form className="grow flex flex-col"
      onSubmit={Events.preventDefault}>
      <input className="hidden"
        autoComplete="off"
        name="username" />
      <div className="h-6" />
      <div className="font-medium">
        {Lang.match({
          en: "Name",
          zh: "名称",
          hi: "नाम",
          es: "Nombre",
          ar: "اسم",
          fr: "Nom",
          de: "Name",
          ru: "Имя",
          pt: "Nome",
          ja: "名前",
          pa: "ਨਾਮ",
          bn: "নাম",
          id: "Nama",
          ur: "نام",
          ms: "Nama",
          it: "Nome",
          tr: "İsim",
          ta: "பெயர்",
          te: "పేరు",
          ko: "이름",
          vi: "Tên",
          pl: "Nazwa",
          ro: "Nume",
          nl: "Naam",
          el: "Όνομα",
          th: "ชื่อ",
          cs: "Jméno",
          hu: "Név",
          sv: "Namn",
          da: "Navn",
        })}
      </div>
      <div className="text-default-contrast">
        {Lang.match({
          en: "Will be used locally for display purposes.",
          zh: "将被本地使用，仅用于显示。",
          hi: "स्थानीय रूप से प्रदर्शन उद्देश्यों के लिए उपयोग किया जाएगा।",
          es: "Se usará localmente para fines de visualización.",
          ar: "سيتم استخدامه محليًا لأغراض العرض.",
          fr: "Sera utilisé localement à des fins d'affichage.",
          de: "Wird lokal für Anzeigezwecke verwendet.",
          ru: "Будет использоваться локально для отображения.",
          pt: "Será usado localmente para fins de exibição.",
          ja: "表示目的でローカルに使用されます。",
          pa: "ਡਿਸਪਲੇਅ ਦੇ ਉਦੇਸ਼ਾਂ ਲਈ ਸਥਾਨਕ ਤੌਰ 'ਤੇ ਵਰਤਿਆ ਜਾਵੇਗਾ।",
          bn: "প্রদর্শন উদ্দেশ্যে স্থানীয়ভাবে ব্যবহৃত হবে।",
          id: "Akan digunakan secara lokal untuk tujuan tampilan.",
          ur: "ڈسپلے کے مقاصد کے لیے مقامی طور پر استعمال کیا جائے گا۔",
          ms: "Akan digunakan secara lokal untuk tujuan tampilan.",
          it: "Sarà usato localmente per scopi di visualizzazione.",
          tr: "Görüntüleme amaçları için yerel olarak kullanılacaktır.",
          ta: "காட்சிப்படுத்தும் நோக்கங்களுக்காக உள்ளூரில் பயன்படுத்தப்படும்.",
          te: "ప్రదర్శన లక్ష్యాల కోసం స్థానికంగా ఉపయోగించబడుతుంది.",
          ko: "디스플레이 목적으로 로컬에서 사용됩니다.",
          vi: "Sẽ được sử dụng cục bộ cho mục đích hiển thị.",
          pl: "Będzie używany lokalnie do celów wyświetlania.",
          ro: "Va fi folosit local pentru scopuri de afișare.",
          nl: "Zal lokaal worden gebruikt voor weergavedoeleinden.",
          el: "Θα χρησιμοποιείται τοπικά για σκοπούς εμφάνισης.",
          th: "จะใช้ในพื้นที่สำหรับวัตถุประสงค์ในการแสดงผล",
          cs: "Bude používán lokálně pro zobrazení.",
          hu: "Helyileg lesz használva megjelenítési célokra.",
          sv: "Kommer att användas lokalt för visningsändamål.",
          da: "Vil blive brugt lokalt til visningsformål.",
        })}
      </div>
      <div className="h-4" />
      <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
        <input className="w-full focus-visible:outline-none"
          autoComplete="off"
          placeholder="Anon"
          value={$name}
          onChange={e => setName(e.target.value)} />
      </div>
      <div className="h-6" />
      <div className="font-medium">
        Password
      </div>
      <div className="text-default-contrast">
        A password to encrypt the created file.&lrm;
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
            disabled={error != null}
            onClick={pickOrAlert}>
            {error != null ? error : "Save"}
          </WideOppositeButton>}
        {"showSaveFilePicker" in window === false &&
          <WideOppositeButton
            type="button"
            disabled={error != null}
            onClick={saveOrAlert}>
            {error != null ? error : "Save"}
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
          <div className="rounded-full size-7 flex justify-center items-center border border-default-contrast bg-opposite text-opposite">
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

  const loadOrAlert1 = useCallback(() => Promise.try(async () => {
    if (file1 == null)
      return
    if (!pass)
      return

    const data = new Uint8Array(await file1.arrayBuffer())

    const encrypted = Readable.readFromBytesOrThrow(KDBX.Database.Encrypted, data)
    const composite = await KDBX.CompositeKey.digestOrThrow(await KDBX.PasswordKey.digestOrThrow(new TextEncoder().encode(pass)))
    const decrypted = await encrypted.decryptOrThrow(composite)

    console.log(decrypted.inner.content.value.document)

    login({ user, comp: composite, kdbx: decrypted })

    close()
  }).catch(Errors.display), [user, login, file1, pass, close])

  const loadOrAlert2 = useCallback(() => Promise.try(async () => {
    if (file2 == null)
      return
    if (auth == null)
      return

    const data = new Uint8Array(await file2.arrayBuffer())

    const encrypted = Readable.readFromBytesOrThrow(KDBX.Database.Encrypted, data)
    const composite = new KDBX.CompositeKey(new Unknown(auth))
    const decrypted = await encrypted.decryptOrThrow(composite)

    console.log(decrypted.inner.content.value.document)

    login({ user, comp: composite, kdbx: decrypted })

    close()
  }).catch(Errors.display), [user, login, file2, auth, close])

  useEffect(() => {
    if (file1 == null)
      return
    if (!pass)
      return
    loadOrAlert1().catch(console.error)
  }, [file1, pass, loadOrAlert1])

  useEffect(() => {
    if (file2 == null)
      return
    if (auth == null)
      return
    loadOrAlert2().catch(console.error)
  }, [file2, auth, loadOrAlert2])

  const openOrAlert1 = useCallback(() => Promise.try(async () => {
    if (user.fsfh == null)
      return
    if (!pass)
      return

    await user.fsfh.requestPermission({ mode: "readwrite" })

    const file = await user.fsfh.getFile()
    const data = new Uint8Array(await file.arrayBuffer())

    const encrypted = Readable.readFromBytesOrThrow(KDBX.Database.Encrypted, data)
    const composite = await KDBX.CompositeKey.digestOrThrow(await KDBX.PasswordKey.digestOrThrow(new TextEncoder().encode(pass)))
    const decrypted = await encrypted.decryptOrThrow(composite)

    console.log(decrypted.inner.content.value.document)

    login({ user, comp: composite, kdbx: decrypted })

    close()
  }).catch(Errors.display), [user, login, pass, close])

  const openOrAlert2 = useCallback((stored: Uint8Array<ArrayBuffer> & { length: 32 }) => Promise.try(async () => {
    if (user.auth == null)
      return
    if (user.fsfh == null)
      return
    if (stored == null)
      return

    await user.fsfh.requestPermission({ mode: "readwrite" })

    const file = await user.fsfh.getFile()
    const data = new Uint8Array(await file.arrayBuffer())

    const encrypted = Readable.readFromBytesOrThrow(KDBX.Database.Encrypted, data)
    const composite = new KDBX.CompositeKey(new Unknown(stored))
    const decrypted = await encrypted.decryptOrThrow(composite)

    console.log(decrypted.inner.content.value.document)

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

    await openOrAlert1()
  }, [user, openOrAlert1, picker1])

  const onPassClick = useCallback(async () => {
    if (user.auth == null)
      return

    if (user.fsfh == null) {
      picker2!.click()

      setAuth(await webAuthnStorage.getOrThrow(user.auth) as Uint8Array<ArrayBuffer> & { length: 32 })

      return
    }

    await openOrAlert2(await webAuthnStorage.getOrThrow(user.auth) as Uint8Array<ArrayBuffer> & { length: 32 })
  }, [user, openOrAlert2, picker2])

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
        <input className="focus-visible:outline-none"
          autoComplete="off"
          type={flipped ? "text" : "password"}
          placeholder="Password"
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
    <InAnchor>
      <Outline.EllipsisVerticalIcon className="size-6" />
    </InAnchor>
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
    Reimport
  </WideNakedMenuAnchor>
}

function UserReimportFilePage(props: { user: UserData }) {
  const { user } = props

  const close = useCloseContext().getOrThrow()
  const store = useStoreContext().getOrThrow()

  const [flipped, setFlipped] = useState(false)

  const [$name, setName] = useState(user.name)
  const [$pass, setPass] = useState("")

  const name = useDeferredValue($name || "Anon")
  const pass = useDeferredValue($pass)

  const [file, setFile] = useState<Nullable<File>>()

  const loadOrAlert = useCallback(() => Promise.try(async () => {
    if (file == null)
      return

    const data = new Uint8Array(await file.arrayBuffer())

    const encrypted = Readable.readFromBytesOrThrow(KDBX.Database.Encrypted, data)
    const composite = await KDBX.CompositeKey.digestOrThrow(await KDBX.PasswordKey.digestOrThrow(new TextEncoder().encode(pass)))

    await encrypted.decryptOrThrow(composite)

    if (!confirm("Do you want to create a passkey?")) {
      const uuid = user.uuid

      const stale = await store.value.getOrThrow().getOrThrow<Array<UserData>>("users") || []

      const fresh = stale.map(x => x.uuid === user.uuid ? { uuid, name } : x)

      await store.value.getOrThrow().setOrThrow("users", fresh)

      store.update()

      close()

      return
    }

    const uuid = user.uuid

    const auth = await webAuthnStorage.createOrThrow(uuid.slice(0, 8), composite.value.bytes)

    const stale = await store.value.getOrThrow().getOrThrow<Array<UserData>>("users") || []

    const fresh = stale.map(x => x.uuid === user.uuid ? { uuid, name, auth } : x)

    await store.value.getOrThrow().setOrThrow("users", fresh)

    store.update()

    close()
  }).catch(Errors.display), [user, store, name, file, pass, close])

  const error = useMemo(() => {
    if (file == null)
      return "File is required"
    if (!pass.length)
      return "Password is required"
    return
  }, [file, pass])

  return <div className="flex flex-col grow p-6">
    <h1 className="text-xl font-medium">
      Reimport user
    </h1>
    <form className="grow flex flex-col"
      onSubmit={Events.preventDefault}>
      <input className="hidden"
        autoComplete="off"
        name="username" />
      <div className="h-6" />
      <div className="font-medium">
        {Lang.match({
          en: "Name",
          zh: "名称",
          hi: "नाम",
          es: "Nombre",
          ar: "اسم",
          fr: "Nom",
          de: "Name",
          ru: "Имя",
          pt: "Nome",
          ja: "名前",
          pa: "ਨਾਮ",
          bn: "নাম",
          id: "Nama",
          ur: "نام",
          ms: "Nama",
          it: "Nome",
          tr: "İsim",
          ta: "பெயர்",
          te: "పేరు",
          ko: "이름",
          vi: "Tên",
          pl: "Nazwa",
          ro: "Nume",
          nl: "Naam",
          el: "Όνομα",
          th: "ชื่อ",
          cs: "Jméno",
          hu: "Név",
          sv: "Namn",
          da: "Navn",
        })}
      </div>
      <div className="text-default-contrast">
        {Lang.match({
          en: "Will be used locally for display purposes.",
          zh: "将被本地使用，仅用于显示。",
          hi: "स्थानीय रूप से प्रदर्शन उद्देश्यों के लिए उपयोग किया जाएगा।",
          es: "Se usará localmente para fines de visualización.",
          ar: "سيتم استخدامه محليًا لأغراض العرض.",
          fr: "Sera utilisé localement à des fins d'affichage.",
          de: "Wird lokal für Anzeigezwecke verwendet.",
          ru: "Будет использоваться локально для отображения.",
          pt: "Será usado localmente para fins de exibição.",
          ja: "表示目的でローカルに使用されます。",
          pa: "ਡਿਸਪਲੇਅ ਦੇ ਉਦੇਸ਼ਾਂ ਲਈ ਸਥਾਨਕ ਤੌਰ 'ਤੇ ਵਰਤਿਆ ਜਾਵੇਗਾ।",
          bn: "প্রদর্শন উদ্দেশ্যে স্থানীয়ভাবে ব্যবহৃত হবে।",
          id: "Akan digunakan secara lokal untuk tujuan tampilan.",
          ur: "ڈسپلے کے مقاصد کے لیے مقامی طور پر استعمال کیا جائے گا۔",
          ms: "Akan digunakan secara lokal untuk tujuan tampilan.",
          it: "Sarà usato localmente per scopi di visualizzazione.",
          tr: "Görüntüleme amaçları için yerel olarak kullanılacaktır.",
          ta: "காட்சிப்படுத்தும் நோக்கங்களுக்காக உள்ளூரில் பயன்படுத்தப்படும்.",
          te: "ప్రదర్శన లక్ష్యాల కోసం స్థానికంగా ఉపయోగించబడుతుంది.",
          ko: "디스플레이 목적으로 로컬에서 사용됩니다.",
          vi: "Sẽ được sử dụng cục bộ cho mục đích hiển thị.",
          pl: "Będzie używany lokalnie do celów wyświetlania.",
          ro: "Va fi folosit local pentru scopuri de afișare.",
          nl: "Zal lokaal worden gebruikt voor weergavedoeleinden.",
          el: "Θα χρησιμοποιείται τοπικά για σκοπούς εμφάνισης.",
          th: "จะใช้ในพื้นที่สำหรับวัตถุประสงค์ในการแสดงผล",
          cs: "Bude používán lokálně pro zobrazení.",
          hu: "Helyileg lesz használva megjelenítési célokra.",
          sv: "Kommer att användas lokalt för visningsändamål.",
          da: "Vil blive brugt lokalt til visningsformål.",
        })}
      </div>
      <div className="h-4" />
      <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
        <input className="w-full focus-visible:outline-none"
          autoComplete="off"
          placeholder="Anon"
          value={$name}
          onChange={e => setName(e.target.value)} />
      </div>
      <div className="h-6" />
      <div className="font-medium">
        {Lang.match({
          en: "File",
          zh: "文件",
          hi: "फ़ाइल",
          es: "Archivo",
          ar: "ملف",
          fr: "Fichier",
          de: "Datei",
          ru: "Файл",
          pt: "Arquivo",
          ja: "ファイル",
          pa: "ਫਾਇਲ",
          bn: "ফাইল",
          id: "Berkas",
          ur: "فائل",
          ms: "Berkas",
          it: "File",
          tr: "Dosya",
          ta: "கோப்பு",
          te: "ఫైల్",
          ko: "파일",
          vi: "Tệp",
          pl: "Plik",
          ro: "Fișier",
          nl: "Bestand",
          el: "Αρχείο",
          th: "ไฟล์",
          cs: "Soubor",
          hu: "Fájl",
          sv: "Fil",
          da: "Fil",
        })}
      </div>
      <div className="text-default-contrast">
        {Lang.match({
          en: "Your existing KDBX file.",
          zh: "您现有的 KDBX 文件。",
          hi: "आपकी मौजूदा KDBX फ़ाइल।",
          es: "Tu archivo KDBX existente.",
          ar: "ملف KDBX الحالي الخاص بك.",
          fr: "Votre fichier KDBX existant.",
          de: "Ihre vorhandene KDBX-Datei.",
          ru: "Ваш существующий файл KDBX.",
          pt: "Seu arquivo KDBX existente.",
          ja: "既存の KDBX ファイル。",
          pa: "ਤੁਹਾਡੀ ਮੌਜੂਦਾ KDBX ਫਾਇਲ।",
          bn: "আপনার বিদ্যমান KDBX ফাইল।",
          id: "File KDBX Anda yang ada.",
          ur: "آپ کی موجودہ KDBX فائل۔",
          ms: "File KDBX Anda yang ada.",
          it: "Il tuo file KDBX esistente.",
          tr: "Mevcut KDBX dosyanız.",
          ta: "உங்கள் தற்போதைய KDBX கோப்பு.",
          te: "మీ ప్రస్తుత KDBX ఫైల్.",
          ko: "기존 KDBX 파일입니다.",
          vi: "Tệp KDBX hiện có của bạn.",
          pl: "Twój istniejący plik KDBX.",
          ro: "Fișierul KDBX existent.",
          nl: "Uw bestaande KDBX-bestand.",
          el: "Το υπάρχον αρχείο KDBX σας.",
          th: "ไฟล์ KDBX ที่มีอยู่ของคุณ",
          cs: "Váš stávající soubor KDBX.",
          hu: "A meglévő KDBX fájlod.",
          sv: "Din befintliga KDBX-fil.",
          da: "Din eksisterende KDBX-fil.",
        })}
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
            {Lang.match({
              en: "Pick or drop file here",
              zh: "在此处选择或拖放文件",
              hi: "यहां फ़ाइल चुनें या ड्रॉप करें",
              es: "Seleccione o suelte el archivo aquí",
              ar: "اختر أو اسقط الملف هنا",
              fr: "Choisissez ou déposez le fichier ici",
              de: "Datei hier auswählen oder ablegen",
              ru: "Выберите или перетащите файл сюда",
              pt: "Escolha ou solte o arquivo aqui",
              ja: "ここでファイルを選択またはドロップ",
              pa: "ਇੱਥੇ ਫਾਇਲ ਚੁਣੋ ਜਾਂ ਡਰੌਪ ਕਰੋ",
              bn: "এখানে ফাইল নির্বাচন করুন বা ড্রপ করুন",
              id: "Pilih atau jatuhkan file di sini",
              ur: "فائل یہاں منتخب کریں یا ڈراپ کریں",
              ms: "Pilih atau jatuhkan file di sini",
              it: "Scegli o trascina il file qui",
              tr: "Dosyayı buraya seçin veya bırakın",
              ta: "கோப்பை இங்கே தேர்ந்தெடுக்கவும் அல்லது விடவும்",
              te: "ఫైల్‌ను ఇక్కడ ఎంచుకోండి లేదా డ్రాప్ చేయండి",
              ko: "여기에 파일을 선택하거나 드롭하세요",
              vi: "Chọn hoặc thả tệp ở đây",
              pl: "Wybierz lub upuść plik tutaj",
              ro: "Alegeți sau aruncați fișierul aici",
              nl: "Kies of drop het bestand hier",
              el: "Επιλέξτε ή ρίξτε το αρχείο εδώ",
              th: "เลือกหรือวางไฟล์ที่นี่",
              cs: "Vyberte nebo přetáhněte soubor sem",
              hu: "Válassza ki vagy dobja ide a fájlt",
              sv: "Välj eller släpp filen här",
              da: "Vælg eller slip filen her",
            })}
          </div>}
      </div>
      <div className="h-6" />
      <div className="font-medium">
        Password
      </div>
      <div className="text-default-contrast">
        Your existing password to decrypt the file.&lrm;
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
          disabled={error != null}
          onClick={loadOrAlert}>
          {error != null ? error : "Open"}
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

  const name = useDeferredValue($name || "Anon")
  const pass = useDeferredValue($pass)

  const [fsfh, setFsfh] = useState<Nullable<FileSystemFileHandle>>(user.fsfh)

  const pickOrAlert = useCallback(() => Promise.try(async () => {
    const [fsfh] = await window.showOpenFilePicker!({ id: "root", startIn: "documents", types: [{ description: "KDBX", accept: { "application/kdbx": [".kdbx"] } }] })

    if (fsfh == null)
      return
    if (fsfh.kind !== "file")
      return

    setFsfh(fsfh)
  }).catch(Errors.display), [])

  const dropOrAlert = useCallback((e: DragEvent<HTMLButtonElement>) => Promise.try(async () => {
    e.preventDefault()

    const [item] = e.dataTransfer.items as unknown as Iterable<DataTransferItem>

    const fsfh = await item.getAsFileSystemHandle!()

    if (fsfh.kind !== "file")
      return

    setFsfh(fsfh)
  }).catch(Errors.display), [])

  const openOrAlert = useCallback(() => Promise.try(async () => {
    if (fsfh == null)
      return

    const file = await fsfh.getFile()
    const data = new Uint8Array(await file.arrayBuffer())

    const encrypted = Readable.readFromBytesOrThrow(KDBX.Database.Encrypted, data)
    const composite = await KDBX.CompositeKey.digestOrThrow(await KDBX.PasswordKey.digestOrThrow(new TextEncoder().encode(pass)))

    await encrypted.decryptOrThrow(composite)

    if (!confirm("Do you want to create a passkey?")) {
      const uuid = user.uuid

      const stale = await store.value.getOrThrow().getOrThrow<Array<UserData>>("users") || []

      const fresh = stale.map(x => x.uuid === user.uuid ? { uuid, name, fsfh } : x)

      await store.value.getOrThrow().setOrThrow("users", fresh)

      store.update()

      close()

      return
    }

    const uuid = user.uuid

    const auth = await webAuthnStorage.createOrThrow(uuid.slice(0, 8), composite.value.bytes)

    const stale = await store.value.getOrThrow().getOrThrow<Array<UserData>>("users") || []

    const fresh = stale.map(x => x.uuid === user.uuid ? { uuid, name, fsfh, auth } : x)

    await store.value.getOrThrow().setOrThrow("users", fresh)

    store.update()

    close()
  }).catch(Errors.display), [user, store, name, fsfh, pass, close])

  const error = useMemo(() => {
    if (fsfh == null)
      return "File is required"
    if (!pass.length)
      return "Password is required"
    return
  }, [fsfh, pass])

  return <div className="flex flex-col grow p-6">
    <h1 className="text-xl font-medium">
      Reimport user
    </h1>
    <form className="grow flex flex-col"
      onSubmit={Events.preventDefault}>
      <input className="hidden"
        autoComplete="off"
        name="username" />
      <div className="h-6" />
      <div className="font-medium">
        {Lang.match({
          en: "Name",
          zh: "名称",
          hi: "नाम",
          es: "Nombre",
          ar: "اسم",
          fr: "Nom",
          de: "Name",
          ru: "Имя",
          pt: "Nome",
          ja: "名前",
          pa: "ਨਾਮ",
          bn: "নাম",
          id: "Nama",
          ur: "نام",
          ms: "Nama",
          it: "Nome",
          tr: "İsim",
          ta: "பெயர்",
          te: "పేరు",
          ko: "이름",
          vi: "Tên",
          pl: "Nazwa",
          ro: "Nume",
          nl: "Naam",
          el: "Όνομα",
          th: "ชื่อ",
          cs: "Jméno",
          hu: "Név",
          sv: "Namn",
          da: "Navn",
        })}
      </div>
      <div className="text-default-contrast">
        {Lang.match({
          en: "Will be used locally for display purposes.",
          zh: "将被本地使用，仅用于显示。",
          hi: "स्थानीय रूप से प्रदर्शन उद्देश्यों के लिए उपयोग किया जाएगा।",
          es: "Se usará localmente para fines de visualización.",
          ar: "سيتم استخدامه محليًا لأغراض العرض.",
          fr: "Sera utilisé localement à des fins d'affichage.",
          de: "Wird lokal für Anzeigezwecke verwendet.",
          ru: "Будет использоваться локально для отображения.",
          pt: "Será usado localmente para fins de exibição.",
          ja: "表示目的でローカルに使用されます。",
          pa: "ਡਿਸਪਲੇਅ ਦੇ ਉਦੇਸ਼ਾਂ ਲਈ ਸਥਾਨਕ ਤੌਰ 'ਤੇ ਵਰਤਿਆ ਜਾਵੇਗਾ।",
          bn: "প্রদর্শন উদ্দেশ্যে স্থানীয়ভাবে ব্যবহৃত হবে।",
          id: "Akan digunakan secara lokal untuk tujuan tampilan.",
          ur: "ڈسپلے کے مقاصد کے لیے مقامی طور پر استعمال کیا جائے گا۔",
          ms: "Akan digunakan secara lokal untuk tujuan tampilan.",
          it: "Sarà usato localmente per scopi di visualizzazione.",
          tr: "Görüntüleme amaçları için yerel olarak kullanılacaktır.",
          ta: "காட்சிப்படுத்தும் நோக்கங்களுக்காக உள்ளூரில் பயன்படுத்தப்படும்.",
          te: "ప్రదర్శన లక్ష్యాల కోసం స్థానికంగా ఉపయోగించబడుతుంది.",
          ko: "디스플레이 목적으로 로컬에서 사용됩니다.",
          vi: "Sẽ được sử dụng cục bộ cho mục đích hiển thị.",
          pl: "Będzie używany lokalnie do celów wyświetlania.",
          ro: "Va fi folosit local pentru scopuri de afișare.",
          nl: "Zal lokaal worden gebruikt voor weergavedoeleinden.",
          el: "Θα χρησιμοποιείται τοπικά για σκοπούς εμφάνισης.",
          th: "จะใช้ในพื้นที่สำหรับวัตถุประสงค์ในการแสดงผล",
          cs: "Bude používán lokálně pro zobrazení.",
          hu: "Helyileg lesz használva megjelenítési célokra.",
          sv: "Kommer att användas lokalt för visningsändamål.",
          da: "Vil blive brugt lokalt til visningsformål.",
        })}
      </div>
      <div className="h-4" />
      <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
        <input className="w-full focus-visible:outline-none"
          autoComplete="off"
          placeholder="Anon"
          value={$name}
          onChange={e => setName(e.target.value)} />
      </div>
      <div className="h-6" />
      <div className="font-medium">
        {Lang.match({
          en: "File",
          zh: "文件",
          hi: "फ़ाइल",
          es: "Archivo",
          ar: "ملف",
          fr: "Fichier",
          de: "Datei",
          ru: "Файл",
          pt: "Arquivo",
          ja: "ファイル",
          pa: "ਫਾਇਲ",
          bn: "ফাইল",
          id: "Berkas",
          ur: "فائل",
          ms: "Berkas",
          it: "File",
          tr: "Dosya",
          ta: "கோப்பு",
          te: "ఫైల్",
          ko: "파일",
          vi: "Tệp",
          pl: "Plik",
          ro: "Fișier",
          nl: "Bestand",
          el: "Αρχείο",
          th: "ไฟล์",
          cs: "Soubor",
          hu: "Fájl",
          sv: "Fil",
          da: "Fil",
        })}
      </div>
      <div className="text-default-contrast">
        {Lang.match({
          en: "Your existing KDBX file.",
          zh: "您现有的 KDBX 文件。",
          hi: "आपकी मौजूदा KDBX फ़ाइल।",
          es: "Tu archivo KDBX existente.",
          ar: "ملف KDBX الحالي الخاص بك.",
          fr: "Votre fichier KDBX existant.",
          de: "Ihre vorhandene KDBX-Datei.",
          ru: "Ваш существующий файл KDBX.",
          pt: "Seu arquivo KDBX existente.",
          ja: "既存の KDBX ファイル。",
          pa: "ਤੁਹਾਡੀ ਮੌਜੂਦਾ KDBX ਫਾਇਲ।",
          bn: "আপনার বিদ্যমান KDBX ফাইল।",
          id: "File KDBX Anda yang ada.",
          ur: "آپ کی موجودہ KDBX فائل۔",
          ms: "File KDBX Anda yang ada.",
          it: "Il tuo file KDBX esistente.",
          tr: "Mevcut KDBX dosyanız.",
          ta: "உங்கள் தற்போதைய KDBX கோப்பு.",
          te: "మీ ప్రస్తుత KDBX ఫైల్.",
          ko: "기존 KDBX 파일입니다.",
          vi: "Tệp KDBX hiện có của bạn.",
          pl: "Twój istniejący plik KDBX.",
          ro: "Fișierul KDBX existent.",
          nl: "Uw bestaande KDBX-bestand.",
          el: "Το υπάρχον αρχείο KDBX σας.",
          th: "ไฟล์ KDBX ที่มีอยู่ของคุณ",
          cs: "Váš stávající soubor KDBX.",
          hu: "A meglévő KDBX fájlod.",
          sv: "Din befintliga KDBX-fil.",
          da: "Din eksisterende KDBX-fil.",
        })}
      </div>
      <div className="h-4" />
      <div className="relative bg-default-contrast rounded-xl [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
        {"showOpenFilePicker" in window === true &&
          <button className="absolute inset-0 opacity-0 cursor-pointer"
            type="button"
            onClick={pickOrAlert}
            onDragOver={Events.preventDefault}
            onDrop={dropOrAlert} />}
        {fsfh != null &&
          <div className="po-2">
            {fsfh.name}
          </div>}
        {fsfh == null &&
          <div className="po-2">
            {Lang.match({
              en: "Pick or drop file here",
              zh: "在此处选择或拖放文件",
              hi: "यहां फ़ाइल चुनें या ड्रॉप करें",
              es: "Seleccione o suelte el archivo aquí",
              ar: "اختر أو اسقط الملف هنا",
              fr: "Choisissez ou déposez le fichier ici",
              de: "Datei hier auswählen oder ablegen",
              ru: "Выберите или перетащите файл сюда",
              pt: "Escolha ou solte o arquivo aqui",
              ja: "ここでファイルを選択またはドロップ",
              pa: "ਇੱਥੇ ਫਾਇਲ ਚੁਣੋ ਜਾਂ ਡਰੌਪ ਕਰੋ",
              bn: "এখানে ফাইল নির্বাচন করুন বা ড্রপ করুন",
              id: "Pilih atau jatuhkan file di sini",
              ur: "فائل یہاں منتخب کریں یا ڈراپ کریں",
              ms: "Pilih atau jatuhkan file di sini",
              it: "Scegli o trascina il file qui",
              tr: "Dosyayı buraya seçin veya bırakın",
              ta: "கோப்பை இங்கே தேர்ந்தெடுக்கவும் அல்லது விடவும்",
              te: "ఫైల్‌ను ఇక్కడ ఎంచుకోండి లేదా డ్రాప్ చేయండి",
              ko: "여기에 파일을 선택하거나 드롭하세요",
              vi: "Chọn hoặc thả tệp ở đây",
              pl: "Wybierz lub upuść plik tutaj",
              ro: "Alegeți sau aruncați fișierul aici",
              nl: "Kies of drop het bestand hier",
              el: "Επιλέξτε ή ρίξτε το αρχείο εδώ",
              th: "เลือกหรือวางไฟล์ที่นี่",
              cs: "Vyberte nebo přetáhněte soubor sem",
              hu: "Válassza ki vagy dobja ide a fájlt",
              sv: "Välj eller släpp filen här",
              da: "Vælg eller slip filen her",
            })}
          </div>}
      </div>
      <div className="h-6" />
      <div className="font-medium">
        Password
      </div>
      <div className="text-default-contrast">
        Your existing password to decrypt the file.&lrm;
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
          disabled={error != null}
          onClick={openOrAlert}>
          {error != null ? error : "Open"}
        </WideOppositeButton>
      </div>
    </form>
  </div>
}

function UserRemoveButton(props: { user: UserData }) {
  const { user } = props

  const close = useCloseContext().getOrThrow()
  const store = useStoreContext().getOrThrow()

  const removeOrAlert = useCallback(() => Promise.try(async () => {
    if (!confirm("Are you sure you want to remove this user?"))
      return

    const stale = await store.value.getOrThrow().getOrThrow<Array<UserData>>("users") || []

    const fresh = stale.filter(x => x.uuid !== user.uuid)

    await store.value.getOrThrow().setOrThrow("users", fresh)

    store.update()

    close()
  }).catch(Errors.display), [store, user, close])

  return <WideNakedMenuButton
    onClick={removeOrAlert}>
    <Outline.TrashIcon className="size-5" />
    Remove
  </WideNakedMenuButton>
}