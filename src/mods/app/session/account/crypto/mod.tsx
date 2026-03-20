import { WideOppositeButton } from "@/libs/button/mod.tsx";
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
import { AccountCard, AccountMenuAnchor, AccountMenuDeleteButton, AccountMenuTrashButton, AccountMenuUntrashButton, ColorAnchor, ColorMenu } from "../mod.tsx";

React;

export function CryptoAccountPage(props: { $entry: KDBX.Inner.KeePassFile.Entry }) {
  const { $entry } = props

  const close = useCloseContext().getOrThrow()

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

  const bitcoinseed = useMemo(() => {
    return $entry.getStringByKeyOrNull("SeedPhrase")?.getValueOrThrow().get()
  }, [$entry])

  const [ethereum, setEthereum] = useState<Nullable<string>>()

  const getEthereumOrThrow = useCallback(async () => {
    if (bitcoinseed == null)
      return

    const seed = new BitcoinSeedKey(await BitcoinSeedPhrase.derive(bitcoinseed))

    const xsig = await seed.derive("m/44'/60'/0'/0/0")
    const upub = secp256k1.getPublicKey(xsig.key, false)

    return `0x${keccak_256(upub.slice(1)).slice(-20).toHex()}`
  }, [bitcoinseed])

  useEffect(() => {
    getEthereumOrThrow().then(setEthereum).catch(console.error)
  }, [getEthereumOrThrow])

  const [solana, setSolana] = useState<Nullable<string>>()

  const getSolanaOrThrow = useCallback(async () => {
    if (bitcoinseed == null)
      return

    const seed = new Ed25519SeedKey(await BitcoinSeedPhrase.derive(bitcoinseed))

    const xsig = await seed.derive("m/44'/501'/0'/0'")
    const upub = await Ed25519.publish(xsig.key)

    return base58.encode(upub)
  }, [bitcoinseed])

  useEffect(() => {
    getSolanaOrThrow().then(setSolana).catch(console.error)
  }, [getSolanaOrThrow])

  const [bobine, setBobine] = useState<Nullable<string>>()

  const getBobineOrThrow = useCallback(async () => {
    if (bitcoinseed == null)
      return

    const seed = new Ed25519SeedKey(await BitcoinSeedPhrase.derive(bitcoinseed))

    const xsig = await seed.derive("m/44'/1'/0'/0'/0'")
    const upub = await Ed25519.publish(xsig.key)

    const hash = new Uint8Array(await crypto.subtle.digest("SHA-256", upub))

    return `0x${hash.toHex()}`
  }, [bitcoinseed])

  useEffect(() => {
    getBobineOrThrow().then(setBobine).catch(console.error)
  }, [getBobineOrThrow])

  const [moneroseed, setMoneroSeed] = useState<Nullable<string>>()

  const getMoneroSeedOrThrow = useCallback(async () => {
    if (bitcoinseed == null)
      return

    const seed = new Ed25519SeedKey(await BitcoinSeedPhrase.derive(bitcoinseed))

    const xsig = await seed.derive("m/44'/128'/0'")

    const sigspreAsRaw = xsig.key
    const sigspreAsHex = sigspreAsRaw.toReversed().toHex()
    const sigspreAsNum = BigInt("0x" + sigspreAsHex)

    const sigskeyAsNum = sigspreAsNum % ed25519.Point.Fn.ORDER
    const sigskeyAsHex = sigskeyAsNum.toString(16).padStart(64, "0")
    const sigskeyAsRaw = Uint8Array.fromHex(sigskeyAsHex).toReversed()

    return MoneroSeedPhrase.encode(sigskeyAsRaw)
  }, [bitcoinseed])

  useEffect(() => {
    getMoneroSeedOrThrow().then(setMoneroSeed).catch(console.error)
  }, [getMoneroSeedOrThrow])

  const [monero, setMonero] = useState<Nullable<string>>()

  const getMoneroOrThrow = useCallback(async () => {
    if (bitcoinseed == null)
      return

    const seed = new Ed25519SeedKey(await BitcoinSeedPhrase.derive(bitcoinseed))

    const xsig = await seed.derive("m/44'/128'/0'")

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
  }, [bitcoinseed])

  useEffect(() => {
    getMoneroOrThrow().then(setMonero).catch(console.error)
  }, [getMoneroOrThrow])

  const notes = useMemo(() => {
    return $entry.getStringByKeyOrNull("Notes")?.getValueOrThrow().get()
  }, [$entry])

  return <div className="flex flex-col grow p-6">
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
    <div className="flex items-center justify-between">
      <h1 className="text-xl font-medium">
        Crypto account
      </h1>
      <AccountMenuAnchor />
    </div>
    <div className="h-6" />
    <div className="flex items-center justify-center">
      <AccountCard $entry={$entry} />
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
          Your EVM address
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
          Your SVM address
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
          Your Bobine address
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
          Your Monero address
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
      {bitcoinseed && <Fragment>
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
            rows={3}
            readOnly
            onFocus={e => e.currentTarget.select()}
            value={bitcoinseed} />
        </div>
      </Fragment>}
      {moneroseed && <Fragment>
        <div className="h-6" />
        <div className="font-medium">
          Monero seed phrase
        </div>
        <div className="text-default-contrast">
          Your Monero mnemonic seed phrase
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex flex-col gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <textarea className="w-full focus-visible:outline-none"
            rows={3}
            readOnly
            onFocus={e => e.currentTarget.select()}
            value={moneroseed} />
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
            {seedphrase.split(" ").at(0)}
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