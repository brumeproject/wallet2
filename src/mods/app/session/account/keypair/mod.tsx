import { InAnchor } from "@/libs/anchor/mod.tsx";
import { InButton, WideContrastButton, WideOppositeButton } from "@/libs/button/mod.tsx";
import { useCopy } from "@/libs/copy/mod.ts";
import { PathPaper, WideNakedMenuAnchor } from "@/libs/dialog/paper/mod.tsx";
import { Errors } from "@/libs/errors/mod.ts";
import { Events } from "@/libs/events/mod.ts";
import { Outline } from "@/libs/heroicons/mod.ts";
import { getRecycleBinOrNull } from "@/libs/kdbx/mod.ts";
import { Nullable } from "@/libs/nullable/mod.ts";
import { QrCode } from "@/libs/qrcode/mod.ts";
import { capitalize } from "@/libs/string/mod.ts";
import { useTotpCode } from "@/libs/totp/mod.ts";
import { PasswordMenu, PasswordMenuAnchor } from "@/mods/app/session/account/password/mod.tsx";
import { Writable } from "@hazae41/binary";
import { MoneroSeedPhrase } from "@hazae41/broca";
import { SubpathProvider, useAnchorWithCoords, useHashSubpath, usePathContext } from "@hazae41/chemin";
import * as KDBX from "@hazae41/kdbx";
import { useCloseContext } from "@hazae41/react-close-context";
import React, { ChangeEvent, Fragment, useCallback, useDeferredValue, useMemo, useState } from "react";
import { useSessionContext } from "../../mod.tsx";
import { AccountMenuAnchor, AccountMenuDeleteButton, AccountMenuTrashButton, AccountMenuUntrashButton, ColorAnchor, ColorMenu, KeypairAccountCard } from "../mod.tsx";

React;

export function KeypairAccountPage(props: { $entry: KDBX.Inner.KeePassFile.Entry }) {
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

  const pubkey = useMemo(() => {
    return $entry.getStringByKeyOrNull("PublicKey")?.getValueOrThrow().get()
  }, [$entry])

  const sigkey = useMemo(() => {
    return $entry.getStringByKeyOrNull("PrivateKey")?.getValueOrThrow().get()
  }, [$entry])

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

  const copyThePubKey = useCopy(pubkey)
  const copyTheSigKey = useCopy(sigkey)
  const copyTheUsername = useCopy(username)
  const copyThePassword = useCopy(password)
  const copyTheTotpcode = useCopy(totpcode)

  const savePubKeyOrAlert = useCallback(() => Promise.try(async () => {
    const content = pubkey || ""

    const file = new File([content], "key.pub", { type: "application/octet-stream" })

    if (/iPad|iPhone|iPod/.test(navigator.platform)) {
      await navigator.share({ files: [file] })
    } else {
      const url = URL.createObjectURL(file)

      const a = document.createElement("a") as HTMLAnchorElement
      a.href = url
      a.download = "key.pub"

      document.body.appendChild(a)

      a.click()

      document.body.removeChild(a)

      URL.revokeObjectURL(url)
    }
  }).catch(Errors.display), [pubkey])

  const saveSigKeyOrAlert = useCallback(() => Promise.try(async () => {
    const content = sigkey || ""

    const file = new File([content], "key", { type: "application/octet-stream" })

    if (/iPad|iPhone|iPod/.test(navigator.platform)) {
      await navigator.share({ files: [file] })
    } else {
      const url = URL.createObjectURL(file)

      const a = document.createElement("a") as HTMLAnchorElement
      a.href = url
      a.download = "key"

      document.body.appendChild(a)

      a.click()

      document.body.removeChild(a)

      URL.revokeObjectURL(url)
    }
  }).catch(Errors.display), [pubkey])

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
          Keypair account
        </h1>
        <AccountMenuAnchor />
      </div>
      <div className="h-6" />
      <div className="flex items-center justify-center">
        <KeypairAccountCard
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
        {pubkey && <Fragment>
          <div className="h-6" />
          <div className="font-medium">
            Public key
          </div>
          <div className="text-default-contrast">
            Your public key.
          </div>
          <div className="h-4" />
          <div className="bg-default-contrast po-2 rounded-xl flex flex-col gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
            <textarea className="w-full focus-visible:outline-none"
              rows={3}
              readOnly
              onFocus={e => e.currentTarget.select()}
              value={pubkey || ""} />
          </div>
          <div className="h-2" />
          <div className="flex items-center gap-2">
            <WideContrastButton
              onClick={copyThePubKey.copyOrAlert}>
              {copyThePubKey.copied ? <Outline.CheckIcon className="size-5" /> : <Outline.DocumentDuplicateIcon className="size-5" />}
              {copyThePubKey.copied ? "Copied" : "Copy"}
            </WideContrastButton>
            <WideContrastButton
              onClick={savePubKeyOrAlert}>
              <Outline.ArrowDownTrayIcon className="size-5" />
              Save
            </WideContrastButton>
          </div>
        </Fragment>}
        {sigkey && <Fragment>
          <div className="h-6" />
          <div className="font-medium">
            Private key
          </div>
          <div className="text-default-contrast">
            Your private key.
          </div>
          <div className="h-4" />
          <div className="bg-default-contrast po-2 rounded-xl flex flex-col gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
            <textarea className="w-full focus-visible:outline-none"
              rows={9}
              readOnly
              onFocus={e => flipped ? e.currentTarget.select() : undefined}
              value={flipped ? sigkey : sigkey?.replaceAll(/./g, "•")} />
          </div>
          <div className="h-2" />
          <div className="flex items-center gap-2">
            <WideContrastButton
              onClick={() => setFlipped(x => !x)}>
              {flipped ? <Outline.EyeSlashIcon className="size-5" /> : <Outline.EyeIcon className="size-5" />}
              {flipped ? "Hide" : "Show"}
            </WideContrastButton>
            <WideContrastButton
              onClick={copyTheSigKey.copyOrAlert}>
              {copyTheSigKey.copied ? <Outline.CheckIcon className="size-5" /> : <Outline.DocumentDuplicateIcon className="size-5" />}
              {copyTheSigKey.copied ? "Copied" : "Copy"}
            </WideContrastButton>
            <WideContrastButton
              onClick={saveSigKeyOrAlert}>
              <Outline.ArrowDownTrayIcon className="size-5" />
              Save
            </WideContrastButton>
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

export function KeypairAccountAddMenuAnchor() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, "/keypair")

  return <WideNakedMenuAnchor
    href={coords.url.hash}
    onClick={coords.onClick}
    onKeyDown={coords.onKeyDown}>
    <Outline.KeyIcon className="size-5" />
    Keypair
  </WideNakedMenuAnchor>
}

export function KeypairAccountAddPage() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const close = useCloseContext().getOrThrow()

  const session = useSessionContext().getOrThrow()

  const [flipped, setFlipped] = useState(false)

  const seedword = useMemo(() => {
    return capitalize(MoneroSeedPhrase.generate().split(" ")[0])
  }, [])

  const [$title, setTitle] = useState("")

  const [$pubkey, setPubKey] = useState("")
  const [$sigkey, setSigKey] = useState("")
  const [$username, setUsername] = useState("")
  const [$password, setPassword] = useState("")
  const [$totpseed, setTotpSeed] = useState("")

  const [$notes, setNotes] = useState("")

  const title = useDeferredValue($title || seedword)

  const [color, setColor] = useState<Nullable<string>>(["red", "orange", "amber", "yellow", "lime", "green", "emerald", "teal", "cyan", "sky", "blue", "indigo", "violet", "purple", "fuchsia", "pink", "rose"][Math.floor(Math.random() * 16)])

  const pubkey = useDeferredValue($pubkey)
  const sigkey = useDeferredValue($sigkey)
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

    if (pubkey)
      $entry.addStringOrThrow("PublicKey", pubkey)

    if (sigkey)
      $entry.addStringOrThrow("PrivateKey", sigkey)

    if (username)
      $entry.addStringOrThrow("UserName", username)

    if (password)
      $entry.addStringOrThrow("Password", password, true)

    if (notes)
      $entry.addStringOrThrow("Notes", notes)

    if (totpseed)
      $entry.addStringOrThrow("otp", totpseed, true)

    return Writable.writeToBytesOrThrow(await kdbx.encryptOrThrow(comp))
  }, [session, title, color, pubkey, sigkey, username, password, totpseed, notes])

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
    if (!pubkey.length)
      return "Public key is required"
    return
  }, [pubkey])

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
        Add keypair account
      </h1>
      <div className="h-6" />
      <div className="flex items-center justify-center">
        <KeypairAccountCard
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
          Public key
        </div>
        <div className="text-default-contrast">
          Your public key.
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex flex-col gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <textarea className="w-full focus-visible:outline-none"
            rows={3}
            autoComplete="off"
            placeholder="ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIIP5NGa5rgNRNSHnty0xwZmDgQNUTYBySHLfjEvVV+kD"
            onChange={e => setPubKey(e.target.value)}
            value={$pubkey} />
        </div>
        <div className="h-6" />
        <div className="font-medium">
          Private key
        </div>
        <div className="text-default-contrast">
          Your private key.
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex flex-col gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <textarea className="w-full focus-visible:outline-none"
            rows={9}
            autoComplete="off"
            placeholder={["-----BEGIN OPENSSH PRIVATE KEY-----", "b3BlbnNzaC1rZXktdjEAAAAACmFlczI1Ni1jdHIAAAAGYmNyeXB0AAAAGAAAABDt0nYsbd", "ErGeWyGOH48e51AAAAGAAAAAEAAAAzAAAAC3NzaC1lZDI1NTE5AAAAIIP5NGa5rgNRNSHn", "ty0xwZmDgQNUTYBySHLfjEvVV+kDAAAAoIj24ltpMoyQCmZcgXMvRqXRF0SdQsozyV4yXA", "NqRW3EqcyhwruatrEVuakMzsbQ/TJZBjkZX50svFecQvoeToakGFbOUSr1EmprtGV/nYOw", "w9z1GVdip46pgJw6gcGX33Z8kS/TMT9IMsSzoVk3O/7F/WgiGasQQTwAjnuTWtqmkCzEUC", "pncuvRMmZG3hXbWyXAckezDQNRn2seUsDNwwg=", "-----END OPENSSH PRIVATE KEY-----"].join("\n")}
            onChange={e => setSigKey(e.target.value)}
            value={flipped ? $sigkey : $sigkey.replaceAll(/./g, "•")} />
        </div>
        <div className="h-2" />
        <div className="flex items-center gap-2">
          <WideContrastButton
            onClick={() => setFlipped(x => !x)}>
            {flipped ? <Outline.EyeSlashIcon className="size-5" /> : <Outline.EyeIcon className="size-5" />}
            {flipped ? "Hide" : "Show"}
          </WideContrastButton>
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