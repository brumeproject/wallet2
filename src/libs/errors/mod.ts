// deno-lint-ignore-file no-namespace

import { Lang } from "@/libs/lang/mod.ts";

export namespace Errors {

  export function display(error: unknown) {
    console.error(error)

    if (error instanceof Error === false)
      return alert(Lang.match({ en: "An unknown error occured", zh: "发生未知错误", hi: "एक अज्ञात त्रुटि हुई", es: "Ocurrió un error desconocido", ar: "حدث خطأ غير معروف", fr: "Une erreur inconnue s'est produite", de: "Ein unbekannter Fehler ist aufgetreten", ru: "Произошла неизвестная ошибка", pt: "Ocorreu um erro desconhecido", ja: "不明なエラーが発生しました", pa: "ਇੱਕ ਅਣਜਾਣੀ ਤਰੁੱਟੀ ਹੋਈ ਹੈ", bn: "একটি অজানা ত্রুটি ঘটেছে", id: "Terjadi kesalahan yang tidak diketahui", ur: "ایک نامعلوم غلطی ہوئی ہے", ms: "Terjadi ralat yang tidak diketahui", it: "Si è verificato un errore sconosciuto", tr: "Bilinmeyen bir hata oluştu", ta: "ஒரு அறியப்படாத பிழை ஏற்பட்டது", te: "ఒక తెలియని లోపం సంభవించింది", ko: "알 수 없는 오류가 발생했습니다", vi: "Đã xảy ra lỗi không xác định", pl: "Wystąpił nieznany błąd", ro: "A apărut o eroare necunoscută", nl: "Er is een onbekende fout opgetreden", el: "Παρουσιάστηκε άγνωστο σφάλμα", th: "เกิดข้อผิดพลาดที่ไม่ทราบ", cs: "Došlo k neznámé chybě", hu: "Ismeretlen hiba történt", sv: "Ett okänt fel inträffade", da: "Der opstod en ukendt fejl" }))

    alert(Lang.match({ en: "An error occured", zh: "发生错误", hi: "एक त्रुटि हुई", es: "Ocurrió un error", ar: "حدث خطأ", fr: "Une erreur s'est produite", de: "Ein Fehler ist aufgetreten", ru: "Произошла ошибка", pt: "Ocorreu um erro", ja: "エラーが発生しました", pa: "ਇੱਕ ਤਰੁੱਟੀ ਹੋਈ ਹੈ", bn: "একটি ত্রুটি ঘটেছে", id: "Terjadi kesalahan", ur: "ایک غلطی ہوئی ہے", ms: "Terjadi ralat", it: "Si è verificato un errore", tr: "Bir hata oluştu", ta: "ஒரு பிழை ஏற்பட்டது", te: "ఒక లోపం సంభవించింది", ko: "오류가 발생했습니다", vi: "Đã xảy ra lỗi", pl: "Wystąpił błąd", ro: "A apărut o eroare", nl: "Er is een fout opgetreden", el: "Παρουσιάστηκε σφάλμα", th: "เกิดข้อผิดพลาด", cs: "Došlo k chybě", hu: "Hiba történt", sv: "Ett fel inträffade", da: "Der opstod en fejl" }))
  }

}