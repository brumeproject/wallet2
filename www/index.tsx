/// <reference lib="dom" />

import "@hazae41/request-idle-callback-polyfill";
import "@hazae41/symbol-dispose-polyfill";

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

const AnUpdateIsAvailable = (origin: string) => ({
  en: `An update of ${origin} is available. Do you want to install it?`,
  zh: `有可用的 ${origin} 更新。您想安装它吗？`,
  hi: `${origin} का एक अपडेट उपलब्ध है। क्या आप इसे इंस्टॉल करना चाहते हैं?`,
  es: `Hay una actualización de ${origin} disponible. ¿Quieres instalarla?`,
  ar: `يتوفر تحديث لـ ${origin}. هل تريد تثبيته؟`,
  fr: `Une mise à jour de ${origin} est disponible. Voulez-vous l'installer ?`,
  de: `Ein Update von ${origin} ist verfügbar. Möchten Sie es installieren?`,
  ru: `Доступно обновление для ${origin}. Вы хотите установить его?`,
  pt: `Uma atualização de ${origin} está disponível. Você quer instalá-la?`,
  ja: `${origin} のアップデートが利用可能です。インストールしますか？`,
  pa: `${origin} ਦਾ ਇੱਕ ਅੱਪਡੇਟ ਉਪਲਬਧ ਹੈ। ਕੀ ਤੁਸੀਂ ਇਸ ਨੂੰ ਇੰਸਟਾਲ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ?`,
  bn: `${origin} এর একটি আপডেট উপলব্ধ। আপনি কি এটি ইনস্টল করতে চান?`,
  id: `Pembaruan dari ${origin} tersedia. Apakah Anda ingin menginstalnya?`,
  ur: `کے لیے ایک اپ ڈیٹ ${origin} دستیاب ہے۔ کیا آپ اسے انسٹال کرنا چاہتے ہیں؟`,
  ms: `Kemas kini untuk ${origin} tersedia. Adakah anda mahu memasangnya?`,
  it: `È disponibile un aggiornamento per ${origin}. Vuoi installarlo?`,
  tr: `${origin} için bir güncelleme mevcut. Kurmak ister misiniz?`,
  ta: `${origin} க்கான ஒரு புதுப்பிப்பு கிடைக்கிறது. நீங்கள் அதை நிறுவ விரும்புகிறீர்களா?`,
  te: `${origin} కోసం ఒక అప్‌డేట్ అందుబాటులో ఉంది. మీరు దాన్ని ఇన్‌స్టాల్ చేయాలనుకుంటున్నారా?`,
  ko: `${origin}의 업데이트가 있습니다. 설치하시겠습니까?`,
  vi: `Có bản cập nhật của ${origin} sẵn có. Bạn có muốn cài đặt nó không?`,
  pl: `Dostępna jest aktualizacja ${origin}. Czy chcesz ją zainstalować?`,
  ro: `O actualizare pentru ${origin} este disponibilă. Doriți să o instalați?`,
  nl: `Er is een update van ${origin} beschikbaar. Wilt u het installeren?`,
  el: `Υπάρχει μια ενημέρωση για το ${origin}. Θέλετε να την εγκαταστήσετε;`,
  th: `มีการอัปเดตของ ${origin} คุณต้องการติดตั้งหรือไม่?`,
  cs: `Je k dispozici aktualizace ${origin}. Chcete ji nainstalovat?`,
  hu: `Elérhető egy frissítés a ${origin} számára. Szeretné telepíteni?`,
  sv: `En uppdatering av ${origin} är tillgänglig. Vill du installera den?`,
  da: `En opdatering af ${origin} er tilgængelig. Vil du installere den?`,
} as const)

async function upgrade() {
  const { registration, update } = await immutable.serviceWorker.register("/service.worker.js", { scope: "/", updateViaCache: "all" })

  if (update == null)
    return registration
  if (!confirm(Lang.match(AnUpdateIsAvailable(location.origin))))
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
    upgrade().catch(console.error)
  }, [])

  return <ClientContext.Provider value={client}>
    <PathProvider value={path}>
      <StoreProvider>
        <App />
      </StoreProvider>
    </PathProvider>
  </ClientContext.Provider>
}

// @ts-ignore: process not found
// deno-lint-ignore no-process-global
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