import { Lang } from "@/libs/lang/mod.ts";
import { Nullable } from "@/libs/nullable/mod.ts";
import React, { ReactNode, useCallback, useState } from "react";
import { flushSync } from "react-dom";

React;

export function FlipCard(props: { type: string } & { icon: ReactNode } & { color: Nullable<string> } & { title: Nullable<string> } & { subtitle?: Nullable<string> } & { index?: Nullable<number> } & { flip: boolean } & { onFlipChange(flip: boolean): void }) {
  const { color, title, subtitle, type, icon, index, flip, onFlipChange } = props

  const [control, setControl] = [flip, onFlipChange]
  const [visible, setVisible] = useState(false)

  const onAnimationEnd = useCallback(() => {
    flushSync(() => setVisible(control))
  }, [control])

  const onClick = useCallback(() => {
    setControl(!control)
  }, [control, setControl])

  return <button className="@container w-[min(320px,100%)] aspect-video perspective-midrange text-left cursor-pointer hover:scale-105 focus-visible:outline-none focus-visible:scale-105 transition-transform"
    type="button"
    onClick={onClick}>
    <div className="h-full w-full data-[flipping=true]:animate-flip-in data-[unflipping=true]:animate-flip-out data-[flipped=true]:rotate-y-180 transform-3d relative rounded-xl bg-default text-default border-2 border-default-contrast select-none
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
      data-flipping={control && !visible}
      data-unflipping={!control && visible}
      data-flipped={control && visible}
      data-theme={color == null ? "opposite" : "dark"}
      data-color={color}
      onAnimationEnd={onAnimationEnd}>
      <div className="absolute inset-0 p-4 flex flex-col backface-hidden overflow-hidden">
        <div className="flex items-center">
          <div className="font-medium text-xl truncate">
            {title || Lang.match({ en: "Untitled", zh: "未命名", hi: "बिना शीर्षक के", es: "Sin título", ar: "بدون عنوان", fr: "Sans titre", de: "Unbenannt", ru: "Без названия", pt: "Sem título", ja: "タイトルなし", pa: "ਬਿਨਾਂ ਸਿਰਲੇਖ ਦੇ", bn: "শিরোনামহীন", id: "Tanpa judul", ur: "بغیر عنوان کے", ms: "Tanpa judul", it: "Senza titolo", tr: "Başlıksız", ta: "தலைப்பு இல்லாமல்", te: "శీర్షికలేని", ko: "제목 없음", vi: "Không tiêu đề", pl: "Bez tytułu", ro: "Fără titlu", nl: "Naamloos", el: "Χωρίς τίτλο ", th: "ไม่มีชื่อเรื่อง ", cs: "Nezvaný ", hu: "Névtelen ", sv: "Namnlös ", da: "Navnløs" })}
          </div>
          <div className="grow" />
          <div className="font-medium text-xl text-default-half-contrast">
            {index != null ? `#${index + 1}` : null}
          </div>
        </div>
        <div className="not-@[290px]:hidden h-2" />
        <div className="not-@[290px]:hidden text-default-half-contrast truncate">
          {subtitle}
        </div>
        <div className="h-4 grow" />
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-default-contrast rounded-xl po-1 flex items-center gap-2">
            {icon}
            {type}
          </div>
        </div>
      </div>
      <div className="absolute inset-0 p-4 flex items-center justify-center backface-hidden overflow-hidden rotate-y-180">
        <div className="text-[0px] @[240px]:text-[5cqw] font-mono text-default-half-contrast whitespace-pre-wrap">
          {`
00100010 01010110 01101001
01110010 01100101 01110011
00100000 01101001 01101110
00100000 01101110 01110101
01101101 01100101 01110010
01101001 01110011 00100010
        `.trim()}
        </div>
      </div>
    </div>
  </button>
}