import { InButton, WideContrastButton, WideOppositeButton } from "@/libs/button/mod.tsx";
import { FlipCard } from "@/libs/card/mod.tsx";
import { useCopy } from "@/libs/copy/mod.ts";
import { PathBoard } from "@/libs/dialog/board/mod.tsx";
import { PathPaper, WideNakedMenuAnchor } from "@/libs/dialog/paper/mod.tsx";
import { Errors } from "@/libs/errors/mod.ts";
import { Events } from "@/libs/events/mod.ts";
import { Outline } from "@/libs/heroicons/mod.ts";
import { getRecycleBinOrNull } from "@/libs/kdbx/mod.ts";
import { Lang } from "@/libs/lang/mod.ts";
import { Nullable } from "@/libs/nullable/mod.ts";
import { Spinner } from "@/libs/spinner/mod.tsx";
import { useTask } from "@/libs/task/mod.ts";
import { Writable } from "@hazae41/binary";
import { BitcoinSeedPhrase } from "@hazae41/broca";
import { SubpathProvider, useAnchorWithCoords, useHashSubpath, usePathContext } from "@hazae41/chemin";
import * as KDBX from "@hazae41/kdbx";
import { useCloseContext } from "@hazae41/react-close-context";
import React, { Fragment, useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";
import { useSessionContext } from "../../mod.tsx";
import { AccountMenuAnchor, AccountMenuDeleteButton, AccountMenuTrashButton, AccountMenuUntrashButton, ColorAnchor, ColorMenu } from "../mod.tsx";
import { CryptoSubaccountAnchor } from "./subaccount/mod.tsx";

React;

export function CryptoAccountAddMenuAnchor() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, "/crypto")

  return <WideNakedMenuAnchor
    href={coords.url.hash}
    onClick={coords.onClick}
    onKeyDown={coords.onKeyDown}>
    <Outline.BanknotesIcon className="size-5" />
    {Lang.match({ en: "Crypto", zh: "加密货币", hi: "क्रिप्टो", es: "Cripto", ar: "تشفير", fr: "Crypto", de: "Krypto", ru: "Крипто", pt: "Cripto", ja: "暗号通貨", pa: "ਕ੍ਰਿਪਟੋ", bn: "ক্রিপ্টো", id: "Kripto", ur: "کرپٹو", ms: "Kripto", it: "Cripto", tr: "Kripto", ta: "கிரிப்டோ", te: "క్రిప్టో", ko: "암호화폐", vi: "Tiền điện tử", pl: "Krypto", ro: "Cripto", nl: "Crypto", el: "Κρυπτο", th: "คริปโต", cs: "Krypto", hu: "Kripto", sv: "Krypto", da: "Krypto" })}
  </WideNakedMenuAnchor>
}

export function CryptoAccountAddPage() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const close = useCloseContext().getOrThrow()

  const session = useSessionContext().getOrThrow()

  const [flipped, setFlipped] = useState(false)

  const [$title, setTitle] = useState("")

  const [$seedphrase, setSeedPhrase] = useState("")

  const [$notes, setNotes] = useState("")

  const title = useDeferredValue($title)

  const [color, setColor] = useState<Nullable<string>>(["red", "orange", "amber", "yellow", "lime", "green", "emerald", "teal", "cyan", "sky", "blue", "indigo", "violet", "purple", "fuchsia", "pink", "rose"][Math.floor(Math.random() * 16)])

  const seedphrase = useDeferredValue($seedphrase)

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

    if (seedphrase)
      $entry.addStringOrThrow("SeedPhrase", seedphrase, true)

    if (notes)
      $entry.addStringOrThrow("Notes", notes)

    return Writable.writeToBytesOrThrow(await kdbx.encryptOrThrow(comp))
  }, [session, title, color, seedphrase, notes])

  const writeOrDisplay = useTask(() => Promise.try(async () => {
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

  const saveOrDisplay = useTask(() => Promise.try(async () => {
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

  const onGenerateClick = useCallback(() => Promise.try(async () => {
    setSeedPhrase(await BitcoinSeedPhrase.generate(256))
  }).catch(Errors.display), [])

  const [valid, setValid] = useState(false)

  const getValidOrThrow = useCallback(async () => {
    return await BitcoinSeedPhrase.validate(seedphrase)
  }, [seedphrase])

  useEffect(() => {
    getValidOrThrow().then(setValid).catch(console.error)
  }, [getValidOrThrow])

  const error = useMemo(() => {
    if (!seedphrase.length)
      return Lang.match({ en: "Seed phrase is required", zh: "助记词是必需的", hi: "सीड वाक्य आवश्यक है", es: "La frase semilla es obligatoria", ar: "عبارة البذور مطلوبة", fr: "La phrase de récupération est requise", de: "Seed-Phrase ist erforderlich", ru: "Требуется сид-фраза", pt: "A frase semente é obrigatória", ja: "シードフレーズは必須です", pa: "ਸੀਡ ਫਰੇਜ਼ ਦੀ ਲੋੜ ਹੈ", bn: "সিড বাক্য প্রয়োজন", id: "Frasa seed diperlukan", ur: "سیڈ فریز ضروری ہے", ms: "Frasa seed diperlukan", it: "La frase seed è obbligatoria", tr: "Seed cümlesi gereklidir", ta: "சீட் வாக்கியம் தேவை", te: "సీడ్ వాక్యం అవసరం", ko: "시드 구문이 필요합니다", vi: "Cụm từ seed là bắt buộc", pl: "Fraza seed jest wymagana", ro: "Fraza seed este obligatorie", nl: "Seed-phrase is verplicht", el: "Η φράση σπόρου είναι υποχρεωτική", th: "วลีเมล็ดพันธุ์เป็นสิ่งจำเป็น", cs: "Seed phrase je povinná", hu: "A seed kifejezés kötelező", sv: "Seed phrase är obligatorisk", da: "Seed phrase er påkrævet" })
    if (!valid)
      return Lang.match({ en: "Seed phrase is invalid", zh: "助记词无效", hi: "सीड वाक्य अमान्य है", es: "La frase semilla no es válida", ar: "عبارة البذور غير صالحة", fr: "La phrase de récupération est invalide", de: "Seed-Phrase ist ungültig", ru: "Сид-фраза недействительна", pt: "A frase semente é inválida", ja: "シードフレーズが無効です", pa: "ਸੀਡ ਫਰੇਜ਼ ਅਵੈਧ ਹੈ", bn: "সিড বাক্য অবৈধ", id: "Frasa seed tidak valid", ur: "سیڈ فریز غیر معتبر ہے", ms: "Frasa seed tidak sah", it: "La frase seed non è valida", tr: "Seed cümlesi geçersiz", ta: "சீட் வாக்கியம் தவறானது", te: "సీడ్ వాక్యం చెల్లదు", ko: "시드 구문이 유효하지 않습니다", vi: "Cụm từ seed không hợp lệ", pl: "Fraza seed jest nieprawidłowa", ro: "Fraza seed este invalidă", nl: "Seed-phrase is ongeldig", el: "Η φράση σπόρου δεν είναι έγκυρη", th: "วลีเมล็ดพันธุ์ไม่ถูกต้อง", cs: "Seed phrase je neplatná", hu: "A seed kifejezés érvénytelen", sv: "Seed phrase är ogiltig", da: "Seed phrase er ugyldig" })
    return
  }, [seedphrase, valid])

  return <Fragment>
    <SubpathProvider value={hash}>
      {hash.url.pathname === "/color" &&
        <PathPaper>
          <ColorMenu ok={setColor} />
        </PathPaper>}
    </SubpathProvider>
    <div className="flex flex-col grow p-6">
      <h1 className="text-xl font-medium">
        {Lang.match({ en: "Add crypto account", zh: "添加加密账户", hi: "क्रिप्टो खाता जोड़ें", es: "Agregar cuenta de cripto", ar: "إضافة حساب تشفير", fr: "Ajouter un compte crypto", de: "Krypto-Konto hinzufügen", ru: "Добавить крипто-аккаунт", pt: "Adicionar conta cripto", ja: "暗号通貨アカウントを追加", pa: "ਕ੍ਰਿਪਟੋ ਖਾਤਾ ਸ਼ਾਮਲ ਕਰੋ", bn: "ক্রিপ্টো অ্যাকাউন্ট যোগ করুন", id: "Tambahkan akun kripto", ur: "کرپٹو اکاؤنٹ شامل کریں", ms: "Tambahkan akun kripto", it: "Aggiungi account cripto", tr: "Kripto hesabı ekle", ta: "கிரிப்டோ கணக்கு சேர்க்கவும்", te: "క్రిప్టో ఖాతా జోడించండి", ko: "암호화폐 계정 추가", vi: "Thêm tài khoản crypto", pl: "Dodaj konto krypto", ro: "Adaugă cont crypto", nl: "Crypto-account toevoegen", el: "Προσθήκη λογαριασμού κρυπτογράφησης", th: "เพิ่มบัญชีคริปโต", cs: "Přidat krypto účet", hu: "Kripto fiók hozzáadása", sv: "Lägg till krypto-konto", da: "Tilføj krypto-konto" })}
      </h1>
      <div className="h-6" />
      <div className="flex items-center justify-center">
        <FlipCard
          type={Lang.match({ en: "Crypto", zh: "加密货币", hi: "क्रिप्टो", es: "Cripto", ar: "تشفير", fr: "Crypto", de: "Krypto", ru: "Крипто", pt: "Cripto", ja: "暗号通貨", pa: "ਕ੍ਰਿਪਟੋ", bn: "ক্রিপ্টো", id: "Kripto", ur: "کرپٹو", ms: "Kripto", it: "Cripto", tr: "Kripto", ta: "கிரிப்டோ", te: "క్రిప్టో", ko: "암호화폐", vi: "Tiền điện tử", pl: "Krypto", ro: "Cripto", nl: "Crypto", el: "Κρυπτο", th: "คริปโต", cs: "Krypto", hu: "Kripto", sv: "Krypto", da: "Krypto" })}
          title={title}
          color={color}
          icon={<Outline.BanknotesIcon className="size-5" />}
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
          {Lang.match({ en: "A name to identify this account.", zh: "用于识别此账户的名称。", hi: "इस खाते की पहचान करने के लिए एक नाम।", es: "Un nombre para identificar esta cuenta.", ar: "اسم لتحديد هذا الحساب.", fr: "Un nom pour identifier ce compte.", de: "Ein Name zur Identifizierung dieses Kontos.", ru: "Имя для идентификации этого аккаунта.", pt: "Um nome para identificar esta conta.", ja: "このアカウントを識別するための名前。", pa: "ਇਸ ਖਾਤੇ ਦੀ ਪਛਾਣ ਕਰਨ ਲਈ ਇੱਕ ਨਾਮ।", bn: "এই অ্যাকাউন্টটি সনাক্ত করার জন্য একটি নাম।", id: "Nama untuk mengidentifikasi akun ini.", ur: "اس اکاؤنٹ کی شناخت کے لیے ایک نام۔", ms: "Nama untuk mengenal pasti akaun ini.", it: "Un nome per identificare questo account.", tr: "Bu hesabı tanımlamak için bir ad.", ta: "இந்த கணக்கை அடையாளம் காண ஒரு பெயர்.", te: "ఈ ఖాతాను గుర్తించడానికి ఒక పేరు.", ko: "이 계정을 식별하기 위한 이름.", vi: "Một tên để xác định tài khoản này.", pl: "Nazwa do identyfikacji tego konta.", ro: "Un nume pentru a identifica acest cont.", nl: "Een naam om dit account te identificeren.", el: "Ένα όνομα για να αναγνωρίσετε αυτόν τον λογαριασμό.", th: "ชื่อเพื่อระบุบัญชีนี้", cs: "Název pro identifikaci tohoto účtu.", hu: "Egy név ennek a fióknak az azonosításához.", sv: "Ett namn för att identifiera detta konto.", da: "Et navn til at identificere denne konto." })}
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
          {Lang.match({ en: "Seed phrase", zh: "助记词", hi: "सीड वाक्य", es: "Frase semilla", ar: "عبارة البذور", fr: "Phrase de récupération", de: "Seed-Phrase", ru: "Сид-фраза", pt: "Frase semente", ja: "シードフレーズ", pa: "ਸੀਡ ਫਰੇਜ਼", bn: "সিড বাক্য", id: "Frasa seed", ur: "سیڈ فریز", ms: "Frasa seed", it: "Frase seed", tr: "Seed cümlesi", ta: "சீட் வாக்கியம்", te: "సీడ్ వాక్యం", ko: "시드 구문", vi: "Cụm từ seed", pl: "Fraza seed", ro: "Fraza seed", nl: "Seed-phrase", el: "Φράση σπόρου", th: "วลีเมล็ดพันธุ์", cs: "Seed phrase", hu: "Seed kifejezés", sv: "Seed phrase", da: "Seed phrase" })}
        </div>
        <div className="text-default-contrast">
          {Lang.match({ en: "Your BIP-39 seed phrase.", zh: "您的 BIP-39 助记词。", hi: "आपका BIP-39 सीड वाक्य।", es: "Su frase semilla BIP-39.", ar: "عبارة البذور BIP-39 الخاصة بك.", fr: "Votre phrase de récupération BIP-39.", de: "Ihre BIP-39 Seed-Phrase.", ru: "Ваша BIP-39 сид-фраза.", pt: "Sua frase semente BIP-39.", ja: "あなたの BIP-39 シードフレーズ。", pa: "ਤੁਹਾਡਾ BIP-39 ਸੀਡ ਫਰੇਜ਼।", bn: "আপনার BIP-39 সিড বাক্য।", id: "Frasa seed BIP-39 Anda.", ur: "آپ کا BIP-39 سیڈ فریز۔", ms: "Frasa seed BIP-39 anda.", it: "La tua frase seed BIP-39.", tr: "BIP-39 seed cümleniz.", ta: "உங்கள் BIP-39 சீட் வாக்கியம்.", te: "మీ BIP-39 సీడ్ వాక్యం.", ko: "귀하의 BIP-39 시드 구문.", vi: "Cụm từ seed BIP-39 của bạn.", pl: "Twoja fraza seed BIP-39.", ro: "Fraza seed BIP-39 a dvs.", nl: "Uw BIP-39 seed phrase.", el: "Η φράση σπόρου BIP-39 σας.", th: "วลีเมล็ดพันธุ์ BIP-39 ของคุณ.", cs: "Vaše BIP-39 seed phrase.", hu: "Az Ön BIP-39 seed kifejezése.", sv: "Din BIP-39 seed phrase.", da: "Din BIP-39 seed phrase." })}
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex flex-col gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <textarea className="w-full focus-visible:outline-none"
            rows={3}
            autoComplete="off"
            onChange={e => setSeedPhrase(e.target.value)}
            value={flipped ? $seedphrase : $seedphrase.replaceAll(/./g, "•")} />
        </div>
        <div className="h-2" />
        <div className="flex items-center flex-wrap-reverse gap-2">
          <WideContrastButton
            onClick={() => setFlipped(x => !x)}>
            {flipped ? <Outline.EyeSlashIcon className="size-5" /> : <Outline.EyeIcon className="size-5" />}
            {flipped ? Lang.match({ en: "Hide", zh: "隐藏", hi: "छिपाएं", es: "Ocultar", ar: "إخفاء", fr: "Cacher", de: "Verbergen", ru: "Скрыть", pt: "Esconder", ja: "隠す", pa: "ਛੁਪਾਓ", bn: "লুকান", id: "Sembunyikan", ur: "چھپائیں", ms: "Sembunyikan", it: "Nascondi", tr: "Gizle", ta: "மறை", te: "దాచు", ko: "숨기기", vi: "Ẩn", pl: "Ukryj", ro: "Ascundeți", nl: "Verbergen", el: "Κρύβω", th: "ซ่อน", cs: "Skrýt", hu: "Elrejtés", sv: "Dölj", da: "Skjul" }) : Lang.match({ en: "Show", zh: "显示", hi: "दिखाएं", es: "Mostrar", ar: "إظهار", fr: "Afficher", de: "Anzeigen", ru: "Показать", pt: "Mostrar", ja: "表示する", pa: "ਦਿਖਾਓ", bn: "দেখান", id: "Tampilkan", ur: "دکھائیں", ms: "Tampilkan", it: "Mostra", tr: "Göster", ta: "காட்டு", te: "తెరచు", ko: "보이기", vi: "Hiển thị", pl: "Pokaż", ro: "Afișați", nl: "Tonen", el: "Εμφάνιση ", th: "แสดง ", cs: "Zobrazit ", hu: "Megjelenítés ", sv: "Visa ", da: "Vis" })}
          </WideContrastButton>
          <WideContrastButton
            onClick={onGenerateClick}>
            <Outline.SparklesIcon className="size-5" />
            {Lang.match({ en: "Generate", zh: "生成", hi: "उत्पन्न करें", es: "Generar", ar: "توليد", fr: "Générer", de: "Generieren", ru: "Создать", pt: "Gerar", ja: "生成", pa: "ਤਿਆਰ ਕਰੋ", bn: "উত্পন্ন করুন", id: "Hasilkan", ur: "تخلیق کریں", ms: "Hasilkan", it: "Genera", tr: "Oluştur", ta: "உருவாக்கு", te: "సృష్టించు", ko: "생성", vi: "Tạo", pl: "Generuj", ro: "Generează", nl: "Genereren", el: "Δημιουργία", th: "สร้าง", cs: "Generovat", hu: "Generálás", sv: "Generera", da: "Generer" })}
          </WideContrastButton>
        </div>
        <div className="h-6" />
        <div className="font-medium">
          {Lang.match({ en: "Notes", zh: "备注", hi: "नोट्स", es: "Notas", ar: "ملاحظات", fr: "Notes", de: "Notizen", ru: "Заметки", pt: "Notas", ja: "ノート", pa: "ਨੋਟਸ", bn: "নোটস", id: "Catatan", ur: "نوٹس", ms: "Nota", it: "Note", tr: "Notlar", ta: "குறிப்புகள்", te: "గమనికలు", ko: "노트", vi: "Ghi chú", pl: "Notatki", ro: "Note", nl: "Notities", el: "Σημειώσεις", th: "บันทึก", cs: "Poznámky", hu: "Jegyzetek", sv: "Anteckningar", da: "Noter" })}
        </div>
        <div className="text-default-contrast">
          {Lang.match({ en: "Any additional information.", zh: "任何附加信息。", hi: "कोई अतिरिक्त जानकारी।", es: "Cualquier información adicional.", ar: "أي معلومات إضافية.", fr: "Toute information supplémentaire.", de: "Alle zusätzlichen Informationen.", ru: "Любая дополнительная информация.", pt: "Qualquer informação adicional.", ja: "追加情報。", pa: "ਕੋਈ ਵੀ ਵਾਧੂ ਜਾਣਕਾਰੀ।", bn: "যেকোনও অতিরিক্ত তথ্য।", id: "Informasi tambahan apa pun.", ur: "کوئی اضافی معلومات۔", ms: "Sebarang maklumat tambahan.", it: "Qualsiasi informazione aggiuntiva.", tr: "Herhangi bir ek bilgi.", ta: "எந்தவொரு கூடுதல் தகவலும்.", te: "ఏదైనా అదనపు సమాచారం.", ko: "추가 정보.", vi: "Bất kỳ thông tin bổ sung nào.", pl: "Wszelkie dodatkowe informacje.", ro: "Orice informație suplimentară.", nl: "Eventuele aanvullende informatie.", el: "Οποιαδήποτε επιπλέον πληροφορία.", th: "ข้อมูลเพิ่มเติมใด ๆ.", cs: "Jakékoli další informace.", hu: "Bármilyen további információ.", sv: "Eventuell ytterligare information.", da: "Eventuelle yderligere oplysninger." })}
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex flex-col  gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <textarea className="w-full resize-none focus-visible:outline-none"
            rows={6}
            autoComplete="off"
            placeholder={Lang.match({ en: "I use this account for...", zh: "我使用这个账户来...", hi: "मैं इस खाते का उपयोग करता हूं...", es: "Uso esta cuenta para...", ar: "أستخدم هذا الحساب لـ...", fr: "J'utilise ce compte pour...", de: "Ich benutze dieses Konto für...", ru: "Я использую этот аккаунт для...", pt: "Eu uso esta conta para...", ja: "このアカウントは...のために使用します", pa: "ਮੈਂ ਇਸ ਖਾਤੇ ਨੂੰ... ਲਈ ਵਰਤਦਾ ਹਾਂ", bn: "আমি এই অ্যাকাউন্টটি... জন্য ব্যবহার করি", id: "Saya menggunakan akun ini untuk...", ur: "میں اس اکاؤنٹ کو... کے لیے استعمال کرتا ہوں", ms: "Saya menggunakan akun ini untuk...", it: "Uso questo account per...", tr: "Bu hesabı... için kullanıyorum", ta: "நான் இந்த கணக்கை... க்காக பயன்படுத்துகிறேன்", te: "నేను ఈ ఖాతాను... కోసం ఉపయోగిస్తున్నాను", ko: "이 계정을...에 사용합니다", vi: "Tôi sử dụng tài khoản này cho...", pl: "Używam tego konta do...", ro: "Folosesc acest cont pentru...", nl: "Ik gebruik dit account voor...", el: "Χρησιμοποιώ αυτόν τον λογαριασμό για...", th: "ฉันใช้บัญชีนี้สำหรับ...", cs: "Používám tento účet pro...", hu: "Ezt a fiókot arra használom, hogy...", sv: "Jag använder det här kontot för...", da: "Jeg bruger denne konto til..." })}
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
              {writeOrDisplay.running === true && <Spinner className="size-6 animate-spin" />}
              {writeOrDisplay.running === false && (error != null ? error : Lang.match({ en: "Save", zh: "保存", hi: "सहेजें", es: "Guardar", ar: "حفظ", fr: "Enregistrer", de: "Speichern", ru: "Сохранить", pt: "Salvar", ja: "保存", pa: "ਸੰਭਾਲੋ", bn: "সংরক্ষণ করুন", id: "Simpan", ur: "محفوظ کریں", ms: "Simpan", it: "Salva", tr: "Kaydet", ta: "சேமிக்கவும்", te: "సేవ్ చేయండి", ko: "저장", vi: "Lưu", pl: "Zapisz", ro: "Salvează", nl: "Opslaan", el: "Αποθήκευση ", th: "บันทึก ", cs: "Uložit ", hu: "Mentés ", sv: "Spara ", da: "Gem" }))}
            </WideOppositeButton>}
          {session.value.user.fsfh == null &&
            <WideOppositeButton
              type="button"
              disabled={saveOrDisplay.running || error != null}
              onClick={saveOrDisplay.execute}>
              {saveOrDisplay.running === true && <Spinner className="size-6 animate-spin" />}
              {saveOrDisplay.running === false && (error != null ? error : Lang.match({ en: "Save", zh: "保存", hi: "सहेजें", es: "Guardar", ar: "حفظ", fr: "Enregistrer", de: "Speichern", ru: "Сохранить", pt: "Salvar", ja: "保存", pa: "ਸੰਭਾਲੋ", bn: "সংরক্ষণ করুন", id: "Simpan", ur: "محفوظ کریں", ms: "Simpan", it: "Salva", tr: "Kaydet", ta: "சேமிக்கவும்", te: "సేవ్ చేయండి", ko: "저장", vi: "Lưu", pl: "Zapisz", ro: "Salvează", nl: "Opslaan", el: "Αποθήκευση ", th: "บันทึก ", cs: "Uložit ", hu: "Mentés ", sv: "Spara ", da: "Gem" }))}
            </WideOppositeButton>}
        </div>
      </form>
    </div>
  </Fragment>
}

export function CryptoAccountPage(props: { $entry: KDBX.Inner.KeePassFile.Entry }) {
  const { $entry } = props

  const close = useCloseContext().getOrThrow()

  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const [flipped, setFlipped] = useState(false)

  const title = useMemo(() => {
    return $entry.getStringByKeyOrNull("Title")?.getValueOrThrow().get()
  }, [$entry])

  const color = useMemo(() => {
    return $entry.getStringByKeyOrNull("Color")?.getValueOrThrow().get()
  }, [$entry])

  const notes = useMemo(() => {
    return $entry.getStringByKeyOrNull("Notes")?.getValueOrThrow().get()
  }, [$entry])

  const [index, setIndex] = useState(0)

  return <Fragment>
    <SubpathProvider value={hash}>
      {hash.url.pathname === "/+" &&
        <PathPaper>
          <CryptoAccountMenu $entry={$entry} close={close} />
        </PathPaper>}
    </SubpathProvider>
    <div className="flex flex-col grow p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium">
          {Lang.match({ en: "Crypto account", zh: "加密账户", hi: "क्रिप्टो खाता", es: "Cuenta de cripto", ar: "حساب تشفير", fr: "Compte crypto", de: "Krypto-Konto", ru: "Крипто-аккаунт", pt: "Conta cripto", ja: "暗号通貨アカウント", pa: "ਕ੍ਰਿਪਟੋ ਖਾਤਾ", bn: "ক্রিপ্টো অ্যাকাউন্ট", id: "Akun kripto", ur: "کرپٹو اکاؤنٹ", ms: "Akun kripto", it: "Account cripto", tr: "Kripto hesabı", ta: "கிரிப்டோ கணக்கு", te: "క్రిప్టో ఖాతా", ko: "암호화폐 계정", vi: "Tài khoản crypto", pl: "Konto krypto", ro: "Cont crypto", nl: "Crypto-account", el: "Λογαριασμός κρυπτογράφησης", th: "บัญชีคริปโต", cs: "Krypto účet", hu: "Kripto fiók", sv: "Krypto-konto", da: "Krypto-konto" })}
        </h1>
        <AccountMenuAnchor />
      </div>
      <div className="h-6" />
      <div className="flex items-center justify-center">
        <FlipCard
          type={Lang.match({ en: "Crypto", zh: "加密货币", hi: "क्रिप्टो", es: "Cripto", ar: "تشفير", fr: "Crypto", de: "Krypto", ru: "Крипто", pt: "Cripto", ja: "暗号通貨", pa: "ਕ੍ਰਿਪਟੋ", bn: "ক্রিপ্টো", id: "Kripto", ur: "کرپٹو", ms: "Kripto", it: "Cripto", tr: "Kripto", ta: "கிரிப்டோ", te: "క్రిప్టో", ko: "암호화폐", vi: "Tiền điện tử", pl: "Krypto", ro: "Cripto", nl: "Crypto", el: "Κρυπτο", th: "คริปโต", cs: "Krypto", hu: "Kripto", sv: "Krypto", da: "Krypto" })}
          title={title}
          color={color}
          icon={<Outline.BanknotesIcon className="size-5" />}
          flip={flipped}
          onFlipChange={setFlipped} />
      </div>
      <form className="grow flex flex-col"
        onSubmit={Events.preventDefault}>
        <input className="hidden"
          autoComplete="off"
          name="username" />
        {notes && <Fragment>
          <div className="h-6" />
          <div className="font-medium">
            {Lang.match({ en: "Notes", zh: "备注", hi: "नोट्स", es: "Notas", ar: "ملاحظات", fr: "Notes", de: "Notizen", ru: "Заметки", pt: "Notas", ja: "ノート", pa: "ਨੋਟਸ", bn: "নোটস", id: "Catatan", ur: "نوٹس", ms: "Nota", it: "Note", tr: "Notlar", ta: "குறிப்புகள்", te: "గమనికలు", ko: "노트", vi: "Ghi chú", pl: "Notatki", ro: "Note", nl: "Notities", el: "Σημειώσεις", th: "บันทึก", cs: "Poznámky", hu: "Jegyzetek", sv: "Anteckningar", da: "Noter" })}
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
        <Fragment>
          <div className="h-6" />
          <div className="font-medium">
            {Lang.match({ en: "Subaccounts", zh: "子账户", hi: "उप खाते", es: "Subcuentas", ar: "الحسابات الفرعية", fr: "Sous-comptes", de: "Unterkonten", ru: "Субаккаунты", pt: "Subcontas", ja: "サブアカウント", pa: "ਸਬਅਕਾਊਂਟ", bn: "সাবঅ্যাকাউন্ট", id: "Subakun", ur: "ذیلی اکاؤنٹس", ms: "Subakun", it: "Sottoaccount", tr: "Alt hesaplar", ta: "உப கணக்குகள்", te: "ఉప ఖాతాలు", ko: "하위 계정", vi: "Tài khoản phụ", pl: "Subkonta", ro: "Subconturi", nl: "Subaccounts", el: "Υπολογαριασμοί", th: "บัญชีย่อย", cs: "Subúčty", hu: "Alszámlák", sv: "Subkonton", da: "Subkonti" })}
          </div>
          <div className="text-default-contrast">
            {Lang.match({ en: "Your subaccounts. Each subaccount has its own address and balance.", zh: "您的子账户。每个子账户都有自己的地址和余额。", hi: "आपके उप खाते। प्रत्येक उप खाते का अपना पता और शेष राशि होती है।", es: "Sus subcuentas. Cada subcuenta tiene su propia dirección y saldo.", ar: "حساباتك الفرعية. كل حساب فرعي له عنوانه ورصيده الخاص.", fr: "Vos sous-comptes. Chaque sous-compte a sa propre adresse et son propre solde.", de: "Ihre Unterkonten. Jedes Unterkonto hat seine eigene Adresse und sein eigenes Guthaben.", ru: "Ваши субаккаунты. Каждый субаккаунт имеет свой собственный адрес и баланс.", pt: "Suas subcontas. Cada subconta tem seu próprio endereço e saldo.", ja: "あなたのサブアカウント。各サブアカウントには独自のアドレスと残高があります。", pa: "ਤੁਹਾਡੇ ਸਬਅਕਾਊਂਟ। ਹਰ ਸਬਅਕਾਊਂਟ ਦਾ ਆਪਣਾ ਪਤਾ ਅਤੇ ਬਕਾਇਆ ਹੈ।", bn: "আপনার সাবঅ্যাকাউন্ট। প্রতিটি সাবঅ্যাকাউন্টের নিজস্ব ঠিকানা এবং ব্যালেন্স থাকে।", id: "Subakun Anda. Setiap subakun memiliki alamat dan saldo sendiri.", ur: "آپ کے ذیلی اکاؤنٹس۔ ہر ذیلی اکاؤنٹ کا اپنا پتہ اور بیلنس ہوتا ہے۔", ms: "Subakun Anda. Setiap subakun memiliki alamat dan saldo sendiri.", it: "I tuoi sottoaccount. Ogni sottoaccount ha il proprio indirizzo e saldo.", tr: "Alt hesaplarınız. Her alt hesabın kendi adresi ve bakiyesi vardır.", ta: "உங்கள் உப கணக்குகள். ஒவ்வொரு உப கணக்குக்கும் தனியான முகவரி மற்றும் இருப்பு உள்ளது.", te: "మీ ఉప ఖాతాలు. ప్రతి ఉప ఖాతాకు స్వంత చిరునామా మరియు బ్యాలెన్స్ ఉంటుంది.", ko: "귀하의 하위 계정입니다. 각 하위 계정에는 고유한 주소와 잔액이 있습니다.", vi: "Các tài khoản phụ của bạn. Mỗi tài khoản phụ có địa chỉ và số dư riêng.", pl: "Twoje subkonta. Każde subkonto ma własny adres i saldo.", ro: "Subconturile dvs. Fiecare subcont are propria adresă și sold.", nl: "Uw subaccounts. Elk subaccount heeft zijn eigen adres en saldo.", el: "Οι υπολογαριασμοί σας. Κάθε υπολογαριασμός έχει τη δική του διεύθυνση και υπόλοιπο.", th: "บัญชีย่อยของคุณ แต่ละบัญชีย่อยมีที่อยู่และยอดคงเหลือเป็นของตัวเอง", cs: "Vaše subúčty. Každý subúčet má svou vlastní adresu a zůstatek.", hu: "Az alszámláid. Minden alszámlának megvan a saját címe és egyenlege.", sv: "Dina subkonton. Varje subkonto har sin egen adress och saldo.", da: "Dine subkonti. Hvert subkonto har sin egen adresse og saldo." })}
          </div>
          <div className="h-4" />
          <div className="flex not-sm:flex-col sm:flex-row items-center justify-between gap-4 border border-default-contrast rounded-xl p-6">
            <button className="group rounded-full p-2 flex items-center justify-center rtl:-scale-x-100 enabled:hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none disabled:opacity-50"
              onClick={() => setIndex(i => i - 1)}
              disabled={index === 0}
              type="button">
              <InButton>
                <Outline.ChevronLeftIcon className="not-sm:hidden sm:size-6" />
                <Outline.ChevronUpIcon className="sm:hidden not-sm:size-6" />
              </InButton>
            </button>
            <CryptoSubaccountAnchor $entry={$entry} index={index} />
            <button className="group rounded-full p-2 flex items-center justify-center rtl:-scale-x-100 enabled:hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none disabled:opacity-50"
              onClick={() => setIndex(i => i + 1)}
              type="button">
              <InButton>
                <Outline.ChevronRightIcon className="not-sm:hidden sm:size-6" />
                <Outline.ChevronDownIcon className="sm:hidden not-sm:size-6" />
              </InButton>
            </button>
          </div>
        </Fragment>
      </form>
    </div>
  </Fragment>
}

export function CryptoAccountMenu(props: { $entry: KDBX.Inner.KeePassFile.Entry } & { close(force?: boolean): void }) {
  const { $entry, close } = props

  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const session = useSessionContext().getOrThrow()

  const trashed = useMemo(() => {
    const { kdbx } = session.value

    const $file = kdbx.inner.content.value
    const $trash = getRecycleBinOrNull($file)

    if ($trash == null)
      return false

    return $trash.element.contains($entry.element)
  }, [session, $entry])

  return <Fragment>
    <SubpathProvider value={hash}>
      {hash.url.pathname === "/export" &&
        <PathBoard>
          <CryptoAccountExportPage $entry={$entry} />
        </PathBoard>}
    </SubpathProvider>
    <div className="flex flex-col text-left gap-2">
      <CryptoAccountExportMenuAnchor />
      {trashed === false && <AccountMenuTrashButton $entry={$entry} close={close} />}
      {trashed === true && <AccountMenuUntrashButton $entry={$entry} close={close} />}
      {trashed === true && <AccountMenuDeleteButton $entry={$entry} close={close} />}
    </div>
  </Fragment>
}

export function CryptoAccountExportMenuAnchor() {
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

export function CryptoAccountExportPage(props: { $entry: KDBX.Inner.KeePassFile.Entry }) {
  const { $entry } = props

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

  const copyTheSeedPhrase = useCopy(seedphrase)

  return <div className="flex flex-col grow p-6">
    <div className="flex items-center justify-between">
      <h1 className="text-xl font-medium">
        {Lang.match({ en: "Export crypto account", zh: "导出加密账户", hi: "क्रिप्टो खाता निर्यात करें", es: "Exportar cuenta de cripto", ar: "تصدير حساب التشفير", fr: "Exporter le compte crypto", de: "Krypto-Konto exportieren", ru: "Экспорт крипто-аккаунта", pt: "Exportar conta cripto", ja: "暗号通貨アカウントをエクスポート", pa: "ਕ੍ਰਿਪਟੋ ਖਾਤਾ ਐਕਸਪੋਰਟ ਕਰੋ", bn: "ক্রিপ্টো অ্যাকাউন্ট রপ্তানি করুন", id: "Ekspor akun kripto", ur: "کرپٹو اکاؤنٹ برآمد کریں", ms: "Ekspor akun kripto", it: "Esporta account cripto", tr: "Kripto hesabını dışa aktar", ta: "கிரிப்டோ கணக்கை ஏற்றுமதி செய்யவும்", te: "క్రిప్టో ఖాతాను ఎగుమతి చేయండి", ko: "암호화폐 계정 내보내기", vi: "Xuất tài khoản crypto", pl: "Eksportuj konto krypto", ro: "Exportați contul crypto", nl: "Crypto-account exporteren", el: "Εξαγωγή λογαριασμού κρυπτογράφησης ", th: "ส่งออกบัญชีคริปโต ", cs: "Exportovat krypto účet ", hu: "Kripto fiók exportálása ", sv: "Exportera krypto-konto ", da: "Eksporter krypto-konto" })}
      </h1>
    </div>
    <div className="h-6" />
    <div className="flex items-center justify-center">
      <FlipCard
        type={Lang.match({ en: "Crypto", zh: "加密货币", hi: "क्रिप्टो", es: "Cripto", ar: "تشفير", fr: "Crypto", de: "Krypto", ru: "Крипто", pt: "Cripto", ja: "暗号通貨", pa: "ਕ੍ਰਿਪਟੋ", bn: "ক্রিপ্টো", id: "Kripto", ur: "کرپٹو", ms: "Kripto", it: "Cripto", tr: "Kripto", ta: "கிரிப்டோ", te: "క్రిప్టో", ko: "암호화폐", vi: "Tiền điện tử", pl: "Krypto", ro: "Cripto", nl: "Crypto", el: "Κρυπτο", th: "คริปโต", cs: "Krypto", hu: "Kripto", sv: "Krypto", da: "Krypto" })}
        title={title}
        color={color}
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
          {Lang.match({ en: "Seed phrase", zh: "助记词", hi: "सीड वाक्य", es: "Frase semilla", ar: "عبارة البذور", fr: "Phrase de récupération", de: "Seed-Phrase", ru: "Сид-фраза", pt: "Frase semente", ja: "シードフレーズ", pa: "ਸੀਡ ਫਰੇਜ਼", bn: "সিড বাক্য", id: "Frasa seed", ur: "سیڈ فریز", ms: "Frasa seed", it: "Frase seed", tr: "Seed cümlesi", ta: "சீட் வாக்கியம்", te: "సీడ్ వాక్యం", ko: "시드 구문", vi: "Cụm từ seed", pl: "Fraza seed", ro: "Fraza seed", nl: "Seed-phrase", el: "Φράση σπόρου ", th: "วลีเมล็ดพันธุ์ ", cs: "Seed phrase ", hu: "Seed kifejezés ", sv: "Seed phrase ", da: "Seed phrase" })}
        </div>
        <div className="text-default-contrast">
          {Lang.match({ en: "Your BIP-39 seed phrase. Use this to recover your funds in most wallets.", zh: "您的 BIP-39 助记词。使用此助记词可以在大多数钱包中恢复您的资金。", hi: "आपका BIP-39 सीड वाक्य। इसका उपयोग अधिकांश वॉलेट में अपने फंड को पुनर्प्राप्त करने के लिए करें।", es: "Su frase semilla BIP-39. Úsela para recuperar sus fondos en la mayoría de las billeteras.", ar: "عبارة البذور BIP-39 الخاصة بك. استخدمها لاستعادة أموالك في معظم المحافظ.", fr: "Votre phrase de récupération BIP-39. Utilisez-la pour récupérer vos fonds dans la plupart des portefeuilles.", de: "Ihre BIP-39-Seed-Phrase. Verwenden Sie diese, um Ihre Gelder in den meisten Wallets wiederherzustellen.", ru: "Ваша BIP-39 сид-фраза. Используйте её для восстановления средств в большинстве кошельков.", pt: "Sua frase semente BIP-39. Use-a para recuperar seus fundos na maioria das carteiras.", ja: "あなたの BIP-39 シードフレーズ。これを使用して、ほとんどのウォレットで資金を回復します。", pa: "ਤੁਹਾਡਾ BIP-39 ਸੀਡ ਫਰੇਜ਼। ਇਸਦਾ ਉਪਯੋਗ ਕਰਕੇ ਆਪਣੇ ਫੰਡ ਨੂੰ ਜ਼ਿਆਦਾਤਰ ਵੌਲੇਟ ਵਿੱਚ ਬਹਾਲ ਕਰੋ।", bn: "আপনার BIP-39 সিড বাক্য। এটি ব্যবহার করে আপনার তহবিলগুলি বেশিরভাগ ওয়ালেটে পুনরুদ্ধার করুন।", id: "Frasa seed BIP-39 Anda. Gunakan ini untuk memulihkan dana Anda di sebagian besar dompet.", ur: "آپ کا BIP-39 سیڈ فریز۔ اس کا استعمال زیادہ تر والٹس میں اپنے فنڈز کو بازیافت کرنے کے لیے کریں۔", ms: "Frasa seed BIP-39 anda. Gunakan ini untuk memulihkan dana anda di kebanyakan dompet.", it: "La tua frase seed BIP-39. Usala per recuperare i tuoi fondi nella maggior parte dei portafogli.", tr: "BIP-39 seed cümleniz. Bunu çoğu cüzdanda fonlarınızı kurtarmak için kullanın.", ta: "உங்கள் BIP-39 சீட் வாக்கியம். இதைப் பயன்படுத்தி உங்கள் நிதியை பெரும்பாலான வாலெட்டுகளில் மீட்டெடுக்கவும்.", te: "మీ BIP-39 సీడ్ వాక్యం. దీన్ని ఉపయోగించి మీ నిధులను ఎక్కువ వాలెట్లలో పునరుద్ధరించండి.", ko: "귀하의 BIP-39 시드 구문. 대부분의 지갑에서 자금을 복구하는 데 사용하십시오.", vi: "Cụm từ seed BIP-39 của bạn. Sử dụng nó để khôi phục quỹ của bạn trong hầu hết các ví.", pl: "Twoja fraza seed BIP-39. Użyj jej, aby odzyskać środki w większości portfeli.", ro: "Fraza seed BIP-39 a dvs. Folosiți-o pentru a vă recupera fondurile în majoritatea portofelelor.", nl: "Uw BIP-39 seed phrase. Gebruik dit om uw fondsen in de meeste wallets te herstellen.", el: "Η φράση σπόρου BIP-39 σας. Χρησιμοποιήστε την για να ανακτήσετε τα κεφάλαιά σας στις περισσότερες πορτοφόλια.", th: "วลีเมล็ดพันธุ์ BIP-39 ของคุณ ใช้สิ่งนี้เพื่อกู้คืนเงินของคุณในกระเป๋าสตางค์ส่วนใหญ่", cs: "Vaše BIP-39 seed phrase. Použijte ji k obnovení prostředků ve většině peněženek.", hu: "Az Ön BIP-39 seed kifejezése. Használja ezt a legtöbb pénztárcában a pénzeszközök visszaállításához.", sv: "Din BIP-39 seed phrase. Använd den för att återställa dina medel i de flesta plånböcker.", da: "Din BIP-39 seed phrase. Brug den til at gendanne dine midler i de fleste tegnebøger." })}
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex flex-col gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <textarea className="w-full focus-visible:outline-none"
            rows={3}
            readOnly
            onFocus={e => flipped ? e.currentTarget.select() : undefined}
            value={flipped ? seedphrase : seedphrase?.replaceAll(/./g, "•")} />
        </div>
        <div className="h-2" />
        <div className="flex items-center flex-wrap-reverse gap-2">
          <WideContrastButton
            onClick={() => setFlipped(x => !x)}>
            {flipped ? <Outline.EyeSlashIcon className="size-5" /> : <Outline.EyeIcon className="size-5" />}
            {flipped ? Lang.match({ en: "Hide", zh: "隐藏", hi: "छिपाएं", es: "Ocultar", ar: "إخفاء", fr: "Masquer", de: "Verbergen", ru: "Скрыть", pt: "Ocultar", ja: "非表示", pa: "ਛੁਪਾਓ", bn: "লুকান", id: "Sembunyikan", ur: "چھپائیں", ms: "Sembunyikan", it: "Nascondi", tr: "Gizle", ta: "மறை", te: "దాచు", ko: "숨기기", vi: "Ẩn", pl: "Ukryj", ro: "Ascunde", nl: "Verbergen", el: "Απόκρυψη", th: "ซ่อน", cs: "Skrýt", hu: "Elrejt", sv: "Dölj", da: "Skjul" }) : Lang.match({ en: "Show", zh: "显示", hi: "दिखाएं", es: "Mostrar", ar: "إظهار", fr: "Afficher", de: "Anzeigen", ru: "Показать", pt: "Mostrar", ja: "表示", pa: "ਦਿਖਾਓ", bn: "প্রদর্শন", id: "Tampilkan", ur: "دکھائیں", ms: "Tunjukkan", it: "Mostra", tr: "Göster", ta: "காட்டு", te: "చూపించు", ko: "보이기", vi: "Hiển thị", pl: "Pokaż", ro: "Afișează", nl: "Tonen", el: "Εμφάνιση", th: "แสดง", cs: "Zobrazit", hu: "Mutasd", sv: "Visa", da: "Vis" })}
          </WideContrastButton>
          <WideContrastButton
            onClick={copyTheSeedPhrase.copyOrDisplay}>
            {copyTheSeedPhrase.copied ? <Outline.CheckIcon className="size-5" /> : <Outline.DocumentDuplicateIcon className="size-5" />}
            {copyTheSeedPhrase.copied ? Lang.match({ en: "Copied", zh: "已复制", hi: "कॉपी किया गया", es: "Copiado", ar: "تم النسخ", fr: "Copié", de: "Kopiert", ru: "Скопировано", pt: "Copiado", ja: "コピーしました", pa: "ਨਕਲ ਕੀਤਾ", bn: "কপি করা হয়েছে", id: "Disalin", ur: "کاپی کیا گیا", ms: "Disalin", it: "Copiato", tr: "Kopyalandı", ta: "நகலெடுக்கப்பட்டது", te: "నకలించబడింది", ko: "복사됨", vi: "Đã sao chép", pl: "Skopiowano", ro: "Copiat", nl: "Gekopieerd", el: "Αντιγράφηκε ", th: "คัดลอกแล้ว ", cs: "Zkopírováno ", hu: "Másolva ", sv: "Kopierat ", da: "Kopieret" }) : Lang.match({ en: "Copy", zh: "复制", hi: "कॉपी करें", es: "Copiar", ar: "نسخ", fr: "Copier", de: "Kopieren", ru: "Копировать", pt: "Copiar", ja: "コピー", pa: "ਨਕਲ ਕਰੋ", bn: "কপি করুন", id: "Salin", ur: "کاپی کریں", ms: "Salin", it: "Copia", tr: "Kopyala", ta: "நகலெடுக்கவும்", te: "నకలించు", ko: "복사", vi: "Sao chép", pl: "Kopiuj", ro: "Copiați", nl: "Kopiëren", el: "Αντιγραφή ", th: "คัดลอก ", cs: "Kopírovat ", hu: "Másolás ", sv: "Kopiera ", da: "Kopier" })}
          </WideContrastButton>
        </div>
      </Fragment>
    </form>
  </div>
}