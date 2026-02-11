import { InAnchor } from "@/libs/anchor/mod.tsx";
import { InButton, WideOppositeButton } from "@/libs/button/mod.tsx";
import { useCopy } from "@/libs/copy/mod.ts";
import { PathPaper, WideNakedMenuAnchor } from "@/libs/dialog/paper/mod.tsx";
import { Errors } from "@/libs/errors/mod.ts";
import { Outline } from "@/libs/heroicons/mod.ts";
import { getEntryTitle } from "@/libs/kdbx/mod.ts";
import { Nullable } from "@/libs/nullable/mod.ts";
import { Writable } from "@hazae41/binary";
import { SubpathProvider, useAnchorWithCoords, useHashSubpath, usePathContext } from "@hazae41/chemin";
import * as KDBX from "@hazae41/kdbx";
import { useCloseContext } from "@hazae41/react-close-context";
import { base58 } from "@scure/base";
import React, { Fragment, useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";
import { useSessionContext } from "../../mod.tsx";
import { AccountCard, ColorAnchor, ColorMenu } from "../mod.tsx";

React;

export function SolanaAccountPage(props: { $entry: KDBX.Inner.KeePassFile.Entry }) {
  const { $entry } = props

  const [masked, setMasked] = useState(true)

  const address = useMemo(() => {
    return $entry.getDirectStringByKeyOrNull("SolanaAddress")?.getValueOrThrow().get()
  }, [$entry])

  const sigkey = useMemo(() => {
    return $entry.getDirectStringByKeyOrNull("SolanaPrivateKey")?.getValueOrThrow().get()
  }, [$entry])

  const notes = useMemo(() => {
    return $entry.getDirectStringByKeyOrNull("Notes")?.getValueOrThrow().get()
  }, [$entry])

  const copyTheAddress = useCopy(address)
  const copyTheSigKey = useCopy(sigkey)

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
      {address && <Fragment>
        <div className="h-6" />
        <div className="font-medium">
          Address
        </div>
        <div className="text-default-contrast">
          Your Solana address
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <Outline.UserIcon className="size-5" />
          <input className="w-full focus-visible:outline-none"
            readOnly
            autoComplete="off"
            onFocus={e => e.currentTarget.select()}
            value={address} />
          <div className="flex items-center gap-2">
            <button className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none"
              type="button"
              onClick={copyTheAddress.copyOrAlert}>
              <InButton>
                {copyTheAddress.copied ? <Outline.CheckIcon className="size-5" /> : <Outline.DocumentDuplicateIcon className="size-5" />}
              </InButton>
            </button>
          </div>
        </div>
      </Fragment>}
      {sigkey && <Fragment>
        <div className="h-6" />
        <div className="font-medium">
          Private key
        </div>
        <div className="text-default-contrast">
          Your Solana private key
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <Outline.KeyIcon className="size-5" />
          <input className="w-full focus-visible:outline-none"
            readOnly
            autoComplete="off"
            type={masked ? "password" : "text"}
            onFocus={e => e.currentTarget.select()}
            value={sigkey} />
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
              onClick={copyTheSigKey.copyOrAlert}>
              <InButton>
                {copyTheSigKey.copied ? <Outline.CheckIcon className="size-5" /> : <Outline.DocumentDuplicateIcon className="size-5" />}
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

export function SolanaAccountAddMenuAnchor() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, "/solana")

  return <WideNakedMenuAnchor
    href={coords.url.hash}
    onClick={coords.onClick}
    onKeyDown={coords.onKeyDown}>
    Solana
  </WideNakedMenuAnchor>
}

export function StandaloneSolanaAccountAddPage() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const close = useCloseContext().getOrThrow()

  const session = useSessionContext().getOrThrow()

  const [masked, setMasked] = useState(true)

  const [$title, setTitle] = useState("")

  const [$sigkey, setSigKey] = useState("")

  const [$notes, setNotes] = useState("")

  const title = useDeferredValue($title || "Untitled")

  const [color, setColor] = useState<Nullable<string>>()

  const sigkey = useDeferredValue($sigkey)

  const notes = useDeferredValue($notes)

  const [address, setAddress] = useState<Nullable<string>>()

  const getAddressOrNull = useCallback(async () => {
    if (!sigkey)
      return

    const keypair = base58.decode(sigkey)

    if (keypair.length !== 64)
      return

    const l = keypair.slice(0, 32)
    const r = keypair.slice(32, 64)

    // TODO validate

    return base58.encode(r)
  }, [sigkey])

  useEffect(() => {
    getAddressOrNull().then(setAddress)
  }, [getAddressOrNull])

  const encryptOrThrow = useCallback(async () => {
    const { kdbx } = session.value

    const $file = kdbx.inner.content.value
    const $root = $file.getRootOrThrow()

    const $group = $root.getDirectGroupByIndexOrThrow(0)
    const $entry = $file.createEntryOrThrow()

    $entry.createStringOrThrow("Title", title)

    if (color)
      $entry.createStringOrThrow("Color", color)

    if (address)
      $entry.createStringOrThrow("SolanaAddress", address)

    if (sigkey)
      $entry.createStringOrThrow("SolanaPrivateKey", sigkey, true)

    if (notes)
      $entry.createStringOrThrow("Notes", notes)

    $group.element.appendChild($entry.element)

    return Writable.writeToBytesOrThrow(await kdbx.encryptOrThrow())
  }, [session, title, color, address, sigkey, notes])

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
    if (!sigkey)
      return "Private key is required"
    if (!address)
      return "Private key is invalid"
    return
  }, [sigkey, address])

  return <Fragment>
    <SubpathProvider value={hash}>
      {hash.url.pathname === "/color" &&
        <PathPaper>
          <ColorMenu ok={setColor} />
        </PathPaper>}
      {hash.url.pathname === "/generate" &&
        <PathPaper>
          <div className="flex flex-col text-left gap-2">

          </div>
        </PathPaper>}
    </SubpathProvider>
    <div className="flex flex-col grow p-6">
      <h1 className="text-xl font-medium">
        Add Solana account
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
            {address}
          </div>
          <div className="h-4 grow" />
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-default-contrast rounded-xl po-1 flex items-center gap-2">
              <Outline.BanknotesIcon className="size-5" />
              Crypto
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
          Private key
        </div>
        <div className="text-default-contrast">
          Your Solana private key
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <Outline.KeyIcon className="size-5" />
          <input className="w-full focus-visible:outline-none"
            autoComplete="off"
            type={masked ? "password" : "text"}
            onChange={e => setSigKey(e.target.value)}
            value={$sigkey} />
          <div className="flex items-center gap-2">
            <button className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none"
              type="button"
              onClick={() => setMasked(!masked)}>
              <InButton>
                {masked ? <Outline.EyeIcon className="size-5" /> : <Outline.EyeSlashIcon className="size-5" />}
              </InButton>
            </button>
            <a className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none">
              <InAnchor>
                <Outline.SparklesIcon className="size-5" />
              </InAnchor>
            </a>
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
        <div className="bg-default-contrast po-2 rounded-xl flex flex-col  gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <textarea className="w-full resize-none focus-visible:outline-none"
            rows={6}
            autoComplete="off"
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