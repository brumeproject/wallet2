import { InAnchor } from "@/libs/anchor/mod.tsx";
import { InButton, WideContrastButton, WideOppositeButton } from "@/libs/button/mod.tsx";
import { useCopy } from "@/libs/copy/mod.ts";
import { PathBoard } from "@/libs/dialog/board/mod.tsx";
import { PathPaper, WideNakedMenuAnchor, WideNakedMenuButton } from "@/libs/dialog/paper/mod.tsx";
import { Errors } from "@/libs/errors/mod.ts";
import { Events } from "@/libs/events/mod.ts";
import { Outline } from "@/libs/heroicons/mod.ts";
import { getRecycleBinOrNull } from "@/libs/kdbx/mod.ts";
import { Lang } from "@/libs/lang/mod.ts";
import { Nullable } from "@/libs/nullable/mod.ts";
import { capitalize } from "@/libs/string/mod.ts";
import { useTotpCode } from "@/libs/totp/mod.ts";
import { Writable } from "@hazae41/binary";
import { MoneroSeedPhrase } from "@hazae41/broca";
import { SubpathProvider, useAnchorWithCoords, useHashSubpath, usePathContext } from "@hazae41/chemin";
import * as KDBX from "@hazae41/kdbx";
import { useCloseContext } from "@hazae41/react-close-context";
import jsqr from "jsqr";
import React, { ChangeEvent, Fragment, useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";
import { useSessionContext } from "../../mod.tsx";
import { AccountMenuAnchor, AccountMenuDeleteButton, AccountMenuTrashButton, AccountMenuUntrashButton, ColorAnchor, ColorMenu, PasswordAccountCard } from "../mod.tsx";

React;

export function PasswordAccountPage(props: { $entry: KDBX.Inner.KeePassFile.Entry }) {
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

  const copyTheUsername = useCopy(username)
  const copyThePassword = useCopy(password)
  const copyTheTotpcode = useCopy(totpcode)

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
          {Lang.match({ en: "Password account", zh: "密码账户", hi: "पासवर्ड खाता", es: "Cuenta de contraseña", ar: "حساب كلمة المرور", fr: "Compte de mot de passe", de: "Passwortkonto", ru: "Учетная запись пароля", pt: "Conta de senha", ja: "パスワードアカウント", pa: "ਪਾਸਵਰਡ ਖਾਤਾ", bn: "পাসওয়ার্ড অ্যাকাউন্ট", id: "Akun Kata Sandi", ur: "پاس ورڈ اکاؤنٹ", ms: "Akaun Kata Laluan", it: "Account password", tr: "Parola hesabı", ta: "கடவுச்சொல் கணக்கு", te: "పాస్వర్డ్ ఖాతా", ko: "비밀번호 계정", vi: "Tài khoản mật khẩu", pl: "Konto hasła", ro: "Cont de parolă", nl: "Wachtwoordaccount", el: "Λογαριασμός κωδικού πρόσβασης", th: "บัญชีรหัสผ่าน", cs: "Účet hesla", hu: "Jelszó fiók", sv: "Lösenordskonto", da: "Adgangskodekonto" })}
        </h1>
        <AccountMenuAnchor />
      </div>
      <div className="h-6" />
      <div className="flex items-center justify-center">
        <PasswordAccountCard
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
            {Lang.match({ en: "Username", zh: "用户名", hi: "उपयोगकर्ता नाम", es: "Nombre de usuario", ar: "اسم المستخدم", fr: "Nom d'utilisateur", de: "Nutzername", ru: "Имя пользователя", pt: "Nome de usuário", ja: "ユーザー名", pa: "ਉਪਭੋਗਤਾ ਨਾਮ", bn: "ব্যবহারকারীর নাম", id: "Nama pengguna", ur: "صارف نام", ms: "Nama pengguna", it: "Nome utente", tr: "Kullanıcı adı", ta: "பயனர்பெயர்", te: "వినియోగదారు పేరు", ko: "사용자 이름", vi: "Tên đăng nhập", pl: "Nazwa użytkownika", ro: "Nume de utilizator", nl: "Gebruikersnaam", el: "Όνομα χρήστη", th: "ชื่อผู้ใช้", cs: "Uživatelské jméno", hu: "Felhasználónév", sv: "Användarnamn", da: "Brugernavn" })}
          </div>
          <div className="text-default-contrast">
            {Lang.match({ en: "Your username or email.", zh: "您的用户名或电子邮件。", hi: "आपका उपयोगकर्ता नाम या ईमेल।", es: "Su nombre de usuario o correo electrónico.", ar: "اسم المستخدم أو البريد الإلكتروني الخاص بك.", fr: "Votre nom d'utilisateur ou e-mail.", de: "Ihr Benutzername oder Ihre E-Mail.", ru: "Ваше имя пользователя или электронная почта.", pt: "Seu nome de usuário ou e-mail.", ja: "あなたのユーザー名またはメールアドレス。", pa: "ਤੁਹਾਡਾ ਉਪਭੋਗਤਾ ਨਾਮ ਜਾਂ ਈਮੇਲ।", bn: "আপনার ব্যবহারকারীর নাম বা ইমেল।", id: "Nama pengguna atau email Anda.", ur: "آپ کا صارف نام یا ای میل۔", ms: "Nama pengguna atau e-mel anda.", it: "Il tuo nome utente o email.", tr: "Kullanıcı adınız veya e-posta adresiniz.", ta: "உங்கள் பயனர்பெயர் அல்லது மின்னஞ்சல்.", te: "మీ వినియోగదారు పేరు లేదా ఇమెయిల్.", ko: "사용자 이름 또는 이메일.", vi: "Tên người dùng hoặc email của bạn.", pl: "Twoja nazwa użytkownika lub e-mail.", ro: "Numele de utilizator sau e-mailul dvs.", nl: "Uw gebruikersnaam of e-mail.", el: "Το όνομα χρήστη ή το email σας.", th: "ชื่อผู้ใช้หรืออีเมลของคุณ.", cs: "Vaše uživatelské jméno nebo e-mail.", hu: "Felhasználóneved vagy e-mail címed.", sv: "Ditt användarnamn eller e-post.", da: "Dit brugernavn eller e-mail." })}
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
        {password && <Fragment>
          <div className="h-6" />
          <div className="font-medium">
            {Lang.match({ en: "Password", zh: "密码", hi: "पासवर्ड", es: "Contraseña", ar: "كلمة المرور", fr: "Mot de passe", de: "Passwort", ru: "Пароль", pt: "Senha", ja: "パスワード", pa: "ਪਾਸਵਰਡ", bn: "পাসওয়ার্ড", id: "Kata sandi", ur: "پاس ورڈ", ms: "Kata laluan", it: "Password", tr: "Parola", ta: "கடவுச்சொல்", te: "పాస్వర్డ్", ko: "비밀번호", vi: "Mật khẩu", pl: "Hasło", ro: "Parolă", nl: "Wachtwoord", el: "Κωδικός πρόσβασης", th: "รหัสผ่าน", cs: "Heslo", hu: "Jelszó", sv: "Lösenord", da: "Adgangskode" })}
          </div>
          <div className="text-default-contrast">
            {Lang.match({ en: "Your password.", zh: "您的密码。", hi: "आपका पासवर्ड।", es: "Su contraseña.", ar: "كلمة المرور الخاصة بك.", fr: "Votre mot de passe.", de: "Ihr Passwort.", ru: "Ваш пароль.", pt: "Sua senha.", ja: "あなたのパスワード。", pa: "ਤੁਹਾਡਾ ਪਾਸਵਰਡ।", bn: "আপনার পাসওয়ার্ড।", id: "Kata sandi Anda.", ur: "آپ کا پاس ورڈ۔", ms: "Kata laluan anda.", it: "La tua password.", tr: "Parolanız.", ta: "உங்கள் கடவுச்சொல்.", te: "మీ పాస్వర్డ్.", ko: "귀하의 비밀번호.", vi: "Mật khẩu của bạn.", pl: "Twoje hasło.", ro: "Parola dvs.", nl: "Uw wachtwoord.", el: "Ο κωδικός πρόσβασής σας.", th: "รหัสผ่านของคุณ.", cs: "Vaše heslo.", hu: "A jelszavad.", sv: "Ditt lösenord.", da: "Din adgangskode." })}
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
            {Lang.match({ en: "Notes", zh: "备注", hi: "नोट्स", es: "Notas", ar: "ملاحظات", fr: "Notes", de: "Notizen", ru: "Заметки", pt: "Notas", ja: "ノート", pa: "ਨੋਟਸ", bn: "নোটস", id: "Catatan", ur: "نوٹس", ms: "Catatan", it: "Note", tr: "Notlar", ta: "குறிப்புகள்", te: "గమనికలు", ko: "노트", vi: "Ghi chú", pl: "Notatki", ro: "Note", nl: "Notities", el: "Σημειώσεις", th: "บันทึกย่อ", cs: "Poznámky", hu: "Jegyzetek", sv: "Anteckningar", da: "Noter" })}
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

export function PasswordAccountAddMenuAnchor() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, "/password")

  return <WideNakedMenuAnchor
    href={coords.url.hash}
    onClick={coords.onClick}
    onKeyDown={coords.onKeyDown}>
    <Outline.LanguageIcon className="size-5" />
    {Lang.match({ en: "Password", zh: "密码", hi: "पासवर्ड", es: "Contraseña", ar: "كلمة المرور", fr: "Mot de passe", de: "Passwort", ru: "Пароль", pt: "Senha", ja: "パスワード", pa: "ਪਾਸਵਰਡ", bn: "পাসওয়ার্ড", id: "Kata sandi", ur: "پاس ورڈ", ms: "Kata laluan", it: "Password", tr: "Parola", ta: "கடவுச்சொல்", te: "పాస్వర్డ్", ko: "비밀번호", vi: "Mật khẩu", pl: "Hasło", ro: "Parolă", nl: "Wachtwoord", el: "Κωδικός πρόσβασης", th: "รหัสผ่าน", cs: "Heslo", hu: "Jelszó", sv: "Lösenord", da: "Adgangskode" })}
  </WideNakedMenuAnchor>
}

export function TotpPageAnchor() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, "/totp")

  return <a className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none"
    href={coords.url.hash}
    onClick={coords.onClick}
    onKeyDown={coords.onKeyDown}>
    <InAnchor>
      <Outline.QrCodeIcon className="size-5" />
    </InAnchor>
  </a>
}

export function ScanPage(props: { value: string } & { onChange(value: string): void }) {
  const { value, onChange } = props

  const close = useCloseContext().getOrThrow()

  const [text, setText] = [value, onChange]

  const onClose = useCallback(() => {
    close()
  }, [close])

  const onFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => Promise.try(async () => {
    using stack = new DisposableStack()

    const file = e.target.files?.item(0)

    if (file == null)
      return

    const bitmap = await createImageBitmap(file)

    stack.defer(() => bitmap.close())

    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height)

    const context = canvas.getContext("2d")

    if (context == null)
      return

    await new Promise(requestAnimationFrame)

    context.drawImage(bitmap, 0, 0)

    const { data, width, height } = context.getImageData(0, 0, canvas.width, canvas.height)

    const result = jsqr.default(data, width, height)

    if (!result?.data)
      return

    setText(result.data)

    close()
  }).catch(Errors.display), [])

  const [video, setVideo] = useState<Nullable<HTMLVideoElement>>()

  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment")

  const [torch, setTorch] = useState(false)

  const captureOrAlert = useCallback((signal: AbortSignal) => Promise.try(async () => {
    using stack = new DisposableStack()

    if (video == null)
      return

    const devices = await navigator.mediaDevices.enumerateDevices()
    const cameras = devices.filter(d => d.kind === "videoinput")

    if (cameras.length === 0)
      return

    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode, torch } } as unknown as MediaStreamConstraints)

    stack.defer(() => stream.getTracks().forEach(t => t.stop()))

    video.srcObject = stream

    stack.defer(() => video.srcObject = null)

    await video.play()

    const canvas = new OffscreenCanvas(video.videoWidth, video.videoHeight)
    const context = canvas.getContext("2d", { willReadFrequently: true })

    if (context == null)
      return

    while (!signal.aborted) {
      await new Promise(requestAnimationFrame)

      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      const { data, width, height } = context.getImageData(0, 0, canvas.width, canvas.height)

      const result = jsqr.default(data, width, height)

      if (signal.aborted)
        break

      if (!result?.data)
        continue

      setText(result.data)

      close()

      break
    }
  }).catch(Errors.display), [facingMode, video, torch])

  useEffect(() => {
    const aborter = new AbortController()

    captureOrAlert(aborter.signal)

    return () => aborter.abort()
  }, [captureOrAlert])

  /**
   * Fix iOS Safari pausing the video after browser prompts
   */
  useEffect(() => {
    if (video == null)
      return

    const i = setInterval(() => {
      video.play().catch(console.warn)
    }, 1000)

    return () => clearInterval(i)
  }, [video])

  return <div className="flex flex-col grow p-6">
    <h1 className="text-xl font-medium">
      {Lang.match({ en: "Scan QR code", zh: "扫描二维码", hi: "क्यूआर कोड स्कैन करें", es: "Escanear código QR", ar: "مسح رمز الاستجابة السريعة", fr: "Scanner le code QR", de: "QR-Code scannen", ru: "Сканировать QR-код", pt: "Escanear código QR", ja: "QRコードをスキャンする", pa: "QR ਕੋਡ ਸਕੈਨ ਕਰੋ", bn: "QR কোড স্ক্যান করুন", id: "Pindai kode QR", ur: "کیو آر کوڈ اسکین کریں", ms: "Imbas kode QR", it: "Scansiona codice QR", tr: "QR kodunu tara", ta: "QR குறியீட்டை ஸ்கேன் செய்யவும்", te: "QR కోడ్ స్కాన్ చేయండి", ko: "QR 코드 스캔하기", vi: "Quét mã QR", pl: "Skanuj kod QR", ro: "Scanează codul QR", nl: "Scan QR-code", el: "Σάρωση κωδικού QR", th: "สแกนรหัส QR", cs: "Skenovat QR kód", hu: "QR-kód beolvasása", sv: "Skanna QR-kod", da: "Scan QR-kode" })}
    </h1>
    <div className="h-4" />
    <div className="flex flex-col grow rounded-xl relative">
      <video className="h-full md:aspect-video object-cover rounded-xl bg-black" muted autoPlay playsInline loop
        src="/noise.mp4"
        ref={setVideo} />
      <div className="absolute bottom-0 w-full flex items-center p-4">
        <div className="group relative text-white bg-neutral-500/80 rounded-full p-2  [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-neutral-500/80">
          <input className="absolute z-10 inset-0 opacity-0 cursor-pointer rounded-full"
            type="file"
            accept="image/*"
            onChange={onFileChange} />
          <InAnchor>
            <Outline.ArrowUpTrayIcon className="size-6" />
          </InAnchor>
        </div>
        <div className="grow" />
        <button className="group text-white bg-neutral-500/80 rounded-full p-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-500/80"
          onClick={() => setTorch(x => !x)}
          type="button">
          <InButton>
            {torch ? <Outline.BoltSlashIcon className="size-6" /> : <Outline.BoltIcon className="size-6" />}
          </InButton>
        </button>
        <div className="w-2" />
        <button className="group text-white bg-neutral-500/80 rounded-full p-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-500/80"
          onClick={() => setFacingMode(x => x === "environment" ? "user" : "environment")}
          type="button">
          <InButton>
            <Outline.ArrowPathIcon className="size-6" />
          </InButton>
        </button>
      </div>
    </div>
    <div className="h-4" />
    <div className="flex items-center">
      <WideContrastButton
        onClick={onClose}>
        <Outline.EyeSlashIcon className="size-5" />
        {Lang.match({ en: "Close", zh: "关闭", hi: "बंद करें", es: "Cerrar", ar: "قريب", fr: "Fermer", de: "Schließen", ru: "Закрыть", pt: "Fechar", ja: "閉じる", pa: "ਬੰਦ ਕਰੋ", bn: "বন্ধ করুন", id: "Tutup", ur: "بند کریں", ms: "Tutup", it: "Chiudi", tr: "Kapat", ta: "மூடு", te: "మూసివేయి", ko: "닫기", vi: "Đóng lại", pl: "Zamknij", ro: "Închideți", nl: "Sluiten", el: "Κλείσιμο", th: "ปิด", cs: "Zavřít", hu: "Bezárás", sv: "Stänga", da: "Luk" })}
      </WideContrastButton>
    </div>
  </div>
}

export function PasswordMenuAnchor() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, "/password")

  return <a className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none"
    href={coords.url.hash}
    onClick={coords.onClick}
    onKeyDown={coords.onKeyDown}>
    <InAnchor>
      <Outline.SparklesIcon className="size-5" />
    </InAnchor>
  </a>
}

export function PasswordMenu(props: { value: string } & { onChange(value: string): void }) {
  const { value, onChange } = props

  const [password, setPassword] = [value, onChange]

  const onDigicodeClick = useCallback(() => Promise.try(() => {
    const random = Array.from(crypto.getRandomValues(new Uint8Array(8)))
    const result = random.map(x => (x % 10).toString()).join("")

    setPassword(result)
  }).catch(Errors.display), [])

  const onPasswordClick = useCallback(() => Promise.try(() => {
    const source = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}|;:,.<>?/~`"

    const random = Array.from(crypto.getRandomValues(new Uint8Array(24)))
    const result = random.map(x => source.charAt(x % source.length)).join("")

    setPassword(result)
  }).catch(Errors.display), [])

  const onPassphraseClick = useCallback(() => Promise.try(() => {
    const source = MoneroSeedPhrase.generate().split(" ").slice(0, 4)

    const random = crypto.getRandomValues(new Uint8Array(1))[0]
    const result = source.map((x, i) => capitalize(x) + (i === (random % 4) ? (random % 10) : "")).join(" ")

    return setPassword(result)
  }).catch(Errors.display), [])

  return <div className="flex flex-col text-left gap-2">
    <WideNakedMenuButton
      onClick={onDigicodeClick}>
      <Outline.HashtagIcon className="size-5" />
      {Lang.match({ en: "Digicode", zh: "数字密码", hi: "डिजीकोड", es: "Código digital", ar: "الرمز الرقمي", fr: "Digicode", de: "Digicode", ru: "Цифровой код", pt: "Digicode", ja: "デジコード", pa: "ਡਿਗੀਕੋਡ", bn: "ডিজিকোড", id: "Digicode", ur: "ڈیجی کوڈ", ms: "Digicode", it: "Digicode", tr: "Dijikod", ta: "டிஜிகோடு", te: "డిజికోడ్", ko: "디지코드", vi: "Mã kỹ thuật số", pl: "Kod cyfrowy", ro: "Cod digital", nl: "Digicode", el: "Ψηφιακός κώδικας", th: "รหัสดิจิทัล", cs: "Digitální kód", hu: "Digitális kód", sv: "Digikod", da: "Digikode" })}
    </WideNakedMenuButton>
    <WideNakedMenuButton
      onClick={onPasswordClick}>
      <Outline.LanguageIcon className="size-5" />
      {Lang.match({ en: "Password", zh: "密码", hi: "पासवर्ड", es: "Contraseña", ar: "كلمة المرور", fr: "Mot de passe", de: "Passwort", ru: "Пароль", pt: "Senha", ja: "パスワード", pa: "ਪਾਸਵਰਡ", bn: "পাসওয়ার্ড", id: "Kata sandi", ur: "پاس ورڈ", ms: "Kata laluan", it: "Password", tr: "Parola", ta: "கடவுச்சொல்", te: "పాస్వర్డ్", ko: "비밀번호", vi: "Mật khẩu", pl: "Hasło", ro: "Parolă", nl: "Wachtwoord", el: "Κωδικός πρόσβασης", th: "รหัสผ่าน", cs: "Heslo", hu: "Jelszó", sv: "Lösenord", da: "Adgangskode" })}
    </WideNakedMenuButton>
    <WideNakedMenuButton
      onClick={onPassphraseClick}>
      <Outline.ChatBubbleOvalLeftEllipsisIcon className="size-5" />
      {Lang.match({ en: "Passphrase", zh: "密码短语", hi: "पासफ़्रेज़", es: "Frase de contraseña", ar: "عبارة المرور", fr: "Phrase de passe", de: "Passphrase", ru: "Парольная фраза", pt: "Frase de senha", ja: "パスフレーズ", pa: "ਪਾਸਫਰੇਜ਼", bn: "পাসফ্রেজ", id: "Frasa sandi", ur: "پاس فریز", ms: "Frasa kata laluan", it: "Frase di accesso", tr: "Parola öbeği", ta: "கடவுச்சொல் வாக்கியம்", te: "పాస్ఫ్రేజ్", ko: "암호 구문", vi: "Cụm từ mật khẩu", pl: "Fraza hasła", ro: "Fraza de parolă", nl: "Wachtwoordzin", el: "Φράση πρόσβασης", th: "วลีรหัสผ่าน", cs: "Heslová fráze", hu: "Jelszó kifejezés", sv: "Lösenordsfras", da: "Adgangskodefrase" })}
    </WideNakedMenuButton>
  </div>
}

export function PasswordAccountAddPage() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const close = useCloseContext().getOrThrow()

  const session = useSessionContext().getOrThrow()

  const [flipped, setFlipped] = useState(false)

  const seedword = useMemo(() => {
    return capitalize(MoneroSeedPhrase.generate().split(" ")[0])
  }, [])

  const [$title, setTitle] = useState("")

  const [$username, setUsername] = useState("")
  const [$password, setPassword] = useState("")
  const [$totpseed, setTotpSeed] = useState("")

  const [$notes, setNotes] = useState("")

  const title = useDeferredValue($title || seedword)

  const [color, setColor] = useState<Nullable<string>>(["red", "orange", "amber", "yellow", "lime", "green", "emerald", "teal", "cyan", "sky", "blue", "indigo", "violet", "purple", "fuchsia", "pink", "rose"][Math.floor(Math.random() * 16)])

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

    if (username)
      $entry.addStringOrThrow("UserName", username)

    if (password)
      $entry.addStringOrThrow("Password", password, true)

    if (notes)
      $entry.addStringOrThrow("Notes", notes)

    if (totpseed)
      $entry.addStringOrThrow("otp", totpseed, true)

    return Writable.writeToBytesOrThrow(await kdbx.encryptOrThrow(comp))
  }, [session, title, color, username, password, totpseed, notes])

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
    return
  }, [])

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
          <ScanPage value={totpseed} onChange={setTotpSeed} />
        </PathBoard>}
    </SubpathProvider>
    <div className="flex flex-col grow p-6">
      <h1 className="text-xl font-medium">
        {Lang.match({ en: "Add password account", zh: "添加密码账户", hi: "पासवर्ड खाता जोड़ें", es: "Agregar cuenta de contraseña", ar: "إضافة حساب كلمة المرور", fr: "Ajouter un compte de mot de passe", de: "Passwortkonto hinzufügen", ru: "Добавить пароль аккаунта", pt: "Adicionar conta de senha", ja: "パスワードアカウントを追加", pa: "ਪਾਸਵਰਡ ਖਾਤਾ ਸ਼ਾਮਲ ਕਰੋ", bn: "পাসওয়ার্ড অ্যাকাউন্ট যোগ করুন", id: "Tambahkan akun kata sandi", ur: "پاس ورڈ اکاؤنٹ شامل کریں", ms: "Tambah akun kata laluan", it: "Aggiungi account password", tr: "Parola hesabı ekle", ta: "கடவுச்சொல் கணக்கைச் சேர்க்கவும்", te: "పాస్వర్డ్ ఖాతాను జోడించండి", ko: "비밀번호 계정 추가하기", vi: "Thêm tài khoản mật khẩu", pl: "Dodaj konto hasła", ro: "Adăugați contul de parolă", nl: "Wachtwoordaccount toevoegen", el: "Προσθήκη λογαριασμού κωδικού πρόσβασης", th: "เพิ่มบัญชีรหัสผ่าน", cs: "Přidat heslo účtu", hu: "Jelszó fiók hozzáadása", sv: "Lägg till lösenordskonto", da: "Tilføj adgangskodekonto" })}
      </h1>
      <div className="h-6" />
      <div className="flex items-center justify-center">
        <PasswordAccountCard
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
          {Lang.match({ en: "Title", zh: "标题", hi: "शीर्षक", es: "Título", ar: "العنوان", fr: "Titre", de: "Titel", ru: "Заголовок", pt: "Título", ja: "タイトル", pa: "ਸਿਰਲੇਖ", bn: "শিরোনাম", id: "Judul", ur: "عنوان", ms: "Tajuk", it: "Titolo", tr: "Başlık", ta: "தலைப்பு", te: "శీర్షిక", ko: "제목", vi: "Tiêu đề", pl: "Tytuł", ro: "Titlu", nl: "Titel", el: "Τίτλος", th: "ชื่อเรื่อง", cs: "Název", hu: "Cím", sv: "Titel", da: "Titel" })}
        </div>
        <div className="text-default-contrast">
          {Lang.match({ en: "A name to identify this account.", zh: "用于识别此账户的名称。", hi: "इस खाते की पहचान करने के लिए एक नाम।", es: "Un nombre para identificar esta cuenta.", ar: "اسم لتحديد هذا الحساب.", fr: "Un nom pour identifier ce compte.", de: "Ein Name zur Identifizierung dieses Kontos.", ru: "Имя для идентификации этой учетной записи.", pt: "Um nome para identificar esta conta.", ja: "このアカウントを識別するための名前。", pa: "ਇਸ ਖਾਤੇ ਦੀ ਪਛਾਣ ਕਰਨ ਲਈ ਇੱਕ ਨਾਮ।", bn: "এই অ্যাকাউন্টটি সনাক্ত করার জন্য একটি নাম।", id: "Nama untuk mengidentifikasi akun ini.", ur: "اس اکاؤنٹ کی شناخت کے لیے ایک نام۔", ms: "Nama untuk mengenal pasti akaun ini.", it: "Un nome per identificare questo account.", tr: "Bu hesabı tanımlamak için bir ad.", ta: "இந்த கணக்கை அடையாளம் காண ஒரு பெயர்.", te: "ఈ ఖాతాను గుర్తించడానికి ఒక పేరు.", ko: "이 계정을 식별하기 위한 이름입니다.", vi: "Một tên để xác định tài khoản này.", pl: "Nazwa do identyfikacji tego konta.", ro: "Un nume pentru a identifica acest cont.", nl: "Een naam om dit account te identificeren.", el: "Ένα όνομα για να αναγνωρίσετε αυτόν τον λογαριασμό.", th: "ชื่อเพื่อระบุบัญชีนี้", cs: "Název pro identifikaci tohoto účtu.", hu: "Egy név ennek a fióknak az azonosításához.", sv: "Ett namn för att identifiera detta konto.", da: "Et navn til at identificere denne konto." })}
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <input className="w-full focus-visible:outline-none"
            autoComplete="off"
            placeholder={seedword}
            onChange={e => setTitle(e.target.value)}
            value={$title} />
          <div className="flex items-center gap-2">
            <ColorAnchor color={color} />
          </div>
        </div>
        <div className="h-6" />
        <div className="font-medium">
          {Lang.match({ en: "Username", zh: "用户名", hi: "उपयोगकर्ता नाम", es: "Nombre de usuario", ar: "اسم المستخدم", fr: "Nom d'utilisateur", de: "Benutzername", ru: "Имя пользователя", pt: "Nome de usuário", ja: "ユーザー名", pa: "ਉਪਭੋਗਤਾ ਨਾਮ", bn: "ব্যবহারকারীর নাম", id: "Nama pengguna", ur: "صارف نام", ms: "Nama pengguna", it: "Nome utente", tr: "Kullanıcı adı", ta: "பயனர் பெயர்", te: "వినియోగదారు పేరు", ko: "사용자 이름", vi: "Tên người dùng", pl: "Nazwa użytkownika", ro: "Nume de utilizator", nl: "Gebruikersnaam", el: "Όνομα χρήστη", th: "ชื่อผู้ใช้", cs: "Uživatelské jméno", hu: "Felhasználónév", sv: "Användarnamn", da: "Brugernavn" })}
        </div>
        <div className="text-default-contrast">
          {Lang.match({ en: "Your username or email.", zh: "您的用户名或电子邮件。", hi: "आपका उपयोगकर्ता नाम या ईमेल।", es: "Su nombre de usuario o correo electrónico.", ar: "اسم المستخدم أو البريد الإلكتروني الخاص بك.", fr: "Votre nom d'utilisateur ou e-mail.", de: "Ihr Benutzername oder Ihre E-Mail.", ru: "Ваше имя пользователя или электронная почта.", pt: "Seu nome de usuário ou e-mail.", ja: "あなたのユーザー名またはメールアドレス。", pa: "ਤੁਹਾਡਾ ਉਪਭੋਗਤਾ ਨਾਮ ਜਾਂ ਈਮੇਲ।", bn: "আপনার ব্যবহারকারীর নাম বা ইমেল।", id: "Nama pengguna atau email Anda.", ur: "آپ کا صارف نام یا ای میل۔", ms: "Nama pengguna atau e-mel anda.", it: "Il tuo nome utente o email.", tr: "Kullanıcı adınız veya e-posta adresiniz.", ta: "உங்கள் பயனர் பெயர் அல்லது மின்னஞ்சல்.", te: "మీ వినియోగదారు పేరు లేదా ఇమెయిల్.", ko: "사용자 이름 또는 이메일.", vi: "Tên người dùng hoặc email của bạn.", pl: "Twoja nazwa użytkownika lub e-mail.", ro: "Numele de utilizator sau e-mailul dvs.", nl: "Uw gebruikersnaam of e-mail.", el: "Το όνομα χρήστη ή το email σας.", th: "ชื่อผู้ใช้หรืออีเมลของคุณ", cs: "Vaše uživatelské jméno nebo e-mail.", hu: "A felhasználóneved vagy e-mailed.", sv: "Ditt användarnamn eller e-post.", da: "Dit brugernavn eller e-mail." })}
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
          {Lang.match({ en: "Password", zh: "密码", hi: "पासवर्ड", es: "Contraseña", ar: "كلمة المرور", fr: "Mot de passe", de: "Passwort", ru: "Пароль", pt: "Senha", ja: "パスワード", pa: "ਪਾਸਵਰਡ", bn: "পাসওয়ার্ড", id: "Kata sandi", ur: "پاس ورڈ", ms: "Kata laluan", it: "Password", tr: "Parola", ta: "கடவுச்சொல்", te: "పాస్వర్డ్", ko: "비밀번호", vi: "Mật khẩu", pl: "Hasło", ro: "Parolă", nl: "Wachtwoord", el: "Κωδικός πρόσβασης", th: "รหัสผ่าน", cs: "Heslo", hu: "Jelszó", sv: "Lösenord", da: "Adgangskode" })}
        </div>
        <div className="text-default-contrast">
          {Lang.match({ en: "Your password.", zh: "您的密码。", hi: "आपका पासवर्ड।", es: "Su contraseña.", ar: "كلمة المرور الخاصة بك.", fr: "Votre mot de passe.", de: "Ihr Passwort.", ru: "Ваш пароль.", pt: "Sua senha.", ja: "あなたのパスワード。", pa: "ਤੁਹਾਡਾ ਪਾਸਵਰਡ।", bn: "আপনার পাসওয়ার্ড।", id: "Kata sandi Anda.", ur: "آپ کا پاس ورڈ۔", ms: "Kata laluan anda.", it: "La tua password.", tr: "Parolanız.", ta: "உங்கள் கடவுச்சொல்.", te: "మీ పాస్వర్డ్.", ko: "귀하의 비밀번호.", vi: "Mật khẩu của bạn.", pl: "Twoje hasło.", ro: "Parola dvs.", nl: "Uw wachtwoord.", el: "Ο κωδικός πρόσβασής σας.", th: "รหัสผ่านของคุณ", cs: "Vaše heslo.", hu: "A jelszavad.", sv: "Ditt lösenord.", da: "Din adgangskode." })}
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
            <PasswordMenuAnchor />
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
          {Lang.match({ en: "Notes", zh: "备注", hi: "नोट्स", es: "Notas", ar: "ملاحظات", fr: "Remarques", de: "Notizen", ru: "Заметки", pt: "Notas", ja: "ノート", pa: "ਨੋਟਸ", bn: "নোটস", id: "Catatan", ur: "نوٹس", ms: "Catatan", it: "Note", tr: "Notlar", ta: "குறிப்புகள்", te: "గమనికలు", ko: "노트", vi: "Ghi chú", pl: "Notatki", ro: "Note", nl: "Notities", el: "Σημειώσεις", th: "บันทึกย่อ", cs: "Poznámky", hu: "Jegyzetek", sv: "Anteckningar", da: "Noter" })}
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