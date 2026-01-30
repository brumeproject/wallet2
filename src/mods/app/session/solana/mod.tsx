import { InButton, WideOppositeButton } from "@/libs/button/mod.tsx";
import { useCopy } from "@/libs/copy/mod.ts";
import { PathPaper, WideNakedMenuAnchor } from "@/libs/dialog/paper/mod.tsx";
import { Errors } from "@/libs/errors/mod.ts";
import { Outline } from "@/libs/heroicons/mod.ts";
import { getEntryTitle } from "@/libs/kdbx/mod.ts";
import { Nullable } from "@/libs/nullable/mod.tsx";
import { useStoreContext } from "@/libs/store/mod.tsx";
import { Writable } from "@hazae41/binary";
import { SubpathProvider, useAnchorWithCoords, useHashSubpath, usePathContext } from "@hazae41/chemin";
import * as KDBX from "@hazae41/kdbx";
import { useCloseContext } from "@hazae41/react-close-context";
import { validateMnemonic } from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english.js";
import React, { Fragment, useCallback, useDeferredValue, useMemo, useState } from "react";
import { SessionAccountCard, useSessionContext } from "../mod.tsx";

React;

export function SessionSolanaAccountPage(props: { $entry: KDBX.Inner.KeePassFile.Entry }) {
  const { $entry } = props

  const [masked, setMasked] = useState(true)

  const address = useMemo(() => {
    return $entry.getDirectStringByKeyOrNull("SolanaAddress")?.getValueOrThrow().get()
  }, [$entry])

  const sigkey = useMemo(() => {
    return $entry.getDirectStringByKeyOrNull("SolanaSigningKey")?.getValueOrThrow().get()
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
      <SessionAccountCard $entry={$entry} />
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
          <Outline.HashtagIcon className="size-5" />
          <input className="w-full focus-visible:outline-none"
            readOnly
            autoComplete="off"
            onFocus={e => e.currentTarget.select()}
            value={address} />
          <div className="flex items-center gap-2">
            <button className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none transition-all"
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
          Your Ed25519 private key
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <Outline.HashtagIcon className="size-5" />
          <input className="w-full focus-visible:outline-none"
            readOnly
            autoComplete="off"
            type={masked ? "password" : "text"}
            onFocus={e => e.currentTarget.select()}
            value={sigkey} />
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

export function SessionSolanaAddAnchor() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, "/solana")

  return <WideNakedMenuAnchor
    href={coords.url.hash}
    onClick={coords.onClick}
    onKeyDown={coords.onKeyDown}>
    <Outline.SparklesIcon className="size-5" />
    Solana
  </WideNakedMenuAnchor>
}

export function SessionSeedAddPage() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const close = useCloseContext().getOrThrow()
  const store = useStoreContext().getOrThrow()

  const session = useSessionContext().getOrThrow()

  const [$title, setTitle] = useState("")

  const [$seedphrase, setSeedPhrase] = useState("")

  const [$notes, setNotes] = useState("")

  const title = useDeferredValue($title || "Untitled")

  const [color, setColor] = useState<Nullable<string>>()

  const seedphrase = useDeferredValue($seedphrase)

  const notes = useDeferredValue($notes)

  const encryptOrThrow = useCallback(async () => {
    const kdbx = session.value.kdbx

    const $file = kdbx.inner.content.value
    const $root = $file.getRootOrThrow()

    const $group = $root.getDirectGroupByIndexOrThrow(0)
    const $entry = $file.createEntryOrThrow()

    $entry.createStringOrThrow("Title", title)

    if (seedphrase)
      $entry.createStringOrThrow("SeedPhrase", seedphrase, true)

    if (notes)
      $entry.createStringOrThrow("Notes", notes)

    $group.element.appendChild($entry.element)

    return Writable.writeToBytesOrThrow(await kdbx.encryptOrThrow())
  }, [session, title, seedphrase, notes])

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
    if (!seedphrase)
      return "Seed phrase is required"
    if (!validateMnemonic(seedphrase, wordlist))
      return "Seed phrase is invalid"
    return
  }, [seedphrase])

  return <Fragment>
    <SubpathProvider value={hash}>
      {hash.url.pathname === "/generate" &&
        <PathPaper>
          <div className="flex flex-col text-left gap-2">

          </div>
        </PathPaper>}
    </SubpathProvider>
    <div className="flex flex-col grow p-6">
      <h1 className="text-xl font-medium">
        Add seed
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
            {seedphrase.split(" ").at(0)}
          </div>
          <div className="h-4 grow" />
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-default-contrast rounded-xl po-1 flex items-center gap-2">
              <Outline.SparklesIcon className="size-5" />
              Seed
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
        </div>
        <div className="h-6" />
        <div className="font-medium">
          Seed phrase
        </div>
        <div className="text-default-contrast">
          Your BIP-39 mnemonic seed phrase
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex flex-col gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <textarea className="w-full focus-visible:outline-none"
            rows={6}
            autoComplete="off"
            onChange={e => setSeedPhrase(e.target.value)}
            value={$seedphrase} />
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