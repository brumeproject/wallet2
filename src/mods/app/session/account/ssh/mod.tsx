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

function getSshPublicKeyPreview(value?: string) {
  if (!value)
    return

  const trimmed = value.trim()
  if (!trimmed)
    return

  const parts = trimmed.split(/\s+/)

  if (parts.length >= 2) {
    const type = parts[0]
    const body = parts[1]
    const commentRaw = parts.slice(2).join(" ")
    const comment = commentRaw.replace(/[\u0000-\u001F\u007F]/g, "").trim()

    const bodyHead = body.length > 18 ? `${body.slice(0, 16)}...` : body

    if (comment) {
      const commentShort = comment.length > 24 ? `${comment.slice(0, 21)}...` : comment
      return `${type} ${bodyHead} ${commentShort}`
    }

    const bodyTail = body.length > 10 ? body.slice(-8) : ""
    return `${type} ${bodyHead}${bodyTail ? bodyTail : ""}`
  }

  if (trimmed.length <= 48)
    return trimmed

  return `${trimmed.slice(0, 32)}...${trimmed.slice(-8)}`
}

type SshValidation = { state: "empty" } | { state: "valid" } | { state: "warning", message: string }

function validateSshPublicKey(value?: string): SshValidation {
  if (!value)
    return { state: "empty" }

  const trimmed = value.trim()
  if (!trimmed)
    return { state: "empty" }

  const parts = trimmed.split(/\s+/)
  if (parts.length < 2) {
    return { state: "warning", message: "Looks unusual: expected an OpenSSH public key like <type> <base64>." }
  }

  const type = parts[0]
  const typeOk = /^ssh-(rsa|ed25519|dss)$/.test(type)
    || /^ecdsa-sha2-/.test(type)
    || /^sk-ssh-/.test(type)
    || /^sk-ecdsa-/.test(type)

  if (!typeOk) {
    return { state: "warning", message: "Looks unusual: public key type is not a common OpenSSH key type." }
  }

  const body = parts[1]
  const bodyOk = /^[A-Za-z0-9+/=]+$/.test(body)

  if (!bodyOk) {
    return { state: "warning", message: "Looks unusual: public key body doesn't look like base64." }
  }

  return { state: "valid" }
}

function validateSshPrivateKey(value?: string): SshValidation {
  if (!value)
    return { state: "empty" }

  const trimmed = value.trim()
  if (!trimmed)
    return { state: "empty" }

  const beginOk = /-----BEGIN [A-Z0-9 ]*PRIVATE KEY-----/.test(trimmed)
  const endOk = /-----END [A-Z0-9 ]*PRIVATE KEY-----/.test(trimmed)

  if (!beginOk || !endOk) {
    return { state: "warning", message: "Looks unusual: expected a PEM/OpenSSH private key with BEGIN/END markers." }
  }

  return { state: "valid" }
}

export function SshAccountPage(props: { $entry: KDBX.Inner.KeePassFile.Entry }) {
  const { $entry } = props

  const [masked, setMasked] = useState(true)

  const publicKey = useMemo(() => {
    return $entry.getDirectStringByKeyOrNull("SshPublicKey")?.getValueOrThrow().get()
  }, [$entry])

  const privateKey = useMemo(() => {
    return $entry.getDirectStringByKeyOrNull("SshPrivateKey")?.getValueOrThrow().get()
  }, [$entry])

  const passphrase = useMemo(() => {
    return $entry.getDirectStringByKeyOrNull("SshPassphrase")?.getValueOrThrow().get()
  }, [$entry])

  const notes = useMemo(() => {
    return $entry.getDirectStringByKeyOrNull("Notes")?.getValueOrThrow().get()
  }, [$entry])

  const copyThePublicKey = useCopy(publicKey)
  const copyThePrivateKey = useCopy(privateKey)
  const copyThePassphrase = useCopy(passphrase)

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
      {publicKey && <Fragment>
        <div className="h-6" />
        <div className="font-medium">
          Public key
        </div>
        <div className="text-default-contrast">
          Your SSH public key
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex flex-col gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <textarea className="w-full resize-none focus-visible:outline-none font-mono text-sm"
            readOnly
            rows={4}
            onFocus={e => e.currentTarget.select()}
            value={publicKey} />
          <div className="flex items-center justify-end">
            <button className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none"
              type="button"
              onClick={copyThePublicKey.copyOrAlert}>
              <InButton>
                {copyThePublicKey.copied ? <Outline.CheckIcon className="size-5" /> : <Outline.DocumentDuplicateIcon className="size-5" />}
              </InButton>
            </button>
          </div>
        </div>
      </Fragment>}
      {privateKey && <Fragment>
        <div className="h-6" />
        <div className="font-medium">
          Private key
        </div>
        <div className="text-default-contrast">
          Your SSH private key
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex flex-col gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <textarea className="w-full resize-none focus-visible:outline-none font-mono text-sm"
            readOnly
            rows={8}
            style={masked ? { WebkitTextSecurity: 'disc' } as React.CSSProperties : undefined}
            onFocus={e => e.currentTarget.select()}
            value={privateKey} />
          <div className="flex items-center justify-end gap-2">
            <button className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none"
              type="button"
              onClick={() => setMasked(!masked)}>
              <InButton>
                {masked ? <Outline.EyeIcon className="size-5" /> : <Outline.EyeSlashIcon className="size-5" />}
              </InButton>
            </button>
            <button className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none"
              type="button"
              onClick={copyThePrivateKey.copyOrAlert}>
              <InButton>
                {copyThePrivateKey.copied ? <Outline.CheckIcon className="size-5" /> : <Outline.DocumentDuplicateIcon className="size-5" />}
              </InButton>
            </button>
          </div>
        </div>
      </Fragment>}
      {passphrase && <Fragment>
        <div className="h-6" />
        <div className="font-medium">
          Passphrase
        </div>
        <div className="text-default-contrast">
          SSH key passphrase
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <Outline.KeyIcon className="size-5" />
          <input className="w-full focus-visible:outline-none"
            readOnly
            autoComplete="off"
            type={masked ? "password" : "text"}
            onFocus={e => e.currentTarget.select()}
            value={passphrase} />
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
              onClick={copyThePassphrase.copyOrAlert}>
              <InButton>
                {copyThePassphrase.copied ? <Outline.CheckIcon className="size-5" /> : <Outline.DocumentDuplicateIcon className="size-5" />}
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

export function SshAccountAddMenuAnchor() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, "/ssh")

  return <WideNakedMenuAnchor
    href={coords.url.hash}
    onClick={coords.onClick}
    onKeyDown={coords.onKeyDown}>
    <Outline.KeyIcon className="size-5" />
    SSH Key
  </WideNakedMenuAnchor>
}

export function SshAccountAddPage() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const close = useCloseContext().getOrThrow()

  const session = useSessionContext().getOrThrow()

  const [masked, setMasked] = useState(true)

  const [$title, setTitle] = useState("")

  const [$publicKey, setPublicKey] = useState("")

  const [$privateKey, setPrivateKey] = useState("")

  const [$passphrase, setPassphrase] = useState("")

  const [$notes, setNotes] = useState("")

  const title = useDeferredValue($title || "Untitled")

  const [color, setColor] = useState<Nullable<string>>()

  const publicKey = useDeferredValue($publicKey)

  const privateKey = useDeferredValue($privateKey)

  const passphrase = useDeferredValue($passphrase)

  const notes = useDeferredValue($notes)

  const publicKeyPreview = useMemo(() => {
    return getSshPublicKeyPreview(publicKey)
  }, [publicKey])

  const publicKeyValidation = useMemo(() => {
    return validateSshPublicKey(publicKey)
  }, [publicKey])

  const privateKeyValidation = useMemo(() => {
    return validateSshPrivateKey(privateKey)
  }, [privateKey])

  const hasAnyKey = useMemo(() => {
    return Boolean(publicKey?.trim() || privateKey?.trim())
  }, [publicKey, privateKey])

  const saveLabel = hasAnyKey ? "Save file" : "Add a key to save"

  const encryptOrThrow = useCallback(async () => {
    const { kdbx } = session.value

    const $file = kdbx.inner.content.value
    const $root = $file.getRootOrThrow()

    const $group = $root.getDirectGroupByIndexOrThrow(0)
    const $entry = $file.createEntryOrThrow()

    $entry.createStringOrThrow("Title", title)

    if (color)
      $entry.createStringOrThrow("Color", color)

    if (publicKey)
      $entry.createStringOrThrow("SshPublicKey", publicKey)

    if (privateKey)
      $entry.createStringOrThrow("SshPrivateKey", privateKey, true)

    if (passphrase)
      $entry.createStringOrThrow("SshPassphrase", passphrase, true)

    if (notes)
      $entry.createStringOrThrow("Notes", notes)

    $group.element.appendChild($entry.element)

    return Writable.writeToBytesOrThrow(await kdbx.encryptOrThrow())
  }, [session, title, color, publicKey, privateKey, passphrase, notes])

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

  return <Fragment>
    <SubpathProvider value={hash}>
      {hash.url.pathname === "/color" &&
        <PathPaper>
          <ColorMenu ok={setColor} />
        </PathPaper>}
    </SubpathProvider>
    <div className="flex flex-col grow p-6">
      <h1 className="text-xl font-medium">
        Add SSH key
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
            {publicKeyPreview}
          </div>
          <div className="h-4 grow" />
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-default-contrast rounded-xl po-1 flex items-center gap-2">
              <Outline.KeyIcon className="size-5" />
              SSH
            </div>
          </div>
        </div>
      </div>
      <form className="grow flex flex-col">
        <div className="h-6" />
        <div className="font-medium">
          Title
        </div>
        <div className="text-default-contrast">
          A name to identify this key
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <Outline.TagIcon className="size-5" />
          <input className="w-full focus-visible:outline-none"
            autoComplete="off"
            placeholder="e.g., GitHub, Production Server"
            value={$title}
            onChange={e => setTitle(e.target.value)} />
          <div className="flex items-center gap-2">
            <ColorAnchor color={color} />
          </div>
        </div>
        <div className="h-6" />
        <div className="font-medium">
          Public key
        </div>
        <div className="text-default-contrast">
          Your SSH public key
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex flex-col gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <textarea className="w-full resize-none focus-visible:outline-none font-mono text-sm"
            rows={4}
            autoComplete="off"
            placeholder="ssh-rsa AAAAB3NzaC1yc2EA..."
            value={$publicKey}
            onChange={e => setPublicKey(e.target.value)} />
        </div>
        {publicKeyValidation.state === "warning" &&
          <div className="text-sm text-default-contrast mt-2">
            {publicKeyValidation.message}
          </div>}
        <div className="h-6" />
        <div className="font-medium">
          Private key
        </div>
        <div className="text-default-contrast">
          Your SSH private key
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex flex-col gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <textarea className="w-full resize-none focus-visible:outline-none font-mono text-sm"
            rows={8}
            style={masked ? { WebkitTextSecurity: 'disc' } as React.CSSProperties : undefined}
            placeholder="-----BEGIN OPENSSH PRIVATE KEY-----"
            value={$privateKey}
            onChange={e => setPrivateKey(e.target.value)} />
          <div className="flex items-center justify-end gap-2">
            <button className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none"
              type="button"
              onClick={() => setMasked(!masked)}>
              <InButton>
                {masked ? <Outline.EyeIcon className="size-5" /> : <Outline.EyeSlashIcon className="size-5" />}
              </InButton>
            </button>
          </div>
        </div>
        {privateKeyValidation.state === "warning" &&
          <div className="text-sm text-default-contrast mt-2">
            {privateKeyValidation.message}
          </div>}
        <div className="h-6" />
        <div className="font-medium">
          Passphrase
        </div>
        <div className="text-default-contrast">
          SSH key passphrase
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <Outline.KeyIcon className="size-5" />
          <input className="w-full focus-visible:outline-none"
            autoComplete="off"
            type={masked ? "password" : "text"}
            placeholder="Optional passphrase"
            value={$passphrase}
            onChange={e => setPassphrase(e.target.value)} />
          <button className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none"
            type="button"
            onClick={() => setMasked(!masked)}>
            <InButton>
              {masked ? <Outline.EyeIcon className="size-5" /> : <Outline.EyeSlashIcon className="size-5" />}
            </InButton>
          </button>
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
            placeholder="Additional information about this SSH key"
            value={$notes}
            onChange={e => setNotes(e.target.value)} />
        </div>
        <div className="h-8" />
        <div className="flex items-center flex-wrap-reverse gap-2">
          {session.value.user.fsfh != null &&
            <WideOppositeButton
              disabled={!hasAnyKey}
              type="button"
              onClick={writeOrAlert}>
              {saveLabel}
            </WideOppositeButton>}
          {session.value.user.fsfh == null &&
            <WideOppositeButton
              disabled={!hasAnyKey}
              type="button"
              onClick={saveOrAlert}>
              {saveLabel}
            </WideOppositeButton>}
        </div>
      </form>
    </div>
  </Fragment>
}
