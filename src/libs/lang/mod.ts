// deno-lint-ignore-file no-namespace

export type Lang =
  | "en"
  | "zh"
  | "hi"
  | "es"
  | "ar"
  | "fr"
  | "de"
  | "ru"
  | "pt"
  | "ja"
  | "pa"
  | "bn"
  | "id"
  | "ur"
  | "ms"
  | "it"
  | "tr"
  | "ta"
  | "te"
  | "ko"
  | "vi"
  | "pl"
  | "ro"
  | "nl"
  | "el"
  | "th"
  | "cs"
  | "hu"
  | "sv"
  | "da"

export const langs: Record<string, Lang> = {
  en: "en",
  zh: "zh",
  hi: "hi",
  es: "es",
  ar: "ar",
  fr: "fr",
  de: "de",
  ru: "ru",
  pt: "pt",
  ja: "ja",
  pa: "pa",
  bn: "bn",
  id: "id",
  ur: "ur",
  ms: "ms",
  it: "it",
  tr: "tr",
  ta: "ta",
  te: "te",
  ko: "ko",
  vi: "vi",
  pl: "pl",
  ro: "ro",
  nl: "nl",
  el: "el",
  th: "th",
  cs: "cs",
  hu: "hu",
  sv: "sv",
  da: "da",
} as const

export const dirs: Record<Lang, "ltr" | "rtl"> = {
  en: "ltr",
  zh: "ltr",
  hi: "ltr",
  es: "ltr",
  ar: "rtl",
  fr: "ltr",
  de: "ltr",
  ru: "ltr",
  pt: "ltr",
  ja: "ltr",
  pa: "ltr",
  bn: "ltr",
  id: "ltr",
  ur: "rtl",
  ms: "ltr",
  it: "ltr",
  tr: "ltr",
  ta: "ltr",
  te: "ltr",
  ko: "ltr",
  vi: "ltr",
  pl: "ltr",
  ro: "ltr",
  nl: "ltr",
  el: "ltr",
  th: "ltr",
  cs: "ltr",
  hu: "ltr",
  sv: "ltr",
  da: "ltr",
} as const

export namespace Lang {

  export function get(): Lang {
    const served = langs[document.documentElement.lang]

    if (served != null)
      return served

    for (const language of navigator.languages) {
      const browsed = langs[language.split("-")[0]]

      if (browsed != null)
        return browsed

      continue
    }

    return "en"
  }

  export function match(record: Record<Lang, string>) {
    const served = langs[document.documentElement.lang]

    if (served != null)
      return record[served]

    return record["en"]
  }

}