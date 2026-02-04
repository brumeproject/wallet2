import { InButton, WideOppositeButton } from "@/libs/button/mod.tsx";
import { useCopy } from "@/libs/copy/mod.ts";
import { PathPaper, WideNakedMenuAnchor } from "@/libs/dialog/paper/mod.tsx";
import { Errors } from "@/libs/errors/mod.ts";
import { Outline } from "@/libs/heroicons/mod.ts";
import { getEntryTitle } from "@/libs/kdbx/mod.ts";
import { Nullable } from "@/libs/nullable/mod.tsx";
import { Writable } from "@hazae41/binary";
import { SubpathProvider, useAnchorWithCoords, useHashSubpath, usePathContext } from "@hazae41/chemin";
import * as KDBX from "@hazae41/kdbx";
import { useCloseContext } from "@hazae41/react-close-context";
import React, { Fragment, useCallback, useDeferredValue, useMemo, useState } from "react";
import { useSessionContext } from "../../mod.tsx";
import { AccountCard, ColorAnchor, ColorMenu } from "../mod.tsx";

React;

export function CardAccountPage(props: { $entry: KDBX.Inner.KeePassFile.Entry }) {
  const { $entry } = props

  const [masked, setMasked] = useState(true)

  const num = useMemo(() => {
    return $entry.getDirectStringByKeyOrNull("CardNumber")?.getValueOrThrow().get()
  }, [$entry])

  const hol = useMemo(() => {
    return $entry.getDirectStringByKeyOrNull("CardHolder")?.getValueOrThrow().get()
  }, [$entry])

  const exp = useMemo(() => {
    return $entry.getDirectStringByKeyOrNull("ExpiryDate")?.getValueOrThrow().get()
  }, [$entry])

  const cvv = useMemo(() => {
    return $entry.getDirectStringByKeyOrNull("CVV")?.getValueOrThrow().get()
  }, [$entry])

  const pin = useMemo(() => {
    return $entry.getDirectStringByKeyOrNull("PIN")?.getValueOrThrow().get()
  }, [$entry])

  const notes = useMemo(() => {
    return $entry.getDirectStringByKeyOrNull("Notes")?.getValueOrThrow().get()
  }, [$entry])

  const copyTheNum = useCopy(num)
  const copyTheHol = useCopy(hol)
  const copyTheExp = useCopy(exp)
  const copyTheCvv = useCopy(cvv)
  const copyThePin = useCopy(pin)

  return <div className="flex flex-col grow p-6">
    <h1 className="text-xl font-medium">
      {getEntryTitle($entry) || "Untitled"}
    </h1>
    <div className="text-default-contrast">
      {$entry.getUuidOrThrow().getOrThrow().slice(0, 8).toUpperCase()}
    </div>
    <div className="h-6" />
    <div className="flex items-center justify-center">
      <AccountCard $entry={$entry} />
    </div>
    <form className="grow flex flex-col">
      <input className="hidden"
        autoComplete="off"
        name="username" />
      {num && <Fragment>
        <div className="h-6" />
        <div className="font-medium">
          Number
        </div>
        <div className="text-default-contrast">
          Your card number
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <Outline.HashtagIcon className="size-5" />
          <input className="w-full focus-visible:outline-none"
            readOnly
            autoComplete="off"
            onFocus={e => e.currentTarget.select()}
            value={num} />
          <div className="flex items-center gap-2">
            <button className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none"
              type="button"
              onClick={copyTheNum.copyOrAlert}>
              <InButton>
                {copyTheNum.copied ? <Outline.CheckIcon className="size-5" /> : <Outline.DocumentDuplicateIcon className="size-5" />}
              </InButton>
            </button>
          </div>
        </div>
      </Fragment>}
      {hol && <Fragment>
        <div className="h-6" />
        <div className="font-medium">
          Holder
        </div>
        <div className="text-default-contrast">
          Your card holder name
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <Outline.UserIcon className="size-5" />
          <input className="w-full focus-visible:outline-none"
            readOnly
            autoComplete="off"
            onFocus={e => e.currentTarget.select()}
            value={hol} />
          <div className="flex items-center gap-2">
            <button className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none"
              type="button"
              onClick={copyTheHol.copyOrAlert}>
              <InButton>
                {copyTheHol.copied ? <Outline.CheckIcon className="size-5" /> : <Outline.DocumentDuplicateIcon className="size-5" />}
              </InButton>
            </button>
          </div>
        </div>
      </Fragment>}
      {exp && <Fragment>
        <div className="h-6" />
        <div className="font-medium">
          Expiry
        </div>
        <div className="text-default-contrast">
          Your card expiry date
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <Outline.CalendarIcon className="size-5" />
          <input className="w-full focus-visible:outline-none"
            readOnly
            autoComplete="off"
            onFocus={e => e.currentTarget.select()}
            value={exp} />
          <div className="flex items-center gap-2">
            <button className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none"
              type="button"
              onClick={copyTheExp.copyOrAlert}>
              <InButton>
                {copyTheExp.copied ? <Outline.CheckIcon className="size-5" /> : <Outline.DocumentDuplicateIcon className="size-5" />}
              </InButton>
            </button>
          </div>
        </div>
      </Fragment>}
      {cvv && <Fragment>
        <div className="h-6" />
        <div className="font-medium">
          CVV
        </div>
        <div className="text-default-contrast">
          Your card verification value
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <Outline.HashtagIcon className="size-5" />
          <input className="w-full focus-visible:outline-none"
            readOnly
            autoComplete="off"
            type={masked ? "password" : "text"}
            onFocus={e => e.currentTarget.select()}
            value={cvv} />
          <div className="flex items-center gap-2">
            <button className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none"
              type="button"
              onClick={() => setMasked(!masked)}>
              <InButton>
                {masked ? <Outline.EyeIcon className="size-5" /> : <Outline.EyeSlashIcon className="size-5" />}
              </InButton>
            </button>
            <button className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none"
              type="button"
              onClick={copyTheCvv.copyOrAlert}>
              <InButton>
                {copyTheCvv.copied ? <Outline.CheckIcon className="size-5" /> : <Outline.DocumentDuplicateIcon className="size-5" />}
              </InButton>
            </button>
          </div>
        </div>
      </Fragment>}
      {pin && <Fragment>
        <div className="h-6" />
        <div className="font-medium">
          PIN
        </div>
        <div className="text-default-contrast">
          Your card personal identification number
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <Outline.HashtagIcon className="size-5" />
          <input className="w-full focus-visible:outline-none"
            readOnly
            autoComplete="off"
            type={masked ? "password" : "text"}
            onFocus={e => e.currentTarget.select()}
            value={pin} />
          <div className="flex items-center gap-2">
            <button className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none"
              type="button"
              onClick={() => setMasked(!masked)}>
              <InButton>
                {masked ? <Outline.EyeIcon className="size-5" /> : <Outline.EyeSlashIcon className="size-5" />}
              </InButton>
            </button>
            <button className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none"
              type="button"
              onClick={copyThePin.copyOrAlert}>
              <InButton>
                {copyThePin.copied ? <Outline.CheckIcon className="size-5" /> : <Outline.DocumentDuplicateIcon className="size-5" />}
              </InButton>
            </button>
          </div>
        </div>
      </Fragment>}
      {notes && <Fragment>
        <div className="h-6" />
        <div className="font-medium">
          Notes
        </div>
        <div className="text-default-contrast">
          Any additional information
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex flex-col gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <textarea className="w-full resize-none focus-visible:outline-none"
            readOnly
            rows={6}
            value={notes} />
        </div>
      </Fragment>}
    </form>
  </div>
}

export function CardAccountAddMenuAnchor() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, "/card")

  return <WideNakedMenuAnchor
    href={coords.url.hash}
    onClick={coords.onClick}
    onKeyDown={coords.onKeyDown}>
    <Outline.CreditCardIcon className="size-5" />
    Card
  </WideNakedMenuAnchor>
}

export function CardAccountAddPage() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const close = useCloseContext().getOrThrow()

  const session = useSessionContext().getOrThrow()

  const [masked, setMasked] = useState(true)

  const [$title, setTitle] = useState("")

  const [$num, setNum] = useState("")
  const [$hol, setHol] = useState("")
  const [$exp, setExp] = useState("")
  const [$cvv, setCvv] = useState("")
  const [$pin, setPin] = useState("")

  const [$notes, setNotes] = useState("")

  const title = useDeferredValue($title || "Untitled")

  const [color, setColor] = useState<Nullable<string>>()

  const num = useDeferredValue($num)
  const hol = useDeferredValue($hol)
  const exp = useDeferredValue($exp)
  const cvv = useDeferredValue($cvv)
  const pin = useDeferredValue($pin)

  const notes = useDeferredValue($notes)

  const encryptOrThrow = useCallback(async () => {
    const { kdbx } = session.value

    const $file = kdbx.inner.content.value
    const $root = $file.getRootOrThrow()

    const $group = $root.getDirectGroupByIndexOrThrow(0)
    const $entry = $file.createEntryOrThrow()

    $entry.createStringOrThrow("Title", title)

    if (color)
      $entry.createStringOrThrow("Color", color)

    if (num)
      $entry.createStringOrThrow("CardNumber", num)

    if (hol)
      $entry.createStringOrThrow("CardHolder", hol)

    if (exp)
      $entry.createStringOrThrow("ExpiryDate", exp)

    if (cvv)
      $entry.createStringOrThrow("CVV", cvv, true)

    if (pin)
      $entry.createStringOrThrow("PIN", pin, true)

    if (notes)
      $entry.createStringOrThrow("Notes", notes)

    $group.element.appendChild($entry.element)

    return Writable.writeToBytesOrThrow(await kdbx.encryptOrThrow())
  }, [session, title, color, num, hol, exp, cvv, pin, notes])

  const writeOrAlert = useCallback(() => Promise.try(async () => {
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

  const saveOrAlert = useCallback(() => Promise.try(async () => {
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

    session.update()

    close()
  }).catch(Errors.display), [encryptOrThrow, close])

  const error = useMemo(() => {
    if (!num.length)
      return "Number is required"
    return
  }, [num])

  return <Fragment>
    <SubpathProvider value={hash}>
      {hash.url.pathname === "/color" &&
        <PathPaper>
          <ColorMenu ok={setColor} />
        </PathPaper>}
    </SubpathProvider>
    <div className="flex flex-col grow p-6">
      <h1 className="text-xl font-medium">
        Add card
      </h1>
      <div className="h-6" />
      <div className="flex items-center justify-center">
        <div className="w-[320px] aspect-video overflow-hidden flex flex-col bg-default text-default select-none p-4 rounded-xl
        data-[color=red]:bg-red-500/90
        data-[color=orange]:bg-orange-500/90
        data-[color=amber]:bg-amber-500/90
        data-[color=yellow]:bg-yellow-500/90
        data-[color=lime]:bg-lime-500/90
        data-[color=green]:bg-green-500/90
        data-[color=emerald]:bg-emerald-500/90
        data-[color=teal]:bg-teal-500/90
        data-[color=cyan]:bg-cyan-500/90
        data-[color=sky]:bg-sky-500/90
        data-[color=blue]:bg-blue-500/90
        data-[color=indigo]:bg-indigo-500/90
        data-[color=violet]:bg-violet-500/90
        data-[color=purple]:bg-purple-500/90
        data-[color=fuchsia]:bg-fuchsia-500/90
        data-[color=pink]:bg-pink-500/90
        data-[color=rose]:bg-rose-500/90"
          data-theme={color == null ? "opposite" : "dark"}
          data-color={color}>
          <div className="font-medium text-xl text-wrap wrap-anywhere truncate">
            {title}
          </div>
          <div className="h-4" />
          <div className="text-default-half-contrast text-wrap wrap-anywhere truncate">
            {num}
          </div>
          <div className="h-4 grow" />
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-default-contrast rounded-xl po-1 flex items-center gap-2">
              <Outline.CreditCardIcon className="size-5" />
              Card
            </div>
          </div>
        </div>
      </div>
      <form className="grow flex flex-col">
        <input className="hidden"
          autoComplete="off"
          name="username" />
        <div className="h-6" />
        <div className="font-medium">
          Title
        </div>
        <div className="text-default-contrast">
          A name to identify this account
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <Outline.TagIcon className="size-5" />
          <input className="w-full focus-visible:outline-none"
            autoComplete="off"
            placeholder="My Account"
            onChange={e => setTitle(e.target.value)}
            value={$title} />
          <div className="flex items-center gap-2">
            <ColorAnchor color={color} />
          </div>
        </div>
        <div className="h-6" />
        <div className="font-medium">
          Number
        </div>
        <div className="text-default-contrast">
          Your card number
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <Outline.HashtagIcon className="size-5" />
          <input className="w-full focus-visible:outline-none"
            autoComplete="off"
            placeholder="1234 5678 9012 3456"
            onChange={e => setNum(e.target.value)}
            value={$num} />
        </div>
        <div className="h-6" />
        <div className="font-medium">
          Holder
        </div>
        <div className="text-default-contrast">
          Your card holder name
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <Outline.UserIcon className="size-5" />
          <input className="w-full focus-visible:outline-none"
            autoComplete="off"
            placeholder="John Doe"
            onChange={e => setHol(e.target.value)}
            value={$hol} />
        </div>
        <div className="h-6" />
        <div className="font-medium">
          Expiry
        </div>
        <div className="text-default-contrast">
          Your card expiry date
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <Outline.CalendarIcon className="size-5" />
          <input className="w-full focus-visible:outline-none"
            autoComplete="off"
            placeholder="12/34"
            onChange={e => setExp(e.target.value)}
            value={$exp} />
        </div>
        <div className="h-6" />
        <div className="font-medium">
          CVV
        </div>
        <div className="text-default-contrast">
          Your card verification value
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <Outline.HashtagIcon className="size-5" />
          <input className="w-full focus-visible:outline-none"
            autoComplete="off"
            type={masked ? "password" : "text"}
            placeholder="123"
            onChange={e => setCvv(e.target.value)}
            value={$cvv} />
          <div className="flex items-center gap-2">
            <button className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none"
              type="button"
              onClick={() => setMasked(!masked)}>
              <InButton>
                {masked ? <Outline.EyeIcon className="size-5" /> : <Outline.EyeSlashIcon className="size-5" />}
              </InButton>
            </button>
          </div>
        </div>
        <div className="h-6" />
        <div className="font-medium">
          PIN
        </div>
        <div className="text-default-contrast">
          Your card personal identification number
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <Outline.HashtagIcon className="size-5" />
          <input className="w-full focus-visible:outline-none"
            autoComplete="off"
            type={masked ? "password" : "text"}
            placeholder="123456"
            onChange={e => setPin(e.target.value)}
            value={$pin} />
          <div className="flex items-center gap-2">
            <button className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none"
              type="button"
              onClick={() => setMasked(!masked)}>
              <InButton>
                {masked ? <Outline.EyeIcon className="size-5" /> : <Outline.EyeSlashIcon className="size-5" />}
              </InButton>
            </button>
          </div>
        </div>
        <div className="h-6" />
        <div className="font-medium">
          Notes
        </div>
        <div className="text-default-contrast">
          Any additional information
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex flex-col gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <textarea className="w-full resize-none focus-visible:outline-none"
            rows={6}
            placeholder="I use this account for..."
            onChange={e => setNotes(e.target.value)}
            value={$notes} />
        </div>
        <div className="h-8" />
        <div className="flex items-center flex-wrap-reverse gap-2">
          {session.value.user.fsfh != null &&
            <WideOppositeButton
              disabled={error != null}
              onClick={writeOrAlert}>
              {error != null ? error : "Save file"}
            </WideOppositeButton>}
          {session.value.user.fsfh == null &&
            <WideOppositeButton
              disabled={error != null}
              onClick={saveOrAlert}>
              {error != null ? error : "Save file"}
            </WideOppositeButton>}
        </div>
      </form>
    </div>
  </Fragment>
}