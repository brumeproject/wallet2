import { InOther, OppositeAnchor } from "@/libs/anchor/mod.tsx";
import { InButton } from "@/libs/button/mod.tsx";
import { Errors } from "@/libs/errors/mod.ts";
import { Outline } from "@/libs/heroicons/mod.ts";
import { getEntryType } from "@/libs/kdbx/mod.ts";
import { Lang } from "@/libs/lang/mod.ts";
import { WideNakedMenuButton } from "@/libs/menu/mod.tsx";
import { Nullable } from "@/libs/nullable/mod.ts";
import { Spinner } from "@/libs/spinner/mod.tsx";
import { useTask } from "@/libs/task/mod.ts";
import { KeypairAccountAddMenuAnchor, KeypairAccountAddPage, KeypairAccountPage } from "@/mods/app/session/account/keypair/mod.tsx";
import { Writable } from "@hazae41/binary";
import { SubpathProvider, useAnchorWithCoords, useHashSubpath, usePathContext } from "@hazae41/chemin";
import * as KDBX from "@hazae41/kdbx";
import { PathBoard } from "@hazae41/modal";
import React, { Fragment, useCallback, useMemo } from "react";
import { useSessionContext } from "../mod.tsx";
import { CardAccountAddMenuAnchor, CardAccountAddPage, CardAccountPage } from "./card/mod.tsx";
import { CryptoAccountAddMenuAnchor, CryptoAccountAddPage, CryptoAccountPage } from "./crypto/mod.tsx";
import { PasswordAccountAddMenuAnchor, PasswordAccountAddPage, PasswordAccountPage } from "./password/mod.tsx";

React;

export function AccountAddButtonInGrid(props: { href: string }) {
  const { href } = props

  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, href)

  return <a className="group w-[min(20rem,100%)] aspect-video rounded-xl border-2 border-default-contrast select-none hover:scale-105 focus-visible:outline-none focus-visible:scale-105 transition-transform"
    href={coords.url.hash}
    onClick={coords.onClick}
    onKeyDown={coords.onKeyDown}>
    <InOther>
      <Outline.PlusIcon className="size-8" />
    </InOther>
  </a>
}

export function AccountAnchor(props: { $entry: KDBX.Inner.KeePassFile.Entry }) {
  const { $entry } = props

  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const uuid = useMemo(() => {
    return $entry.getUuidOrThrow().getOrThrow()
  }, [$entry])

  const title = useMemo(() => {
    return $entry.getStringByKeyOrNull("Title")?.getValueOrNull()?.get()
  }, [$entry])

  const color = useMemo(() => {
    return $entry.getStringByKeyOrNull("Color")?.getValueOrNull()?.get()
  }, [$entry])

  const coords = useAnchorWithCoords(hash, `/account/${uuid}`)

  return <Fragment>
    <SubpathProvider value={hash}>
      {hash.url.pathname === `/account/${uuid}` &&
        <PathBoard>
          {(() => {
            const type = getEntryType($entry)

            if (type === "password")
              return <PasswordAccountPage $entry={$entry} />

            if (type === "card")
              return <CardAccountPage $entry={$entry} />

            if (type === "crypto")
              return <CryptoAccountPage $entry={$entry} />

            if (type === "keypair")
              return <KeypairAccountPage $entry={$entry} />

            return null
          })()}
        </PathBoard>}
    </SubpathProvider>
    <a className="@container w-[min(20rem,100%)] aspect-video overflow-hidden border-2 border-default-contrast rounded-xl bg-default text-default select-none hover:scale-105 focus-visible:outline-none focus-visible:scale-105 transition-transform
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
      in-dark:data-[color=rose]:bg-rose-500
      focus-visible:data-[color=red]:outline-red-400 
      focus-visible:data-[color=orange]:outline-orange-400 
      focus-visible:data-[color=amber]:outline-amber-400 
      focus-visible:data-[color=yellow]:outline-yellow-400 
      focus-visible:data-[color=lime]:outline-lime-400 
      focus-visible:data-[color=green]:outline-green-400 
      focus-visible:data-[color=emerald]:outline-emerald-400 
      focus-visible:data-[color=teal]:outline-teal-400 
      focus-visible:data-[color=cyan]:outline-cyan-400 
      focus-visible:data-[color=sky]:outline-sky-400 
      focus-visible:data-[color=blue]:outline-blue-400 
      focus-visible:data-[color=indigo]:outline-indigo-400 
      focus-visible:data-[color=violet]:outline-violet-400 
      focus-visible:data-[color=purple]:outline-purple-400 
      focus-visible:data-[color=fuchsia]:outline-fuchsia-400 
      focus-visible:data-[color=pink]:outline-pink-400 
      focus-visible:data-[color=rose]:outline-rose-400 
      focus-visible:in-dark:data-[color=red]:outline-red-500
      focus-visible:in-dark:data-[color=orange]:outline-orange-500
      focus-visible:in-dark:data-[color=amber]:outline-amber-500
      focus-visible:in-dark:data-[color=yellow]:outline-yellow-500
      focus-visible:in-dark:data-[color=lime]:outline-lime-500
      focus-visible:in-dark:data-[color=green]:outline-green-500
      focus-visible:in-dark:data-[color=emerald]:outline-emerald-500
      focus-visible:in-dark:data-[color=teal]:outline-teal-500
      focus-visible:in-dark:data-[color=cyan]:outline-cyan-500
      focus-visible:in-dark:data-[color=sky]:outline-sky-500
      focus-visible:in-dark:data-[color=blue]:outline-blue-500
      focus-visible:in-dark:data-[color=indigo]:outline-indigo-500
      focus-visible:in-dark:data-[color=violet]:outline-violet-500
      focus-visible:in-dark:data-[color=purple]:outline-purple-500
      focus-visible:in-dark:data-[color=fuchsia]:outline-fuchsia-500
      focus-visible:in-dark:data-[color=pink]:outline-pink-500
      focus-visible:in-dark:data-[color=rose]:outline-rose-500"
      data-theme={color == null ? "opposite" : "dark"}
      data-color={color}
      href={coords.url.hash}
      onClick={coords.onClick}
      onKeyDown={coords.onKeyDown}>
      <div className="h-full w-full flex flex-col p-4">
        <div className="font-medium text-xl truncate">
          {title || Lang.match({ en: "Untitled", zh: "无标题", hi: "शीर्षक रहित", es: "Sin título", ar: "بدون عنوان", fr: "Sans titre", de: "Unbenannt", ru: "Без названия", pt: "Sem título", ja: "無題", pa: "ਬਿਨਾਂ ਸਿਰਲੇਖ ਦੇ", bn: "বিনা শিরোনাম", id: "Tanpa judul", ur: "بغیر عنوان کے", ms: "Tanpa judul", it: "Senza titolo", tr: "Başlıksız", ta: "தலைப்பு இல்லாமல்", te: "శీర్షిక లేని", ko: "제목 없음", vi: "Không tiêu đề", pl: "Bez tytułu", ro: "Fără titlu", nl: "Ongetiteld", el: "Χωρίς τίτλο", th: "ไม่มีชื่อเรื่อง", cs: "Nezvaný", hu: "Névtelen", sv: "Otitulerad", da: "Uden titel" })}
        </div>
        <div className="not-@[16rem]:hidden h-2" />
        <div className="not-@[16rem]:hidden text-default-half-contrast truncate">
          {(() => {
            const type = getEntryType($entry)

            if (type === "password")
              return $entry.getStringByKeyOrNull("UserName")?.getValueOrNull()?.get()

            if (type === "keypair")
              return $entry.getStringByKeyOrNull("UserName")?.getValueOrNull()?.get()

            if (type === "card")
              return $entry.getStringByKeyOrNull("CardNumber")?.getValueOrNull()?.get()

            return null
          })()}
        </div>
        <div className="not-@[12rem]:hidden h-4 grow" />
        <div className="not-@[12rem]:hidden flex flex-wrap items-center gap-2">
          {(() => {
            const type = getEntryType($entry)

            if (type === "password")
              return <div className="bg-default-contrast rounded-xl po-1 flex items-center gap-2">
                <Outline.LanguageIcon className="size-5" />
                {Lang.match({ en: "Password", zh: "密码", hi: "पासवर्ड", es: "Contraseña", ar: "كلمة المرور", fr: "Mot de passe", de: "Passwort", ru: "Пароль", pt: "Senha", ja: "パスワード", pa: "ਪਾਸਵਰਡ", bn: "পাসওয়ার্ড", id: "Kata Sandi", ur: "پاس ورڈ", ms: "Kata Laluan", it: "Password", tr: "Parola", ta: "கடவுச்சொல்", te: "పాస్వర్డ్", ko: "비밀번호", vi: "Mật khẩu", pl: "Hasło", ro: "Parolă", nl: "Wachtwoord", el: "Κωδικός", th: "รหัสผ่าน", cs: "Heslo", hu: "Jelszó", sv: "Lösenord", da: "Adgangskode" })}
              </div>

            if (type === "keypair")
              return <div className="bg-default-contrast rounded-xl po-1 flex items-center gap-2">
                <Outline.KeyIcon className="size-5" />
                {Lang.match({ en: "Keypair", zh: "密钥对", hi: "कीपेयार", es: "Par de claves", ar: "زوج المفاتيح", fr: "Paire de clés", de: "Schlüsselpaar", ru: "Ключевая пара", pt: "Par de chaves", ja: "キーペア", pa: "ਕੀਪੇਅਰ", bn: "কীপেয়ার", id: "Pasangan Kunci", ur: "کلیدی جوڑا", ms: "Pasangan Kunci", it: "Coppia di chiavi", tr: "Anahtar çifti", ta: "கீபேர்", te: "కీపేర్", ko: "키페어", vi: "Cặp khóa", pl: "Para kluczy", ro: "Pereche de chei", nl: "Sleutelpaar", el: "Ζεύγος κλειδιών", th: "คู่กุญแจ", cs: "Klíčový pár", hu: "Kulcspár", sv: "Nyckelpar", da: "Nøglepar" })}
              </div>

            if (type === "crypto")
              return <div className="bg-default-contrast rounded-xl po-1 flex items-center gap-2">
                <Outline.BanknotesIcon className="size-5" />
                {Lang.match({ en: "Crypto", zh: "加密货币", hi: "क्रिप्टो", es: "Cripto", ar: "تشفير", fr: "Crypto", de: "Krypto", ru: "Крипто", pt: "Cripto", ja: "暗号通貨", pa: "ਕ੍ਰਿਪਟੋ", bn: "ক্রিপ্টো", id: "Kripto", ur: "کرپٹو", ms: "Kripto", it: "Cripto", tr: "Kripto", ta: "கிரிப்டோ", te: "క్రిప్టో", ko: "암호화폐", vi: "Tiền điện tử", pl: "Krypto", ro: "Cripto", nl: "Crypto", el: "Κρυπτο", th: "คริปโต", cs: "Krypto", hu: "Kripto", sv: "Krypto", da: "Krypto" })}
              </div>

            if (type === "card")
              return <div className="bg-default-contrast rounded-xl po-1 flex items-center gap-2">
                <Outline.CreditCardIcon className="size-5" />
                {Lang.match({ en: "Card", zh: "卡片", hi: "कार्ड", es: "Tarjeta", ar: "بطاقة", fr: "Carte", de: "Karte", ru: "Карта", pt: "Cartão", ja: "カード", pa: "ਕਾਰਡ", bn: "কার্ড", id: "Kartu", ur: "کارڈ", ms: "Kad", it: "Carta", tr: "Kart", ta: "கார்டு", te: "కార్డు", ko: "카드", vi: "Thẻ", pl: "Karta", ro: "Card", nl: "Kaart", el: "Κάρτα", th: "บัตร", cs: "Karta", hu: "Kártya", sv: "Kort", da: "Kort" })}
              </div>

            return null
          })()}
        </div>
      </div>
    </a>
  </Fragment>
}

export function AccountAddButton() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, "/add")

  return <OppositeAnchor
    href={coords.url.hash}
    onClick={coords.onClick}
    onKeyDown={coords.onKeyDown}>
    <Outline.PlusIcon className="size-5" />
    {Lang.match({ en: "Add account", zh: "添加账户", hi: "खाता जोड़ें", es: "Agregar cuenta", ar: "إضافة حساب", fr: "Ajouter un compte", de: "Konto hinzufügen", ru: "Добавить аккаунт", pt: "Adicionar conta", ja: "アカウントを追加", pa: "ਖਾਤਾ ਸ਼ਾਮਲ ਕਰੋ", bn: "অ্যাকাউন্ট যোগ করুন", id: "Tambahkan akun", ur: "اکاؤنٹ شامل کریں", ms: "Tambah akaun", it: "Aggiungi account", tr: "Hesap ekle", ta: "கணக்கைச் சேர்க்கவும்", te: "ఖాతాను జోడించండి", ko: "계정 추가", vi: "Thêm tài khoản", pl: "Dodaj konto", ro: "Adaugă cont", nl: "Account toevoegen", el: "Προσθήκη λογαριασμού", th: "เพิ่มบัญชี", cs: "Přidat účet", hu: "Fiók hozzáadása", sv: "Lägg till konto", da: "Tilføj konto" })}
  </OppositeAnchor>
}

export function AccountAddMenu() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  return <Fragment>
    <SubpathProvider value={hash}>
      {hash.url.pathname === "/password" &&
        <PathBoard>
          <PasswordAccountAddPage />
        </PathBoard>}
      {hash.url.pathname === "/keypair" &&
        <PathBoard>
          <KeypairAccountAddPage />
        </PathBoard>}
      {hash.url.pathname === "/crypto" &&
        <PathBoard>
          <CryptoAccountAddPage />
        </PathBoard>}
      {hash.url.pathname === "/card" &&
        <PathBoard>
          <CardAccountAddPage />
        </PathBoard>}
    </SubpathProvider>
    <div className="flex flex-col gap-2">
      <PasswordAccountAddMenuAnchor />
      <KeypairAccountAddMenuAnchor />
      <CryptoAccountAddMenuAnchor />
      <CardAccountAddMenuAnchor />
    </div>
  </Fragment>
}

export function ColorAnchor(props: { color?: Nullable<string> }) {
  const { color } = props

  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, "/color")

  return <a className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none"
    href={coords.url.hash}
    onClick={coords.onClick}
    onKeyDown={coords.onKeyDown}>
    <InOther>
      <div className="size-5 rounded-full bg-opposite
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
        data-color={color} />
    </InOther>
  </a>
}

export function ColorMenu(props: { ok(color: Nullable<string>): void }) {
  const { ok } = props

  return <div className="grid grid-cols-6 grid-auto-rows gap-2">
    <button className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none"
      onClick={() => ok(null)}
      type="button">
      <InButton>
        <div className="size-5 rounded-full bg-opposite" />
      </InButton>
    </button>
    {["red", "orange", "amber", "yellow", "lime", "green", "emerald", "teal", "cyan", "sky", "blue", "indigo", "violet", "purple", "fuchsia", "pink", "rose"].map(color =>
      <Fragment key={color}>
        <button className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none"
          onClick={() => ok(color)}
          type="button">
          <InButton>
            <div className="size-5 rounded-full
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
              data-color={color} />
          </InButton>
        </button>
      </Fragment>)}
  </div>
}

export function AccountMenuAnchor() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, "/+")

  return <a className="group rounded-full p-2 flex items-center justify-center hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none"
    href={coords.url.hash}
    onClick={coords.onClick}
    onKeyDown={coords.onKeyDown}>
    <InOther>
      <Outline.EllipsisVerticalIcon className="size-5" />
    </InOther>
  </a>
}

export function AccountMenuTrashButton(props: { $entry: KDBX.Inner.KeePassFile.Entry } & { close(force: boolean): void }) {
  const { $entry, close } = props

  const session = useSessionContext().getOrThrow()

  const encrypt = useCallback(async () => {
    const { kdbx, comp } = session.value

    await new Promise(ok => requestIdleCallback(ok))

    $entry.trash()

    return Writable.writeToBytes(await kdbx.encrypt(comp))
  }, [session, $entry])

  const writeOrDisplay = useTask(() => Promise.try(async () => {
    const fsfh = session.value.user.fsfh

    if (fsfh == null)
      return

    const content = await encrypt()

    const writable = await fsfh.createWritable()
    await writable.write(content)
    await writable.close()

    close(true)

    session.update()
  }).catch(Errors.display), [encrypt, close])

  const saveOrDisplay = useTask(() => Promise.try(async () => {
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

      await new Promise(ok => setTimeout(ok, 300))
    }

    close(true)

    session.update()
  }).catch(Errors.display), [encrypt, close])

  return <Fragment>
    {session.value.user.fsfh != null &&
      <WideNakedMenuButton
        type="button"
        disabled={writeOrDisplay.running}
        onClick={writeOrDisplay.execute}>
        {writeOrDisplay.running ? <Spinner className="size-5 animate-spin" /> : <Outline.TrashIcon className="size-5" />}
        {Lang.match({ en: "Trash", zh: "丢弃", hi: "कूड़ेदान", es: "Papelera", ar: "سلة المهملات", fr: "Corbeille", de: "Papierkorb", ru: "Корзина", pt: "Lixeira", ja: "ゴミ箱", pa: "ਕੂੜੇਦਾਨ", bn: "ট্র্যাশ", id: "Sampah", ur: "کوڑے دان", ms: "Tong sampah", it: "Cestino", tr: "Çöp Kutusu", ta: "குப்பை பெட்டி", te: "ట్రాష్ బిన్", ko: "휴지통", vi: "Thùng rác", pl: "Kosz na śmieci", ro: "Coș de gunoi", nl: "Prullenbak", el: "Κάδος απορριμμάτων", th: "ถังขยะ", cs: "Koš na odpadky", hu: "Szemetesláda", sv: "Papperskorg", da: "Skraldespand" })}
      </WideNakedMenuButton>}
    {session.value.user.fsfh == null &&
      <WideNakedMenuButton
        type="button"
        disabled={saveOrDisplay.running}
        onClick={saveOrDisplay.execute}>
        {saveOrDisplay.running ? <Spinner className="size-5 animate-spin" /> : <Outline.TrashIcon className="size-5" />}
        {Lang.match({ en: "Trash", zh: "丢弃", hi: "कूड़ेदान", es: "Papelera", ar: "سلة المهملات", fr: "Corbeille", de: "Papierkorb", ru: "Корзина", pt: "Lixeira", ja: "ゴミ箱", pa: "ਕੂੜੇਦਾਨ", bn: "ট্র্যাশ", id: "Sampah", ur: "کوڑے دان", ms: "Tong sampah", it: "Cestino", tr: "Çöp Kutusu", ta: "குப்பை பெட்டி", te: "ట్రాష్ బిన్", ko: "휴지통", vi: "Thùng rác", pl: "Kosz na śmieci", ro: "Coș de gunoi", nl: "Prullenbak", el: "Κάδος απορριμμάτων", th: "ถังขยะ", cs: "Koš na odpadky", hu: "Szemetesláda", sv: "Papperskorg", da: "Skraldespand" })}
      </WideNakedMenuButton>}
  </Fragment>
}

export function AccountMenuUntrashButton(props: { $entry: KDBX.Inner.KeePassFile.Entry } & { close(force: boolean): void }) {
  const { $entry, close } = props

  const session = useSessionContext().getOrThrow()

  const encrypt = useCallback(async () => {
    const { kdbx, comp } = session.value

    await new Promise(ok => requestIdleCallback(ok))

    const $file = kdbx.inner.content.value
    const $root = $file.getRootOrThrow()

    $entry.move($root.getDirectGroupByIndexOrThrow(0))

    return Writable.writeToBytes(await kdbx.encrypt(comp))
  }, [session, $entry])

  const writeOrDisplay = useTask(() => Promise.try(async () => {
    const fsfh = session.value.user.fsfh

    if (fsfh == null)
      return

    const content = await encrypt()

    const writable = await fsfh.createWritable()
    await writable.write(content)
    await writable.close()

    close(true)

    session.update()
  }).catch(Errors.display), [encrypt, close])

  const saveOrDisplay = useTask(() => Promise.try(async () => {
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

      await new Promise(ok => setTimeout(ok, 300))
    }

    close(true)

    session.update()
  }).catch(Errors.display), [encrypt, close])

  return <Fragment>
    {session.value.user.fsfh != null &&
      <WideNakedMenuButton
        type="button"
        disabled={writeOrDisplay.running}
        onClick={writeOrDisplay.execute}>
        {writeOrDisplay.running ? <Spinner className="size-5 animate-spin" /> : <Outline.TrashIcon className="size-5" />}
        {Lang.match({ en: "Untrash", zh: "恢复", hi: "पुनः प्राप्त करें", es: "Restaurar", ar: "استعادة", fr: "Restaurer", de: "Wiederherstellen", ru: "Восстановить", pt: "Restaurar", ja: "復元", pa: "ਪੁਨਰ ਪ੍ਰਾਪਤ ਕਰੋ", bn: "পুনরুদ্ধার", id: "Pulihkan", ur: "بحال کریں", ms: "Pulihkan", it: "Ripristina", tr: "Geri Yükle", ta: "மீட்டெடுக்கவும்", te: "పునరుద్ధరించు", ko: "복원", vi: "Khôi phục", pl: "Przywróć", ro: "Restabilește", nl: "Herstellen", el: "Επαναφορά", th: "กู้คืน", cs: "Obnovit", hu: "Visszaállítás", sv: "Återställ", da: "Gendan" })}
      </WideNakedMenuButton>}
    {session.value.user.fsfh == null &&
      <WideNakedMenuButton
        type="button"
        disabled={saveOrDisplay.running}
        onClick={saveOrDisplay.execute}>
        {saveOrDisplay.running ? <Spinner className="size-5 animate-spin" /> : <Outline.TrashIcon className="size-5" />}
        {Lang.match({ en: "Untrash", zh: "恢复", hi: "पुनः प्राप्त करें", es: "Restaurar", ar: "استعادة", fr: "Restaurer", de: "Wiederherstellen", ru: "Восстановить", pt: "Restaurar", ja: "復元", pa: "ਪੁਨਰ ਪ੍ਰਾਪਤ ਕਰੋ", bn: "পুনরুদ্ধার", id: "Pulihkan", ur: "بحال کریں", ms: "Pulihkan", it: "Ripristina", tr: "Geri Yükle", ta: "மீட்டெடுக்கவும்", te: "పునరుద్ధరించు", ko: "복원", vi: "Khôi phục", pl: "Przywróć", ro: "Restabilește", nl: "Herstellen", el: "Επαναφορά", th: "กู้คืน", cs: "Obnovit", hu: "Visszaállítás", sv: "Återställ", da: "Gendan" })}
      </WideNakedMenuButton>}
  </Fragment>
}

export function AccountMenuDeleteButton(props: { $entry: KDBX.Inner.KeePassFile.Entry } & { close(force: boolean): void }) {
  const { $entry, close } = props

  const session = useSessionContext().getOrThrow()

  const encrypt = useCallback(async () => {
    const { kdbx, comp } = session.value

    await new Promise(ok => requestIdleCallback(ok))

    const subentries = [...kdbx.inner.content.value.document.querySelectorAll("Entry")].filter(e => !e.closest("History")).map(e => new KDBX.Inner.KeePassFile.Entry(e)).filter(e => e.getStringByKeyOrNull("Parent")?.getValueOrNull()?.get() === $entry.getUuidOrThrow().toString())

    for (const $subentry of subentries)
      $subentry.element.parentNode?.removeChild($subentry.element)

    $entry.element.parentNode?.removeChild($entry.element)

    return Writable.writeToBytes(await kdbx.encrypt(comp))
  }, [session, $entry])

  const writeOrDisplay = useTask(() => Promise.try(async () => {
    if (!confirm(Lang.match({ en: "Are you sure you want to permanently delete this account?", zh: "您确定要永久删除此账户吗？", hi: "क्या आप वाकई इस खाते को स्थायी रूप से हटाना चाहते हैं?", es: "¿Está seguro de que desea eliminar permanentemente esta cuenta?", ar: "هل أنت متأكد أنك تريد حذف هذا الحساب نهائيًا؟", fr: "Êtes-vous sûr de vouloir supprimer définitivement ce compte ?", de: "Sind Sie sicher, dass Sie dieses Konto dauerhaft löschen möchten?", ru: "Вы уверены, что хотите навсегда удалить эту учетную запись?", pt: "Tem certeza de que deseja excluir permanentemente esta conta?", ja: "このアカウントを完全に削除してもよろしいですか？", pa: "ਕੀ ਤੁਸੀਂ ਯਕੀਨਨ ਇਸ ਖਾਤੇ ਨੂੰ ਸਥਾਈ रूप से हटाना चाहते हैं?", bn: "আপনি কি সত্যিই এই অ্যাকাউন্টটি স্থায়ীভাবে মুছে ফেলতে চান?", id: "Apakah Anda yakin ingin menghapus akun ini secara permanen?", ur: "کیا آپ واقعی اس اکاؤنٹ کو مستقل طور پر حذف کرنا چاہتے ہیں؟", ms: "Adakah anda pasti mahu memadam akaun ini secara kekal?", it: "Sei sicuro di voler eliminare definitivamente questo account?", tr: "Bu hesabı kalıcı olarak silmek istediğinizden emin misiniz?", ta: "இந்த கணக்கை நிரந்தரமாக நீக்க விரும்புகிறீர்களா?", te: "మీరు ఈ ఖాతాను శాశ్వతంగా తొలగించాలనుకుంటున్నారా?", ko: "이 계정을 영구적으로 삭제하시겠습니까?", vi: "Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản này không?", pl: "Czy na pewno chcesz trwale usunąć to konto?", ro: "Sigur doriți să ștergeți definitiv acest cont?", nl: "Weet je zeker dat je dit account permanent wilt verwijderen?", el: "Είστε σίγουροι ότι θέλετε να διαγράψετε οριστικά αυτόν τον λογαριασμό;", th: "คุณแน่ใจหรือไม่ว่าต้องการลบบัญชีนี้อย่างถาวร?", cs: "Opravdu chcete tento účet trvale smazat?", hu: "Biztos benne, hogy véglegesen törölni szeretné ezt a fiókot?", sv: "Är du säker på att du vill ta bort det här kontot permanent?", da: "Er du sikker på, at du vil slette denne konto permanent?" })))
      return

    const fsfh = session.value.user.fsfh

    if (fsfh == null)
      return

    const content = await encrypt()

    const writable = await fsfh.createWritable()
    await writable.write(content)
    await writable.close()

    close(true)

    session.update()
  }).catch(Errors.display), [encrypt, close])

  const saveOrDisplay = useTask(() => Promise.try(async () => {
    if (!confirm(Lang.match({ en: "Are you sure you want to permanently delete this account?", zh: "您确定要永久删除此账户吗？", hi: "क्या आप वाकई इस खाते को स्थायी रूप से हटाना चाहते हैं?", es: "¿Está seguro de que desea eliminar permanentemente esta cuenta?", ar: "هل أنت متأكد أنك تريد حذف هذا الحساب نهائيًا؟", fr: "Êtes-vous sûr de vouloir supprimer définitivement ce compte ?", de: "Sind Sie sicher, dass Sie dieses Konto dauerhaft löschen möchten?", ru: "Вы уверены, что хотите навсегда удалить эту учетную запись?", pt: "Tem certeza de que deseja excluir permanentemente esta conta?", ja: "このアカウントを完全に削除してもよろしいですか？", pa: "ਕੀ ਤੁਸੀਂ ਯਕੀਨਨ ਇਸ ਖਾਤੇ ਨੂੰ ਸਥਾਈ रूप से हटाना चाहते हैं?", bn: "আপনি কি সত্যিই এই অ্যাকাউন্টটি স্থায়ীভাবে মুছে ফেলতে চান?", id: "Apakah Anda yakin ingin menghapus akun ini secara permanen?", ur: "کیا آپ واقعی اس اکاؤنٹ کو مستقل طور پر حذف کرنا چاہتے ہیں؟", ms: "Adakah anda pasti mahu memadam akaun ini secara kekal?", it: "Sei sicuro di voler eliminare definitivamente questo account?", tr: "Bu hesabı kalıcı olarak silmek istediğinizden emin misiniz?", ta: "இந்த கணக்கை நிரந்தரமாக நீக்க விரும்புகிறீர்களா?", te: "మీరు ఈ ఖాతాను శాశ్వతంగా తొలగించాలనుకుంటున్నారా?", ko: "이 계정을 영구적으로 삭제하시겠습니까?", vi: "Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản này không?", pl: "Czy na pewno chcesz trwale usunąć to konto?", ro: "Sigur doriți să ștergeți definitiv acest cont?", nl: "Weet je zeker dat je dit account permanent wilt verwijderen?", el: "Είστε σίγουροι ότι θέλετε να διαγράψετε οριστικά αυτόν τον λογαριασμό;", th: "คุณแน่ใจหรือไม่ว่าต้องการลบบัญชีนี้อย่างถาวร?", cs: "Opravdu chcete tento účet trvale smazat?", hu: "Biztos benne, hogy véglegesen törölni szeretné ezt a fiókot?", sv: "Är du säker på att du vill ta bort det här kontot permanent?", da: "Er du sikker på, at du vil slette denne konto permanent?" })))
      return

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

      await new Promise(ok => setTimeout(ok, 300))
    }

    close(true)

    session.update()
  }).catch(Errors.display), [encrypt, close])

  return <Fragment>
    {session.value.user.fsfh != null &&
      <WideNakedMenuButton
        type="button"
        disabled={writeOrDisplay.running}
        onClick={writeOrDisplay.execute}>
        {writeOrDisplay.running ? <Spinner className="size-5 animate-spin" /> : <Outline.ScissorsIcon className="size-5" />}
        {Lang.match({ en: "Delete", zh: "删除", hi: "हटाएं", es: "Eliminar", ar: "حذف", fr: "Supprimer", de: "Löschen", ru: "Удалить", pt: "Excluir", ja: "削除", pa: "ਹਟਾਓ", bn: "মুছে ফেলুন", id: "Hapus", ur: "حذف کریں", ms: "Padam", it: "Elimina", tr: "Sil", ta: "அழிக்கவும்", te: "తొలగించు", ko: "삭제", vi: "Xóa", pl: "Usuń", ro: "Șterge", nl: "Verwijderen", el: "Διαγραφή", th: "ลบ", cs: "Smazat", hu: "Törlés", sv: "Radera", da: "Slet" })}
      </WideNakedMenuButton>}
    {session.value.user.fsfh == null &&
      <WideNakedMenuButton
        type="button"
        disabled={saveOrDisplay.running}
        onClick={saveOrDisplay.execute}>
        {saveOrDisplay.running ? <Spinner className="size-5 animate-spin" /> : <Outline.ScissorsIcon className="size-5" />}
        {Lang.match({ en: "Delete", zh: "删除", hi: "हटाएं", es: "Eliminar", ar: "حذف", fr: "Supprimer", de: "Löschen", ru: "Удалить", pt: "Excluir", ja: "削除", pa: "ਹਟਾਓ", bn: "মুছে ফেলুন", id: "Hapus", ur: "حذف کریں", ms: "Padam", it: "Elimina", tr: "Sil", ta: "அழிக்கவும்", te: "తొలగించు", ko: "삭제", vi: "Xóa", pl: "Usuń", ro: "Șterge", nl: "Verwijderen", el: "Διαγραφή", th: "ลบ", cs: "Smazat", hu: "Törlés", sv: "Radera", da: "Slet" })}
      </WideNakedMenuButton>}
  </Fragment>
}