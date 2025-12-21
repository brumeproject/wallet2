// deno-lint-ignore-file no-unused-vars

/// <reference lib="dom" />

import { dirs, Lang } from "@/libs/lang/mod.ts";
import { App } from "@/mods/app/mod.tsx";
import { immutable } from "@hazae41/immutable";
import { Rewind } from "@hazae41/rewind";
import React, { ReactNode, useEffect, useState } from "react";
import { hydrateRoot } from "react-dom/client";

React;

const AnUpdateIsAvailable = (origin: string) => ({
  en: `An update of ${origin} is available. Do you want to update now?`,
  zh: `有可用的 ${origin} 更新。您想现在更新吗？`,
  hi: `${origin} का एक अपडेट उपलब्ध है। क्या आप अभी अपडेट करना चाहते हैं?`,
  es: `Hay una actualización de ${origin} disponible. ¿Quieres actualizar ahora?`,
  ar: `يتوفر تحديث لـ ${origin}. هل تريد التحديث الآن؟`,
  fr: `Une mise à jour de ${origin} est disponible. Voulez-vous mettre à jour maintenant ?`,
  de: `Ein Update von ${origin} ist verfügbar. Möchten Sie jetzt aktualisieren?`,
  ru: `Доступно обновление для ${origin}. Вы хотите обновить сейчас?`,
  pt: `Uma atualização de ${origin} está disponível. Você quer atualizar agora?`,
  ja: `${origin} のアップデートが利用可能です。今すぐアップデートしますか？`,
  pa: `${origin} ਦਾ ਇੱਕ ਅੱਪਡੇਟ ਉਪਲਬਧ ਹੈ। ਕੀ ਤੁਸੀਂ ਹੁਣ ਅੱਪਡੇਟ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ؟`,
  bn: `${origin} এর একটি আপডেট উপলব্ধ। আপনি কি এখনই আপডেট করতে চান?`,
  id: `Pembaruan dari ${origin} tersedia. Apakah Anda ingin memperbarui sekarang?`,
  ur: `کے لیے ایک اپ ڈیٹ ${origin} دستیاب ہے۔ کیا آپ ابھی اپ ڈیٹ کرنا چاہتے ہیں؟`,
  ms: `Kemas kini untuk ${origin} tersedia. Adakah anda mahu mengemas kini sekarang?`,
  it: `È disponibile un aggiornamento per ${origin}. Vuoi aggiornare ora?`,
  tr: `${origin} için bir güncelleme mevcut. Şimdi güncellemek ister misiniz?`,
  ta: `${origin} க்கான ஒரு புதுப்பிப்பு கிடைக்கிறது. நீங்கள் இப்போது புதுப்பிக்க விரும்புகிறீர்களா?`,
  te: `${origin} కోసం ఒక అప్‌డేట్ అందుబాటులో ఉంది. మీరు ఇప్పుడు అప్‌డేట్ చేయాలనుకుంటున్నారా?`,
  ko: `${origin}의 업데이트가 있습니다. 지금 업데이트하시겠습니까?`,
  vi: `Có bản cập nhật của ${origin} sẵn có. Bạn có muốn cập nhật ngay bây giờ không?`,
  pl: `Dostępna jest aktualizacja ${origin}. Czy chcesz zaktualizować teraz?`,
  ro: `O actualizare pentru ${origin} este disponibilă. Doriți să actualizați acum?`,
  nl: `Er is een update van ${origin} beschikbaar. Wilt u nu updaten?`,
  el: `Υπάρχει μια ενημέρωση για το ${origin}. Θέλετε να ενημερώσετε τώρα;`,
  th: `มีการอัปเดตของ ${origin} คุณต้องการอัปเดตตอนนี้หรือไม่?`,
  cs: `Je k dispozici aktualizace ${origin}. Chcete nyní aktualizovat?`,
  hu: `Elérhető egy frissítés a ${origin} számára. Szeretne most frissíteni?`,
  sv: `En uppdatering av ${origin} är tillgänglig. Vill du uppdatera nu?`,
  da: `En opdatering af ${origin} er tilgængelig. Vil du opdatere nu?`,
} as const)

async function upgrade() {
  if (navigator.serviceWorker.controller != null)
    navigator.serviceWorker.addEventListener("controllerchange", () => location.reload())

  const { registration, update } = await immutable.serviceWorker.register("/service.worker.js", { type: "module", scope: "/", updateViaCache: "all" })

  if (update == null)
    return registration
  if (!confirm(Lang.match(AnUpdateIsAvailable(location.origin))))
    return registration

  return await update()
}

function Body() {
  const [client, setClient] = useState(false)

  useEffect(() => {
    const lang = Lang.get()

    document.documentElement.lang = lang
    document.documentElement.dir = dirs[lang]

    setClient(true)
  }, [])

  useEffect(() => {
    upgrade().catch(console.error)
  }, [])

  return <App />
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