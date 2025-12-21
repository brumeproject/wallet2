import React from "react";
import { Lang } from "../../libs/lang/mod.ts";

React;

export function App() {
  return <div className="text-2xl font-sans">
    {Lang.match({
      en: "Hello world",
      zh: "你好，世界",
      hi: "नमस्ते दुनिया",
      es: "Hola mundo",
      ar: "مرحبا بالعالم",
      fr: "Bonjour le monde",
      de: "Hallo Welt",
      ru: "Привет, мир",
      pt: "Olá mundo",
      ja: "こんにちは世界",
      pa: "ਹੈਲੋ ਵਰਲਡ",
      bn: "হ্যালো ওয়ার্ল্ড",
      id: "Halo dunia",
      ur: "ہیلو ورلڈ",
      ms: "Hai dunia",
      it: "Ciao mondo",
      tr: "Merhaba dünya",
      ta: "ஹலோ வேர்ல்ட்",
      te: "హలో వరల్డ్",
      ko: "안녕하세요 세계",
      vi: "Xin chào thế giới",
      pl: "Witaj świecie",
      ro: "Salut lume",
      nl: "Hallo wereld",
      el: "Γειά σου κόσμε",
      th: "สวัสดีชาวโลก",
      cs: "Ahoj světe",
      hu: "Helló világ",
      sv: "Hej världen",
      da: "Hej verden",
    })}
  </div>
}