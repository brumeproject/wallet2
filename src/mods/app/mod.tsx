import { ContrastAnchor, WideContrastAnchor } from "@/libs/anchor/mod.tsx";
import { useClientContext } from "@/libs/client/mod.tsx";
import { PathBoard } from "@/libs/dialog/board/mod.tsx";
import { PathPaper } from "@/libs/dialog/paper/mod.tsx";
import { Wall } from "@/libs/dialog/wall/mod.tsx";
import { Events } from "@/libs/events/mod.ts";
import { Outline } from "@/libs/heroicons/mod.ts";
import { Lang } from "@/libs/lang/mod.ts";
import { Nullable } from "@/libs/nullable/mod.ts";
import { useStoreContext } from "@/libs/store/mod.tsx";
import { SubpathProvider, useAnchorWithCoords, useHashSubpath, usePathContext } from "@hazae41/chemin";
import { CloseContext } from "@hazae41/react-close-context";
import React, { ChangeEvent, Fragment, useCallback, useEffect, useState } from "react";
import { SessionData, SessionPage, SessionProvider } from "./session/mod.tsx";
import { UserLoginButton, UserLoginMenu } from "./user/mod.tsx";

React;

export function App() {
  const client = useClientContext().getOrThrow()
  const store = useStoreContext().getOrThrow()

  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const [name, setName] = useState<Nullable<string>>()

  const getNameOrThrow = useCallback(async () => {
    setName(await store.value.getOrThrow().getOrThrow<string>("appname"))
  }, [store])

  useEffect(() => {
    if (store == null)
      return
    if (store.value.isErr())
      return
    getNameOrThrow().catch(console.error)
  }, [store])

  const [icon, setIcon] = useState<Nullable<string>>()

  const getIconOrThrow = useCallback(async () => {
    setIcon(await store.value.getOrThrow().getOrThrow<Uint8Array<ArrayBuffer>>("appicon").then(x => x && `data:image/png;base64,${x.toBase64()}`))
  }, [store])

  useEffect(() => {
    if (store == null)
      return
    if (store.value.isErr())
      return
    getIconOrThrow().catch(console.error)
  }, [store])

  const maskOrThrow = useCallback(async () => {
    const manifest = await fetch("/manifest.json").then(res => res.json())

    document.title = name || manifest.name

    manifest.start_url = location.origin + "/"
    manifest.name = name || manifest.name
    manifest.short_name = name || manifest.short_name

    if (icon == null) {
      manifest.icons[0].src = location.origin + "/appicon.png"
    } else {
      manifest.icons[0].src = icon
    }

    const $favicon = document.querySelector("link[rel~='icon']")! as HTMLLinkElement
    const $appicon = document.querySelector("link[rel='apple-touch-icon']")! as HTMLLinkElement
    const $manifest = document.querySelector("link[rel='manifest']")! as HTMLLinkElement

    if (icon == null) {
      $favicon.href = "/favicon.ico"
      $appicon.href = "/appicon.png"
    } else {
      $favicon.href = icon
      $appicon.href = icon
    }

    $manifest.href = `data:application/manifest+json,${encodeURIComponent(JSON.stringify(manifest))}`
  }, [name, icon])

  useEffect(() => {
    maskOrThrow().catch(console.error)
  }, [maskOrThrow])

  const [session, setSession] = useState<SessionData>()

  const login = useCallback((session: SessionData) => {
    setSession(session)
  }, [])

  const logout = useCallback(() => {
    setSession(undefined)
  }, [])

  return <Fragment>
    <CloseContext.Provider value={logout}>
      {client && session != null &&
        <Wall>
          <SessionProvider value={session}>
            <SessionPage />
          </SessionProvider>
        </Wall>}
    </CloseContext.Provider>
    <SubpathProvider value={hash}>
      {client && hash.url.pathname === "/login" &&
        <PathPaper>
          <UserLoginMenu login={login} />
        </PathPaper>}
      {client && hash.url.pathname === "/settings" &&
        <PathBoard>
          <SettingsPage />
        </PathBoard>}
      {client && hash.url.pathname === "/install" &&
        <PathBoard>
          <InstallPage />
        </PathBoard>}
    </SubpathProvider>
    <div className="h-full w-full overflow-y-scroll animate-opacity-in text-pretty">
      <div className="p-safe flex flex-col items-center">
        <div className="p-6 flex flex-col items-center w-full max-w-[1000px] m-auto">
          <div className="h-[25dvh]" />
          <h1 className="text-center text-5xl sm:text-6xl font-medium">
            {Lang.match({ en: "The secure and private wallet", zh: "安全隐私的钱包", hi: "सुरक्षित और निजी वॉलेट", es: "La billetera segura y privada", ar: "المحفظة الآمنة والخاصة", fr: "Le portefeuille sécurisé et privé", de: "Die sichere und private Brieftasche", ru: "Безопасный и приватный кошелек", pt: "A carteira segura e privada", ja: "安全でプライベートなウォレット", pa: "ਸੁਰੱਖਿਅਤ ਅਤੇ ਨਿੱਜੀ ਵਾਲਿਟ", bn: "নিরাপদ এবং ব্যক্তিগত ওয়ালেট", id: "Dompet yang aman dan pribadi", ur: "محفوظ اور نجی والیٹ", ms: "Dompet yang aman dan pribadi", it: "Il portafoglio sicuro e privato", tr: "Güvenli ve özel cüzdan", ta: "பாதுகாப்பான மற்றும் தனிப்பட்ட பணப்பை", te: "సురక్షిత మరియు ప్రైవేట్ వాలెట్", ko: "안전하고 개인적인 지갑", vi: "Ví an toàn và riêng tư", pl: "Bezpieczny i prywatny portfel", ro: "Portofel sigur și privat", nl: "De veilige en privé-portemonnee", el: "Το ασφαλές και ιδιωτικό πορτοφόλι", th: "กระเป๋าเงินที่ปลอดภัยและเป็นส่วนตัว", cs: "Bezpečná a soukromá peněženka", hu: "A biztonságos és privát pénztárca", sv: "Den säkra och privata plånboken", da: "Den sikre og private tegnebog" })}
          </h1>
          <div className="h-4" />
          <div className="text-center text-default-contrast text-xl sm:text-2xl">
            {Lang.match({ en: "Meet the only crypto-wallet with maximum security and privacy", zh: "唯一具有最大安全性和隐私性的加密钱包", hi: "अधिकतम सुरक्षा और गोपनीयता के साथ एकमात्र क्रिप्टो-वॉलेट से मिलें", es: "Conoce la única billetera criptográfica con máxima seguridad y privacidad", ar: "تعرف على المحفظة المشفرة الوحيدة ذات الأمان والخصوصية القصوى", fr: "Découvrez le seul portefeuille crypto avec une sécurité et une confidentialité maximales", de: "Lernen Sie die einzige Krypto-Brieftasche mit maximaler Sicherheit und Privatsphäre kennen", ru: "Познакомьтесь с единственным криптокошельком с максимальной безопасностью и конфиденциальностью", pt: "Conheça a única carteira de criptomoedas com máxima segurança e privacidade", ja: "最大のセキュリティとプライバシーを備えた唯一の暗号ウォレットを紹介します", pa: "ਅਧਿਕਤਮ ਸੁਰੱਖਿਆ ਅਤੇ ਗੋਪਨੀਯਤਾ ਨਾਲ ਇੱਕੋ ਹੀ क्रिप्टो-वॉलेट से मिलें", bn: "সর্বাধিক নিরাপত্তা এবং গোপনীয়তা সহ একমাত্র ক্রিপ্টো-ওয়ালেটের সাথে দেখা করুন", id: "Temui satu-satunya dompet kripto dengan keamanan dan privasi maksimal", ur: "زیادہ سے زیادہ سیکیورٹی اور پرائیویسی کے ساتھ واحد کرپٹو-والٹ سے ملیں", ms: "Temui satu-satunya dompet kripto dengan keamanan dan privasi maksimal", it: "Incontra l'unico portafoglio crittografico con massima sicurezza e privacy", tr: "Maksimum güvenlik ve gizlilik ile tek kripto cüzdanla tanışın", ta: "அதிகபட்ச பாதுகாப்பு மற்றும் தனியுரிமையுடன் ஒரே கிரிப்டோ-வாலெட்டை சந்திக்கவும்", te: "అధిక స్థాయి భద్రత మరియు గోప్యతతో ఏకైక క్రిప్టో-వాలెట్‌ను కలుసుకోండి", ko: "최대 보안과 개인 정보 보호를 제공하는 유일한 암호화 지갑을 만나보세요", vi: "Gặp gỡ ví tiền điện tử duy nhất với bảo mật và quyền riêng tư tối đa", pl: "Poznaj jedyną portmonetkę kryptograficzną z maksymalnym bezpieczeństwem i prywatnością", ro: "Cunoașteți singurul portofel cripto cu securitate și confidențialitate maxime", nl: "Ontmoet de enige crypto-portemonnee met maximale beveiliging en privacy", el: "Γνωρίστε το μόνο κρυπτο-πορτοφόλι με μέγ ιστη ασφάλεια και ιδιωτικότητα", th: "พบกับกระเป๋าเงินดิจิทัลเพียงหนึ่งเดียวที่มีความปลอดภัยและความเป็นส่วนตัวสูงสุด", cs: "Seznamte se s jedinou kryptopeněženkou s maximálním zabezpečením a soukromím", hu: "Ismerje meg az egyetlen kriptotárcát, amely maximális biztonságot és adatvédelmet nyújt", sv: "Möt den enda kryptoplånboken med maximal säkerhet och integritet", da: "Mød den eneste kryptotegnebog med maksimal sikkerhed og privatliv" })}
          </div>
          <div className="h-16" />
          <div className="flex items-center justify-center flex-wrap gap-4 max-w-64">
            <UserLoginButton />
            <InstallButton />
            <SettingsButton />
          </div>
          <div className="h-16" />
          <Outline.ChevronDownIcon className="size-6 text-default-half-contrast" />
          <div className="h-[50dvh]" />
          <h1 className="text-center text-5xl sm:text-6xl font-medium">
            {Lang.match({ en: "Your everything manager", zh: "你的万能管理器", hi: "आपका सब कुछ प्रबंधक", es: "Su gestor de todo", ar: "مدير كل شيء الخاص بك", fr: "Votre gestionnaire universel", de: "Ihr Alles-Manager", ru: "Ваш менеджер всего", pt: "Seu gerente de tudo", ja: "あなたのすべてのマネージャー", pa: "ਤੁਹਾਡਾ ਸਭ ਕੁਝ ਮੈਨੇਜਰ", bn: "আপনার সবকিছু ম্যানেজার", id: "Manajer segalanya Anda", ur: "آپ کا سب کچھ منیجر", ms: "Manajer segalanya Anda", it: "Il tuo gestore di tutto", tr: "Her şey yöneticiniz", ta: "உங்கள் எல்லாம் மேலாளர்", te: "మీ అన్నింటికీ మేనేజర్", ko: "당신의 모든 관리자", vi: "Trình quản lý mọi thứ của bạn", pl: "Twój menedżer wszystkiego", ro: "Managerul tău pentru tot", nl: "Jouw allesmanager", el: "Ο διαχειριστής των πάντων σας", th: "ผู้จัดการทุกอย่างของคุณ", cs: "Váš správce všeho", hu: "Mindenes menedzsered", sv: "Din allt-i-allo-chef", da: "Din alt-mulige manager" })}
          </h1>
          <div className="h-4" />
          <div className="text-center text-default-contrast text-xl sm:text-2xl">
            {Lang.match({ en: "Manage all your sensitive data in one secure and private place", zh: "在一个安全私密的地方管理你所有的敏感数据", hi: "एक सुरक्षित और निजी स्थान में अपने सभी संवेदनशील डेटा का प्रबंधन करें", es: "Administra todos tus datos sensibles en un solo lugar seguro y privado", ar: "قم بإدارة جميع بياناتك الحساسة في مكان واحد آمن وخاص", fr: "Gérez toutes vos données sensibles dans un seul endroit sécurisé et privé", de: "Verwalten Sie alle Ihre sensiblen Daten an einem sicheren und privaten Ort", ru: "Управляйте всеми своими конфиденциальными данными в одном безопасном и приватном месте", pt: "Gerencie todos os seus dados sensíveis em um só lugar seguro e privado", ja: "すべての機密データを安全でプライベートな場所で管理する", pa: "ਸਾਰੇ ਸੰਵੇਦਨਸ਼ੀਲ ਡੇਟਾ ਨੂੰ ਇੱਕ ਸੁਰੱਖਿਅਤ ਅਤੇ ਨਿੱਜੀ ਥਾਂ 'ਤੇ ਪ੍ਰਬੰਧਿਤ ਕਰੋ", bn: "আপনার সমস্ত সংবেদনশীল ডেটা একটি নিরাপদ এবং ব্যক্তিগত জায়গায় পরিচালনা করুন", id: "Kelola semua data sensitif Anda di satu tempat yang aman dan pribadi", ur: "اپنے تمام حساس ڈیٹا کو ایک محفوظ اور نجی جگہ پر منظم کریں", ms: "Kelola semua data sensitif Anda di satu tempat yang aman dan pribadi", it: "Gestisci tutti i tuoi dati sensibili in un unico posto sicuro e privato", tr: "Tüm hassas verilerinizi tek bir güvenli ve özel yerde yönetin", ta: "உங்கள் அனைத்து நுண்ணறிவு தரவையும் ஒரு பாதுகாப்பான மற்றும் தனிப்பட்ட இடத்தில் நிர்வகிக்கவும்", te: "మీ అన్ని సున్నితమైన డేటాను ఒకే సురక్షిత మరియు ప్రైవేట్ స్థలంలో నిర్వహించండి", ko: "모든 민감한 데이터를 하나의 안전하고 개인적인 장소에서 관리하세요", vi: "Quản lý tất cả dữ liệu nhạy cảm của bạn ở một nơi an toàn và riêng tư", pl: "Zarządzaj wszystkimi swoimi wrażliwymi danymi w jednym bezpiecznym i prywatnym miejscu", ro: "Gestionați toate datele dvs. sensibile într-un singur loc sigur și privat", nl: "Beheer al uw gevoelige gegevens op één veilige en privéplek", el: "Διαχειριστείτε όλα τα ευαίσθητα δεδομένα σας σε ένα ασφαλές και ιδιωτικό μέρος", th: "จัดการข้อมูลที่ละเอียดอ่อนทั้งหมดของคุณในที่เดียวที่ปลอดภัยและเป็นส่วนตัว", cs: "Spravujte všechna svá citlivá data na jednom bezpečném a soukromém místě", hu: "Kezelje az összes érzékeny adatát egy helyen, biztonságosan és privát módon", sv: "Hantera all din känsliga data på en säker och privat plats", da: "Administrer alle dine følsomme data på ét sikkert og privat sted" })}
          </div>
          <div className="h-16" />
          <div className="flex flex-wrap flex-col sm:flex-row items-center text-center gap-4">
            <div className="p-4 bg-default-contrast rounded-xl">
              {Lang.match({ en: "Cryptos", zh: "加密货币", hi: "क्रिप्टो", es: "Criptomonedas", ar: "العملات المشفرة", fr: "Cryptos", de: "Kryptos", ru: "Криптовалюты", pt: "Criptomoedas", ja: "暗号通貨", pa: "ਕ੍ਰਿਪਟੋਸ", bn: "ক্রিপ্টোস", id: "Kripto", ur: "کرپٹو", ms: "Kripto", it: "Criptovalute", tr: "Kriptolar", ta: "கிரிப்டோஸ்", te: "క్రిప్టోస్", ko: "암호화폐", vi: "Tiền điện tử", pl: "Kryptowaluty", ro: "Criptomonede", nl: "Crypto's", el: "Κρυπτονομίσματα", th: "สกุลเงินดิจิทัล", cs: "Kryptoměny", hu: "Kriptók", sv: "Kryptos", da: "Kryptos" })}
            </div>
            <div className="p-4 bg-default-contrast rounded-xl">
              {Lang.match({ en: "Passwords", zh: "密码", hi: "पासवर्ड", es: "Contraseñas", ar: "كلمات المرور", fr: "Mots de passe", de: "Passwörter", ru: "Пароли", pt: "Senhas", ja: "パスワード", pa: "ਪਾਸਵਰਡ", bn: "পাসওয়ার্ড", id: "Kata sandi", ur: "پاس ورڈز", ms: "Kata sandi", it: "Password", tr: "Parolalar", ta: "கடவுச்சொற்கள்", te: "పాస్వర్డ్స్", ko: "비밀번호", vi: "Mật khẩu", pl: "Hasła", ro: "Parole de passe", nl: "Wachtwoorden", el: "Κωδικοί πρόσβασης", th: "รหัสผ่าน", cs: "Hesla", hu: "Jelszavak", sv: "Lösenord", da: "Adgangskoder" })}
            </div>
            <div className="p-4 bg-default-contrast rounded-xl">
              {Lang.match({ en: "Keypairs", zh: "密钥对", hi: "कीपेयर", es: "Pares de claves", ar: "أزواج المفاتيح", fr: "Paires de clés", de: "Schlüsselpaar", ru: "Ключевые пары", pt: "Pares de chaves", ja: "キーペア", pa: "ਕੀਪੇਅਰ", bn: "কী-পেয়ার", id: "Pasangan kunci", ur: "کی جوڑے", ms: "Pasangan kunci", it: "Coppie di chiavi", tr: "Anahtar çiftleri", ta: "கீபேர்கள்", te: "కీపేయర్స్", ko: "키쌍", vi: "Cặp khóa", pl: "Pary kluczy", ro: "Perechi de chei", nl: "Sleutelpaar", el: "Ζεύγη κλειδιών", th: "คู่กุญแจ", cs: "Páry klíčů", hu: "Kulcspárok", sv: "Nyckelpar", da: "Nøglepar" })}
            </div>
            <div className="p-4 bg-default-contrast rounded-xl">
              {Lang.match({ en: "Credit cards", zh: "信用卡", hi: "क्रेडिट कार्ड", es: "Tarjetas de crédito", ar: "بطاقات الائتمان", fr: "Cartes de crédit", de: "Kreditkarten", ru: "Кредитные карты", pt: "Cartões de crédito", ja: "クレジットカード", pa: "ਕ੍ਰੈਡਿਟ ਕਾਰਡ", bn: "ক্রেডিট কার্ড", id: "Kartu kredit", ur: "کریڈٹ کارڈز", ms: "Kartu kredit", it: "Carte di credito", tr: "Kredi kartları", ta: "கடன் அட்டைகள்", te: "క్రెడిట్ కార్డులు", ko: "신용 카드", vi: "Thẻ tín dụng", pl: "Karty kredytowe", ro: "Carduri de credit", nl: "Creditcards", el: "Κάρτες πιστωτικές", th: "บัตรเครดิต", cs: "Kreditní karty", hu: "Hitelkártyák", sv: "Kreditkort", da: "Kreditkort" })}
            </div>
          </div>
          <div className="h-[50dvh]" />
          <h1 className="text-center text-5xl sm:text-6xl font-medium">
            {Lang.match({ en: "Bring your own storage", zh: "使用你自己的存储", hi: "अपना खुद का स्टोरेज लाएं", es: "Trae su propio almacenamiento", ar: "استخدم التخزين الخاص بك", fr: "Utilisez votre propre stockage", de: "Bringen Sie Ihren eigenen Speicher mit", ru: "Используйте собственное хранилище", pt: "Traga seu próprio armazenamento", ja: "独自のストレージを持ち込む", pa: "ਆਪਣਾ ਖੁਦ ਦਾ ਸਟੋਰੇਜ ਲਿਆਓ", bn: "নিজের স্টোরেজ আনুন", id: "Bawa penyimpanan Anda sendiri", ur: "اپنا خود کا اسٹوریج لائیں", ms: "Bawa penyimpanan Anda sendiri", it: "Porta il tuo storage", tr: "Kendi depolamanızı getirin", ta: "உங்கள் சொந்த சேமிப்பை கொண்டு வாருங்கள்", te: "మీ స్వంత నిల్వను తీసుకురండి", ko: "자신의 저장소를 가져오세요", vi: "Mang bộ nhớ của riêng bạn", pl: "Przynieś własne przechowywanie", ro: "Aduceți-vă propriul stocare", nl: "Breng je eigen opslag mee", el: "Φέρτε τη δική σας αποθήκευση", th: "นำที่เก็บข้อมูลของคุณเองมา", cs: "Přineste si vlastní úložiště", hu: "Hozd a saját tárhelyed", sv: "Ta med din egen lagring", da: "Tag din egen opbevaring med" })}
          </h1>
          <div className="h-4" />
          <div className="text-center text-default-contrast text-xl sm:text-2xl">
            {Lang.match({ en: "Store your data wherever you want, securely and privately", zh: "将你的数据安全私密地存储在你想要的任何地方", hi: "अपना डेटा जहां चाहें, सुरक्षित और निजी रूप से स्टोर करें", es: "Almacena tus datos donde quieras, de forma segura y privada", ar: "قم بتخزين بياناتك حيثما تريد، بأمان وخصوصية", fr: "Stockez vos données où vous voulez, en toute sécurité et confidentialité", de: "Speichern Sie Ihre Daten sicher und privat, wo immer Sie möchten", ru: "Храните свои данные там, где хотите, безопасно и конфиденциально", pt: "Armazene seus dados onde quiser, com segurança e privacidade", ja: "データを安全かつプライベートに好きな場所に保存", pa: "ਆਪਣਾ ਡੇਟਾ ਜਿੱਥੇ ਚਾਹੋ, ਸੁਰੱਖਿਅਤ ਅਤੇ ਨਿੱਜੀ ਤੌਰ 'ਤੇ ਸਟੋਰ ਕਰੋ", bn: "আপনার ডেটা যেখানে খুশি সুরক্ষিত এবং ব্যক্তিগতভাবে সংরক্ষণ করুন", id: "Simpan data Anda di mana pun Anda mau, dengan aman dan pribadi", ur: "اپنا ڈیٹا جہاں چاہیں، محفوظ اور نجی طور پر اسٹور کریں", ms: "Simpan data Anda di mana pun Anda mau, dengan aman dan pribadi", it: "Archivia i tuoi dati ovunque su voglia, in modo sicuro e privato", tr: "Verilerinizi istediğiniz yerde, güvenli ve özel olarak saklayın", ta: "உங்கள் தரவை எங்கே வேண்டுமானாலும், பாதுகாப்பாக மற்றும் தனிப்பட்ட முறையில் சேமிக்கவும்", te: "మీ డేటాను మీరు కోరుకున్న ఎక్కడైనా, సురక్షితంగా మరియు ప్రైవేట్‌గా నిల్వ చేయండి", ko: "데이터를 원하는 곳에 안전하고 개인적으로 저장하세요", vi: "Lưu trữ dữ liệu của bạn ở bất cứ đâu bạn muốn, an toàn và riêng tư", pl: "Przechowuj swoje dane tam, gdzie chcesz, bezpiecznie i prywatnie", ro: "Stocați-vă datele oriunde doriți, în siguranță și confidențialitate", nl: "Sla je gegevens op waar je maar wilt, veilig en privé", el: "Αποθηκεύστε τα δεδομένα σας όπου θέλετε, με ασφάλεια και ιδιωτικότητα", th: "จัดเก็บข้อมูลของคุณที่ไหนก็ได้อย่างปลอดภัยและเป็นส่วนตัว", cs: "Ukládejte svá data kdekoli chcete, bezpečně a soukromě", hu: "Tárolja adatait bárhol, biztonságosan és privát módon", sv: "Lagra dina data var du vill, säkert och privat", da: "Gem dine data, hvor du vil, sikkert og privat" })}
          </div>
          <div className="h-16" />
          <div className="flex flex-wrap flex-col sm:flex-row items-center text-center gap-4">
            <div className="p-4 bg-default-contrast rounded-xl">
              {Lang.match({ en: "Your device", zh: "你的设备", hi: "आपका डिवाइस", es: "Su dispositivo", ar: "جهازك", fr: "Votre appareil", de: "Ihr Gerät", ru: "Ваше устройство", pt: "Seu dispositivo", ja: "あなたのデバイス", pa: "ਤੁਹਾਡਾ ਡਿਵਾਈਸ", bn: "আপনার ডিভাইস", id: "Perangkat Anda", ur: "آپ کا آلہ", ms: "Perangkat Anda", it: "Il tuo dispositivo", tr: "Cihazınız", ta: "உங்கள் சாதனம்", te: "మీ పరికరం", ko: "당신의 장치", vi: "Thiết bị của bạn", pl: "Twoje urządzenie", ro: "Dispozitivul tău", nl: "Je apparaat", el: "Η συσκευή σας", th: "อุปกรณ์ของคุณ", cs: "Vaše zařízení", hu: "Az eszközöd", sv: "Din enhet", da: "Din enhed" })}
            </div>
            <div className="p-4 bg-default-contrast rounded-xl">
              {Lang.match({ en: "Your iCloud", zh: "你的iCloud", hi: "आपका iCloud", es: "Su iCloud", ar: "iCloud الخاص بك", fr: "Votre iCloud", de: "Ihr iCloud", ru: "Ваш iCloud", pt: "Seu iCloud", ja: "あなたのiCloud", pa: "ਤੁਹਾਡਾ iCloud", bn: "আপনার iCloud", id: "iCloud Anda", ur: "آپ کا iCloud", ms: "iCloud Anda", it: "Il tuo iCloud", tr: "iCloud'unuz", ta: "உங்கள் iCloud", te: "మీ iCloud", ko: "당신의 iCloud", vi: "iCloud của bạn", pl: "Twój iCloud", ro: "iCloud-ul tău", nl: "Je iCloud", el: "Το iCloud σας", th: "iCloud ของคุณ", cs: "Váš iCloud", hu: "Az iCloudod", sv: "Din iCloud", da: "Din iCloud" })}
            </div>
            <div className="p-4 bg-default-contrast rounded-xl">
              {Lang.match({ en: "Your Google Drive", zh: "你的Google Drive", hi: "आपका Google Drive", es: "Su Google Drive", ar: "Google Drive الخاص بك", fr: "Votre Google Drive", de: "Ihr Google Drive", ru: "Ваш Google Drive", pt: "Seu Google Drive", ja: "あなたのGoogle Drive", pa: "ਤੁਹਾਡਾ Google Drive", bn: "আপনার Google Drive", id: "Google Drive Anda", ur: "آپ کا Google Drive", ms: "Google Drive Anda", it: "Il tuo Google Drive", tr: "Google Drive'iniz", ta: "உங்கள் Google Drive", te: "మీ Google Drive", ko: "당신의 Google Drive", vi: "Google Drive của bạn", pl: "Twój Google Drive", ro: "Google Drive-ul tău", nl: "Je Google Drive", el: "Το Google Drive σας", th: "Google Drive ของคุณ", cs: "Váš Google Drive", hu: "A Google Drive-od", sv: "Din Google Drive", da: "Din Google Drive" })}
            </div>
            <div className="p-4 bg-default-contrast rounded-xl">
              {Lang.match({ en: "Your USB stick", zh: "你的USB闪存盘", hi: "आपका USB स्टिक", es: "Su memoria USB", ar: "محرك USB الخاص بك", fr: "Votre clé USB", de: "Ihr USB-Stick", ru: "Ваш USB-накопитель", pt: "Seu pen drive", ja: "あなたのUSBメモリ", pa: "ਤੁਹਾਡਾ USB ਸਟਿਕ", bn: "আপনার USB স্টিক", id: "USB stick Anda", ur: "آپ کا USB اسٹک", ms: "USB stick Anda", it: "La tua chiavetta USB", tr: "USB belleğiniz", ta: "உங்கள் USB ஸ்டிக்", te: "మీ USB స్టిక్", ko: "당신의 USB 스틱", vi: "USB stick của bạn", pl: "Twój pendrive USB", ro: "Stick-ul tău USB", nl: "Je USB-stick", el: "Το USB stick σας", th: "USB stick ของคุณ", cs: "Váš USB stick", hu: "Az USB sticked", sv: "Din USB-sticka", da: "Din USB-stick" })}
            </div>
          </div>
          <div className="h-[50dvh]" />
          <h1 className="text-center text-5xl sm:text-6xl font-medium">
            {Lang.match({ en: "Military-grade encryption", zh: "军用级加密", hi: "सैन्य-ग्रेड एन्क्रिप्शन", es: "Cifrado de grado militar", ar: "تشفير من الدرجة العسكرية", fr: "Chiffrement de niveau militaire", de: "Verschlüsselung auf militärischem Niveau", ru: "Шифрование военного уровня", pt: "Criptografia de nível militar", ja: "軍用グレードの暗号化", pa: "ਸੈਨਾ-ਗਰੇਡ ਇੰਕ੍ਰਿਪਸ਼ਨ", bn: "সামরিক-গ্রেড এনক্রিপশন", id: "Enkripsi tingkat militer", ur: "فوجی گریڈ انکرپشن", ms: "Enkripsi tingkat militer", it: "Crittografia di livello militare", tr: "Askeri sınıf şifreleme", ta: "சைனிக் கிரேட் குறியாக்கம்", te: "సైనిక-గ్రేడ్ ఎన్‌క్రిప్షన్", ko: "군용 등급 암호화", vi: "Mã hóa cấp quân sự", pl: "Szyfrowanie o klasie wojskowej", ro: "Criptare de nivel militar", nl: "Militaire-grade encryptie", el: "Κρυπτογράφηση στρατιωτικού επιπέδου", th: "การเข้ารหัสระดับทหาร", cs: "Vojenské šifrování", hu: "Katonai szintű titkosítás", sv: "Militärklassad kryptering", da: "Militær-kryptering" })}
          </h1>
          <div className="h-4" />
          <div className="text-center text-default-contrast text-xl sm:text-2xl">
            {Lang.match({ en: "Your data uses the KeePass file format with military-grade encryption", zh: "你的数据使用具有军用级加密的KeePass文件格式", hi: "आपका डेटा सैन्य-ग्रेड एन्क्रिप्शन के साथ KeePass फ़ाइल प्रारूप का उपयोग करता है", es: "Tus datos utilizan el formato de archivo KeePass con cifrado de grado militar", ar: "تستخدم بياناتك تنسيق ملف KeePass مع تشفير من الدرجة العسكرية", fr: "Vos données utilisent le format de fichier KeePass avec un chiffrement de niveau militaire", de: "Ihre Daten verwenden das KeePass-Dateiformat mit militärischer Verschlüsselung", ru: "Ваши данные используют формат файла KeePass с шифрованием военного уровня", pt: "Seus dados usam o formato de arquivo KeePass com criptografia de nível militar", ja: "あなたのデータは、軍用グレードの暗号化を使用したKeePassファイル形式を使用しています", pa: "ਤੁਹਾਡਾ ਡੇਟਾ ਸੈਨਾ-ਗਰੇਡ ਇੰਕ੍ਰਿਪਸ਼ਨ ਨਾਲ KeePass ਫਾਇਲ ਫਾਰਮੈਟ ਦਾ ਉਪਯੋਗ ਕਰਦਾ ਹੈ", bn: "আপনার ডেটা সামরিক-গ্রেড এনক্রিপশন সহ KeePass ফাইল ফরম্যাট ব্যবহার করে", id: "Data Anda menggunakan format file KeePass dengan enkripsi tingkat militer", ur: "آپ کا ڈیٹا فوجی گریڈ انکرپشن کے ساتھ KeePass فائل فارمیٹ استعمال کرتا ہے", ms: "Data Anda menggunakan format file KeePass dengan enkripsi tingkat militer", it: "I tuoi dati utilizzano il formato di file KeePass con crittografia di livello militare", tr: "Verileriniz, askeri sınıf şifreleme ile KeePass dosya formatını kullanır", ta: "உங்கள் தரவு KeePass கோப்பு வடிவத்தை சைனிக் கிரேட் குறியாக்கத்துடன் பயன்படுத்துகிறது", te: "మీ డేటా సైనిక-గ్రేడ్ ఎన్‌క్రిప్షన్‌తో KeePass ఫైల్ ఫార్మాట్‌ను ఉపయోగిస్తుంది", ko: "귀하의 데이터는 군용 등급 암호화가 적용된 KeePass 파일 형식을 사용합니다", vi: "Dữ liệu của bạn sử dụng định dạng tệp KeePass với mã hóa cấp quân sự", pl: "Twoje dane używają formatu pliku KeePass z szyfrowaniem o klasie wojskowej", ro: "Datele dvs. folosesc formatul de fișier KeePass cu criptare de nivel militar", nl: "Uw gegevens gebruiken het KeePass-bestandsformaat met militaire-grade encryptie", el: "Τα δεδομένα σας χρησιμοποιούν τη μορφή αρχείου KeePass με κρυπτογράφηση στρατιωτικού επιπέδου", th: "ข้อมูลของคุณใช้รูปแบบไฟล์ KeePass พร้อมการเข้ารหัสระดับทหาร", cs: "Vaše data používají formát souboru KeePass s vojenským šifrováním", hu: "Az adataid a KeePass fájlformátumot használják katonai szintű titkosítással", sv: "Dina data använder KeePass filformat med militärklassad kryptering", da: "Dine data bruger KeePass filformat med militær-kryptering" })}
          </div>
          <div className="h-16" />
          <div className="flex flex-wrap flex-col sm:flex-row items-center text-center gap-4">
            <div className="p-4 bg-default-contrast rounded-xl">
              AES-256
            </div>
            <div className="p-4 bg-default-contrast rounded-xl">
              ChaCha20
            </div>
            <div className="p-4 bg-default-contrast rounded-xl">
              Argon2
            </div>
          </div>
          <div className="h-[50dvh]" />
          <h1 className="text-center text-5xl sm:text-6xl font-medium">
            {Lang.match({ en: "Hide your fingerprint", zh: "隐藏你的指纹", hi: "अपना फिंगरप्रिंट छिपाएं", es: "Oculta su huella digital", ar: "اخف بصمتك", fr: "Masquez votre empreinte digitale", de: "Verstecken Sie Ihren Fingerabdruck", ru: "Скрыть ваш отпечаток", pt: "Oculte sua impressão digital", ja: "あなたの指紋を隠す", pa: "ਆਪਣੀ ਫਿੰਗਰਪ੍ਰਿੰਟ ਨੂੰ ਛੁਪਾਓ", bn: "আপনার ফিঙ্গারপ্রিন্ট লুকান", id: "Sembunyikan sidik jari Anda", ur: "اپنا فنگر پرنٹ چھپائیں", ms: "Sembunyikan sidik jari Anda", it: "Nascondi la tua impronta digitale", tr: "Parmak izinizi gizleyin", ta: "உங்கள் விரல் அச்சை மறைக்கவும்", te: "మీ ఫింగర్ ప్రింట్‌ను దాచండి", ko: "지문을 숨기세요", vi: "Ẩn dấu vân tay của bạn", pl: "Ukryj swój odcisk palca", ro: "Ascundeți amprenta dvs.", nl: "Verberg je vingerafdruk", el: "Κρύψτε το δακτυλικό σας αποτύπωμα", th: "ซ่อนลายนิ้วมือของคุณ", cs: "Skrýt váš otisk prstu", hu: "Rejtsd el az ujjlenyomatod", sv: "Dölj ditt fingeravtryck", da: "Skjul dit fingeraftryk" })}
          </h1>
          <div className="h-4" />
          <div className="text-center text-default-contrast text-xl sm:text-2xl">
            {Lang.match({ en: "All traffic can be sent through compatible proxies or mixnets", zh: "所有流量都可以通过兼容的代理或混合网络发送", hi: "सभी ट्रैफ़िक को संगत प्रॉक्सी या मिक्सनेट के माध्यम से भेजा जा सकता है", es: "Todo el tráfico se puede enviar a través de proxies o mixnets compatibles", ar: "يمكن إرسال كل حركة المرور من خلال بروكسي أو mixnets متوافقة", fr: "Tout le trafic peut être envoyé via des proxies ou mixnets compatibles", de: "Der gesamte Datenverkehr kann über kompatible Proxys oder Mixnets gesendet werden", ru: "Весь трафик может быть отправлен через совместимые прокси или микснеты", pt: "Todo o tráfego pode ser enviado através de proxies ou mixnets compatíveis", ja: "すべてのトラフィックは、互換性のあるプロキシやミックスネットを通じて送信できます", pa: "ਸਾਰਾ ਟਰੈਫਿਕ ਅਨੁਕੂਲ ਪ੍ਰਾਕਸੀ ਜਾਂ ਮਿਕਸਨੈੱਟ ਦੇ ਜ਼ਰੀਏ ਭੇਜਿਆ ਜਾ ਸਕਦਾ ਹੈ", bn: "সমস্ত ট্র্যাফিক সামঞ্জস্যপূর্ণ প্রক্সি বা মিক্সনেটের মাধ্যমে পাঠানো যেতে পারে", id: "Semua lalu lintas dapat dikirim melalui proxy atau mixnet yang kompatibel", ur: "تمام ٹریفک کو مطابقت پذیر پراکسی یا مکس نیٹ کے ذریعے بھیجا جا سکتا ہے", ms: "Semua lalu lintas dapat dikirim melalui proxy atau mixnet yang kompatibel", it: "Tutto il traffico può essere inviato tramite proxy o mixnet compatibili", tr: "Tüm trafik, uyumlu proxy'ler veya mixnet'ler aracılığıyla gönderilebilir", ta: "அனைத்து போக்குவரத்தும் பொருந்தக்கூடிய பிரதிநிதிகள் அல்லது மிக்ஸ்நெட்கள் மூலம் அனுப்பப்படலாம்", te: "అన్ని ట్రాఫిక్ అనుకూల ప్రాక్సీల లేదా మిక్స్‌నెట్స్ ద్వారా పంపబడవచ్చు", ko: "모든 트래픽은 호환 가능한 프록시 또는 믹스넷을 통해 전송할 수 있습니다", vi: "Tất cả lưu lượng có thể được gửi qua proxy hoặc mixnet tương thích", pl: "Cały ruch może być wysyłany przez kompatybilne proxy lub mixnety", ro: "Tot traficul poate fi trimis prin proxy-uri sau mixnet-uri compatibile", nl: "Al het verkeer kan worden verzonden via compatibele proxy's of mixnets", el: "Όλη η κίνηση μπορεί να αποστέλλεται μέσω συμβατών διακομιστών μεσολάβησης ή mixnets", th: "การรับส่งข้อมูลทั้งหมดสามารถส่งผ่านพร็อกซีหรือมิกซ์เน็ตที่เข้ากันได้", cs: "Veškerý provoz může být odesílán prostřednictvím kompatibilních proxy nebo mixnetů", hu: "Minden forgalom kompatibilis proxykon vagy mixneteken keresztül küldhető", sv: "All trafik kan skickas genom kompatibla proxys eller mixnets", da: "Al trafik kan sendes gennem kompatible proxyer eller mixnets" })}
          </div>
          <div className="h-16" />
          <div className="flex flex-wrap flex-col sm:flex-row items-center text-center gap-4">
            <div className="p-4 bg-default-contrast rounded-xl">
              {Lang.match({ en: "You", zh: "你", hi: "आप", es: "Tú", ar: "أنت", fr: "Vous", de: "Du", ru: "Вы", pt: "Você", ja: "あなた", pa: "ਤੁਸੀਂ", bn: "আপনি", id: "Anda", ur: "آپ", ms: "Anda", it: "Tu", tr: "Siz", ta: "நீங்கள்", te: "మీరు", ko: "당신", vi: "Bạn", pl: "Ty", ro: "Tu", nl: "Jij", el: "Εσύ", th: "คุณ", cs: "Vy", hu: "Te", sv: "Du", da: "Du" })}
            </div>
            <div className="text-default-contrast whitespace-pre rotate-90 sm:rotate-0">
              {`<--->`}
            </div>
            <div className="p-4 bg-opposite text-opposite selection-opposite rounded-xl">
              {Lang.match({ en: "Proxies", zh: "代理", hi: "प्रॉक्सी", es: "Proxies", ar: "بروكسي", fr: "Proxies", de: "Proxies", ru: "Прокси", pt: "Proxies", ja: "プロキシ", pa: "ਪ੍ਰਾਕਸੀ", bn: "প্রক্সি", id: "Proksi", ur: "پراکسیز", ms: "Proksi", it: "Proxy", tr: "Proxy'ler", ta: "ப்ராக்ஸிகள்", te: "ప్రాక్సీలు", ko: "프록시", vi: "Proxy", pl: "Proxies", ro: "Proxies", nl: "Proxies", el: "Proxies", th: "พร็อกซี", cs: "Proxies", hu: "Proxies", sv: "Proxies", da: "Proxies" })}
            </div>
            <div className="text-default-contrast whitespace-pre rotate-90 sm:rotate-0">
              {`<--->`}
            </div>
            <div className="p-4 bg-default-contrast rounded-xl">
              {Lang.match({ en: "Services", zh: "服务", hi: "सेवाएं", es: "Servicios", ar: "خدمات", fr: "Services", de: "Dienste", ru: "Сервисы", pt: "Serviços", ja: "サービス", pa: "ਸੇਵਾਵਾਂ", bn: "সার্ভিস", id: "Layanan", ur: "خدمات", ms: "Layanan", it: "Servizi", tr: "Hizmetler", ta: "சேவைகள்", te: "సేవలు", ko: "서비스", vi: "Dịch vụ", pl: "Usługi", ro: "Servicii", nl: "Diensten", el: "Υπηρεσίες", th: "บริการ", cs: "Služby", hu: "Szolgáltatások", sv: "Tjänster", da: "Tjenester" })}
            </div>
          </div>
          <div className="h-[50dvh]" />
          <h1 className="text-center text-5xl sm:text-6xl font-medium">
            {Lang.match({ en: "Built for resilience", zh: "为韧性而建", hi: "लचीलापन के लिए बनाया गया", es: "Construido para la resiliencia", ar: "بنيت للمرونة", fr: "Conçu pour la résilience", de: "Für Resilienz gebaut", ru: "Создан для устойчивости", pt: "Construído para resiliência", ja: "レジリエンスのために構築", pa: "ਲਚੀਲਾਪਨ ਲਈ ਬਣਾਇਆ ਗਿਆ", bn: "স্থিতিস্থাপকতার জন্য তৈরি", id: "Dibangun untuk ketahanan", ur: "لچک کے لیے بنایا گیا", ms: "Dibangun untuk ketahanan", it: "Costruito per la resilienza", tr: "Dayanıklılık için inşa edildi", ta: "நிலைத்தன்மைக்காக கட்டப்பட்டது", te: "స్థిరత్వం కోసం నిర్మించబడింది", ko: "복원력을 위해 구축", vi: "Được xây dựng cho sự phục hồi", pl: "Zbudowany dla odporności", ro: "Construit pentru reziliență", nl: "Gebouwd voor veerkracht", el: "Χτισμένο για ανθεκτικότητα", th: "สร้างขึ้นสำหรับความยืดหยุ่น", cs: "Postaven pro odolnost", hu: "Az ellenálló képesség érdekében építve", sv: "Byggd för resiliens", da: "Bygget for modstandsdygtighed" })}
          </h1>
          <div className="h-4" />
          <div className="text-center text-default-contrast text-xl sm:text-2xl">
            {Lang.match({ en: "Use it on any device with a modern web browser", zh: "在任何具有现代网络浏览器的设备上使用它", hi: "इसे किसी भी डिवाइस पर उपयोग करें जिसमें आधुनिक वेब ब्राउज़र हो", es: "Úsalo en cualquier dispositivo con un navegador web moderno", ar: "استخدمه على أي جهاز يحتوي على متصفح ويب حديث", fr: "Utilisez-le sur n'importe quel appareil avec un navigateur web moderne", de: "Verwenden Sie es auf jedem Gerät mit einem modernen Webbrowser", ru: "Используйте его на любом устройстве с современным веб-браузером", pt: "Use-o em qualquer dispositivo com um navegador web moderno", ja: "最新のウェブブラウザを搭載した任意のデバイスで使用できます", pa: "ਇਸਨੂੰ ਕਿਸੇ ਵੀ ਡਿਵਾਈਸ 'ਤੇ ਵਰਤੋਂ ਜਿਸ ਵਿੱਚ ਆਧੁਨਿਕ ਵੈੱਬ ਬਰਾਊਜ਼ਰ ਹੋਵੇ", bn: "এটি যে কোনও ডিভাইসে ব্যবহার করুন যার একটি আধুনিক ওয়েব ব্রাউজার রয়েছে", id: "Gunakan di perangkat apa pun dengan browser web modern", ur: "اسے کسی بھی ڈیوائس پر استعمال کریں جس میں جدید ویب براؤزر ہو", ms: "Gunakan di perangkat apa pun dengan browser web modern", it: "Usalo su qualsiasi dispositivo con un browser web moderno", tr: "Modern bir web tarayıcısına sahip herhangi bir cihazda kullanın", ta: "அதை எந்த சாதனத்திலும் பயன்படுத்தவும், அதில் ஒரு நவீன வலை உலாவி உள்ளது", te: "దాన్ని ఏ డివైస్‌లోనైనా ఉపయోగించండి, అందులో ఒక ఆధునిక వెబ్ బ్రౌజర్ ఉంది", ko: "최신 웹 브라우저가 있는 모든 장치에서 사용하세요", vi: "Sử dụng nó trên bất kỳ thiết bị nào có trình duyệt web hiện đại", pl: "Użyj go na dowolnym urządzeniu z nowoczesną przeglądarką internetową", ro: "Utilizați-l pe orice dispozitiv cu un browser web modern", nl: "Gebruik het op elk apparaat met een moderne webbrowser", el: "Χρησιμοποιήστε το σε οποιαδήποτε συσκευή με σύγχρονο πρόγραμμα περιήγησης ιστού", th: "ใช้ได้กับอุปกรณ์ใดก็ได้ที่มีเว็บเบราว์เซอร์สมัยใหม่", cs: "Použijte jej na jakémkoli zařízení s moderním webovým prohlížečem", hu: "Használja bármilyen eszközön, amely modern webböngészővel rendelkezik", sv: "Använd det på vilken enhet som helst med en modern webbläsare", da: "Brug det på enhver enhed med en moderne webbrowser" })}
          </div>
          <div className="h-16" />
          <div className="flex flex-wrap flex-col items-center text-center gap-4">
            <div className="p-4 bg-default-contrast rounded-xl">
              {Lang.match({ en: "No installation needed", zh: "无需安装", hi: "कोई स्थापना आवश्यक नहीं", es: "No se necesita instalación", ar: "لا حاجة للتثبيت", fr: "Aucune installation nécessaire", de: "Keine Installation erforderlich", ru: "Установка не требуется", pt: "Nenhuma instalação necessária", ja: "インストール不要", pa: "ਕੋਈ ਇੰਸਟਾਲੇਸ਼ਨ ਦੀ ਲੋੜ ਨਹੀਂ", bn: "কোন ইনস্টলেশন প্রয়োজন নেই", id: "Tidak perlu instalasi", ur: "انسٹالیشن کی ضرورت نہیں", ms: "Tidak perlu instalasi", it: "Nessuna installazione necessaria", tr: "Kurulum gerekmez", ta: "நிறுவல் தேவையில்லை", te: "ఇన్‌స్టాలేషన్ అవసరం లేదు", ko: "설치 필요 없음", vi: "Không cần cài đặt", pl: "Nie wymaga instalacji", ro: "Nu este necesară instalarea", nl: "Geen installatie nodig", el: "Δεν απαιτείται εγκατάσταση", th: "ไม่ต้องติดตั้ง", cs: "Není potřeba instalace", hu: "Nincs szükség telepítésre", sv: "Ingen installation behövs", da: "Ingen installation nødvendig" })}
            </div>
            <div className="p-4 bg-default-contrast rounded-xl">
              {Lang.match({ en: "Can be self-hosted anywhere", zh: "可以在任何地方自托管", hi: "कहीं भी स्व-होस्ट किया जा सकता है", es: "Puede ser autoalojado en cualquier lugar", ar: "يمكن استضافته ذاتيًا في أي مكان", fr: "Peut être auto-hébergé n'importe où", de: "Kann überall selbst gehostet werden", ru: "Может быть размещен самостоятельно в любом месте", pt: "Pode ser auto-hospedado em qualquer lugar", ja: "どこでもセルフホストできます", pa: "ਕਿਤੇ ਵੀ ਸਵੈ-ਹੋਸਟ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ", bn: "কোথাও স্ব-হোস্ট করা যেতে পারে", id: "Dapat di-host sendiri di mana saja", ur: "کہیں بھی خود میزبان ہو سکتا ہے", ms: "Dapat di-host sendiri di mana saja", it: "Può essere auto-ospitato ovunque", tr: "Herhangi bir yerde kendi kendine barındırılabilir", ta: "எங்கும் சுய-ஹோஸ்ட் செய்யலாம்", te: "ఎక్కడైనా స్వీయ-హోస్ట్ చేయవచ్చు", ko: "어디에서나 자체 호스팅 가능", vi: "Có thể tự lưu trữ ở bất cứ đâu", pl: "Może być samodzielnie hostowany gdziekolwiek", ro: "Poate fi auto-găzduit oriunde", nl: "Kan overal zelf gehost worden", el: "Μπορεί να φιλοξενηθεί οπουδήποτε", th: "สามารถโฮสต์เองได้ทุกที่", cs: "Může být samo-hostován kdekoli", hu: "Bárhol önállóan hosztolható", sv: "Kan självhostas var som helst", da: "Kan selv-hostes hvor som helst" })}
            </div>
            <div className="p-4 bg-default-contrast rounded-xl">
              {Lang.match({ en: "Works on airplane mode", zh: "在飞行模式下工作", hi: "विमान मोड पर काम करता है", es: "Funciona en modo avión", ar: "يعمل في وضع الطائرة", fr: "Fonctionne en mode avion", de: "Funktioniert im Flugmodus", ru: "Работает в режиме полета", pt: "Funciona no modo avião", ja: "機内モードで動作します", pa: "ਵਿਮਾਨ ਮੋਡ 'ਤੇ ਕੰਮ ਕਰਦਾ ਹੈ", bn: "এয়ারপ্লেন মোডে কাজ করে", id: "Bekerja dalam mode pesawat", ur: "ایئرپلین موڈ میں کام کرتا ہے", ms: "Bekerja dalam mode pesawat", it: "Funziona in modalità aereo", tr: "Uçak modunda çalışır", ta: "விமான முறைமை செயல்படுகிறது", te: "విమాన మోడ్‌లో పనిచేస్తుంది", ko: "비행기 모드에서 작동", vi: "Hoạt động ở chế độ máy bay", pl: "Działa w trybie samolotowym", ro: "Funcționează în modul avion", nl: "Werkt in vliegtuigmodus", el: "Λειτουργεί σε λειτουργία πτήσης", th: "ทำงานในโหมดเครื่องบิน", cs: "Funguje v letovém režimu", hu: "Működik repülőgépes módban", sv: "Fungerar i flygplansläge", da: "Fungerer i flytilstand" })}
            </div>
          </div>
          <div className="h-[50dvh]" />
          <h1 className="text-center text-5xl sm:text-6xl font-medium">
            {Lang.match({ en: "Supply-chain hardened", zh: "供应链加固", hi: "सप्लाई-चेन हार्डनिंग", es: "Endurecido contra la cadena de suministro", ar: "مقوى ضد سلسلة التوريد", fr: "Dépendences minimales", de: "Lieferketten gehärtet", ru: "Укрепление цепочки поставок", pt: "Endurecido contra a cadeia de suprimentos", ja: "サプライチェーン強化", pa: "ਸਪਲਾਈ-ਚੇਨ ਹਾਰਡਨਿੰਗ", bn: "সরবরাহ-চেইন হার্ডেনিং", id: "Diperkuat rantai pasokan", ur: "سپلائی چین سخت", ms: "Diperkuat rantai pasokan", it: "Indurito contro la catena di approvvigionamento", tr: "Tedarik zinciri sertleştirilmiş", ta: "சப்ளை-செயின் ஹார்டனிங்", te: "సప్లై-చైన్ హార్డెనింగ్", ko: "공급망 강화", vi: "Tăng cường chuỗi cung ứng", pl: "Wzmocniony łańcuch dostaw", ro: "Întărit împotriva lanțului de aprovizionare", nl: "Supply-chain gehard", el: "Ενισχυμένο κατά της αλυσίδας εφοδιασμού", th: "เสริมความแข็งแกร่งของห่วงโซ่อุปทาน", cs: "Zpevněný dodavatelský řetězec", hu: "Ellátási lánc megerősítve", sv: "Förstärkt försörjningskedja", da: "Supply-chain hærdet" })}
          </h1>
          <div className="h-4" />
          <div className="text-center text-default-contrast text-xl sm:text-2xl">
            {Lang.match({ en: "Most of our code is made in-house to prevent supply-chain attacks", zh: "我们的大部分代码都是内部制作的，以防止供应链攻击", hi: "हमारा अधिकांश कोड इन-हाउस बनाया गया है ताकि सप्लाई-चेन हमलों को रोका जा सके", es: "La mayor parte de nuestro código se hace internamente para prevenir ataques a la cadena de suministro", ar: "معظم كودنا مصنوع داخليًا لمنع هجمات سلسلة التوريد", fr: "La plupart de notre code est fait en interne pour prévenir les attaques de la chaîne d'approvisionnement", de: "Der Großteil unseres Codes wird intern erstellt, um Angriffe auf die Lieferkette zu verhindern", ru: "Большая часть нашего кода создается внутри компании, чтобы предотвратить атаки на цепочку поставок", pt: "A maior parte do nosso código é feita internamente para prevenir ataques à cadeia de suprimentos", ja: "サプライチェーン攻撃を防ぐために、私たちのコードの大部分は社内で作られています", pa: "ਸਪਲਾਈ-ਚੇਨ ਹਮਲਿਆਂ ਨੂੰ ਰੋਕਣ ਲਈ ਸਾਡਾ ਜ਼ਿਆਦਾਤਰ ਕੋਡ ਘਰੇਲੂ ਤੌਰ 'ਤੇ ਬਣਾਇਆ ਗਿਆ ਹੈ", bn: "আমাদের কোডের বেশিরভাগই ইন-হাউস তৈরি করা হয় সরবরাহ-চেইন আক্রমণ প্রতিরোধ করার জন্য", id: "Sebagian besar kode kami dibuat secara in-house untuk mencegah serangan rantai pasokan", ur: "سپلائی چین حملوں کو روکنے کے لیے ہمارا زیادہ تر کوڈ ان ہاؤس بنایا گیا ہے", ms: "Sebagian besar kode kami dibuat secara in-house untuk mencegah serangan rantai pasokan", it: "La maggior parte del nostro codice è realizzata internamente per prevenire attacchi alla catena di approvvigionamento", tr: "Tedarik zinciri saldırılarını önlemek için kodumuzun çoğu dahili olarak yapılır", ta: "சப்ளை-செயின் தாக்குதல்களைத் தடுக்கும் வகையில் எங்கள் குறியீட்டின் பெரும்பகுதி வீட்டில் செய்யப்படுகிறது", te: "సప్లై-చైన్ దాడులను నివారించడానికి మా కోడ్ యొక్క చాలా భాగం ఇన్-హౌస్‌లో తయారు చేయబడింది", ko: "공급망 공격을 방지하기 위해 대부분의 코드는 사내에서 만들어집니다", vi: "Phần lớn mã của chúng tôi được tạo trong nhà để ngăn chặn các cuộc tấn công chuỗi cung ứng", pl: "Większość naszego kodu jest tworzona wewnętrznie, aby zapobiec atakom na łańcuch dostaw", ro: "Majoritatea codului nostru este făcut în-house pentru a preveni atacurile asupra lanțului de aprovizionare", nl: "Het grootste deel van onze code is in-house gemaakt om aanvallen op de toeleveringsketen te voorkomen", el: "Το μεγαλύτερο μέρος του κώδικά μας γίνεται in-house για να αποτρέψει επιθέσεις στην αλυσίδα εφοδιασμού", th: "ส่วนใหญ่ของโค้ดของเราทำในบ้านเพื่อป้องกันการโจมตีของซัพพลายเชน", cs: "Většina našeho kódu je vytvářena interně, aby se zabránilo útokům na dodavatelský řetězec", hu: "Kódunk nagy részét házon belül készítjük, hogy megakadályozzuk az ellátási lánc támadásokat", sv: "Det mesta av vår kod är gjord in-house för att förhindra attacker på försörjningskedjan", da: "Det meste af vores kode er lavet in-house for at forhindre angreb på forsyningskæden" })}
          </div>
          <div className="h-16" />
          <div className="flex flex-col items-start w-full gap-4">
            <div className="bg-default-contrast w-full p-4 rounded-xl">
              {Lang.match({ en: "Other wallets have more than 1000 external dependencies", zh: "其他钱包有超过1000个外部依赖", hi: "अन्य वॉलेट में 1000 से अधिक बाहरी निर्भरताएं हैं", es: "Otras billeteras tienen más de 1000 dependencias externas", ar: "محافظ أخرى لديها أكثر من 1000 تبعيات خارجية", fr: "D'autres portefeuilles ont plus de 1000 dépendances externes", de: "Andere Wallets haben mehr als 1000 externe Abhängigkeiten", ru: "Другие кошельки имеют более 1000 внешних зависимостей", pt: "Outras carteiras têm mais de 1000 dependências externas", ja: "他のウォレットには1000以上の外部依存関係があります", pa: "ਹੋਰ ਵਾਲਿਟਾਂ ਵਿੱਚ 1000 ਤੋਂ ਵੱਧ ਬਾਹਰੀ ਨਿਰਭਰਤਾਵਾਂ ਹਨ", bn: "অন্যান্য ওয়ালেটের 1000 এর বেশি বাহ্যিক নির্ভরতা রয়েছে", id: "Dompet lain memiliki lebih dari 1000 dependensi eksternal", ur: "دیگر والٹس میں 1000 سے زیادہ بیرونی انحصار ہیں", ms: "Dompet lain memiliki lebih dari 1000 dependensi eksternal", it: "Altri portafogli hanno più di 1000 dipendenze esterne", tr: "Diğer cüzdanların 1000'den fazla harici bağımlılığı var", ta: "மற்ற பணப்பைகள் 1000 க்கும் அதிகமான வெளிப்புற சார்புகளை கொண்டுள்ளன", te: "ఇతర వాలెట్లు 1000 కంటే ఎక్కువ బాహ్య ఆధారాలు కలిగి ఉన్నాయి", ko: "다른 지갑에는 1000개 이상의 외부 종속성이 있습니다", vi: "Các ví khác có hơn 1000 phụ thuộc bên ngoài", pl: "Inne portfele mają ponad 1000 zewnętrznych zależności", ro: "Alte portofele au peste 1000 de dependențe externe", nl: "Andere wallets hebben meer dan 1000 externe afhankelijkheden", el: "Άλλα πορτοφόλια έχουν περισσότερες από 1000 εξωτερικές εξαρτήσεις", th: "กระเป๋าเงินอื่นๆ มีการพึ่งพาภายนอกมากกว่า 1000 รายการ", cs: "Jiné peněženky mají více než 1000 externích závislostí", hu: "Más pénztárcák több mint 1000 külső függőséggel rendelkeznek", sv: "Andra plånböcker har mer än 1000 externa beroenden", da: "Andre tegnebøger har mere end 1000 eksterne afhængigheder" })}
            </div>
            <div className="bg-opposite text-opposite selection-opposite p-4 rounded-xl">
              {Lang.match({ en: "We have 10", zh: "我们有10个", hi: "हमारे पास 10 हैं", es: "Tenemos 10", ar: "لدينا 10", fr: "Nous en avons 10", de: "Wir haben 10", ru: "У нас есть 10", pt: "Temos 10", ja: "私たちは10を持っています", pa: "ਸਾਡੇ ਕੋਲ 10 ਹਨ", bn: "আমাদের কাছে 10 টি আছে", id: "Kami memiliki 10", ur: "ہمارے پاس 10 ہیں", ms: "Kami memiliki 10", it: "Ne abbiamo 10", tr: "Bizde 10 var", ta: "எங்களிடம் 10 உள்ளது", te: "మాకు 10 ఉన్నాయి", ko: "우리는 10개를 가지고 있습니다", vi: "Chúng tôi có 10", pl: "Mamy 10", ro: "Avem 10", nl: "We hebben er 10", el: "Έχουμε 10", th: "เรามี 10", cs: "Máme 10", hu: "Van 10", sv: "Vi har 10", da: "Vi har 10" })}
            </div>
          </div>
          <div className="h-[50dvh]" />
          <a className="text-center hover:underline focus-visible:underline focus-visible:outline-none"
            href="https://brume.tech"
            target="_blank noreferrer">
            {Lang.match({ en: "Made by cypherpunks", zh: "由赛博朋克制作", hi: "साइबरपंक द्वारा बनाया गया", es: "Hecho por cypherpunks", ar: "مصنوع من قبل سايفربانكس", fr: "Fait par des cypherpunks", de: "Hergestellt von Cypherpunks", ru: "Создано киберпанками", pt: "Feito por cypherpunks", ja: "サイバーパンクによって作られた", pa: "ਸਾਈਬਰਪੰਕਸ ਦੁਆਰਾ ਬਣਾਇਆ ਗਿਆ", bn: "সাইফারপাঙ্ক দ্বারা তৈরি", id: "Dibuat oleh cypherpunks", ur: "سائبرپنکس کے ذریعہ بنایا گیا", ms: "Dibuat oleh cypherpunks", it: "Realizzato da cypherpunks", tr: "Cypherpunks tarafından yapıldı", ta: "சைபர்பங்க்ஸ் மூலம் உருவாக்கப்பட்டது", te: "సైఫర్పంక్స్ ద్వారా తయారు చేయబడింది", ko: "사이버펑크가 제작", vi: "Được tạo bởi cypherpunks", pl: "Stworzone przez cypherpunks", ro: "Realizat de cypherpunks", nl: "Gemaakt door cypherpunks", el: "Κατασκευάστηκε από cypherpunks", th: "สร้างโดย cypherpunks", cs: "Vytvořeno cypherpunks", hu: "Cypherpunks által készített", sv: "Gjord av cypherpunks", da: "Lavet af cypherpunks" })}
          </a>
          <div className="h-4" />
        </div>
      </div>
    </div>
  </Fragment>
}

export function SettingsButton() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, "/settings")

  return <ContrastAnchor
    href={coords.url.hash}
    onClick={coords.onClick}
    onKeyDown={coords.onKeyDown}>
    <Outline.CogIcon className="size-5" />
    {Lang.match({ en: "Settings", zh: "设置", hi: "सेटिंग्स", es: "Configuración", ar: "الإعدادات", fr: "Paramètres", de: "Einstellungen", ru: "Настройки", pt: "Configurações", ja: "設定", pa: "ਸੈਟਿੰਗਾਂ", bn: "সেটিংস", id: "Pengaturan", ur: "ترتیبات", ms: "Pengaturan", it: "Impostazioni", tr: "Ayarlar", ta: "அமைப்புகள்", te: "సెట్టింగ్స్", ko: "설정", vi: "Cài đặt", pl: "Ustawienia", ro: "Setări", nl: "Instellingen", el: "Ρυθμίσεις", th: "การตั้งค่า", cs: "Nastavení", hu: "Beállítások", sv: "Inställningar", da: "Indstillinger" })}
  </ContrastAnchor>
}

export function SettingsPage() {
  const store = useStoreContext().getOrThrow()

  const [name, setName] = useState<Nullable<string>>()

  const getNameOrThrow = useCallback(async () => {
    setName(await store.value.getOrThrow().getOrThrow<string>("appname"))
  }, [store])

  useEffect(() => {
    if (store == null)
      return
    if (store.value.isErr())
      return
    getNameOrThrow().catch(console.error)
  }, [store])

  const onNameChange = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)

    if (store == null)
      return
    if (store.value.isErr())
      return

    await store.value.getOrThrow().setOrThrow("appname", e.target.value)

    store.update()
  }, [store])

  const [icon, setIcon] = useState<Nullable<string>>()

  const getIconOrThrow = useCallback(async () => {
    setIcon(await store.value.getOrThrow().getOrThrow<Uint8Array<ArrayBuffer>>("appicon").then(x => x && `data:image/png;base64,${x.toBase64()}`))
  }, [store])

  useEffect(() => {
    if (store == null)
      return
    if (store.value.isErr())
      return
    getIconOrThrow().catch(console.error)
  }, [store])

  const onIconChange = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0)

    if (file == null)
      return

    setIcon(URL.createObjectURL(file))

    const data = new Uint8Array(await file.arrayBuffer())

    await store.value.getOrThrow().setOrThrow("appicon", data)

    store.update()
  }, [store])

  const onIconRemove = useCallback(async () => {
    await store.value.getOrThrow().deleteOrThrow("appicon")

    setIcon(undefined)

    store.update()
  }, [store])

  return <div className="flex flex-col grow p-6">
    <h1 className="text-xl font-medium">
      {Lang.match({ en: "Settings", zh: "设置", hi: "सेटिंग्स", es: "Configuración", ar: "الإعدادات", fr: "Paramètres", de: "Einstellungen", ru: "Настройки", pt: "Configurações", ja: "設定", pa: "ਸੈਟਿੰਗਾਂ", bn: "সেটিংস", id: "Pengaturan", ur: "ترتیبات", ms: "Pengaturan", it: "Impostazioni", tr: "Ayarlar", ta: "அமைப்புகள்", te: "సెట్టింగ్స్", ko: "설정", vi: "Cài đặt", pl: "Ustawienia", ro: "Setări", nl: "Instellingen", el: "Ρυθμίσεις", th: "การตั้งค่า", cs: "Nastavení", hu: "Beállítások", sv: "Inställningar", da: "Indstillinger" })}
    </h1>
    <form className="grow flex flex-col"
      onSubmit={Events.preventDefault}>
      <input className="hidden"
        autoComplete="off"
        name="username" />
      <div className="h-6" />
      <div className="font-medium">
        {Lang.match({ en: "App display", zh: "应用显示", hi: "ऐप प्रदर्शन", es: "Pantalla de la aplicación", ar: "عرض التطبيق", fr: "Affichage de l'application", de: "App-Anzeige", ru: "Отображение приложения", pt: "Exibição do aplicativo", ja: "アプリの表示", pa: "ਐਪ ਡਿਸਪਲੇਅ", bn: "অ্যাপ প্রদর্শন", id: "Tampilan aplikasi", ur: "ایپ ڈسپلے", ms: "Tampilan aplikasi", it: "Visualizzazione dell'app", tr: "Uygulama görüntüsü", ta: "அப் காட்சி", te: "యాప్ ప్రదర్శన", ko: "앱 디스플레이", vi: "Hiển thị ứng dụng", pl: "Wyświetlanie aplikacji", ro: "Afișajul aplicației", nl: "App-weergave", el: "Εμφάνιση εφαρμογής", th: "การแสดงผลแอป", cs: "Zobrazení aplikace", hu: "Alkalmazás megjelenítése", sv: "Appvisning", da: "App-visning" })}
      </div>
      <div className="text-default-contrast">
        {Lang.match({ en: "Custom name and icon to hide the app.", zh: "自定义名称和图标以隐藏应用程序。", hi: "ऐप को छिपाने के लिए कस्टम नाम और आइकन।", es: "Nombre e ícono personalizados para ocultar la aplicación.", ar: "اسم مخصص وأيقونة لإخفاء التطبيق.", fr: "Nom et icône personnalisés pour masquer l'application.", de: "Benutzerdefinierter Name und Symbol zum Verstecken der App.", ru: "Пользовательское имя и значок для скрытия приложения.", pt: "Nome e ícone personalizados para ocultar o aplicativo.", ja: "アプリを隠すためのカスタム名とアイコン。", pa: "ਐਪ ਨੂੰ ਛੁਪਾਉਣ ਲਈ ਕਸਟਮ ਨਾਮ ਅਤੇ ਆਈਕਨ।", bn: "অ্যাপটি লুকানোর জন্য কাস্টম নাম এবং আইকন।", id: "Nama dan ikon khusus untuk menyembunyikan aplikasi.", ur: "ایپ کو چھپانے کے لیے کسٹم نام اور آئیکن۔", ms: "Nama dan ikon khusus untuk menyembunyikan aplikasi.", it: "Nome e icona personalizzati per nascondere l'app.", tr: "Uygulamayı gizlemek için özel ad ve simge.", ta: "அப் மறைக்க தனிப்பயன் பெயர் மற்றும் ஐகான்.", te: "యాప్‌ను దాచడానికి కస్టమ్ పేరు మరియు చిహ్నం.", ko: "앱을 숨기기 위한 사용자 지정 이름 및 아이콘입니다.", vi: "Tên và biểu tượng tùy chỉnh để ẩn ứng dụng.", pl: "Niestandardowa nazwa i ikona do ukrycia aplikacji.", ro: "Nume și pictogramă personalizate pentru a ascunde aplicația.", nl: "Aangepaste naam en pictogram om de app te verbergen.", el: "Προσαρμοσμένο όνομα και εικονίδιο για να κρύψετε την εφαρμογή.", th: "ชื่อและไอคอนที่กำหนดเองเพื่อซ่อนแอป", cs: "Vlastní název a ikona pro skrytí aplikace.", hu: "Egyéni név és ikon az alkalmazás elrejtéséhez.", sv: "Anpassat namn och ikon för att dölja appen.", da: "Brugerdefineret navn og ikon for at skjule appen." })}
      </div>
      <div className="h-4" />
      <div className="flex flex-col items-center border border-default-contrast rounded-xl p-6">
        {icon == null &&
          <div className="relative size-24 border-2 border-dashed border-default-contrast flex items-center justify-center rounded-xl [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
            <input className="absolute inset-0 opacity-0 cursor-pointer"
              type="file"
              accept="image/*"
              onChange={onIconChange} />
            <Outline.ArrowUpTrayIcon className="size-6 text-default-contrast" />
          </div>}
        {icon != null &&
          <button className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-default-contrast"
            type="button"
            onClick={onIconRemove}>
            <img className="size-24 rounded-xl bg-opposite" src={icon} />
          </button>}
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <input className="w-full focus-visible:outline-none text-center"
            autoComplete="off"
            placeholder="Wallet"
            value={name || ""}
            onChange={onNameChange} />
        </div>
      </div>
    </form>
  </div>
}

export function InstallButton() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, "/install")

  return <ContrastAnchor
    href={coords.url.hash}
    onClick={coords.onClick}
    onKeyDown={coords.onKeyDown}>
    <Outline.ArrowDownOnSquareIcon className="size-5" />
    {Lang.match({ en: "Install", zh: "安装", hi: "इंस्टॉल करें", es: "Instalar", ar: "تثبيت", fr: "Installer", de: "Installieren", ru: "Установить", pt: "Instalar", ja: "インストール", pa: "ਇੰਸਟਾਲ ਕਰੋ", bn: "ইনস্টল করুন", id: "Pasang", ur: "انسٹال کریں", ms: "Pasang", it: "Installa", tr: "Yükle", ta: "நிறுவு", te: "ఇన్‌స్టాల్ చేయండి", ko: "설치하기", vi: "Cài đặt", pl: "Zainstaluj", ro: "Instalează", nl: "Installeren", el: "Εγκαταστήστε", th: "ติดตั้ง", cs: "Nainstalovat", hu: "Telepítés", sv: "Installera", da: "Installer" })}
  </ContrastAnchor>
}

export function InstallPage() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  return <Fragment>
    <SubpathProvider value={hash}>
      {hash.url.pathname === "/chrome" &&
        <PathBoard>
          <ChromeInstallPage />
        </PathBoard>}
      {hash.url.pathname === "/safari" &&
        <PathBoard>
          <SafariInstallPage />
        </PathBoard>}
      {hash.url.pathname === "/android" &&
        <PathBoard>
          <AndroidInstallPage />
        </PathBoard>}
    </SubpathProvider>
    <div className="flex flex-col grow p-6">
      <h1 className="text-xl font-medium">
        {Lang.match({ en: "Install", zh: "安装", hi: "इंस्टॉल करें", es: "Instalar", ar: "تثبيت", fr: "Installer", de: "Installieren", ru: "Установить", pt: "Instalar", ja: "インストール", pa: "ਇੰਸਟਾਲ ਕਰੋ", bn: "ইনস্টল করুন", id: "Pasang", ur: "انسٹال کریں", ms: "Pasang", it: "Installa", tr: "Yükle", ta: "நிறுவு", te: "ఇన్‌స్టాల్ చేయండి", ko: "설치하기", vi: "Cài đặt", pl: "Zainstaluj", ro: "Instalează", nl: "Installeren", el: "Εγκαταστήστε", th: "ติดตั้ง", cs: "Nainstalovat", hu: "Telepítés", sv: "Installera", da: "Installer" })}
      </h1>
      <div className="text-default-contrast">
        {Lang.match({ en: "You can install this website as an app on your device.", zh: "您可以将此网站安装为设备上的应用程序。", hi: "आप इस वेबसाइट को अपने डिवाइस पर एक ऐप के रूप में इंस्टॉल कर सकते हैं।", es: "Puedes instalar este sitio web como una aplicación en tu dispositivo.", ar: "يمكنك تثبيت هذا الموقع الإلكتروني كتطبيق على جهازك.", fr: "Vous pouvez installer ce site web en tant qu'application sur votre appareil.", de: "Sie können diese Website als App auf Ihrem Gerät installieren.", ru: "Вы можете установить этот веб-сайт как приложение на своем устройстве.", pt: "Você pode instalar este site como um aplicativo em seu dispositivo.", ja: "このウェブサイトをデバイスのアプリとしてインストールできます。", pa: "ਤੁਸੀਂ ਇਸ ਵੈੱਬਸਾਈਟ ਨੂੰ ਆਪਣੇ ਡਿਵਾਈਸ 'ਤੇ ਇੱਕ ਐਪ ਵਜੋਂ ਇੰਸਟਾਲ ਕਰ ਸਕਦੇ ਹੋ।", bn: "আপনি এই ওয়েবসাইটটিকে আপনার ডিভাইসে একটি অ্যাপ হিসাবে ইনস্টল করতে পারেন।", id: "Anda dapat menginstal situs web ini sebagai aplikasi di perangkat Anda.", ur: "آپ اس ویب سائٹ کو اپنے آلے پر ایک ایپ کے طور پر انسٹال کر سکتے ہیں۔", ms: "Anda dapat menginstal situs web ini sebagai aplikasi di perangkat Anda.", it: "Puoi installare questo sito web come un'app sul tuo dispositivo.", tr: "Bu web sitesini cihazınıza bir uygulama olarak yükleyebilirsiniz.", ta: "இந்த வலைத்தளத்தை உங்கள் சாதனத்தில் ஒரு செயலியாக நிறுவலாம்.", te: "మీరు ఈ వెబ్‌సైట్‌ను మీ డివైస్‌లో ఒక యాప్‌గా ఇన్‌స్టాల్ చేయవచ్చు.", ko: "이 웹사이트를 기기에 앱으로 설치할 수 있습니다.", vi: "Bạn có thể cài đặt trang web này như một ứng dụng trên thiết bị của mình.", pl: "Możesz zainstalować tę stronę internetową jako aplikację na swoim urządzeniu.", ro: "Puteți instala acest site web ca o aplicație pe dispozitivul dvs.", nl: "Je kunt deze website installeren als een app op je apparaat.", el: "Μπορείτε να εγκαταστήσετε αυτήν την ιστοσελίδα ως εφαρμογή στη συσκευή σας.", th: "คุณสามารถติดตั้งเว็บไซต์นี้เป็นแอปบนอุปกรณ์ของคุณได้", cs: "Můžete tento web nainstalovat jako aplikaci na své zařízení.", hu: "Ezt a weboldalt telepítheti alkalmazásként az eszközére.", sv: "Du kan installera den här webbplatsen som en app på din enhet.", da: "Du kan installere denne hjemmeside som en app på din enhed." })}
      </div>
      <div className="h-6" />
      <div className="flex flex-col gap-4">
        <ChromeButton />
        <SafariButton />
        <AndroidButton />
      </div>
      <div className="h-4 grow" />
      <div className="flex items-center">
        <WideContrastAnchor
          target="_blank noreferrer"
          href="https://github.com/brumeproject/wallet2">
          <Outline.ArrowTopRightOnSquareIcon className="size-5" />
          {Lang.match({ en: "Advanced", zh: "高级", hi: "उन्नत", es: "Avanzado", ar: "متقدم", fr: "Avancé", de: "Erweitert", ru: "Продвинутый", pt: "Avançado", ja: "高度な", pa: "ਉੱਨਤ", bn: "উন্নত", id: "Lanjutan", ur: "اعلی درجے کا", ms: "Lanjutan", it: "Avanzato", tr: "Gelişmiş", ta: "மேம்பட்டது", te: "అధునాతన", ko: "고급", vi: "Nâng cao", pl: "Zaawansowane", ro: "Avansat", nl: "Geavanceerd", el: "Για προχωρημένους", th: "ขั้นสูง", cs: "Pokročilý", hu: "Fejlett", sv: "Avancerad", da: "Avanceret" })}
        </WideContrastAnchor>
      </div>
    </div>
  </Fragment>
}

export function ChromeButton() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, "/chrome")

  return <a className="p-6 bg-default-contrast rounded-xl flex items-center gap-4 data-[highlighted=false]:opacity-50 hover:bg-default-double-contrast focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-default-contrast transition-transform"
    data-highlighted={navigator.userAgent.includes("Chrome") && !navigator.userAgent.includes("Android")}
    onKeyDown={coords.onKeyDown}
    onClick={coords.onClick}
    href={coords.url.hash}>
    <img className="size-16 object-contain p-2 bg-white rounded-xl"
      src="/assets/platforms/chrome.png" />
    <div className="flex flex-col">
      <div className="font-medium text-xl">
        Chrome
      </div>
      <div className="h-1" />
      <div className="text-default-contrast">
        Chrome, Edge, Brave, Opera, Chromium
      </div>
    </div>
  </a>
}


export function SafariButton() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, "/safari")

  return <a className="p-6 bg-default-contrast rounded-xl flex items-center gap-4 data-[highlighted=false]:opacity-50 hover:bg-default-double-contrast focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-default-contrast transition-transform"
    data-highlighted={navigator.userAgent.includes("Safari") && !navigator.userAgent.includes("Chrome") && !navigator.userAgent.includes("Android")}
    onKeyDown={coords.onKeyDown}
    onClick={coords.onClick}
    href={coords.url.hash}>
    <img className="size-16 object-contain p-2 bg-white rounded-xl"
      src="/assets/platforms/safari.svg" />
    <div className="flex flex-col">
      <div className="font-medium text-xl">
        Safari
      </div>
      <div className="h-1" />
      <div className="text-default-contrast">
        iPhone, iPad, Mac
      </div>
    </div>
  </a>
}

export function AndroidButton() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, "/android")

  return <a className="p-6 bg-default-contrast rounded-xl flex items-center gap-4 data-[highlighted=false]:opacity-50 hover:bg-default-double-contrast focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-default-contrast transition-transform"
    data-highlighted={navigator.userAgent.includes("Android")}
    onKeyDown={coords.onKeyDown}
    onClick={coords.onClick}
    href={coords.url.hash}>
    <img className="size-16 object-contain p-2 bg-white rounded-xl"
      src="/assets/platforms/android.svg" />
    <div className="flex flex-col">
      <div className="font-medium text-xl">
        Android
      </div>
      <div className="h-1" />
      <div className="text-default-contrast">
        Google, Samsung, Huawei, Xiaomi
      </div>
    </div>
  </a>
}

export function ChromeInstallPage() {
  return <div className="flex flex-col grow p-6">
    <h1 className="text-xl font-medium">
      {Lang.match({ en: "Install on Chrome", zh: "在 Chrome 上安装", hi: "Chrome पर इंस्टॉल करें", es: "Instalar en Chrome", ar: "التثبيت على كروم", fr: "Installer sur Chrome", de: "Auf Chrome installieren", ru: "Установить на Chrome", pt: "Instalar no Chrome", ja: "Chromeにインストール", pa: "ਕ੍ਰੋਮ 'ਤੇ ਇੰਸਟਾਲ ਕਰੋ", bn: "Chrome এ ইনস্টল করুন", id: "Pasang di Chrome", ur: "کروم پر انسٹال کریں", ms: "Pasang di Chrome", it: "Installa su Chrome", tr: "Chrome'ye Yükle", ta: "குரோம் இல் நிறுவவும்", te: "క్రోమ్ లో ఇన్‌స్టాల్ చేయండి", ko: "Chrome에 설치", vi: "Cài đặt trên Chrome", pl: "Zainstaluj na Chrome", ro: "Instalează pe Chrome", nl: "Installeren op Chrome", el: "Εγκαταστήστε στο Chrome", th: "ติดตั้งบน Chrome", cs: "Nainstalovat na Chrome", hu: "Telepítés Chrome-ra", sv: "Installera på Chrome", da: "Installer på Chrome" })}
    </h1>
    <div className="text-default-contrast">
      {Lang.match({ en: "Follow these steps to install this website on Chrome.", zh: "按照以下步骤在 Chrome 上安装此网站。", hi: "इन चरणों का पालन करके इस वेबसाइट को Chrome पर इंस्टॉल करें।", es: "Sigue estos pasos para instalar este sitio web en Chrome.", ar: "اتبع هذه الخطوات لتثبيت هذا الموقع على كروم.", fr: "Suivez ces étapes pour installer ce site web sur Chrome.", de: "Befolgen Sie diese Schritte, um diese Website auf Chrome zu installieren.", ru: "Следуйте этим шагам, чтобы установить этот веб-сайт на Chrome.", pt: "Siga estas etapas para instalar este site no Chrome.", ja: "これらの手順に従って、このウェブサイトをChromeにインストールしてください。", pa: "ਕ੍ਰੋਮ 'ਤੇ ਇਸ ਵੈੱਬਸਾਈਟ ਨੂੰ ਇੰਸਟਾਲ ਕਰਨ ਲਈ ਇਹਨਾਂ ਕਦਮਾਂ ਦੀ ਪਾਲਣਾ ਕਰੋ।", bn: "এই ধাপগুলি অনুসরণ করে এই ওয়েবসাইটটি ক্রোমে ইনস্টল করুন।", id: "Ikuti langkah-langkah ini untuk menginstal situs web ini di Chrome.", ur: "کروم پر اس ویب سائٹ کو انسٹال کرنے کے لیے ان مراحل پر عمل کریں۔", ms: "Ikuti langkah-langkah ini untuk menginstal situs web ini di Chrome.", it: "Segui questi passaggi per installare questo sito web su Chrome.", tr: "Bu adımları izleyerek bu web sitesini Chrome'a yükleyin.", ta: "இந்த படிகளை பின்பற்றி இந்த வலைத்தளத்தை குரோம் இல் நிறுவவும்.", te: "ఈ దశలను అనుసరించి ఈ వెబ్‌సైట్‌ను Chrome లో ఇన్‌స్టాల్ చేయండి.", ko: "이 단계를 따라 이 웹사이트를 Chrome에 설치하세요.", vi: "Làm theo các bước này để cài đặt trang web này trên Chrome.", pl: "Postępuj zgodnie z tymi krokami, aby zainstalować tę stronę internetową na Chrome.", ro: "Urmați acești pași pentru a instala acest site web pe Chrome.", nl: "Volg deze stappen om deze website op Chrome te installeren.", el: "Ακολουθήστε αυτά τα βήματα για να εγκαταστήσετε αυτήν την ιστοσελίδα στο Chrome.", th: "ทำตามขั้นตอนเหล่านี้เพื่อติดตั้งเว็บไซต์นี้บน Chrome", cs: "Postupujte podle těchto kroků pro instalaci této webové stránky na Chrome.", hu: "Kövesse ezeket a lépéseket a webhely telepítéséhez Chrome-ra.", sv: "Följ dessa steg för att installera denna webbplats på Chrome.", da: "Følg disse trin for at installere denne hjemmeside på Chrome." })}
    </div>
    <div className="h-6" />
    <div className="flex flex-wrap items-center justify-center gap-2">
      <img className="w-auto h-120"
        src="/assets/install/chrome-1.png" />
      <img className="w-auto h-120"
        src="/assets/install/chrome-2.png" />
    </div>
  </div>
}

export function SafariInstallPage() {
  return <div className="flex flex-col grow p-6">
    <h1 className="text-xl font-medium">
      {Lang.match({ en: "Install on Safari", zh: "在 Safari 上安装", hi: "Safari पर इंस्टॉल करें", es: "Instalar en Safari", ar: "التثبيت على سفاري", fr: "Installer sur Safari", de: "Auf Safari installieren", ru: "Установить на Safari", pt: "Instalar no Safari", ja: "Safariにインストール", pa: "ਸਫਾਰੀ 'ਤੇ ਇੰਸਟਾਲ ਕਰੋ", bn: "Safari এ ইনস্টল করুন", id: "Pasang di Safari", ur: "سفاری پر انسٹال کریں", ms: "Pasang di Safari", it: "Installa su Safari", tr: "Safari'ye Yükle", ta: "சஃபாரியில் நிறுவவும்", te: "సఫారి లో ఇన్‌స్టాల్ చేయండి", ko: "Safari에 설치", vi: "Cài đặt trên Safari", pl: "Zainstaluj na Safari", ro: "Instalează pe Safari", nl: "Installeren op Safari", el: "Εγκαταστήστε στο Safari", th: "ติดตั้งบน Safari", cs: "Nainstalovat na Safari", hu: "Telepítés Safarira", sv: "Installera på Safari", da: "Installer på Safari" })}
    </h1>
    <div className="text-default-contrast">
      {Lang.match({ en: "Follow these steps to install this website on Safari.", zh: "按照以下步骤在 Safari 上安装此网站。", hi: "इन चरणों का पालन करके इस वेबसाइट को Safari पर इंस्टॉल करें।", es: "Sigue estos pasos para instalar este sitio web en Safari.", ar: "اتبع هذه الخطوات لتثبيت هذا الموقع على سفاري.", fr: "Suivez ces étapes pour installer ce site web sur Safari.", de: "Befolgen Sie diese Schritte, um diese Website auf Safari zu installieren.", ru: "Следуйте этим шагам, чтобы установить этот веб-сайт на Safari.", pt: "Siga estas etapas para instalar este site no Safari.", ja: "これらの手順に従って、このウェブサイトをSafariにインストールしてください。", pa: "ਸਫਾਰੀ 'ਤੇ ਇਸ ਵੈੱਬਸਾਈਟ ਨੂੰ ਇੰਸਟਾਲ ਕਰਨ ਲਈ ਇਹਨਾਂ ਕਦਮਾਂ ਦੀ ਪਾਲਣਾ ਕਰੋ।", bn: "এই ধাপগুলি অনুসরণ করে এই ওয়েবসাইটটি সাফারিতে ইনস্টল করুন।", id: "Ikuti langkah-langkah ini untuk menginstal situs web ini di Safari.", ur: "سفاری پر اس ویب سائٹ کو انسٹال کرنے کے لیے ان مراحل پر عمل کریں۔", ms: "Ikuti langkah-langkah ini untuk menginstal situs web ini di Safari.", it: "Segui questi passaggi per installare questo sito web su Safari.", tr: "Bu adımları izleyerek bu web sitesini Safari'ye yükleyin.", ta: "இந்த படிகளை பின்பற்றி இந்த வலைத்தளத்தை சஃபாரியில் நிறுவவும்.", te: "ఈ దశలను అనుసరించి ఈ వెబ్‌సైట్‌ను సఫారీలో ఇన్‌స్టాల్ చేయండి.", ko: "이 단계를 따라 이 웹사이트를 Safari에 설치하세요.", vi: "Làm theo các bước này để cài đặt trang web này trên Safari.", pl: "Postępuj zgodnie z tymi krokami, aby zainstalować tę stronę internetową na Safari.", ro: "Urmați acești pași pentru a instala acest site web pe Safari.", nl: "Volg deze stappen om deze website op Safari te installeren.", el: "Ακολουθήστε αυτά τα βήματα για να εγκαταστήσετε αυτήν την ιστοσελίδα στο Safari.", th: "ทำตามขั้นตอนเหล่านี้เพื่อติดตั้งเว็บไซต์นี้บน Safari", cs: "Postupujte podle těchto kroků pro instalaci této webové stránky na Safari.", hu: "Kövesse ezeket a lépéseket a webhely telepítéséhez Safarira.", sv: "Följ dessa steg för att installera denna webbplats på Safari.", da: "Følg disse trin for at installere denne hjemmeside på Safari." })}
    </div>
    <div className="h-6" />
    <div className="flex flex-wrap items-center justify-center gap-2">
      <img className="w-auto h-120 rounded-4xl border-8 border-default-contrast"
        src="/assets/install/iphone-1.png" />
      <img className="w-auto h-120 rounded-4xl border-8 border-default-contrast"
        src="/assets/install/iphone-2.png" />
      <img className="w-auto h-120 rounded-4xl border-8 border-default-contrast"
        src="/assets/install/iphone-3.png" />
    </div>
  </div>
}

export function AndroidInstallPage() {
  return <div className="flex flex-col grow p-6">
    <h1 className="text-xl font-medium">
      {Lang.match({ en: "Install on Android", zh: "在 Android 上安装", hi: "Android पर इंस्टॉल करें", es: "Instalar en Android", ar: "التثبيت على أندرويد", fr: "Installer sur Android", de: "Auf Android installieren", ru: "Установить на Android", pt: "Instalar no Android", ja: "Androidにインストール", pa: "ਐਂਡਰਾਇਡ 'ਤੇ ਇੰਸਟਾਲ ਕਰੋ", bn: "Android এ ইনস্টল করুন", id: "Pasang di Android", ur: "اینڈروئیڈ پر انسٹال کریں", ms: "Pasang di Android", it: "Installa su Android", tr: "Android'e Yükle", ta: "ஆண்ட்ராய்டில் நிறுவவும்", te: "Android లో ఇన్‌స్టాల్ చేయండి", ko: "Android에 설치", vi: "Cài đặt trên Android", pl: "Zainstaluj na Android", ro: "Instalează pe Android", nl: "Installeren op Android", el: "Εγκαταστήστε στο Android", th: "ติดตั้งบน Android", cs: "Nainstalovat na Android", hu: "Telepítés Androidra", sv: "Installera på Android", da: "Installer på Android" })}
    </h1>
    <div className="text-default-contrast">
      {Lang.match({ en: "Follow these steps to install this website on Android.", zh: "按照以下步骤在 Android 上安装此网站。", hi: "इन चरणों का पालन करके इस वेबसाइट को Android पर इंस्टॉल करें।", es: "Sigue estos pasos para instalar este sitio web en Android.", ar: "اتبع هذه الخطوات لتثبيت هذا الموقع على أندرويد.", fr: "Suivez ces étapes pour installer ce site web sur Android.", de: "Befolgen Sie diese Schritte, um diese Website auf Android zu installieren.", ru: "Следуйте этим шагам, чтобы установить этот веб-сайт на Android.", pt: "Siga estas etapas para instalar este site no Android.", ja: "これらの手順に従って、このウェブサイトをAndroidにインストールしてください。", pa: "ਐਂਡਰਾਇਡ 'ਤੇ ਇਸ ਵੈੱਬਸਾਈਟ ਨੂੰ ਇੰਸਟਾਲ ਕਰਨ ਲਈ ਇਹਨਾਂ ਕਦਮਾਂ ਦੀ ਪਾਲਣਾ ਕਰੋ।", bn: "এই ধাপগুলি অনুসরণ করে এই ওয়েবসাইটটি অ্যান্ড্রয়েডে ইনস্টল করুন।", id: "Ikuti langkah-langkah ini untuk menginstal situs web ini di Android.", ur: "اینڈروئیڈ پر اس ویب سائٹ کو انسٹال کرنے کے لیے ان مراحل پر عمل کریں۔", ms: "Ikuti langkah-langkah ini untuk menginstal situs web ini di Android.", it: "Segui questi passaggi per installare questo sito web su Android.", tr: "Bu adımları izleyerek bu web sitesini Android'e yükleyin.", ta: "இந்த படிகளை பின்பற்றி இந்த வலைத்தளத்தை ஆண்ட்ராய்டில் நிறுவவும்.", te: "ఈ దశలను అనుసరించి ఈ వెబ్‌సైట్‌ను Android లో ఇన్‌స్టాల్ చేయండి.", ko: "이 단계를 따라 이 웹사이트를 Android에 설치하세요.", vi: "Làm theo các bước này để cài đặt trang web này trên Android.", pl: "Postępuj zgodnie z tymi krokami, aby zainstalować tę stronę internetową na Android.", ro: "Urmați acești pași pentru a instala acest site web pe Android.", nl: "Volg deze stappen om deze website op Android te installeren.", el: "Ακολουθήστε αυτά τα βήματα για να εγκαταστήσετε αυτήν την ιστοσελίδα στο Android.", th: "ทำตามขั้นตอนเหล่านี้เพื่อติดตั้งเว็บไซต์นี้บน Android", cs: "Postupujte podle těchto kroků pro instalaci této webové stránky na Android.", hu: "Kövesse ezeket a lépéseket a webhely telepítéséhez Androidra.", sv: "Följ dessa steg för att installera denna webbplats på Android.", da: "Følg disse trin for at installere denne hjemmeside på Android." })}
    </div>
    <div className="h-6" />
    <div className="flex flex-wrap items-center justify-center gap-2">
      <img className="w-auto h-120 rounded-4xl border-8 border-default-contrast"
        src="/assets/install/android-1.png" />
      <img className="w-auto h-120 rounded-4xl border-8 border-default-contrast"
        src="/assets/install/android-2.png" />
      <img className="w-auto h-120 rounded-4xl border-8 border-default-contrast"
        src="/assets/install/android-3.png" />
    </div>
  </div>
}

