/// <reference lib="dom" />
// deno-lint-ignore-file no-process-global

import "@hazae41/symbol-dispose-polyfill";

import "@hazae41/disposable-stack-polyfill";

import "@hazae41/request-idle-callback-polyfill";

import { ClientContext } from "@/libs/client/mod.tsx";
import { dirs, Lang } from "@/libs/lang/mod.ts";
import { StoreProvider } from "@/libs/store/mod.tsx";
import { App } from "@/mods/app/mod.tsx";
import { argon2 } from "@hazae41/argon2";
import { argon2Wasm } from "@hazae41/argon2-wasm";
import { chaCha20Poly1305 } from "@hazae41/chacha20poly1305";
import { chaCha20Poly1305Wasm } from "@hazae41/chacha20poly1305-wasm";
import { PathProvider, useHashPath } from "@hazae41/chemin";
import { immutable } from "@hazae41/immutable";
import { Rewind } from "@hazae41/rewind";
import React, { ReactNode, useEffect, useState } from "react";
import { hydrateRoot } from "react-dom/client";

React;

async function register() {
  const { registration, update } = await immutable.serviceWorker.register("/service.worker.js", { scope: "/", updateViaCache: "all" })

  registration.addEventListener("updatefound", () => {
    const { installing, active } = registration

    if (active == null)
      return
    if (installing == null)
      return

    installing.addEventListener("statechange", async () => {
      if (installing.state !== "activated")
        return

      if (process.env.NODE_ENV !== "production")
        return

      await Promise.resolve()

      alert(Lang.match({ en: `An update of ${location.origin} has been installed. Please refresh the page to use the new version.`, zh: `已安装 ${location.origin} 的更新。请刷新页面以使用新版本。`, hi: `${location.origin} का एक अपडेट इंस्टॉल हो गया है। कृपया नए संस्करण का उपयोग करने के लिए पृष्ठ को रिफ्रेश करें।`, es: `Se ha instalado una actualización de ${location.origin}. Por favor, actualice la página para usar la nueva versión.`, ar: `تم تثبيت تحديث لـ ${location.origin}. يرجى تحديث الصفحة لاستخدام الإصدار الجديد.`, fr: `Une mise à jour de ${location.origin} a été installée. Veuillez rafraîchir la page pour utiliser la nouvelle version.`, de: `Ein Update von ${location.origin} wurde installiert. Bitte aktualisieren Sie die Seite, um die neue Version zu verwenden.`, ru: `Обновление для ${location.origin} было установлено. Пожалуйста, обновите страницу, чтобы использовать новую версию.`, pt: `Uma atualização de ${location.origin} foi instalada. Por favor, atualize a página para usar a nova versão.`, ja: `${location.origin} のアップデートがインストールされました。新しいバージョンを使用するには、ページを更新してください。`, pa: `${location.origin} ਦਾ ਇੱਕ ਅੱਪਡੇਟ ਇੰਸਟਾਲ ਹੋ ਗਿਆ ਹੈ। कृपया नए संस्करण का उपयोग करने के लिए पृष्ठ को रिफ्रेश करें।`, bn: `${location.origin} এর একটি আপডেট ইনস্টল করা হয়েছে। নতুন সংস্করণ ব্যবহার করতে कृपया पृष्ठ को रिफ्रेश करें।`, id: `Pembaruan dari ${location.origin} telah diinstal. Harap segarkan halaman untuk menggunakan versi baru.`, ur: `کے لیے ایک اپ ڈیٹ ${location.origin} انسٹال ہو گیا ہے۔ نئے ورژن کو استعمال کرنے کے لیے صفحہ کو ریفریش کریں۔`, ms: `Kemas kini untuk ${location.origin} telah dipasang. Sila segarkan halaman untuk menggunakan versi baru.`, it: `Un aggiornamento per ${location.origin} è stato installato. Per favore, aggiorna la pagina per usare la nuova versione.`, tr: `${location.origin} için bir güncelleme yüklendi. Yeni sürümü kullanmak için lütfen sayfayı yenileyin.`, ta: `${location.origin} க்கான ஒரு புதுப்பிப்பு நிறுவப்பட்டுள்ளது. புதிய பதிப்பைப் பயன்படுத்த பக்கத்தை புதுப்பிக்கவும்.`, te: `${location.origin} కోసం ఒక అప్‌డేట్ ఇన్‌స్టాల్ చేయబడింది. కొత్త వెర్షన్‌ను ఉపయోగించడానికి దయచేసి పేజీని రిఫ్రెష్ చేయండి.`, ko: `${location.origin}의 업데이트가 설치되었습니다. 새 버전을 사용하려면 페이지를 새로 고치세요.`, vi: `Một bản cập nhật của ${location.origin} đã được cài đặt. Vui lòng làm mới trang để sử dụng phiên bản mới.`, pl: `Aktualizacja ${location.origin} została zainstalowana. Odśwież stronę, aby użyć nowej wersji.`, ro: `O actualizare pentru ${location.origin} a fost instalată. Vă rugăm să reîmprospătați pagina pentru a utiliza noua versiune.`, nl: `Er is een update van ${location.origin} geïnstalleerd. Vernieuw de pagina om de nieuwe versie te gebruiken.`, el: `Μια ενημέρωση για το ${location.origin} έχει εγκατασταθεί. Παρακαλώ ανανεώστε τη σελίδα για να χρησιμοποιήσετε τη νέα έκδοση.`, th: `มีการติดตั้งการอัปเดตของ ${location.origin} กรุณารีเฟรชหน้าเพื่อใช้เวอร์ชันใหม่`, cs: `Aktualizace pro ${location.origin} byla nainstalována. Obnovte prosím stránku pro použití nové verze.`, hu: `Elérhető egy frissítés a ${location.origin} számára. Kérem, frissítse az oldalt az új verzió használatához.`, sv: `En uppdatering av ${location.origin} har installerats. Vänligen uppdatera sidan för att använda den nya versionen.`, da: `En opdatering af ${location.origin} er blevet installeret. Opdater venligst siden for at bruge den nye version.` }))
    }, { passive: true })

    console.debug("A new service worker is being installed")
  }, { passive: true })

  if (update == null)
    return registration
  if (!confirm(Lang.match({ en: `An update of ${location.origin} is available. Do you want to install it?`, zh: `有可用的 ${location.origin} 更新。您想安装它吗？`, hi: `${location.origin} का एक अपडेट उपलब्ध है। क्या आप इसे इंस्टॉल करना चाहते हैं?`, es: `Hay una actualización de ${location.origin} disponible. ¿Quieres instalarla?`, ar: `يتوفر تحديث لـ ${location.origin}. هل تريد تثبيته؟`, fr: `Une mise à jour de ${location.origin} est disponible. Voulez-vous l'installer ?`, de: `Ein Update von ${location.origin} ist verfügbar. Möchten Sie es installieren?`, ru: `Доступно обновление для ${location.origin}. Вы хотите установить его?`, pt: `Uma atualização de ${location.origin} está disponível. Você quer instalá-la?`, ja: `${location.origin} のアップデートが利用可能です。インストールしますか？`, pa: `${location.origin} ਦਾ ਇੱਕ ਅੱਪਡੇਟ ਉਪਲਬਧ ਹੈ। ਕੀ ਤੁਸੀਂ ਇਸ ਨੂੰ ਇੰਸਟਾਲ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ?`, bn: `${location.origin} এর একটি আপডেট উপলব্ধ। আপনি কি এটি ইনস্টল করতে চান?`, id: `Pembaruan dari ${location.origin} tersedia. Apakah Anda ingin menginstalnya?`, ur: `کے لیے ایک اپ ڈیٹ ${location.origin} دستیاب ہے۔ کیا آپ اسے انسٹال کرنا چاہتے ہیں؟`, ms: `Kemas kini untuk ${location.origin} tersedia. Adakah anda mahu memasangnya?`, it: `È disponibile un aggiornamento per ${location.origin}. Vuoi installarlo?`, tr: `${location.origin} için bir güncelleme mevcut. Kurmak ister misiniz?`, ta: `${location.origin} க்கான ஒரு புதுப்பிப்பு கிடைக்கிறது. நீங்கள் அதை நிறுவ விரும்புகிறீர்களா?`, te: `${location.origin} కోసం ఒక అప్‌డేట్ అందుబాటులో ఉంది. మీరు దాన్ని ఇన్‌స్టాల్ చేయాలనుకుంటున్నారా?`, ko: `${location.origin}의 업데이트가 있습니다. 설치하시겠습니까?`, vi: `Có bản cập nhật của ${location.origin} sẵn có. Bạn có muốn cài đặt nó không?`, pl: `Dostępna jest aktualizacja ${location.origin}. Czy chcesz ją zainstalować?`, ro: `O actualizare pentru ${location.origin} este disponibilă. Doriți să o instalați?`, nl: `Er is een update van ${location.origin} beschikbaar. Wilt u het installeren?`, el: `Υπάρχει μια ενημέρωση για το ${location.origin}. Θέλετε να την εγκαταστήσετε;`, th: `มีการอัปเดตของ ${location.origin} คุณต้องการติดตั้งหรือไม่?`, cs: `Je k dispozici aktualizace ${location.origin}. Chcete ji nainstalovat?`, hu: `Elérhető egy frissítés a ${location.origin} számára. Szeretné telepíteni?`, sv: `En uppdatering av ${location.origin} är tillgänglig. Vill du installera den?`, da: `En opdatering af ${location.origin} er tilgængelig. Vil du installere den?` })))
    return registration

  return await update()
}

function Body() {
  const path = useHashPath()

  const [client, setClient] = useState(false)

  useEffect(() => {
    const lang = Lang.get()

    document.documentElement.lang = lang
    document.documentElement.dir = dirs[lang]

    argon2.set(argon2.fromWasm(argon2Wasm))

    argon2Wasm.load().catch(console.error)

    chaCha20Poly1305.set(chaCha20Poly1305.fromWasm(chaCha20Poly1305Wasm))

    chaCha20Poly1305Wasm.load().catch(console.error)

    setClient(true)
  }, [])

  useEffect(() => {
    register().catch(console.error)
  }, [])

  return <ClientContext.Provider value={client}>
    <PathProvider value={path}>
      <StoreProvider>
        <App />
      </StoreProvider>
    </PathProvider>
  </ClientContext.Provider>
}

if (process.env.PLATFORM === "browser") {
  await new Rewind(document).hydrateOrThrow().then(() => hydrateRoot(document.body, <Body />))
} else {
  const params = new URLSearchParams(location.search)

  const lang = params.get("lang") as Lang | null

  if (lang != null) {
    document.documentElement.lang = lang
    document.documentElement.dir = dirs[lang]
  }

  const prerender = async (node: ReactNode) => {
    const ReactDOM = await import("react-dom/static")

    using stack = new DisposableStack()

    const stream = await ReactDOM.default.prerender(node)
    const reader = stream.prelude.getReader()

    stack.defer(() => reader.releaseLock())

    let html = ""

    for (let result = await reader.read(); !result.done; result = await reader.read())
      html += new TextDecoder().decode(result.value)

    return html
  }

  document.body.innerHTML = await prerender(<Body />)

  await new Rewind(document).prerenderOrThrow()
}