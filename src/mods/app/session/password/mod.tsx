import { InAnchor } from "@/libs/anchor/mod.tsx";
import { InButton, WideOppositeButton } from "@/libs/button/mod.tsx";
import { useCopy } from "@/libs/copy/mod.ts";
import { Errors } from "@/libs/errors/mod.ts";
import { Outline } from "@/libs/heroicons/mod.ts";
import { getEntryTitle } from "@/libs/kdbx/mod.ts";
import { PathMenu, WideNakedMenuAnchor } from "@/libs/menu/mod.tsx";
import { Nullable } from "@/libs/nullable/mod.tsx";
import { useStoreContext } from "@/libs/store/mod.tsx";
import { Totp } from "@/libs/totp/mod.ts";
import { Writable } from "@hazae41/binary";
import { SubpathProvider, useAnchorWithCoords, useHashSubpath, usePathContext } from "@hazae41/chemin";
import * as KDBX from "@hazae41/kdbx";
import { useCloseContext } from "@hazae41/react-close-context";
import { Result } from "@hazae41/result-and-option";
import React, { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { SessionAccountCard, useSessionContext } from "../mod.tsx";

React;

export function SessionPasswordAccountWindow(props: { $entry: KDBX.Inner.KeePassFile.Entry }) {
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

  const totp = useMemo(() => {
    if (totpseed == null)
      return
    if (!totpseed.length)
      return

    const generator = Result.runAndWrapSync(() => {
      return Totp.parseOrThrow(totpseed)
    }).getOrNull()

    return generator
  }, [totpseed])

  const [totpcode, setTotpcode] = useState<Nullable<string>>()

  useEffect(() => {
    if (totp == null)
      return

    const interval = setInterval(async () => {
      setTotpcode(await totp.generate())
    }, 1000)

    return () => clearInterval(interval)
  }, [totp])

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
    <div className="h-4" />
    <div className="flex items-center justify-center py-4">
      <SessionAccountCard $entry={$entry} />
    </div>
    <div className="h-4 grow" />
    {username != null && <Fragment>
      <div className="font-medium">
        Username
      </div>
      <div className="text-default-contrast">
        Your username or email for this account
      </div>
      <div className="h-2" />
      <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-default-contrast">
        <Outline.AtSymbolIcon className="size-5" />
        <input className="w-full focus:outline-none"
          readOnly
          onFocus={e => e.currentTarget.select()}
          value={username} />
        <div className="flex items-center gap-2">
          <button className="group rounded-full p-1 hover:bg-default-double-contrast focus:bg-default-double-contrast focus:outline-none transition-opacity"
            type="button"
            onClick={copyTheUsername.copyOrAlert}>
            <InButton>
              {copyTheUsername.copied ? <Outline.CheckIcon className="size-5" /> : <Outline.DocumentDuplicateIcon className="size-5" />}
            </InButton>
          </button>
        </div>
      </div>
      <div className="h-4" />
    </Fragment>}
    {password != null && <Fragment>
      <div className="font-medium">
        Password
      </div>
      <div className="text-default-contrast">
        Your password for this account
      </div>
      <div className="h-2" />
      <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-default-contrast">
        <Outline.LanguageIcon className="size-5" />
        <input className="w-full focus:outline-none"
          readOnly
          onFocus={e => e.currentTarget.select()}
          type={masked ? "password" : "text"}
          value={password} />
        <div className="flex items-center gap-2">
          <button className="group rounded-full p-1 hover:bg-default-double-contrast focus:bg-default-double-contrast focus:outline-none transition-opacity"
            type="button"
            onClick={() => setMasked(!masked)}>
            <InButton>
              {masked ? <Outline.EyeIcon className="size-5" /> : <Outline.EyeSlashIcon className="size-5" />}
            </InButton>
          </button>
          <button className="group rounded-full p-1 hover:bg-default-double-contrast focus:bg-default-double-contrast focus:outline-none transition-opacity"
            type="button"
            onClick={copyThePassword.copyOrAlert}>
            <InButton>
              {copyThePassword.copied ? <Outline.CheckIcon className="size-5" /> : <Outline.DocumentDuplicateIcon className="size-5" />}
            </InButton>
          </button>
        </div>
      </div>
    </Fragment>}
    {totpseed != null && <Fragment>
      <div className="h-4" />
      <div className="font-medium">
        One-time passcode
      </div>
      <div className="text-default-contrast">
        Your second-factor time-based one-time passcode for this account
      </div>
      <div className="h-2" />
      <input className="p-8 rounded-xl bg-default-contrast text-center focus:outline-none text-6xl font-mono tracking-widest"
        readOnly
        onClick={copyTheTotpcode.copyOrAlert}
        value={totpcode ? (copyTheTotpcode.copied ? "COPIED" : totpcode) : "------"} />
    </Fragment>}
  </div>
}

export function SessionPasswordAddAnchor() {
  const path = usePathContext().getOrThrow()

  const coords = useAnchorWithCoords(path, "/add/password")

  return <WideNakedMenuAnchor
    href={coords.url.hash}
    onClick={coords.onClick}
    onKeyDown={coords.onKeyDown}>
    Password
  </WideNakedMenuAnchor>
}

export function SessionPasswordAddWindow() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const close = useCloseContext().getOrThrow()
  const store = useStoreContext().getOrThrow()

  const session = useSessionContext().getOrThrow()

  const [title, setTitle] = useState("")
  const [color, setColor] = useState<Nullable<string>>()

  const [masked, setMasked] = useState<boolean>(true)

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [totpseed, setTotpseed] = useState("")

  const totp = useMemo(() => {
    if (!totpseed.length)
      return

    const generator = Result.runAndWrapSync(() => {
      return Totp.parseOrThrow(totpseed)
    }).getOrNull()

    return generator
  }, [totpseed])

  const [totpcode, setTotpcode] = useState<Nullable<string>>()

  useEffect(() => {
    if (totp == null)
      return

    const interval = setInterval(async () => {
      setTotpcode(await totp.generate())
    }, 1000)

    return () => clearInterval(interval)
  }, [totp])

  const copyTheTotpcode = useCopy(totpcode)

  const encryptOrThrow = useCallback(async () => {
    const kdbx = session.value.kdbx

    const $file = kdbx.inner.content.value
    const $root = $file.getRootOrThrow()

    const $group = $root.getDirectGroupByIndexOrThrow(0)
    const $entry = $file.createEntryOrThrow()

    $entry.createStringOrThrow("Title", title)
    $entry.createStringOrThrow("UserName", username)
    $entry.createStringOrThrow("Password", password, true)

    if (totp != null)
      $entry.createStringOrThrow("otp", totp.url.toString(), true)

    $group.element.appendChild($entry.element)

    return Writable.writeToBytesOrThrow(await kdbx.encryptOrThrow())
  }, [session, title, username, password, totpseed])

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
    if (!title.length)
      return "Title is required"
    if (!password.length)
      return "Password is required"
    return
  }, [title, password])

  return <Fragment>
    <SubpathProvider value={hash}>
      {hash.url.pathname === "/password" &&
        <PathMenu>
          <div className="flex flex-col text-left gap-2">

          </div>
        </PathMenu>}
      {hash.url.pathname === "/password/alphanumeric" &&
        <PathMenu>
          <div className="flex flex-col text-left gap-2">

          </div>
        </PathMenu>}
      {hash.url.pathname === "/password/correcthorse" &&
        <PathMenu>

        </PathMenu>}
    </SubpathProvider>
    <div className="flex flex-col grow p-6">
      <h1 className="text-xl font-medium">
        Add password
      </h1>
      <div className="h-4" />
      <div className="flex items-center justify-center py-4">
        <div className="w-80 aspect-video flex flex-col bg-default text-default selection-default data-[color=red]:bg-red-500/90 data-[color=blue]:bg-blue-500/90 data-[color=3]:bg-green-500/90 p-4 rounded-xl"
          data-theme={color == null ? "opposite" : "dark"}
          data-color={color}>
          <div className="font-medium text-xl text-wrap wrap-anywhere">
            {title || "Untitled"}
          </div>
          <div className="h-2" />
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
      <div className="h-4 grow" />
      <div className="font-medium">
        Title
      </div>
      <div className="text-default-contrast">
        A name to identify this account
      </div>
      <div className="h-2" />
      <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-default-contrast">
        <Outline.TagIcon className="size-5" />
        <input className="w-full focus:outline-none"
          placeholder="My Account"
          onChange={e => setTitle(e.target.value)}
          value={title} />
      </div>
      <div className="h-4" />
      <div className="font-medium">
        Username
      </div>
      <div className="text-default-contrast">
        Your username or email for this account
      </div>
      <div className="h-2" />
      <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-default-contrast">
        <Outline.AtSymbolIcon className="size-5" />
        <input className="w-full focus:outline-none"
          placeholder="john.doe@mail.com"
          onChange={e => setUsername(e.target.value)}
          value={username} />
      </div>
      <div className="h-4" />
      <div className="font-medium">
        Password
      </div>
      <div className="text-default-contrast">
        Your password for this account
      </div>
      <div className="h-2" />
      <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-default-contrast">
        <Outline.LanguageIcon className="size-5" />
        <input className="w-full focus:outline-none"
          type={masked ? "password" : "text"}
          placeholder={masked ? "••••••••••••••••••••••••" : "u#fH@WMNn3BY7LFzaR$B4GBM"}
          onChange={e => setPassword(e.target.value)}
          value={password} />
        <div className="flex items-center gap-2">
          <button className="group rounded-full p-1 hover:bg-default-double-contrast focus:bg-default-double-contrast focus:outline-none transition-opacity"
            type="button"
            onClick={() => setMasked(!masked)}>
            <InButton>
              {masked ? <Outline.EyeIcon className="size-5" /> : <Outline.EyeSlashIcon className="size-5" />}
            </InButton>
          </button>
          <a className="group rounded-full p-1 hover:bg-default-double-contrast focus:bg-default-double-contrast focus:outline-none transition-opacity">
            <InAnchor>
              <Outline.SparklesIcon className="size-5" />
            </InAnchor>
          </a>
        </div>
      </div>
      <div className="h-4" />
      <div className="font-medium">
        One-time passcode
      </div>
      <div className="text-default-contrast">
        Your second-factor time-based one-time passcode seed for this account
      </div>
      <div className="h-2" />
      <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-default-contrast">
        <Outline.HashtagIcon className="size-5" />
        <input className="w-full focus:outline-none"
          type={masked ? "password" : "text"}
          placeholder={masked ? "••••••••••••••••••••••••••••••••" : "MQCHJLS6FJXT2BGQJ6QMG3WCAVUC2HJZ"}
          onChange={e => setTotpseed(e.target.value)}
          value={totpseed} />
        <div className="flex items-center gap-2">
          <button className="group rounded-full p-1 hover:bg-default-double-contrast focus:bg-default-double-contrast focus:outline-none transition-opacity"
            type="button"
            onClick={() => setMasked(!masked)}>
            <InButton>
              {masked ? <Outline.EyeIcon className="size-5" /> : <Outline.EyeSlashIcon className="size-5" />}
            </InButton>
          </button>
          <a className="group rounded-full p-1 hover:bg-default-double-contrast focus:bg-default-double-contrast focus:outline-none transition-opacity">
            <InAnchor>
              <Outline.QrCodeIcon className="size-5" />
            </InAnchor>
          </a>
        </div>
      </div>
      <div className="h-2" />
      <input className="p-8 rounded-xl bg-default-contrast text-center focus:outline-none text-6xl font-mono tracking-widest"
        readOnly
        onClick={copyTheTotpcode.copyOrAlert}
        value={totpcode ? (copyTheTotpcode.copied ? "COPIED" : totpcode) : "------"} />
      <div className="h-4" />
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
    </div>
  </Fragment>
}