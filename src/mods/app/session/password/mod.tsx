import { InButton, WideOppositeButton } from "@/libs/button/mod.tsx";
import { useCopy } from "@/libs/copy/mod.ts";
import { PathPaper, WideNakedMenuAnchor } from "@/libs/dialog/paper/mod.tsx";
import { Errors } from "@/libs/errors/mod.ts";
import { Outline } from "@/libs/heroicons/mod.ts";
import { getEntryTitle } from "@/libs/kdbx/mod.ts";
import { Nullable } from "@/libs/nullable/mod.tsx";
import { useStoreContext } from "@/libs/store/mod.tsx";
import { useTotpCode } from "@/libs/totp/mod.ts";
import { Writable } from "@hazae41/binary";
import { SubpathProvider, useAnchorWithCoords, useHashSubpath, usePathContext } from "@hazae41/chemin";
import * as KDBX from "@hazae41/kdbx";
import { useCloseContext } from "@hazae41/react-close-context";
import React, { ChangeEvent, Fragment, useCallback, useMemo, useState } from "react";
import { InAnchor } from "../../../../libs/anchor/mod.tsx";
import { QrCode } from "../../../../libs/qrcode/mod.ts";
import { SessionAccountCard, useSessionContext } from "../mod.tsx";

React;

export function SessionPasswordAccountPage(props: { $entry: KDBX.Inner.KeePassFile.Entry }) {
  const { $entry } = props

  const [masked, setMasked] = useState(true)

  const username = useMemo(() => {
    return $entry.getDirectStringByKeyOrNull("UserName")?.getValueOrThrow().get()
  }, [$entry])

  const password = useMemo(() => {
    return $entry.getDirectStringByKeyOrNull("Password")?.getValueOrThrow().get()
  }, [$entry])

  const totpseed = useMemo(() => {
    return $entry.getDirectStringByKeyOrNull("otp")?.getValueOrThrow().get()
  }, [$entry])

  const totpcode = useTotpCode(totpseed)

  const notes = useMemo(() => {
    return $entry.getDirectStringByKeyOrNull("Notes")?.getValueOrThrow().get()
  }, [$entry])

  const copyTheUsername = useCopy(username)
  const copyThePassword = useCopy(password)
  const copyTheTotpcode = useCopy(totpcode)

  return <div className="flex flex-col grow p-6">
    <h1 className="text-xl font-medium">
      {getEntryTitle($entry) || "Untitled"}
    </h1>
    <div className="text-default-contrast">
      {$entry.getUuidOrThrow().getOrThrow().slice(0, 8).toUpperCase()}
    </div>
    <div className="h-6" />
    <div className="flex items-center justify-center">
      <SessionAccountCard $entry={$entry} />
    </div>
    <div className="grow" />
    {username && <Fragment>
      <div className="h-6" />
      <div className="font-medium">
        Username
      </div>
      <div className="text-default-contrast">
        Your username or email
      </div>
      <div className="h-4" />
      <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
        <Outline.AtSymbolIcon className="size-5" />
        <input className="w-full focus-visible:outline-none"
          readOnly
          onFocus={e => e.currentTarget.select()}
          value={username} />
        <div className="flex items-center gap-2">
          <button className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none transition-all"
            type="button"
            onClick={copyTheUsername.copyOrAlert}>
            <InButton>
              {copyTheUsername.copied ? <Outline.CheckIcon className="size-5" /> : <Outline.DocumentDuplicateIcon className="size-5" />}
            </InButton>
          </button>
        </div>
      </div>
    </Fragment>}
    {password && <Fragment>
      <div className="h-6" />
      <div className="font-medium">
        Password
      </div>
      <div className="text-default-contrast">
        Your password
      </div>
      <div className="h-4" />
      <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
        <Outline.LanguageIcon className="size-5" />
        <input className="w-full focus-visible:outline-none"
          readOnly
          onFocus={e => e.currentTarget.select()}
          type={masked ? "password" : "text"}
          value={password} />
        <div className="flex items-center gap-2">
          <button className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none transition-all"
            type="button"
            onClick={() => setMasked(!masked)}>
            <InButton>
              {masked ? <Outline.EyeIcon className="size-5" /> : <Outline.EyeSlashIcon className="size-5" />}
            </InButton>
          </button>
          <button className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none transition-all"
            type="button"
            onClick={copyThePassword.copyOrAlert}>
            <InButton>
              {copyThePassword.copied ? <Outline.CheckIcon className="size-5" /> : <Outline.DocumentDuplicateIcon className="size-5" />}
            </InButton>
          </button>
        </div>
      </div>
    </Fragment>}
    {totpseed && <Fragment>
      <div className="h-6" />
      <div className="font-medium">
        One-time passcode
      </div>
      <div className="text-default-contrast">
        Your time-based one-time passcode
      </div>
      <div className="h-4" />
      <input className="p-8 rounded-xl bg-default-contrast text-center focus-visible:outline-none text-6xl font-mono tracking-widest"
        readOnly
        onClick={copyTheTotpcode.copyOrAlert}
        value={totpcode ? (copyTheTotpcode.copied ? "COPIED" : totpcode) : "------"} />
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
      <div className="bg-default-contrast po-2 rounded-xl gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
        <textarea className="w-full resize-none focus-visible:outline-none"
          readOnly
          rows={6}
          value={notes} />
      </div>
    </Fragment>}
  </div>
}

export function SessionPasswordAddAnchor() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, "/password")

  return <WideNakedMenuAnchor
    href={coords.url.hash}
    onClick={coords.onClick}
    onKeyDown={coords.onKeyDown}>
    <Outline.LanguageIcon className="size-5" />
    Password
  </WideNakedMenuAnchor>
}

export function SessionPasswordAddPage() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const close = useCloseContext().getOrThrow()
  const store = useStoreContext().getOrThrow()

  const session = useSessionContext().getOrThrow()

  const [rawtitle, setRawTitle] = useState("")

  const title = rawtitle || "Untitled"

  const [color, setColor] = useState<Nullable<string>>()

  const [masked, setMasked] = useState<boolean>(true)

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [totpseed, setTotpSeed] = useState("")

  const totpcode = useTotpCode(totpseed)

  const [notes, setNotes] = useState("")

  const copyTheTotpcode = useCopy(totpcode)

  const encryptOrThrow = useCallback(async () => {
    const kdbx = session.value.kdbx

    const $file = kdbx.inner.content.value
    const $root = $file.getRootOrThrow()

    const $group = $root.getDirectGroupByIndexOrThrow(0)
    const $entry = $file.createEntryOrThrow()

    $entry.createStringOrThrow("Title", title)

    if (username)
      $entry.createStringOrThrow("UserName", username)

    if (password)
      $entry.createStringOrThrow("Password", password, true)

    if (notes)
      $entry.createStringOrThrow("Notes", notes)

    if (totpseed)
      $entry.createStringOrThrow("otp", totpseed, true)

    $group.element.appendChild($entry.element)

    return Writable.writeToBytesOrThrow(await kdbx.encryptOrThrow())
  }, [session, title, username, password, totpseed, notes])

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
  }).catch(Errors.display), [store, encryptOrThrow, close])

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
  }).catch(Errors.display), [store, encryptOrThrow, close])

  const error = useMemo(() => {
    return
  }, [])

  const onTotpQrcodeChange = useCallback((e: ChangeEvent<HTMLInputElement>) => Promise.try(async () => {
    const file = e.target.files?.item(0)

    if (file == null)
      return

    const content = await QrCode.decodeFileOrNull(file)

    if (content == null)
      throw new Error("Could not find QR code")

    setTotpSeed(content)
  }).catch(Errors.display), [])

  return <Fragment>
    <SubpathProvider value={hash}>
      {hash.url.pathname === "/password" &&
        <PathPaper>
          <div className="flex flex-col text-left gap-2">

          </div>
        </PathPaper>}
      {hash.url.pathname === "/password/alphanumeric" &&
        <PathPaper>
          <div className="flex flex-col text-left gap-2">

          </div>
        </PathPaper>}
      {hash.url.pathname === "/password/correcthorse" &&
        <PathPaper>

        </PathPaper>}
    </SubpathProvider>
    <div className="flex flex-col grow p-6">
      <h1 className="text-xl font-medium">
        Add password
      </h1>
      <div className="h-6" />
      <div className="flex items-center justify-center">
        <div className="w-80 aspect-video flex flex-col bg-default text-default select-none data-[color=red]:bg-red-500/90 data-[color=blue]:bg-blue-500/90 data-[color=3]:bg-green-500/90 p-4 rounded-xl"
          data-theme={color == null ? "opposite" : "dark"}
          data-color={color}>
          <div className="font-medium text-xl text-wrap wrap-anywhere">
            {title}
          </div>
          <div className="h-4" />
          <div className="text-default-half-contrast text-wrap wrap-anywhere">
            {username}
          </div>
          <div className="h-4 grow" />
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-default-contrast rounded-xl po-1 flex items-center gap-2">
              <Outline.LanguageIcon className="size-5" />
              Password
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
            onChange={e => setRawTitle(e.target.value)}
            value={rawtitle} />
        </div>
        <div className="h-6" />
        <div className="font-medium">
          Username
        </div>
        <div className="text-default-contrast">
          Your username or email
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <Outline.AtSymbolIcon className="size-5" />
          <input className="w-full focus-visible:outline-none"
            autoComplete="off"
            placeholder="john.doe@mail.com"
            onChange={e => setUsername(e.target.value)}
            value={username} />
        </div>
        <div className="h-6" />
        <div className="font-medium">
          Password
        </div>
        <div className="text-default-contrast">
          Your password
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <Outline.LanguageIcon className="size-5" />
          <input className="w-full focus-visible:outline-none"
            autoComplete="off"
            type={masked ? "password" : "text"}
            onChange={e => setPassword(e.target.value)}
            value={password} />
          <div className="flex items-center gap-2">
            <button className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none transition-all"
              type="button"
              onClick={() => setMasked(!masked)}>
              <InButton>
                {masked ? <Outline.EyeIcon className="size-5" /> : <Outline.EyeSlashIcon className="size-5" />}
              </InButton>
            </button>
            <a className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none transition-all">
              <InAnchor>
                <Outline.SparklesIcon className="size-5" />
              </InAnchor>
            </a>
          </div>
        </div>
        <div className="h-6" />
        <div className="font-medium">
          One-time passcode
        </div>
        <div className="text-default-contrast">
          Your time-based one-time passcode
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <Outline.HashtagIcon className="size-5" />
          <input className="w-full focus-visible:outline-none"
            autoComplete="off"
            type={masked ? "password" : "text"}
            placeholder="JBSWY3DPEHPK3PXP or otpauth://totp/..."
            onChange={e => setTotpSeed(e.target.value)}
            value={totpseed} />
          <div className="flex items-center gap-2">
            <button className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none transition-all"
              type="button"
              onClick={() => setMasked(!masked)}>
              <InButton>
                {masked ? <Outline.EyeIcon className="size-5" /> : <Outline.EyeSlashIcon className="size-5" />}
              </InButton>
            </button>
            <div className="group relative rounded-full p-1 [&:has(:hover)]:bg-default-double-contrast [&:has(:focus-visible)]:bg-default-double-contrast [&:has(:focus-visible)]:outline-none transition-all">
              <input className="absolute z-10 inset-0 opacity-0 cursor-pointer"
                type="file"
                accept="image/*"
                onChange={onTotpQrcodeChange} />
              <InAnchor>
                <Outline.QrCodeIcon className="size-5" />
              </InAnchor>
            </div>
          </div>
        </div>
        <div className="h-4" />
        <input className="p-8 rounded-xl bg-default-contrast text-center focus-visible:outline-none text-6xl font-mono tracking-widest"
          readOnly
          onClick={copyTheTotpcode.copyOrAlert}
          value={totpcode ? (copyTheTotpcode.copied ? "COPIED" : totpcode) : "------"} />
        <div className="h-6" />
        <div className="font-medium">
          Notes
        </div>
        <div className="text-default-contrast">
          Any additional information
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <textarea className="w-full resize-none focus-visible:outline-none"
            rows={6}
            autoComplete="off"
            placeholder="I use this account for..."
            onChange={e => setNotes(e.target.value)}
            value={notes} />
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