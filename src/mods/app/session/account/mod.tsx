import { InAnchor, OppositeAnchor } from "@/libs/anchor/mod.tsx";
import { InButton } from "@/libs/button/mod.tsx";
import { PathBoard } from "@/libs/dialog/board/mod.tsx";
import { WideNakedMenuAnchor, WideNakedMenuButton } from "@/libs/dialog/paper/mod.tsx";
import { Errors } from "@/libs/errors/mod.ts";
import { Outline } from "@/libs/heroicons/mod.ts";
import { getEntryColor, getEntryTitle, getEntryType } from "@/libs/kdbx/mod.ts";
import { Nullable } from "@/libs/nullable/mod.ts";
import { Writable } from "@hazae41/binary";
import { SubpathProvider, useAnchorWithCoords, useHashSubpath, usePathContext } from "@hazae41/chemin";
import * as KDBX from "@hazae41/kdbx";
import React, { Fragment, MouseEvent, ReactNode, useCallback, useMemo, useState } from "react";
import { flushSync } from "react-dom";
import { useSessionContext } from "../mod.tsx";
import { CardAccountAddMenuAnchor, CardAccountAddPage, CardAccountPage } from "./card/mod.tsx";
import { CryptoAccountAddPage, CryptoAccountPage } from "./crypto/mod.tsx";
import { PasswordAccountAddMenuAnchor, PasswordAccountAddPage, PasswordAccountPage } from "./password/mod.tsx";

React;

export function AccountAddButtonInGrid() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, "/add")

  return <a className="group w-[320px] aspect-video border-2 border-default-contrast rounded-xl hover:scale-105 focus-visible:outline-none focus-visible:scale-105 transition-transform"
    href={coords.url.hash}
    onClick={coords.onClick}
    onKeyDown={coords.onKeyDown}>
    <InAnchor>
      <Outline.PlusIcon className="size-8" />
    </InAnchor>
  </a>
}

export function AccountCardInGrid(props: { $entry: KDBX.Inner.KeePassFile.Entry }) {
  const { $entry } = props

  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const uuid = useMemo(() => {
    return $entry.getUuidOrThrow().getOrThrow()
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

            return null
          })()}
        </PathBoard>}
    </SubpathProvider>
    <a className="w-[320px] aspect-video border-2 border-default-contrast p-4 rounded-xl text-left bg-default text-default select-none flex flex-col hover:scale-105 focus-visible:outline-none focus-visible:scale-105 transition-transform
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
      data-theme={getEntryColor($entry) == null ? "opposite" : "dark"}
      data-color={getEntryColor($entry)}
      href={coords.url.hash}
      onClick={coords.onClick}
      onKeyDown={coords.onKeyDown}>
      <div className="font-medium text-xl text-wrap wrap-anywhere truncate">
        {getEntryTitle($entry) || "Untitled"}
      </div>
      <div className="h-2" />
      <div className="text-default-half-contrast text-wrap wrap-anywhere truncate">
        {(() => {
          const type = getEntryType($entry)

          if (type === "password")
            return $entry.getStringByKeyOrNull("UserName")?.getValueOrThrow().get()

          if (type === "card")
            return $entry.getStringByKeyOrNull("CardNumber")?.getValueOrThrow().get()

          return null
        })()}
      </div>
      <div className="h-4 grow" />
      <div className="flex flex-wrap items-center gap-2">
        {(() => {
          const type = getEntryType($entry)

          if (type === "card")
            return <div className="bg-default-contrast rounded-xl po-1 flex items-center gap-2">
              <Outline.CreditCardIcon className="size-5" />
              Card
            </div>

          if (type === "crypto")
            return <div className="bg-default-contrast rounded-xl po-1 flex items-center gap-2">
              <Outline.BanknotesIcon className="size-5" />
              Crypto
            </div>

          if (type === "password")
            return <div className="bg-default-contrast rounded-xl po-1 flex items-center gap-2">
              <Outline.LanguageIcon className="size-5" />
              Password
            </div>

          return null
        })()}
      </div>
    </a>
  </Fragment>
}

export function CryptoAccountCard(props: { color: Nullable<string> } & { title: Nullable<string> } & { subtitle?: Nullable<string> } & { index?: Nullable<number> }) {
  const { color, title, subtitle, index } = props

  return <GenericAccountCard
    type="Crypto"
    title={title}
    subtitle={subtitle}
    color={color}
    index={index}
    icon={<Outline.BanknotesIcon className="size-5" />} />
}

export function PasswordAccountCard(props: { color: Nullable<string> } & { title: Nullable<string> } & { username: Nullable<string> }) {
  const { color, title, username } = props

  return <GenericAccountCard
    type="Password"
    title={title}
    subtitle={username}
    color={color}
    icon={<Outline.LanguageIcon className="size-5" />} />
}

export function CardAccountCard(props: { color: Nullable<string> } & { title: Nullable<string> } & { number: Nullable<string> }) {
  const { color, title, number } = props

  return <GenericAccountCard
    type="Card"
    title={title}
    subtitle={number}
    color={color}
    icon={<Outline.CreditCardIcon className="size-5" />} />
}

export function GenericAccountCard(props: { type: string } & { icon: ReactNode } & { color: Nullable<string> } & { title: Nullable<string> } & { subtitle?: Nullable<string> } & { index?: Nullable<number> }) {
  const { color, title, subtitle, type, icon, index } = props

  const [flipping, setFlipping] = useState(false)
  const [flipped, setFlipped] = useState(false)

  const onAnimationEnd = useCallback(() => {
    flushSync(() => setFlipped(flipping))
  }, [flipping])

  const onClick = useCallback((e: MouseEvent<HTMLDivElement>) => {
    setFlipping(f => !f)
  }, [])

  return <div className="w-[320px] aspect-video perspective-[640px]">
    <div className="h-full w-full data-[flip=true]:animate-flip-in data-[unflip=true]:animate-flip-out data-[flipped=true]:rotate-y-180 transform-3d relative rounded-xl bg-default text-default border-2 border-default-contrast select-none cursor-pointer hover:scale-105 focus-visible:outline-none focus-visible:scale-105 transition-transform
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
      data-flip={flipping && !flipped}
      data-unflip={!flipping && flipped}
      data-flipped={flipping && flipped}
      data-theme={color == null ? "opposite" : "dark"}
      data-color={color}
      onAnimationEnd={onAnimationEnd}
      onClick={onClick}>
      <div className="absolute inset-0 p-4 flex flex-col backface-hidden overflow-hidden">
        <div className="flex items-center">
          <div className="font-medium text-xl truncate">
            {title || "Untitled"}
          </div>
          <div className="grow" />
          <div className="font-medium text-xl text-default-half-contrast">
            {index != null ? `#${index + 1}` : null}
          </div>
        </div>
        <div className="h-2" />
        <div className="text-default-half-contrast text-wrap wrap-anywhere truncate">
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
        <div className="font-mono text-default-half-contrast whitespace-pre-wrap">
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
  </div>
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
    Add account
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
      {hash.url.pathname === "/crypto" &&
        <PathBoard>
          <CryptoAccountAddPage />
        </PathBoard>}
      {hash.url.pathname === "/card" &&
        <PathBoard>
          <CardAccountAddPage />
        </PathBoard>}
    </SubpathProvider>
    <div className="flex flex-col text-left gap-2">
      <PasswordAccountAddMenuAnchor />
      <CryptoAccountAddMenuAnchor />
      <CardAccountAddMenuAnchor />
    </div>
  </Fragment>
}

export function CryptoAccountAddMenuAnchor() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, "/crypto")

  return <WideNakedMenuAnchor
    href={coords.url.hash}
    onClick={coords.onClick}
    onKeyDown={coords.onKeyDown}>
    <Outline.BanknotesIcon className="size-5" />
    Crypto
  </WideNakedMenuAnchor>
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
    <InAnchor>
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
    </InAnchor>
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

  return <a className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none"
    href={coords.url.hash}
    onClick={coords.onClick}
    onKeyDown={coords.onKeyDown}>
    <InAnchor>
      <Outline.EllipsisVerticalIcon className="size-6" />
    </InAnchor>
  </a>
}

export function AccountMenuTrashButton(props: { $entry: KDBX.Inner.KeePassFile.Entry } & { close(force: boolean): void }) {
  const { $entry, close } = props

  const session = useSessionContext().getOrThrow()

  const encryptOrThrow = useCallback(async () => {
    const { kdbx, comp } = session.value

    $entry.trashOrThrow()

    return Writable.writeToBytesOrThrow(await kdbx.encryptOrThrow(comp))
  }, [session, $entry])

  const encryptAndWriteOrAlert = useCallback(() => Promise.try(async () => {
    const fsfh = session.value.user.fsfh

    if (fsfh == null)
      return

    const content = await encryptOrThrow()

    const writable = await fsfh.createWritable()
    await writable.write(content)
    await writable.close()

    close(true)

    session.update()
  }).catch(Errors.display), [encryptOrThrow, close])

  const encryptAndSaveOrAlert = useCallback(() => Promise.try(async () => {
    const content = await encryptOrThrow()

    const file = new File([content], "wallet.kdbx", { type: "application/kdbx" })

    if (/iPad|iPhone|iPod/.test(navigator.platform)) {
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

    close(true)

    session.update()
  }).catch(Errors.display), [encryptOrThrow, close])

  return <Fragment>
    {session.value.user.fsfh != null &&
      <WideNakedMenuButton
        type="button"
        onClick={encryptAndWriteOrAlert}>
        <Outline.TrashIcon className="size-5" />
        Trash
      </WideNakedMenuButton>}
    {session.value.user.fsfh == null &&
      <WideNakedMenuButton
        type="button"
        onClick={encryptAndSaveOrAlert}>
        <Outline.TrashIcon className="size-5" />
        Trash
      </WideNakedMenuButton>}
  </Fragment>
}

export function AccountMenuUntrashButton(props: { $entry: KDBX.Inner.KeePassFile.Entry } & { close(force: boolean): void }) {
  const { $entry, close } = props

  const session = useSessionContext().getOrThrow()

  const encryptOrThrow = useCallback(async () => {
    const { kdbx, comp } = session.value

    const $file = kdbx.inner.content.value
    const $root = $file.getRootOrThrow()

    $entry.moveOrThrow($root.getDirectGroupByIndexOrThrow(0))

    return Writable.writeToBytesOrThrow(await kdbx.encryptOrThrow(comp))
  }, [session, $entry])

  const encryptAndWriteOrAlert = useCallback(() => Promise.try(async () => {
    const fsfh = session.value.user.fsfh

    if (fsfh == null)
      return

    const content = await encryptOrThrow()

    const writable = await fsfh.createWritable()
    await writable.write(content)
    await writable.close()

    close(true)

    session.update()
  }).catch(Errors.display), [encryptOrThrow, close])

  const encryptAndSaveOrAlert = useCallback(() => Promise.try(async () => {
    const content = await encryptOrThrow()

    const file = new File([content], "wallet.kdbx", { type: "application/kdbx" })

    if (/iPad|iPhone|iPod/.test(navigator.platform)) {
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

    close(true)

    session.update()
  }).catch(Errors.display), [encryptOrThrow, close])

  return <Fragment>
    {session.value.user.fsfh != null &&
      <WideNakedMenuButton
        type="button"
        onClick={encryptAndWriteOrAlert}>
        <Outline.TrashIcon className="size-5" />
        Untrash
      </WideNakedMenuButton>}
    {session.value.user.fsfh == null &&
      <WideNakedMenuButton
        type="button"
        onClick={encryptAndSaveOrAlert}>
        <Outline.TrashIcon className="size-5" />
        Untrash
      </WideNakedMenuButton>}
  </Fragment>
}

export function AccountMenuDeleteButton(props: { $entry: KDBX.Inner.KeePassFile.Entry } & { close(force: boolean): void }) {
  const { $entry, close } = props

  const session = useSessionContext().getOrThrow()

  const encryptOrThrow = useCallback(async () => {
    const { kdbx, comp } = session.value

    $entry.element.parentNode?.removeChild($entry.element)

    return Writable.writeToBytesOrThrow(await kdbx.encryptOrThrow(comp))
  }, [session, $entry])

  const encryptAndWriteOrAlert = useCallback(() => Promise.try(async () => {
    if (!confirm("Are you sure you want to permanently delete this account?"))
      return

    const fsfh = session.value.user.fsfh

    if (fsfh == null)
      return

    const content = await encryptOrThrow()

    const writable = await fsfh.createWritable()
    await writable.write(content)
    await writable.close()

    close(true)

    session.update()
  }).catch(Errors.display), [encryptOrThrow, close])

  const encryptAndSaveOrAlert = useCallback(() => Promise.try(async () => {
    if (!confirm("Are you sure you want to permanently delete this account?"))
      return

    const content = await encryptOrThrow()

    const file = new File([content], "wallet.kdbx", { type: "application/kdbx" })

    if (/iPad|iPhone|iPod/.test(navigator.platform)) {
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

    close(true)

    session.update()
  }).catch(Errors.display), [encryptOrThrow, close])

  return <Fragment>
    {session.value.user.fsfh != null &&
      <WideNakedMenuButton
        type="button"
        onClick={encryptAndWriteOrAlert}>
        <Outline.ScissorsIcon className="size-5" />
        Delete
      </WideNakedMenuButton>}
    {session.value.user.fsfh == null &&
      <WideNakedMenuButton
        type="button"
        onClick={encryptAndSaveOrAlert}>
        <Outline.ScissorsIcon className="size-5" />
        Delete
      </WideNakedMenuButton>}
  </Fragment>
}