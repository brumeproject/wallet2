import { PathBoard } from "@/libs/dialog/board/mod.tsx";
import { PathPaper, WideNakedMenuAnchor } from "@/libs/dialog/paper/mod.tsx";
import { Ed25519 } from "@/libs/ed25519/mod.ts";
import { Events } from "@/libs/events/mod.ts";
import { Outline } from "@/libs/heroicons/mod.ts";
import { Nullable } from "@/libs/nullable/mod.ts";
import { BitcoinSeedPhrase } from "@hazae41/broca";
import { SubpathProvider, useAnchorWithCoords, useHashSubpath, usePathContext } from "@hazae41/chemin";
import { BitcoinSeedKey, Ed25519SeedKey } from "@hazae41/clade";
import { Cursor } from "@hazae41/cursor";
import * as KDBX from "@hazae41/kdbx";
import { ed25519 } from "@noble/curves/ed25519.js";
import { secp256k1 } from "@noble/curves/secp256k1.js";
import { keccak_256 } from "@noble/hashes/sha3.js";
import { base58, base58xmr } from "@scure/base";
import React, { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { AccountMenuAnchor, CryptoAccountCard } from "../../mod.tsx";

React;

export function CryptoSubaccountAnchor(props: { $entry: KDBX.Inner.KeePassFile.Entry } & { name: string } & { index: number }) {
  const { $entry, name, index } = props

  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, `/subaccount/${index}`)

  // const title = useMemo(() => {
  //   return $subentry.getStringByKeyOrNull("Title")?.getValueOrThrow().get()
  // }, [$subentry])

  const color = useMemo(() => {
    return $entry.getStringByKeyOrNull("Color")?.getValueOrThrow().get()
  }, [$entry])

  return <Fragment>
    <SubpathProvider value={hash}>
      {hash.url.pathname === `/subaccount/${index}` &&
        <PathBoard>
          <CryptoSubaccountPage $entry={$entry} name={name} index={index} />
        </PathBoard>}
    </SubpathProvider>
    <a className="group w-[320px] aspect-video p-4 z-10 rounded-xl bg-default text-default border-2 border-default-contrast select-none hover:translate-x-3 focus-visible:outline-none focus-visible:translate-x-3 transition-transform
      data-[color=red]:bg-red-400 
      data-[color=orange]:bg-orange-400 
      data-[color=amber]:bg-amber-400 
      data-[color=yellow]:bg-yellow-400 
      data-[color=lime]:bg-lime-400 
      data-[color=green]:bg-green-400 
      data-[color=emerald]:bg-emerald-400 
      data-[color=teal]:bg-teal-400 
      data-[color=cyan]:bg-cyan-400 
      data-[color=sky]:bg-sky-400 
      data-[color=blue]:bg-blue-400 
      data-[color=indigo]:bg-indigo-400 
      data-[color=violet]:bg-violet-400 
      data-[color=purple]:bg-purple-400 
      data-[color=fuchsia]:bg-fuchsia-400 
      data-[color=pink]:bg-pink-400 
      data-[color=rose]:bg-rose-400 
      in-dark:data-[color=red]:bg-red-500
      in-dark:data-[color=orange]:bg-orange-500
      in-dark:data-[color=amber]:bg-amber-500
      in-dark:data-[color=yellow]:bg-yellow-500
      in-dark:data-[color=lime]:bg-lime-500
      in-dark:data-[color=green]:bg-green-500
      in-dark:data-[color=emerald]:bg-emerald-500
      in-dark:data-[color=teal]:bg-teal-500
      in-dark:data-[color=cyan]:bg-cyan-500
      in-dark:data-[color=sky]:bg-sky-500
      in-dark:data-[color=blue]:bg-blue-500
      in-dark:data-[color=indigo]:bg-indigo-500
      in-dark:data-[color=violet]:bg-violet-500
      in-dark:data-[color=purple]:bg-purple-500
      in-dark:data-[color=fuchsia]:bg-fuchsia-500
      in-dark:data-[color=pink]:bg-pink-500
      in-dark:data-[color=rose]:bg-rose-500"
      style={{ transform: `translateY(-${index * 120}px)` }}
      data-theme={color == null ? "opposite" : "dark"}
      data-color={color}
      href={coords.url.hash}
      onClick={coords.onClick}
      onKeyDown={coords.onKeyDown}>
      <div className="flex items-center justify-between">
        <div className="font-medium text-xl">
          {name}
        </div>
        <div className="font-medium text-xl text-default-half-contrast">
          #{index + 1}
        </div>
      </div>
    </a>
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
        {/* <Fragment>
          <div className="h-6" />
          <div className="font-medium">
            Tokens
          </div>
          <div className="text-default-contrast">
            Your asset balances.
          </div>
          <div className="h-4" />
          <div className="flex flex-col border border-default-contrast items-center rounded-xl p-6 gap-2">
            <GenericAccountCard title="Ether" subtitle={["= 0.00 ETH", "≈ 0.00 USD"].join("\n")} color="indigo" type="Ethereum" icon={<Outline.CubeIcon className="size-5" />} />
            <GenericAccountCard title="Solana" subtitle={["= 0.00 SOL", "≈ 0.00 USD"].join("\n")} color="purple" type="Solana" icon={<Outline.CubeIcon className="size-5" />} />
            <GenericAccountCard title="Monero" subtitle={["= 0.00 XMR", "≈ 0.00 USD"].join("\n")} color="orange" type="Monero" icon={<Outline.CubeIcon className="size-5" />} />
          </div>
        </Fragment> */}
      </form>
    </div>
  </Fragment>
}

export function CryptoSubaccountAddressMenuAnchor() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, "/address")

  return <WideNakedMenuAnchor
    href={coords.url.hash}
    onClick={coords.onClick}
    onKeyDown={coords.onKeyDown}>
    <Outline.AtSymbolIcon className="size-5" />
    Address
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

export function CryptoSubaccountMenu(props: { $entry: KDBX.Inner.KeePassFile.Entry } & { name: string } & { index: number }) {
  const { $entry, name, index } = props

  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  return <Fragment>
    <SubpathProvider value={hash}>
      {hash.url.pathname === "/address" &&
        <PathBoard>
          <CryptoSubaccountAddressPage $entry={$entry} name={name} index={index} />
        </PathBoard>}
      {hash.url.pathname === "/export" &&
        <PathBoard>
          <CryptoSubaccountExportPage $entry={$entry} name={name} index={index} />
        </PathBoard>}
    </SubpathProvider>
    <div className="flex flex-col text-left gap-2">
      <CryptoSubaccountAddressMenuAnchor />
      <CryptoSubaccountExportMenuAnchor />
    </div>
  </Fragment>
}

export function CryptoSubaccountAddressPage(props: { $entry: KDBX.Inner.KeePassFile.Entry } & { name: string } & { index: number }) {
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

  return <div className="flex flex-col grow p-6">
    <div className="flex items-center justify-between">
      <h1 className="text-xl font-medium">
        Address crypto subaccount
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