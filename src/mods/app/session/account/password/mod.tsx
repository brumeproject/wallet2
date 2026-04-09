import { InAnchor } from "@/libs/anchor/mod.tsx";
import { InButton, WideOppositeButton } from "@/libs/button/mod.tsx";
import { useCopy } from "@/libs/copy/mod.ts";
import { PathPaper, WideNakedMenuAnchor, WideNakedMenuButton } from "@/libs/dialog/paper/mod.tsx";
import { Errors } from "@/libs/errors/mod.ts";
import { Events } from "@/libs/events/mod.ts";
import { Outline } from "@/libs/heroicons/mod.ts";
import { getRecycleBinOrNull } from "@/libs/kdbx/mod.ts";
import { Nullable } from "@/libs/nullable/mod.ts";
import { QrCode } from "@/libs/qrcode/mod.ts";
import { capitalize } from "@/libs/string/mod.ts";
import { useTotpCode } from "@/libs/totp/mod.ts";
import { Writable } from "@hazae41/binary";
import { MoneroSeedPhrase } from "@hazae41/broca";
import { SubpathProvider, useAnchorWithCoords, useHashSubpath, usePathContext } from "@hazae41/chemin";
import * as KDBX from "@hazae41/kdbx";
import { useCloseContext } from "@hazae41/react-close-context";
import React, { ChangeEvent, Fragment, useCallback, useDeferredValue, useMemo, useState } from "react";
import { useSessionContext } from "../../mod.tsx";
import { AccountMenuAnchor, AccountMenuDeleteButton, AccountMenuTrashButton, AccountMenuUntrashButton, ColorAnchor, ColorMenu, PasswordAccountCard } from "../mod.tsx";

React;

export function PasswordAccountPage(props: { $entry: KDBX.Inner.KeePassFile.Entry }) {
  const { $entry } = props

  const close = useCloseContext().getOrThrow()

  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const session = useSessionContext().getOrThrow()

  const [flipped, setFlipped] = useState(false)

  const title = useMemo(() => {
    return $entry.getStringByKeyOrNull("Title")?.getValueOrThrow().get()
  }, [$entry])

  const color = useMemo(() => {
    return $entry.getStringByKeyOrNull("Color")?.getValueOrThrow().get()
  }, [$entry])

  const trashed = useMemo(() => {
    const { kdbx } = session.value

    const $file = kdbx.inner.content.value
    const $trash = getRecycleBinOrNull($file)

    if ($trash == null)
      return false

    return $trash.element.contains($entry.element)
  }, [session, $entry])

  const username = useMemo(() => {
    return $entry.getStringByKeyOrNull("UserName")?.getValueOrThrow().get()
  }, [$entry])

  const password = useMemo(() => {
    return $entry.getStringByKeyOrNull("Password")?.getValueOrThrow().get()
  }, [$entry])

  const totpseed = useMemo(() => {
    return $entry.getStringByKeyOrNull("otp")?.getValueOrThrow().get()
  }, [$entry])

  const totpcode = useTotpCode(totpseed)

  const notes = useMemo(() => {
    return $entry.getStringByKeyOrNull("Notes")?.getValueOrThrow().get()
  }, [$entry])

  const copyTheUsername = useCopy(username)
  const copyThePassword = useCopy(password)
  const copyTheTotpcode = useCopy(totpcode)

  return <Fragment>
    <SubpathProvider value={hash}>
      {hash.url.pathname === "/+" &&
        <PathPaper>
          <div className="flex flex-col text-left gap-2">
            {/* <WideNakedMenuButton>
              <Outline.PencilIcon className="size-5" />
              Edit
            </WideNakedMenuButton> */}
            {trashed === false && <AccountMenuTrashButton $entry={$entry} close={close} />}
            {trashed === true && <AccountMenuUntrashButton $entry={$entry} close={close} />}
            {trashed === true && <AccountMenuDeleteButton $entry={$entry} close={close} />}
          </div>
        </PathPaper>}
    </SubpathProvider>
    <div className="flex flex-col grow p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium">
          Password account
        </h1>
        <AccountMenuAnchor />
      </div>
      <div className="h-6" />
      <div className="flex items-center justify-center">
        <PasswordAccountCard
          title={title}
          color={color}
          username={username}
          flip={flipped}
          onFlipChange={setFlipped} />
      </div>
      <form className="grow flex flex-col"
        onSubmit={Events.preventDefault}>
        <input className="hidden"
          autoComplete="off"
          name="username" />
        {username && <Fragment>
          <div className="h-6" />
          <div className="font-medium">
            Username
          </div>
          <div className="text-default-contrast">
            Your username or email.
          </div>
          <div className="h-4" />
          <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
            <input className="w-full focus-visible:outline-none"
              readOnly
              autoComplete="off"
              onFocus={e => e.currentTarget.select()}
              value={username} />
            <div className="flex items-center gap-2">
              <button className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none"
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
            Your password.
          </div>
          <div className="h-4" />
          <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
            <input className="w-full focus-visible:outline-none"
              readOnly
              autoComplete="off"
              onFocus={e => e.currentTarget.select()}
              type={flipped ? "text" : "password"}
              value={password} />
            <div className="flex items-center gap-2">
              <button className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none"
                type="button"
                onClick={() => setFlipped(x => !x)}>
                <InButton>
                  {flipped ? <Outline.EyeSlashIcon className="size-5" /> : <Outline.EyeIcon className="size-5" />}
                </InButton>
              </button>
              <button className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none"
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
            Your time-based one-time passcode.
          </div>
          <div className="h-4" />
          <input className="p-8 rounded-xl bg-default-contrast text-center focus-visible:outline-none text-6xl font-mono tracking-widest"
            readOnly
            autoComplete="off"
            onClick={copyTheTotpcode.copyOrAlert}
            value={totpcode ? (copyTheTotpcode.copied ? "COPIED" : totpcode) : "------"} />
        </Fragment>}
        {notes && <Fragment>
          <div className="h-6" />
          <div className="font-medium">
            Notes
          </div>
          <div className="text-default-contrast">
            Any additional information.
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
  </Fragment>
}



export function PasswordAccountAddMenuAnchor() {
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

export function PasswordMenuAnchor() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, "/password")

  return <a className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none"
    href={coords.url.hash}
    onClick={coords.onClick}
    onKeyDown={coords.onKeyDown}>
    <InAnchor>
      <Outline.SparklesIcon className="size-5" />
    </InAnchor>
  </a>
}

export function PasswordMenu(props: { value: string } & { onChange(value: string): void }) {
  const { value, onChange } = props

  const [password, setPassword] = [value, onChange]

  const onDigicodeClick = useCallback(() => Promise.try(() => {
    const random = Array.from(crypto.getRandomValues(new Uint8Array(8)))
    const result = random.map(x => (x % 10).toString()).join("")

    setPassword(result)
  }).catch(Errors.display), [])

  const onPasswordClick = useCallback(() => Promise.try(() => {
    const source = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}|;:,.<>?/~`"

    const random = Array.from(crypto.getRandomValues(new Uint8Array(24)))
    const result = random.map(x => source.charAt(x % source.length)).join("")

    setPassword(result)
  }).catch(Errors.display), [])

  const onPassphraseClick = useCallback(() => Promise.try(() => {
    const source = MoneroSeedPhrase.generate().split(" ").slice(0, 4)

    const random = crypto.getRandomValues(new Uint8Array(1))[0]
    const result = source.map((x, i) => capitalize(x) + (i === (random % 4) ? (random % 10) : "")).join(" ")

    return setPassword(result)
  }).catch(Errors.display), [])

  return <div className="flex flex-col text-left gap-2">
    <WideNakedMenuButton
      onClick={onDigicodeClick}>
      <Outline.HashtagIcon className="size-5" />
      Digicode
    </WideNakedMenuButton>
    <WideNakedMenuButton
      onClick={onPasswordClick}>
      <Outline.LanguageIcon className="size-5" />
      Password
    </WideNakedMenuButton>
    <WideNakedMenuButton
      onClick={onPassphraseClick}>
      <Outline.ChatBubbleOvalLeftEllipsisIcon className="size-5" />
      Passphrase
    </WideNakedMenuButton>
  </div>
}

export function PasswordAccountAddPage() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const close = useCloseContext().getOrThrow()

  const session = useSessionContext().getOrThrow()

  const [flipped, setFlipped] = useState(false)

  const seedword = useMemo(() => {
    return capitalize(MoneroSeedPhrase.generate().split(" ")[0])
  }, [])

  const [$title, setTitle] = useState("")

  const [$username, setUsername] = useState("")
  const [$password, setPassword] = useState("")
  const [$totpseed, setTotpSeed] = useState("")

  const [$notes, setNotes] = useState("")

  const title = useDeferredValue($title || seedword)

  const [color, setColor] = useState<Nullable<string>>(["red", "orange", "amber", "yellow", "lime", "green", "emerald", "teal", "cyan", "sky", "blue", "indigo", "violet", "purple", "fuchsia", "pink", "rose"][Math.floor(Math.random() * 16)])

  const username = useDeferredValue($username)
  const password = useDeferredValue($password)
  const totpseed = useDeferredValue($totpseed)
  const totpcode = useTotpCode(totpseed)

  const notes = useDeferredValue($notes)

  const copyTheTotpcode = useCopy(totpcode)

  const encryptOrThrow = useCallback(async () => {
    const { kdbx, comp } = session.value

    const $file = kdbx.inner.content.value
    const $root = $file.getRootOrThrow()

    const $group = $root.getDirectGroupByIndexOrThrow(0)
    const $entry = $group.addEntryOrThrow()

    $entry.addStringOrThrow("Title", title)

    if (color)
      $entry.addStringOrThrow("Color", color)

    if (username)
      $entry.addStringOrThrow("UserName", username)

    if (password)
      $entry.addStringOrThrow("Password", password, true)

    if (notes)
      $entry.addStringOrThrow("Notes", notes)

    if (totpseed)
      $entry.addStringOrThrow("otp", totpseed, true)

    return Writable.writeToBytesOrThrow(await kdbx.encryptOrThrow(comp))
  }, [session, title, color, username, password, totpseed, notes])

  const encryptAndWriteOrAlert = useCallback(() => Promise.try(async () => {
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

  const encryptAndSaveOrAlert = useCallback(() => Promise.try(async () => {
    const content = await encryptOrThrow()

    const file = new File([content], "wallet.kdbx", { type: "application/kdbx" })

    if (/iPad|iPhone|iPod/.test(navigator.platform) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) {
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
      {hash.url.pathname === "/color" &&
        <PathPaper>
          <ColorMenu ok={setColor} />
        </PathPaper>}
      {hash.url.pathname === "/password" &&
        <PathPaper>
          <PasswordMenu value={password} onChange={setPassword} />
        </PathPaper>}
    </SubpathProvider>
    <div className="flex flex-col grow p-6">
      <h1 className="text-xl font-medium">
        Add password account
      </h1>
      <div className="h-6" />
      <div className="flex items-center justify-center">
        <PasswordAccountCard
          title={title}
          color={color}
          username={username}
          flip={flipped}
          onFlipChange={setFlipped} />
      </div>
      <form className="grow flex flex-col"
        onSubmit={Events.preventDefault}>
        <input className="hidden"
          autoComplete="off"
          name="username" />
        <div className="h-6" />
        <div className="font-medium">
          Title
        </div>
        <div className="text-default-contrast">
          A name to identify this account.
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <input className="w-full focus-visible:outline-none"
            autoComplete="off"
            placeholder={seedword}
            onChange={e => setTitle(e.target.value)}
            value={$title} />
          <div className="flex items-center gap-2">
            <ColorAnchor color={color} />
          </div>
        </div>
        <div className="h-6" />
        <div className="font-medium">
          Username
        </div>
        <div className="text-default-contrast">
          Your username or email.
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <input className="w-full focus-visible:outline-none"
            autoComplete="off"
            placeholder="john.doe@mail.com"
            onChange={e => setUsername(e.target.value)}
            value={$username} />
        </div>
        <div className="h-6" />
        <div className="font-medium">
          Password
        </div>
        <div className="text-default-contrast">
          Your password.
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <input className="w-full focus-visible:outline-none"
            autoComplete="off"
            type={flipped ? "text" : "password"}
            onChange={e => setPassword(e.target.value)}
            value={$password} />
          <div className="flex items-center gap-2">
            <button className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none"
              type="button"
              onClick={() => setFlipped(x => !x)}>
              <InButton>
                {flipped ? <Outline.EyeSlashIcon className="size-5" /> : <Outline.EyeIcon className="size-5" />}
              </InButton>
            </button>
            <PasswordMenuAnchor />
          </div>
        </div>
        <div className="h-6" />
        <div className="font-medium">
          One-time passcode
        </div>
        <div className="text-default-contrast">
          Your time-based one-time passcode.
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <input className="w-full focus-visible:outline-none"
            autoComplete="off"
            type={flipped ? "text" : "password"}
            placeholder="otpauth://..."
            onChange={e => setTotpSeed(e.target.value)}
            value={$totpseed} />
          <div className="flex items-center gap-2">
            <button className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none"
              type="button"
              onClick={() => setFlipped(x => !x)}>
              <InButton>
                {flipped ? <Outline.EyeSlashIcon className="size-5" /> : <Outline.EyeIcon className="size-5" />}
              </InButton>
            </button>
            <div className="group relative rounded-full p-1 [&:has(:hover)]:bg-default-double-contrast [&:has(:focus-visible)]:bg-default-double-contrast [&:has(:focus-visible)]:outline-none">
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
        <div className="h-2" />
        <input className="p-8 rounded-xl bg-default-contrast text-center focus-visible:outline-none text-6xl font-mono tracking-widest"
          readOnly
          onClick={copyTheTotpcode.copyOrAlert}
          value={totpcode ? (copyTheTotpcode.copied ? "COPIED" : totpcode) : "------"} />
        <div className="h-6" />
        <div className="font-medium">
          Notes
        </div>
        <div className="text-default-contrast">
          Any additional information.
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
              type="button"
              disabled={error != null}
              onClick={encryptAndWriteOrAlert}>
              {error != null ? error : "Save"}
            </WideOppositeButton>}
          {session.value.user.fsfh == null &&
            <WideOppositeButton
              type="button"
              disabled={error != null}
              onClick={encryptAndSaveOrAlert}>
              {error != null ? error : "Save"}
            </WideOppositeButton>}
        </div>
      </form>
    </div>
  </Fragment>
}