import { InAnchor } from "@/libs/anchor/mod.tsx";
import { WideOppositeButton } from "@/libs/button/mod.tsx";
import { PathBoard } from "@/libs/dialog/board/mod.tsx";
import { PathPaper, WideNakedMenuAnchor } from "@/libs/dialog/paper/mod.tsx";
import { Ed25519 } from "@/libs/ed25519/mod.ts";
import { Errors } from "@/libs/errors/mod.ts";
import { Events } from "@/libs/events/mod.ts";
import { Outline } from "@/libs/heroicons/mod.ts";
import { getRecycleBinOrNull } from "@/libs/kdbx/mod.ts";
import { Nullable } from "@/libs/nullable/mod.ts";
import { Writable } from "@hazae41/binary";
import { BitcoinSeedPhrase, MoneroSeedPhrase } from "@hazae41/broca";
import { SubpathProvider, useAnchorWithCoords, useHashSubpath, usePathContext } from "@hazae41/chemin";
import { BitcoinSeedKey, Ed25519SeedKey } from "@hazae41/clade";
import { Cursor } from "@hazae41/cursor";
import * as KDBX from "@hazae41/kdbx";
import { useCloseContext } from "@hazae41/react-close-context";
import { ed25519 } from "@noble/curves/ed25519.js";
import { secp256k1 } from "@noble/curves/secp256k1.js";
import { keccak_256 } from "@noble/hashes/sha3.js";
import { base58, base58xmr } from "@scure/base";
import React, { Fragment, useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";
import { useSessionContext } from "../../mod.tsx";
import { AccountMenuAnchor, AccountMenuDeleteButton, AccountMenuTrashButton, AccountMenuUntrashButton, ColorAnchor, ColorMenu, CryptoAccountCard } from "../mod.tsx";

React;

export function CryptoAccountPage(props: { $entry: KDBX.Inner.KeePassFile.Entry }) {
  const { $entry } = props

  const close = useCloseContext().getOrThrow()

  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const title = useMemo(() => {
    return $entry.getStringByKeyOrNull("Title")?.getValueOrThrow().get()
  }, [$entry])

  const color = useMemo(() => {
    return $entry.getStringByKeyOrNull("Color")?.getValueOrThrow().get()
  }, [$entry])

  const notes = useMemo(() => {
    return $entry.getStringByKeyOrNull("Notes")?.getValueOrThrow().get()
  }, [$entry])

  const i0 = useAnchorWithCoords(hash, "/0")
  const i1 = useAnchorWithCoords(hash, "/1")

  return <Fragment>
    <SubpathProvider value={hash}>
      {hash.url.pathname === "/+" &&
        <PathPaper>
          <CryptoAccountMenu $entry={$entry} close={close} />
        </PathPaper>}
      {hash.url.pathname === "/0" &&
        <PathBoard>
          <CryptoSubaccountPage $entry={$entry} name="Personal" index={0} />
        </PathBoard>}
      {hash.url.pathname === "/1" &&
        <PathBoard>
          <CryptoSubaccountPage $entry={$entry} name="Business" index={1} />
        </PathBoard>}
    </SubpathProvider>
    <div className="flex flex-col grow p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium">
          Crypto account
        </h1>
        <AccountMenuAnchor />
      </div>
      <div className="h-6" />
      <div className="flex items-center justify-center">
        <CryptoAccountCard title={title} color={color} />
      </div>
      <form className="grow flex flex-col"
        onSubmit={Events.preventDefault}>
        <input className="hidden"
          autoComplete="off"
          name="username" />
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
        <Fragment>
          <div className="h-6" />
          <div className="font-medium">
            Subaccounts
          </div>
          <div className="text-default-contrast">
            Your subaccounts.
          </div>
          <div className="h-4" />
          <div className="flex flex-col items-center border border-default-contrast rounded-xl p-6">
            <a className="w-[320px] aspect-video p-4 z-10 rounded-xl bg-orange-400 text-default border-2 border-default-contrast hover:translate-x-3 focus-visible:outline-none focus-visible:translate-x-3 transition-transform"
              data-theme="dark"
              href={i0.url.hash}
              onClick={i0.onClick}
              onKeyDown={i0.onKeyDown}>
              <div className="flex items-center justify-between">
                <div className="font-medium text-xl">
                  Personal
                </div>
                <div className="font-medium text-xl text-default-contrast">
                  #1
                </div>
              </div>
            </a>
            <a className="w-[320px] aspect-video p-4 z-10 rounded-xl bg-orange-400 text-default border-2 border-default-contrast -translate-y-30 hover:translate-x-3 focus-visible:outline-none focus-visible:translate-x-3 transition-transform"
              data-theme="dark"
              href={i1.url.hash}
              onClick={i1.onClick}
              onKeyDown={i1.onKeyDown}>
              <div className="flex items-center justify-between">
                <div className="font-medium text-xl">
                  Business
                </div>
                <div className="font-medium text-xl text-default-contrast">
                  #2
                </div>
              </div>
            </a>
            <a className="w-[320px] aspect-video p-4 z-10 rounded-xl bg-orange-400 text-default border-2 border-default-contrast -translate-y-60 hover:translate-x-3 focus-visible:outline-none focus-visible:translate-x-3 transition-transform"
              data-theme="dark"
              href={hash.go("/add").hash}>
              <InAnchor>
                <Outline.PlusIcon className="size-8" />
              </InAnchor>
            </a>
          </div>
        </Fragment>
      </form>
    </div>
  </Fragment>
}

export function CryptoAccountExportMenuAnchor() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, "/export")

  return <WideNakedMenuAnchor
    href={coords.url.hash}
    onClick={coords.onClick}
    onKeyDown={coords.onKeyDown}>
    <Outline.ArrowUpOnSquareIcon className="size-5" />
    Export
  </WideNakedMenuAnchor>
}

export function CryptoSubaccountExportMenuAnchor() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, "/export")

  return <WideNakedMenuAnchor
    href={coords.url.hash}
    onClick={coords.onClick}
    onKeyDown={coords.onKeyDown}>
    <Outline.ArrowUpOnSquareIcon className="size-5" />
    Export
  </WideNakedMenuAnchor>
}

export function CryptoAccountMenu(props: { $entry: KDBX.Inner.KeePassFile.Entry } & { close(force?: boolean): void }) {
  const { $entry, close } = props

  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const session = useSessionContext().getOrThrow()

  const trashed = useMemo(() => {
    const { kdbx } = session.value

    const $file = kdbx.inner.content.value
    const $trash = getRecycleBinOrNull($file)

    if ($trash == null)
      return false

    return $trash.element.contains($entry.element)
  }, [session, $entry])

  return <Fragment>
    <SubpathProvider value={hash}>
      {hash.url.pathname === "/export" &&
        <PathBoard>
          <CryptoAccountExportPage $entry={$entry} />
        </PathBoard>}
    </SubpathProvider>
    <div className="flex flex-col text-left gap-2">
      <CryptoAccountExportMenuAnchor />
      {trashed === false && <AccountMenuTrashButton $entry={$entry} close={close} />}
      {trashed === true && <AccountMenuUntrashButton $entry={$entry} close={close} />}
      {trashed === true && <AccountMenuDeleteButton $entry={$entry} close={close} />}
    </div>
  </Fragment>
}

export function CryptoSubaccountMenu(props: { $entry: KDBX.Inner.KeePassFile.Entry } & { name: string } & { index: number }) {
  const { $entry, name, index } = props

  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  return <Fragment>
    <SubpathProvider value={hash}>
      {hash.url.pathname === "/export" &&
        <PathBoard>
          <CryptoSubaccountExportPage $entry={$entry} name={name} index={index} />
        </PathBoard>}
    </SubpathProvider>
    <div className="flex flex-col text-left gap-2">
      <CryptoSubaccountExportMenuAnchor />
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
    Standard
  </WideNakedMenuAnchor>
}

export function CryptoAccountAddPage() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const close = useCloseContext().getOrThrow()

  const session = useSessionContext().getOrThrow()

  const [$title, setTitle] = useState("")

  const [$seedphrase, setSeedPhrase] = useState("")

  const [$notes, setNotes] = useState("")

  const title = useDeferredValue($title || "Untitled")

  const [color, setColor] = useState<Nullable<string>>()

  const seedphrase = useDeferredValue($seedphrase)

  const notes = useDeferredValue($notes)

  const encryptOrThrow = useCallback(async () => {
    const { kdbx, comp } = session.value

    const $file = kdbx.inner.content.value
    const $root = $file.getRootOrThrow()

    const $group = $root.getDirectGroupByIndexOrThrow(0)
    const $entry = $group.addEntryOrThrow()

    $entry.addStringOrThrow("Title", title)

    if (color)
      $entry.addStringOrThrow("Color", color)

    if (seedphrase)
      $entry.addStringOrThrow("SeedPhrase", seedphrase, true)

    if (notes)
      $entry.addStringOrThrow("Notes", notes)

    return Writable.writeToBytesOrThrow(await kdbx.encryptOrThrow(comp))
  }, [session, title, color, seedphrase, notes])

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

  const [valid, setValid] = useState(false)

  const getValidOrThrow = useCallback(async () => {
    return await BitcoinSeedPhrase.validate(seedphrase)
  }, [seedphrase])

  useEffect(() => {
    getValidOrThrow().then(setValid).catch(console.error)
  }, [getValidOrThrow])

  const error = useMemo(() => {
    if (!seedphrase)
      return "Seed phrase is required"
    if (!valid)
      return "Seed phrase is invalid"
    return
  }, [seedphrase, valid])

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
        Add crypto account
      </h1>
      <div className="h-6" />
      <div className="flex items-center justify-center">
        <CryptoAccountCard title={title} color={color} />
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
          Seed phrase
        </div>
        <div className="text-default-contrast">
          Your BIP-39 seed phrase.
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
          Any additional information.
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
              type="button"
              disabled={error != null}
              onClick={encryptAndWriteOrAlert}>
              {error != null ? error : "Save file"}
            </WideOppositeButton>}
          {session.value.user.fsfh == null &&
            <WideOppositeButton
              type="button"
              disabled={error != null}
              onClick={encryptAndSaveOrAlert}>
              {error != null ? error : "Save file"}
            </WideOppositeButton>}
        </div>
      </form>
    </div>
  </Fragment>
}

export function CryptoSubaccountPage(props: { $entry: KDBX.Inner.KeePassFile.Entry } & { name: string } & { index: number }) {
  const { $entry, name, index } = props

  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const title = useMemo(() => {
    return $entry.getStringByKeyOrNull("Title")?.getValueOrThrow().get()
  }, [$entry])

  const color = useMemo(() => {
    return $entry.getStringByKeyOrNull("Color")?.getValueOrThrow().get()
  }, [$entry])

  const seedphrase = useMemo(() => {
    return $entry.getStringByKeyOrNull("SeedPhrase")?.getValueOrThrow().get()
  }, [$entry])

  const [ethereum, setEthereum] = useState<Nullable<string>>()

  const getEthereumOrThrow = useCallback(async () => {
    if (seedphrase == null)
      return

    const seed = new BitcoinSeedKey(await BitcoinSeedPhrase.derive(seedphrase))

    const xsig = await seed.derive(`m/44'/60'/0'/0/${index}`)
    const upub = secp256k1.getPublicKey(xsig.key, false)

    return `0x${keccak_256(upub.slice(1)).slice(-20).toHex()}`
  }, [seedphrase, index])

  useEffect(() => {
    getEthereumOrThrow().then(setEthereum).catch(console.error)
  }, [getEthereumOrThrow])

  const [solana, setSolana] = useState<Nullable<string>>()

  const getSolanaOrThrow = useCallback(async () => {
    if (seedphrase == null)
      return

    const seed = new Ed25519SeedKey(await BitcoinSeedPhrase.derive(seedphrase))

    const xsig = await seed.derive(`m/44'/501'/${index}'/0'`)
    const upub = await Ed25519.publish(xsig.key)

    return base58.encode(upub)
  }, [seedphrase, index])

  useEffect(() => {
    getSolanaOrThrow().then(setSolana).catch(console.error)
  }, [getSolanaOrThrow])

  const [bobine, setBobine] = useState<Nullable<string>>()

  const getBobineOrThrow = useCallback(async () => {
    if (seedphrase == null)
      return

    const seed = new Ed25519SeedKey(await BitcoinSeedPhrase.derive(seedphrase))

    const xsig = await seed.derive(`m/44'/1'/${index}'/0'/0'`)
    const upub = await Ed25519.publish(xsig.key)

    const hash = new Uint8Array(await crypto.subtle.digest("SHA-256", upub))

    return `0x${hash.toHex()}`
  }, [seedphrase, index])

  useEffect(() => {
    getBobineOrThrow().then(setBobine).catch(console.error)
  }, [getBobineOrThrow])

  const [monero, setMonero] = useState<Nullable<string>>()

  const getMoneroOrThrow = useCallback(async () => {
    if (seedphrase == null)
      return

    const seed = new Ed25519SeedKey(await BitcoinSeedPhrase.derive(seedphrase))

    const xsig = await seed.derive(`m/44'/128'/${index}'`)

    const sigspreAsRaw = xsig.key
    const sigspreAsHex = sigspreAsRaw.toReversed().toHex()
    const sigspreAsNum = BigInt("0x" + sigspreAsHex)

    const sigskeyAsNum = sigspreAsNum % ed25519.Point.Fn.ORDER
    const sigskeyAsHex = sigskeyAsNum.toString(16).padStart(64, "0")
    const sigskeyAsRaw = Uint8Array.fromHex(sigskeyAsHex).toReversed()

    const sigvpreAsRaw = keccak_256(sigskeyAsRaw)
    const sigvpreAsHex = sigvpreAsRaw.toReversed().toHex()
    const sigvpreAsNum = BigInt("0x" + sigvpreAsHex)

    const sigvkeyAsNum = sigvpreAsNum % ed25519.Point.Fn.ORDER
    const sigvkeyAsHex = sigvkeyAsNum.toString(16).padStart(64, "0")
    const sigvkeyAsRaw = Uint8Array.fromHex(sigvkeyAsHex).toReversed()

    const pubskeyAsRaw = ed25519.Point.BASE.multiply(sigskeyAsNum).toBytes()
    const pubvkeyAsRaw = ed25519.Point.BASE.multiply(sigvkeyAsNum).toBytes()

    const concat0 = new Uint8Array(1 + pubskeyAsRaw.length + pubvkeyAsRaw.length)

    const cursor0 = new Cursor(concat0)
    cursor0.writeUint8OrThrow(0x12)
    cursor0.writeOrThrow(pubskeyAsRaw)
    cursor0.writeOrThrow(pubvkeyAsRaw)

    const checksum = keccak_256(concat0).subarray(0, 4)

    const concat1 = new Uint8Array(concat0.length + checksum.length)

    const cursor1 = new Cursor(concat1)
    cursor1.writeOrThrow(concat0)
    cursor1.writeOrThrow(checksum)

    return base58xmr.encode(concat1)
  }, [seedphrase, index])

  useEffect(() => {
    getMoneroOrThrow().then(setMonero).catch(console.error)
  }, [getMoneroOrThrow])

  return <Fragment>
    <SubpathProvider value={hash}>
      {hash.url.pathname === "/+" &&
        <PathPaper>
          <CryptoSubaccountMenu $entry={$entry} name={name} index={index} />
        </PathPaper>}
    </SubpathProvider>
    <div className="flex flex-col grow p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium">
          Crypto subaccount
        </h1>
        <AccountMenuAnchor />
      </div>
      <div className="h-6" />
      <div className="flex flex-col items-center justify-center">
        <CryptoAccountCard title={name} subtitle={title} color={color} index={index} />
      </div>
      <form className="grow flex flex-col"
        onSubmit={Events.preventDefault}>
        <input className="hidden"
          autoComplete="off"
          name="username" />
        <Fragment>
          <div className="h-6" />
          <div className="font-medium">
            Ethereum address
          </div>
          <div className="text-default-contrast">
            Your Ethereum (EVM, ERC20) address.
          </div>
          <div className="h-4" />
          <div className="bg-default-contrast po-2 rounded-xl flex flex-col gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
            <textarea className="w-full focus-visible:outline-none"
              rows={2}
              readOnly
              onFocus={e => e.currentTarget.select()}
              value={ethereum || ""} />
          </div>
        </Fragment>
        <Fragment>
          <div className="h-6" />
          <div className="font-medium">
            Solana address
          </div>
          <div className="text-default-contrast">
            Your Solana (SVM) address.
          </div>
          <div className="h-4" />
          <div className="bg-default-contrast po-2 rounded-xl flex flex-col gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
            <textarea className="w-full focus-visible:outline-none"
              rows={2}
              readOnly
              onFocus={e => e.currentTarget.select()}
              value={solana || ""} />
          </div>
        </Fragment>
        <Fragment>
          <div className="h-6" />
          <div className="font-medium">
            Bobine address
          </div>
          <div className="text-default-contrast">
            Your Bobine address.
          </div>
          <div className="h-4" />
          <div className="bg-default-contrast po-2 rounded-xl flex flex-col gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
            <textarea className="w-full focus-visible:outline-none"
              rows={2}
              readOnly
              onFocus={e => e.currentTarget.select()}
              value={bobine || ""} />
          </div>
        </Fragment>
        <Fragment>
          <div className="h-6" />
          <div className="font-medium">
            Monero address
          </div>
          <div className="text-default-contrast">
            Your Monero address.
          </div>
          <div className="h-4" />
          <div className="bg-default-contrast po-2 rounded-xl flex flex-col gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
            <textarea className="w-full focus-visible:outline-none"
              rows={2}
              readOnly
              onFocus={e => e.currentTarget.select()}
              value={monero || ""} />
          </div>
        </Fragment>
      </form>
    </div>
  </Fragment>
}

export function CryptoAccountExportPage(props: { $entry: KDBX.Inner.KeePassFile.Entry }) {
  const { $entry } = props

  const title = useMemo(() => {
    return $entry.getStringByKeyOrNull("Title")?.getValueOrThrow().get()
  }, [$entry])

  const color = useMemo(() => {
    return $entry.getStringByKeyOrNull("Color")?.getValueOrThrow().get()
  }, [$entry])

  const seedphrase = useMemo(() => {
    return $entry.getStringByKeyOrNull("SeedPhrase")?.getValueOrThrow().get()
  }, [$entry])

  const [moneroseedphrase, setMoneroSeedphrase] = useState<Nullable<string>>()

  const getMoneroSeedphraseOrThrow = useCallback(async () => {
    if (seedphrase == null)
      return

    const seed = new Ed25519SeedKey(await BitcoinSeedPhrase.derive(seedphrase))

    const xsig = await seed.derive("m/44'/128'/0'")

    const sigspreAsRaw = xsig.key
    const sigspreAsHex = sigspreAsRaw.toReversed().toHex()
    const sigspreAsNum = BigInt("0x" + sigspreAsHex)

    const sigskeyAsNum = sigspreAsNum % ed25519.Point.Fn.ORDER
    const sigskeyAsHex = sigskeyAsNum.toString(16).padStart(64, "0")
    const sigskeyAsRaw = Uint8Array.fromHex(sigskeyAsHex).toReversed()

    return MoneroSeedPhrase.encode(sigskeyAsRaw)
  }, [seedphrase])

  useEffect(() => {
    getMoneroSeedphraseOrThrow().then(setMoneroSeedphrase).catch(console.error)
  }, [getMoneroSeedphraseOrThrow])

  return <div className="flex flex-col grow p-6">
    <div className="flex items-center justify-between">
      <h1 className="text-xl font-medium">
        Export crypto account
      </h1>
    </div>
    <div className="h-6" />
    <div className="flex items-center justify-center">
      <CryptoAccountCard title={title} color={color} />
    </div>
    <form className="grow flex flex-col"
      onSubmit={Events.preventDefault}>
      <input className="hidden"
        autoComplete="off"
        name="username" />
      <Fragment>
        <div className="h-6" />
        <div className="font-medium">
          Seed phrase
        </div>
        <div className="text-default-contrast">
          Your BIP-39 seed phrase. Use this to recover your funds in most wallets.
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex flex-col gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <textarea className="w-full focus-visible:outline-none"
            rows={3}
            readOnly
            onFocus={e => e.currentTarget.select()}
            value={seedphrase} />
        </div>
      </Fragment>
      <Fragment>
        <div className="h-6" />
        <div className="font-medium">
          Seed phrase (Monero)
        </div>
        <div className="text-default-contrast">
          Your Monero seed phrase (derived from your BIP-39 seed phrase). Use this to recover your funds in Monero wallets.
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex flex-col gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <textarea className="w-full focus-visible:outline-none"
            rows={3}
            readOnly
            onFocus={e => e.currentTarget.select()}
            value={moneroseedphrase || ""} />
        </div>
      </Fragment>
    </form>
  </div>
}

export function CryptoSubaccountExportPage(props: { $entry: KDBX.Inner.KeePassFile.Entry } & { name: string } & { index: number }) {
  const { $entry, name, index } = props

  const title = useMemo(() => {
    return $entry.getStringByKeyOrNull("Title")?.getValueOrThrow().get()
  }, [$entry])

  const color = useMemo(() => {
    return $entry.getStringByKeyOrNull("Color")?.getValueOrThrow().get()
  }, [$entry])

  const seedphrase = useMemo(() => {
    return $entry.getStringByKeyOrNull("SeedPhrase")?.getValueOrThrow().get()
  }, [$entry])

  const [ethereum, setEthereum] = useState<Nullable<string>>()

  const getEthereumOrThrow = useCallback(async () => {
    if (seedphrase == null)
      return

    const seed = new BitcoinSeedKey(await BitcoinSeedPhrase.derive(seedphrase))

    const xsig = await seed.derive(`m/44'/60'/0'/0/${index}`)

    return `0x${xsig.key.toHex()}`
  }, [seedphrase, index])

  useEffect(() => {
    getEthereumOrThrow().then(setEthereum).catch(console.error)
  }, [getEthereumOrThrow])

  const [solana, setSolana] = useState<Nullable<string>>()

  const getSolanaOrThrow = useCallback(async () => {
    if (seedphrase == null)
      return

    const seed = new Ed25519SeedKey(await BitcoinSeedPhrase.derive(seedphrase))

    const xsig = await seed.derive(`m/44'/501'/${index}'/0'`)
    const upub = await Ed25519.publish(xsig.key)

    const concat = new Uint8Array(xsig.key.length + upub.length)

    const cursor = new Cursor(concat)
    cursor.writeOrThrow(xsig.key)
    cursor.writeOrThrow(upub)

    return base58.encode(concat)
  }, [seedphrase, index])

  useEffect(() => {
    getSolanaOrThrow().then(setSolana).catch(console.error)
  }, [getSolanaOrThrow])

  const [bobine, setBobine] = useState<Nullable<string>>()

  const getBobineOrThrow = useCallback(async () => {
    if (seedphrase == null)
      return

    const seed = new Ed25519SeedKey(await BitcoinSeedPhrase.derive(seedphrase))

    const xsig = await seed.derive(`m/44'/1'/${index}'/0'/0'`)
    const upub = await Ed25519.publish(xsig.key)

    const concat = new Uint8Array(xsig.key.length + upub.length)

    const cursor = new Cursor(concat)
    cursor.writeOrThrow(xsig.key)
    cursor.writeOrThrow(upub)

    return `0x${concat.toHex()}`
  }, [seedphrase, index])

  useEffect(() => {
    getBobineOrThrow().then(setBobine).catch(console.error)
  }, [getBobineOrThrow])

  const [monero, setMonero] = useState<Nullable<readonly [string, string, string, string]>>()

  const getMoneroOrThrow = useCallback(async () => {
    if (seedphrase == null)
      return

    const seed = new Ed25519SeedKey(await BitcoinSeedPhrase.derive(seedphrase))

    const xsig = await seed.derive(`m/44'/128'/${index}'`)

    const sigspreAsRaw = xsig.key
    const sigspreAsHex = sigspreAsRaw.toReversed().toHex()
    const sigspreAsNum = BigInt("0x" + sigspreAsHex)

    const sigskeyAsNum = sigspreAsNum % ed25519.Point.Fn.ORDER
    const sigskeyAsHex = sigskeyAsNum.toString(16).padStart(64, "0")
    const sigskeyAsRaw = Uint8Array.fromHex(sigskeyAsHex).toReversed()

    const sigvpreAsRaw = keccak_256(sigskeyAsRaw)
    const sigvpreAsHex = sigvpreAsRaw.toReversed().toHex()
    const sigvpreAsNum = BigInt("0x" + sigvpreAsHex)

    const sigvkeyAsNum = sigvpreAsNum % ed25519.Point.Fn.ORDER
    const sigvkeyAsHex = sigvkeyAsNum.toString(16).padStart(64, "0")
    const sigvkeyAsRaw = Uint8Array.fromHex(sigvkeyAsHex).toReversed()

    const pubskeyAsRaw = ed25519.Point.BASE.multiply(sigskeyAsNum).toBytes()
    const pubvkeyAsRaw = ed25519.Point.BASE.multiply(sigvkeyAsNum).toBytes()

    return [sigskeyAsRaw.toHex(), sigvkeyAsRaw.toHex(), pubskeyAsRaw.toHex(), pubvkeyAsRaw.toHex()] as const
  }, [seedphrase, index])

  useEffect(() => {
    getMoneroOrThrow().then(setMonero).catch(console.error)
  }, [getMoneroOrThrow])

  return <div className="flex flex-col grow p-6">
    <div className="flex items-center justify-between">
      <h1 className="text-xl font-medium">
        Export crypto subaccount
      </h1>
    </div>
    <div className="h-6" />
    <div className="flex flex-col items-center justify-center">
      <CryptoAccountCard title={name} subtitle={title} color={color} index={index} />
    </div>
    <form className="grow flex flex-col"
      onSubmit={Events.preventDefault}>
      <input className="hidden"
        autoComplete="off"
        name="username" />
      <Fragment>
        <div className="h-6" />
        <div className="font-medium">
          Ethereum private key
        </div>
        <div className="text-default-contrast">
          Your Ethereum (EVM, ERC20) private key in hexadecimal format.
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex flex-col gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <textarea className="w-full focus-visible:outline-none"
            rows={2}
            readOnly
            onFocus={e => e.currentTarget.select()}
            value={ethereum || ""} />
        </div>
      </Fragment>
      <Fragment>
        <div className="h-6" />
        <div className="font-medium">
          Solana private key
        </div>
        <div className="text-default-contrast">
          Your Solana (SVM) private key in base58 format.
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex flex-col gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <textarea className="w-full focus-visible:outline-none"
            rows={2}
            readOnly
            onFocus={e => e.currentTarget.select()}
            value={solana || ""} />
        </div>
      </Fragment>
      <Fragment>
        <div className="h-6" />
        <div className="font-medium">
          Bobine private key
        </div>
        <div className="text-default-contrast">
          Your Bobine private key in hexadecimal format.
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex flex-col gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <textarea className="w-full focus-visible:outline-none"
            rows={2}
            readOnly
            onFocus={e => e.currentTarget.select()}
            value={bobine || ""} />
        </div>
      </Fragment>
      <Fragment>
        <div className="h-6" />
        <div className="font-medium">
          Monero private spending key
        </div>
        <div className="text-default-contrast">
          Your Monero private spending key in hexadecimal format.
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex flex-col gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <textarea className="w-full focus-visible:outline-none"
            rows={2}
            readOnly
            onFocus={e => e.currentTarget.select()}
            value={monero?.[0] || ""} />
        </div>
      </Fragment>
      <Fragment>
        <div className="h-6" />
        <div className="font-medium">
          Monero private viewing key
        </div>
        <div className="text-default-contrast">
          Your Monero private viewing key in hexadecimal format.
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex flex-col gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <textarea className="w-full focus-visible:outline-none"
            rows={2}
            readOnly
            onFocus={e => e.currentTarget.select()}
            value={monero?.[1] || ""} />
        </div>
      </Fragment>
      <Fragment>
        <div className="h-6" />
        <div className="font-medium">
          Monero public spending key
        </div>
        <div className="text-default-contrast">
          Your Monero public spending key in hexadecimal format.
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex flex-col gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <textarea className="w-full focus-visible:outline-none"
            rows={2}
            readOnly
            onFocus={e => e.currentTarget.select()}
            value={monero?.[2] || ""} />
        </div>
      </Fragment>
      <Fragment>
        <div className="h-6" />
        <div className="font-medium">
          Monero public viewing key
        </div>
        <div className="text-default-contrast">
          Your Monero public viewing key in hexadecimal format.
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex flex-col gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <textarea className="w-full focus-visible:outline-none"
            rows={2}
            readOnly
            onFocus={e => e.currentTarget.select()}
            value={monero?.[3] || ""} />
        </div>
      </Fragment>
    </form>
  </div>
}