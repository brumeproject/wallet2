import { InOther } from "@/libs/anchor/mod.tsx";
import { InButton, WideOppositeButton } from "@/libs/button/mod.tsx";
import { Errors } from "@/libs/errors/mod.ts";
import { Events } from "@/libs/events/mod.ts";
import { useAutoFocus } from "@/libs/focus/mod.ts";
import { Outline } from "@/libs/heroicons/mod.ts";
import { getEntryType, getRecycleBinOrNull } from "@/libs/kdbx/mod.ts";
import { Lang } from "@/libs/lang/mod.ts";
import { WideNakedMenuAnchor, WideNakedMenuButton } from "@/libs/menu/mod.tsx";
import { Nullable } from "@/libs/nullable/mod.ts";
import { ChildrenProps } from "@/libs/props/mod.ts";
import { Spinner } from "@/libs/spinner/mod.tsx";
import { useSubmit } from "@/libs/submit/mod.ts";
import { CardAccountAddPage } from "@/mods/app/session/account/card/mod.tsx";
import { CryptoAccountAddPage } from "@/mods/app/session/account/crypto/mod.tsx";
import { KeypairAccountAddPage } from "@/mods/app/session/account/keypair/mod.tsx";
import { PasswordAccountAddPage } from "@/mods/app/session/account/password/mod.tsx";
import { Writable } from "@hazae41/binary";
import { SubpathProvider, useAnchorWithCoords, useHashSubpath, usePathContext, useSearchState } from "@hazae41/chemin";
import * as KDBX from "@hazae41/kdbx";
import { PathBoard, PathPaper } from "@hazae41/modal";
import { useCloseContext } from "@hazae41/react-close-context";
import { Option } from "@hazae41/result-and-option";
import React, { createContext, Fragment, useCallback, useContext, useDeferredValue, useMemo, useState } from "react";
import { UserData } from "../user/mod.tsx";
import { AccountAddButtonInGrid, AccountAddMenu, AccountAnchor } from "./account/mod.tsx";

React;

export interface SessionInit {
  readonly user: UserData
  readonly comp: Uint8Array<ArrayBuffer>
  readonly data: Uint8Array<ArrayBuffer>
}

export interface SessionData {
  readonly user: UserData
  readonly comp: KDBX.CompositeKey
  readonly kdbx: KDBX.Database.Decrypted
}

export interface SessionHandle {

  readonly value: SessionData

  update: () => void

}

export const SessionContext = createContext<Nullable<SessionHandle>>(null)

export function useSessionContext() {
  return Option.wrap(useContext(SessionContext))
}

export function SessionProvider(props: ChildrenProps & { value: SessionData }) {
  const { children, value } = props

  const [counter, setCounter] = useState(0)

  const update = useCallback(() => {
    setCounter(c => c + 1)
  }, [])

  const handle = useMemo(() => {
    return { value, update }
  }, [value, update, counter])

  return <SessionContext.Provider value={handle}>
    {children}
  </SessionContext.Provider>
}

export function SessionPage() {
  const close = useCloseContext().getOrThrow()

  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const session = useSessionContext().getOrThrow()

  const [search, setSearch] = useSearchState(path, "search")
  const [filter, setFilter] = useSearchState(path, "filter")

  const trash = useMemo(() => {
    return getRecycleBinOrNull(session.value.kdbx.inner.content.value)
  }, [session])

  const entries = useMemo(() => {
    return [...session.value.kdbx.inner.content.value.document.querySelectorAll("Entry")].filter(e => !e.closest("History")).map(e => new KDBX.Inner.KeePassFile.Entry(e)).filter(e => e.getStringByKeyOrNull("Parent") == null)
  }, [session])

  const visibles = useMemo(() => entries.filter($entry => {
    const trashed = trash != null ? trash.element.contains($entry.element) : false
    const searched = search ? $entry.element.textContent.toLowerCase().includes(search.toLowerCase()) : true

    if (!filter && !trashed)
      return searched

    if (filter === getEntryType($entry) && !trashed)
      return searched

    if (filter === "trash" && trashed)
      return searched

    return false
  }).reverse(), [entries, filter, search, trash])

  const logout = useCallback(() => {
    close()
  }, [close])

  return <Fragment>
    <SubpathProvider value={hash}>
      {hash.url.pathname === "/+" &&
        <PathPaper>
          <SessionMenu logout={logout} />
        </PathPaper>}
      {hash.url.pathname === "/add" &&
        <PathPaper>
          <AccountAddMenu />
        </PathPaper>}
      {hash.url.pathname === "/add/password" &&
        <PathBoard>
          <PasswordAccountAddPage />
        </PathBoard>}
      {hash.url.pathname === "/add/keypair" &&
        <PathBoard>
          <KeypairAccountAddPage />
        </PathBoard>}
      {hash.url.pathname === "/add/crypto" &&
        <PathBoard>
          <CryptoAccountAddPage />
        </PathBoard>}
      {hash.url.pathname === "/add/card" &&
        <PathBoard>
          <CardAccountAddPage />
        </PathBoard>}
    </SubpathProvider>
    <div className="grow flex flex-col *:shrink-0 p-6 overflow-y-auto">
      <h1 className="text-xl font-medium">
        {Lang.match({ en: "Your accounts", zh: "你的账户", hi: "आपके खाते", es: "Tus cuentas", ar: "حساباتك", fr: "Vos comptes", de: "Deine Konten", ru: "Ваши аккаунты", pt: "Suas contas", ja: "あなたのアカウント", pa: "ਤੁਹਾਡੇ ਖਾਤੇ", bn: "আপনার অ্যাকাউন্টগুলি", id: "Akun Anda", ur: "آپ کے اکاؤنٹس", ms: "Akun Anda", it: "I tuoi account", tr: "Hesaplarınız", ta: "உங்கள் கணக்குகள்", te: "మీ ఖాతాలు", ko: "당신의 계정들", vi: "Tài khoản của bạn", pl: "Twoje konta", ro: "Conturile tale", nl: "Jouw accounts", el: "Οι λογαριασμοί σας", th: "บัญชีของคุณ", cs: "Vaše účty", hu: "Fiókjaid", sv: "Dina konton", da: "Dine konti" })}
      </h1>
      <div className="h-6" />
      <div className="shrink! grow flex flex-col overflow-y-auto border border-default-contrast rounded-xl p-1">
        <div className="grow flex flex-col overflow-y-scroll overscroll-y-none p-5">
          <div className="grow grid grid-cols-[repeat(auto-fit,min(20rem,100%))] justify-center content-center gap-4">
            {visibles.map($entry =>
              <Fragment key={$entry.getUuidOrThrow().getOrThrow()}>
                <AccountAnchor $entry={$entry} />
              </Fragment>)}
            {filter == null && <Fragment>
              <AccountAddButtonInGrid href="/add" />
            </Fragment>}
            {filter === "password" && <Fragment>
              <AccountAddButtonInGrid href="/add/password" />
            </Fragment>}
            {filter === "keypair" && <Fragment>
              <AccountAddButtonInGrid href="/add/keypair" />
            </Fragment>}
            {filter === "crypto" && <Fragment>
              <AccountAddButtonInGrid href="/add/crypto" />
            </Fragment>}
            {filter === "card" && <Fragment>
              <AccountAddButtonInGrid href="/add/card" />
            </Fragment>}
          </div>
        </div>
      </div>
      <div className="h-4" />
      <div className="flex flex-wrap items-center gap-2 *:shrink-0 pointer-coarse:not-sm:overflow-x-auto pointer-coarse:not-sm:flex-nowrap pointer-coarse:not-sm:[scrollbar-width:none] pointer-coarse:not-sm:scrollfade-x-default">
        <button className="bg-default-contrast aria-selected:bg-opposite aria-selected:text-opposite rounded-xl po-1 flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-default-contrast aria-selected:focus-visible:outline-opposite"
          type="button"
          aria-selected={filter == null}
          onClick={() => setFilter(null)}>
          <Outline.NoSymbolIcon className="size-5" />
          {Lang.match({ en: "Everything", zh: "全部", hi: "सब कुछ", es: "Todo", ar: "كل شيء", fr: "Tout", de: "Alles", ru: "Все", pt: "Tudo", ja: "すべて", pa: "ਸਭ ਕੁਝ", bn: "সব কিছু", id: "Semua", ur: "سب کچھ", ms: "Semua", it: "Tutto", tr: "Her şey", ta: "எல்லாம்", te: "అన్నీ", ko: "모든 항목", vi: "Tất cả", pl: "Wszystko", ro: "Totul", nl: "Alles", el: "Όλα", th: "ทั้งหมด", cs: "Všechny položky", hu: "Minden", sv: "Allt", da: "Alt" })}
        </button>
        <button className="bg-default-contrast aria-selected:bg-opposite aria-selected:text-opposite rounded-xl po-1 flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-default-contrast aria-selected:focus-visible:outline-opposite"
          type="button"
          aria-selected={filter === "password"}
          onClick={() => setFilter("password")}>
          <Outline.LanguageIcon className="size-5" />
          {Lang.match({ en: "Passwords", zh: "密码", hi: "पासवर्ड", es: "Contraseñas", ar: "كلمات المرور", fr: "Mots de passe", de: "Passwörter", ru: "Пароли", pt: "Senhas", ja: "パスワード", pa: "ਪਾਸਵਰਡ", bn: "পাসওয়ার্ড", id: "Kata Sandi", ur: "پاس ورڈز", ms: "Kata Laluan", it: "Password", tr: "Parolalar", ta: "கடவுச்சொற்கள்", te: "పాస్వర్డ్లు", ko: "비밀번호", vi: "Mật khẩu", pl: "Hasła", ro: "Parole", nl: "Wachtwoorden", el: "Κωδικοί πρόσβασης", th: "รหัสผ่าน", cs: "Hesla", hu: "Jelszavak", sv: "Lösenord", da: "Adgangskoder" })}
        </button>
        <button className="bg-default-contrast aria-selected:bg-opposite aria-selected:text-opposite rounded-xl po-1 flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-default-contrast aria-selected:focus-visible:outline-opposite"
          type="button"
          aria-selected={filter === "keypair"}
          onClick={() => setFilter("keypair")}>
          <Outline.KeyIcon className="size-5" />
          {Lang.match({ en: "Keypairs", zh: "密钥对", hi: "की जोड़ी", es: "Pares de claves", ar: "أزواج المفاتيح", fr: "Paires de clés", de: "Schlüsselpaar", ru: "Ключевые пары", pt: "Pares de chaves", ja: "キーペア", pa: "ਕੀ ਜੋੜੇ", bn: "কী জোড়া", id: "Pasangan Kunci", ur: "کلیدی جوڑے", ms: "Pasangan Kunci", it: "Coppie di chiavi", tr: "Anahtar çiftleri", ta: "முக்கிய ஜோடிகள்", te: "కీ జంటలు", ko: "키 쌍", vi: "Cặp khóa", pl: "Pary kluczy", ro: "Perechi de chei", nl: "Sleutelpaar", el: "Ζεύγη κλειδιών", th: "คู่กุญแจ", cs: "Páry klíčů", hu: "Kulcspárok", sv: "Nyckelpar", da: "Nøglepar" })}
        </button>
        <button className="bg-default-contrast aria-selected:bg-opposite aria-selected:text-opposite rounded-xl po-1 flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-default-contrast aria-selected:focus-visible:outline-opposite"
          type="button"
          aria-selected={filter === "crypto"}
          onClick={() => setFilter("crypto")}>
          <Outline.BanknotesIcon className="size-5" />
          {Lang.match({ en: "Cryptos", zh: "加密货币", hi: "क्रिप्टो", es: "Criptomonedas", ar: "العملات المشفرة", fr: "Cryptos", de: "Kryptos", ru: "Криптовалюты", pt: "Criptomoedas", ja: "暗号通貨", pa: "ਕ੍ਰਿਪਟੋ", bn: "ক্রিপ্টো", id: "Kripto", ur: "کرپٹو", ms: "Kripto", it: "Criptovalute", tr: "Kriptolar", ta: "கிரிப்டோ", te: "క్రిప్టో", ko: "암호화폐", vi: "Tiền điện tử", pl: "Kryptowaluty", ro: "Criptomonede", nl: "Cryptos", el: "Κρυπτονομίσματα", th: "สกุลเงินดิจิทัล", cs: "Kryptoměny", hu: "Kriptók", sv: "Kryptovalutor", da: "Kryptovalutaer" })}
        </button>
        <button className="bg-default-contrast aria-selected:bg-opposite aria-selected:text-opposite rounded-xl po-1 flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-default-contrast aria-selected:focus-visible:outline-opposite"
          type="button"
          aria-selected={filter === "card"}
          onClick={() => setFilter("card")}>
          <Outline.CreditCardIcon className="size-5" />
          {Lang.match({ en: "Cards", zh: "卡片", hi: "कार्ड", es: "Tarjetas", ar: "بطاقات", fr: "Cartes", de: "Karten", ru: "Карты", pt: "Cartões", ja: "カード", pa: "ਕਾਰਡ", bn: "কার্ড", id: "Kartu", ur: "کارڈز", ms: "Kad", it: "Carte", tr: "Kartlar", ta: "கார்டுகள்", te: "కార్డులు", ko: "카드", vi: "Thẻ", pl: "Karty", ro: "Carduri", nl: "Kaarten", el: "Κάρτες", th: "บัตร", cs: "Karty", hu: "Kártyák", sv: "Kort", da: "Kort" })}
        </button>
        <button className="bg-default-contrast aria-selected:bg-opposite aria-selected:text-opposite rounded-xl po-1 flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-default-contrast aria-selected:focus-visible:outline-opposite"
          type="button"
          aria-selected={filter === "trash"}
          onClick={() => setFilter("trash")}>
          <Outline.TrashIcon className="size-5" />
          {Lang.match({ en: "Trash", zh: "垃圾桶", hi: "कचरा", es: "Papelera", ar: "سلة المهملات", fr: "Corbeille", de: "Papierkorb", ru: "Корзина", pt: "Lixeira", ja: "ゴミ箱", pa: "ਕਚਰਾ", bn: "ট্র্যাশ", id: "Sampah", ur: "کچرا", ms: "Tong Sampah", it: "Cestino", tr: "Çöp", ta: "குப்பை", te: "ట్రాష్", ko: "휴지통", vi: "Thùng rác", pl: "Kosz", ro: "Coș de gunoi", nl: "Prullenbak", el: "Κάδος απορριμμάτων", th: "ถังขยะ", cs: "Koš", hu: "Szemetes", sv: "Papperskorg", da: "Papirkurv" })}
        </button>
      </div>
      <div className="h-4" />
      <div className="flex items-center gap-2">
        <SessionMenuButton />
        <div className="grow bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <Outline.MagnifyingGlassIcon className="size-5" />
          <input className="w-full focus-visible:outline-none"
            autoComplete="off"
            placeholder={Lang.match({ en: "Search", zh: "搜索", hi: "खोज", es: "Buscar", ar: "بحث", fr: "Rechercher", de: "Suche", ru: "Поиск", pt: "Pesquisar", ja: "検索", pa: "ਖੋਜ", bn: "অনুসন্ধান", id: "Cari", ur: "تلاش کریں", ms: "Cari", it: "Cerca", tr: "Ara", ta: "தேடு", te: "శోధించండి", ko: "검색", vi: "Tìm kiếm", pl: "Szukaj", ro: "Caută", nl: "Zoeken", el: "Αναζήτηση", th: "ค้นหา", cs: "Hledat", hu: "Keresés", sv: "Sökning", da: "Søg" })}
            onChange={e => setSearch(e.target.value)}
            ref={useAutoFocus()}
            value={search || ""} />
        </div>
      </div>
    </div>
  </Fragment>
}

function SessionMenuButton() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, "/+")

  return <a className="group p-2 bg-opposite text-opposite rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-opposite"
    href={coords.url.hash}
    onClick={coords.onClick}
    onKeyDown={coords.onKeyDown}>
    <InOther>
      <Outline.EllipsisVerticalIcon className="size-5" />
    </InOther>
  </a>
}

function SessionMenu(props: { logout(): void }) {
  const { logout } = props

  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  return <Fragment>
    <SubpathProvider value={hash}>
      {hash.url.pathname === "/add" &&
        <PathPaper>
          <AccountAddMenu />
        </PathPaper>}
      {hash.url.pathname === "/export" &&
        <PathBoard>
          <SessionExportPage />
        </PathBoard>}
    </SubpathProvider>
    <div className="flex flex-col text-left gap-2">
      <SessionExportAnchor />
      <WideNakedMenuButton
        type="button"
        onClick={logout}>
        <Outline.LockClosedIcon className="size-5" />
        {Lang.match({ en: "Lock", zh: "锁定", hi: "लॉक करें", es: "Bloquear", ar: "قفل", fr: "Verrouiller", de: "Sperren", ru: "Заблокировать", pt: "Bloquear", ja: "ロック", pa: "ਲਾਕ ਕਰੋ", bn: "লক করুন", id: "Kunci", ur: "لاک کریں", ms: "Kunci", it: "Blocca", tr: "Kilitle", ta: "மூடு", te: "లాక్ చేయండి", ko: "잠그기", vi: "Khóa", pl: "Zablokuj", ro: "Blochează", nl: "Vergrendel", el: "Κλείδωμα", th: "ล็อค", cs: "Zamknout", hu: "Zárolás", sv: "Lås", da: "Lås" })}
      </WideNakedMenuButton>
    </div>
  </Fragment>
}

export function SessionExportAnchor() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, "/export")

  return <WideNakedMenuAnchor
    href={coords.url.hash}
    onClick={coords.onClick}
    onKeyDown={coords.onKeyDown}>
    <Outline.ArrowUpOnSquareIcon className="size-5" />
    {Lang.match({ en: "Export", zh: "导出", hi: "निर्यात", es: "Exportar", ar: "تصدير", fr: "Exporter", de: "Exportieren", ru: "Экспорт", pt: "Exportar", ja: "エクスポート", pa: "ਨਿਰਯਾਤ", bn: "রপ্তানি", id: "Ekspor", ur: "برآمد کریں", ms: "Eksport", it: "Esporta", tr: "Dışa Aktar", ta: "ஏற்றுமதி", te: "ఎగుమతి", ko: "내보내기", vi: "Xuất", pl: "Eksportuj", ro: "Export", nl: "Exporteren", el: "Εξαγωγή", th: "ส่งออก", cs: "Exportovat", hu: "Exportálás", sv: "Exportera", da: "Eksporter" })}
  </WideNakedMenuAnchor>
}

export function SessionExportPage() {
  const close = useCloseContext().getOrThrow()

  const session = useSessionContext().getOrThrow()

  const [flipped, setFlipped] = useState(false)

  const [$pass, setPass] = useState("")

  const pass = useDeferredValue($pass)

  const encrypt = useCallback(async () => {
    const { kdbx } = session.value

    await new Promise(ok => requestIdleCallback(ok))

    const composite = await KDBX.CompositeKey.digest(await KDBX.PasswordKey.digest(new TextEncoder().encode(pass)))

    return Writable.writeToBytes(await kdbx.encrypt(composite))
  }, [session, pass])

  const pickOrDisplay = useSubmit(() => Promise.try(async () => {
    const fsfh = await window.showSaveFilePicker!({ id: "root", startIn: "documents", suggestedName: `wallet.kdbx`, types: [{ description: "KDBX", accept: { "application/kdbx": [".kdbx"] } }] })

    const content = await encrypt()

    const writable = await fsfh.createWritable()
    await writable.write(content)
    await writable.close()

    close()
  }).catch(Errors.display), [encrypt, close])

  const saveOrDisplay = useSubmit(() => Promise.try(async () => {
    const content = await encrypt()

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
    if (!pass.length)
      return Lang.match({ en: "Password is required", zh: "密码是必需的", hi: "पासवर्ड आवश्यक है", es: "Se requiere contraseña", ar: "كلمة المرور مطلوبة", fr: "Le mot de passe est requis", de: "Passwort ist erforderlich", ru: "Требуется пароль", pt: "Senha é obrigatória", ja: "パスワードは必須です", pa: "ਪਾਸਵਰਡ ਦੀ ਲੋੜ ਹੈ", bn: "পাসওয়ার্ড প্রয়োজন", id: "Kata sandi diperlukan", ur: "پاس ورڈ ضروری ہے", ms: "Kata sandi diperlukan", it: "La password è obbligatoria", tr: "Parola gerekli", ta: "கடவுச்சொல் தேவை", te: "పాస్వర్డ్ అవసరం", ko: "비밀번호가 필요합니다", vi: "Mật khẩu là bắt buộc", pl: "Hasło jest wymagane", ro: "Parola este necesară", nl: "Wachtwoord is verplicht", el: "Απαιτείται κωδικός πρόσβασης", th: "รหัสผ่านจำเป็นต้องใช้", cs: "Heslo je povinné", hu: "Jelszó szükséges", sv: "Lösenord krävs", da: "Adgangskode er påkrævet" })
    return
  }, [pass])

  return <Fragment>
    <div className="flex flex-col grow p-6">
      <h1 className="text-xl font-medium">
        {Lang.match({ en: "Export user", zh: "导出用户", hi: "उपयोगकर्ता निर्यात करें", es: "Exportar usuario", ar: "تصدير المستخدم", fr: "Exporter l'utilisateur", de: "Benutzer exportieren", ru: "Экспорт пользователя", pt: "Exportar usuário", ja: "ユーザーをエクスポート", pa: "ਉਪਭੋਗਤਾ ਨਿਰਯਾਤ ਕਰੋ", bn: "ব্যবহারকারী রপ্তানি করুন", id: "Ekspor pengguna", ur: "صارف برآمد کریں", ms: "Ekspor pengguna", it: "Esporta utente", tr: "Kullanıcıyı dışa aktar", ta: "பயனரை ஏற்றுமதி செய்யவும்", te: "వినియోగదారుని ఎగుమతి చేయండి", ko: "사용자 내보내기", vi: "Xuất người dùng", pl: "Eksportuj użytkownika", ro: "Exportă utilizatorul", nl: "Gebruiker exporteren", el: "Εξαγωγή χρήστη", th: "ส่งออกผู้ใช้", cs: "Exportovat uživatele", hu: "Felhasználó exportálása", sv: "Exportera användare", da: "Eksporter bruger" })}
      </h1>
      <form className="grow flex flex-col"
        onSubmit={Events.preventDefault}>
        <input className="hidden"
          autoComplete="off"
          name="username" />
        <div className="h-6" />
        <div className="font-medium">
          {Lang.match({ en: "Password", zh: "密码", hi: "पासवर्ड", es: "Contraseña", ar: "كلمة المرور", fr: "Mot de passe", de: "Passwort", ru: "Пароль", pt: "Senha", ja: "パスワード", pa: "ਪਾਸਵਰਡ", bn: "পাসওয়ার্ড", id: "Kata sandi", ur: "پاس ورڈ", ms: "Kata sandi", it: "Password", tr: "Parola", ta: "கடவுச்சொல்", te: "పాస్వర్డ్", ko: "비밀번호", vi: "Mật khẩu", pl: "Hasło", ro: "Parolă", nl: "Wachtwoord", el: "Κωδικός πρόσβασης", th: "รหัสผ่าน", cs: "Heslo", hu: "Jelszó", sv: "Lösenord", da: "Adgangskode" })}
        </div>
        <div className="text-default-contrast">
          {Lang.match({ en: "A password to encrypt the exported file.", zh: "用于加密导出文件的密码。", hi: "निर्यात की गई फ़ाइल को एन्क्रिप्ट करने के लिए एक पासवर्ड।", es: "Una contraseña para encriptar el archivo exportado.", ar: "كلمة مرور لتشفير الملف المصدر.", fr: "Un mot de passe pour chiffrer le fichier exporté.", de: "Ein Passwort zum Verschlüsseln der exportierten Datei.", ru: "Пароль для шифрования экспортируемого файла.", pt: "Uma senha para criptografar o arquivo exportado.", ja: "エクスポートされたファイルを暗号化するためのパスワード。", pa: "ਨਿਰਯਾਤ ਕੀਤੀ ਫਾਈਲ ਨੂੰ ਇੰਕ੍ਰਿਪਟ ਕਰਨ ਲਈ ਇੱਕ ਪਾਸਵਰਡ।", bn: "রপ্তানি করা ফাইলটি এনক্রিপ্ট করার জন্য একটি পাসওয়ার্ড।", id: "Kata sandi untuk mengenkripsi file yang diekspor.", ur: "برآمد شدہ فائل کو خفیہ کرنے کے لیے ایک پاس ورڈ۔", ms: "Kata sandi untuk menyulitkan fail yang dieksport.", it: "Una password per crittografare il file esportato.", tr: "Dışa aktarılan dosyayı şifrelemek için bir parola.", ta: "ஏற்றுமதி செய்யப்பட்ட கோப்பை குறியாக்கம் செய்ய ஒரு கடவுச்சொல்.", te: "ఎగుమతి చేసిన ఫైల్‌ను గుప్తీకరించడానికి ఒక పాస్వర్డ్.", ko: "내보낸 파일을 암호화하기 위한 비밀번호.", vi: "Mật khẩu để mã hóa tệp xuất.", pl: "Hasło do zaszyfrowania eksportowanego pliku.", ro: "O parolă pentru a cripta fișierul exportat.", nl: "Een wachtwoord om het geëxporteerde bestand te versleutelen.", el: "Ένας κωδικός πρόσβασης για την κρυπτογράφηση του εξαγόμενου αρχείου.", th: "รหัสผ่านเพื่อเข้ารหัสไฟล์ที่ส่งออก.", cs: "Heslo pro šifrování exportovaného souboru.", hu: "Egy jelszó az exportált fájl titkosításához.", sv: "Ett lösenord för att kryptera den exporterade filen.", da: "En adgangskode til at kryptere den eksporterede fil." })}
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
              {pickOrDisplay.running ? <Spinner className="size-5 animate-spin" /> : <Outline.ArrowDownTrayIcon className="size-5" />}
              {error != null ? error : Lang.match({ en: "Save", zh: "保存", hi: "सहेजें", es: "Guardar", ar: "حفظ", fr: "Enregistrer", de: "Speichern", ru: "Сохранить", pt: "Salvar", ja: "保存", pa: "ਸੰਭਾਲੋ", bn: "সংরক্ষণ করুন", id: "Simpan", ur: "محفوظ کریں", ms: "Simpan", it: "Salva", tr: "Kaydet", ta: "சேமிக்கவும்", te: "సేవ్ చేయండి", ko: "저장", vi: "Lưu", pl: "Zapisz", ro: "Salvează", nl: "Opslaan", el: "Αποθήκευση", th: "บันทึก", cs: "Uložit", hu: "Mentés", sv: "Spara", da: "Gem" })}
            </WideOppositeButton>}
          {"showSaveFilePicker" in window === false &&
            <WideOppositeButton
              type="button"
              disabled={saveOrDisplay.running || error != null}
              onClick={saveOrDisplay.execute}>
              {saveOrDisplay.running ? <Spinner className="size-5 animate-spin" /> : <Outline.ArrowDownTrayIcon className="size-5" />}
              {error != null ? error : Lang.match({ en: "Save", zh: "保存", hi: "सहेजें", es: "Guardar", ar: "حفظ", fr: "Enregistrer", de: "Speichern", ru: "Сохранить", pt: "Salvar", ja: "保存", pa: "ਸੰਭਾਲੋ", bn: "সংরক্ষণ করুন", id: "Simpan", ur: "محفوظ کریں", ms: "Simpan", it: "Salva", tr: "Kaydet", ta: "சேமிக்கவும்", te: "సేవ్ చేయండి", ko: "저장", vi: "Lưu", pl: "Zapisz", ro: "Salvează", nl: "Opslaan", el: "Αποθήκευση", th: "บันทึก", cs: "Uložit", hu: "Mentés", sv: "Spara", da: "Gem" })}
            </WideOppositeButton>}
        </div>
      </form>
    </div>
  </Fragment>
}
