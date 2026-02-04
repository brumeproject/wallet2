import { InAnchor, OppositeAnchor } from "@/libs/anchor/mod.tsx";
import { InButton } from "@/libs/button/mod.tsx";
import { PathBoard } from "@/libs/dialog/board/mod.tsx";
import { PathPaper, WideNakedMenuAnchor } from "@/libs/dialog/paper/mod.tsx";
import { Outline } from "@/libs/heroicons/mod.ts";
import { getEntryColor, getEntryTitle, getEntryType } from "@/libs/kdbx/mod.ts";
import { Nullable } from "@/libs/nullable/mod.tsx";
import { SubpathProvider, useAnchorWithCoords, useHashSubpath, usePathContext } from "@hazae41/chemin";
import * as KDBX from "@hazae41/kdbx";
import React, { Fragment, MouseEvent, useCallback, useMemo, useState } from "react";
import { flushSync } from "react-dom";
import { CardAccountAddMenuAnchor, CardAccountAddPage, CardAccountPage } from "./card/mod.tsx";
import { EthereumAccountAddMenuAnchor, EthereumAccountPage, StandaloneEthereumAccountAddPage } from "./ethereum/mod.tsx";
import { MoneroAccountAddMenuAnchor, MoneroAccountPage, StandaloneMoneroAccountAddPage } from "./monero/mod.tsx";
import { PasswordAccountAddMenuAnchor, PasswordAccountAddPage, PasswordAccountPage } from "./password/mod.tsx";
import { SeedAccountAddMenuAnchor, SeedAccountAddPage, SeedAccountPage } from "./seed/mod.tsx";
import { SolanaAccountAddMenuAnchor, SolanaAccountPage, StandaloneSolanaAccountAddPage } from "./solana/mod.tsx";

React;

export function AccountAddButtonInGrid() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, "/add")

  return <a className="group w-[320px] aspect-video rounded-xl border-2 border-dashed border-default-contrast focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-default-contrast"
    href={coords.url.hash}
    onClick={coords.onClick}
    onKeyDown={coords.onKeyDown}>
    <InAnchor>
      <Outline.PlusIcon className="size-8" />
    </InAnchor>
  </a>
}

export function AccountCardInGrid(props: { $entry: KDBX.Inner.KeePassFile.Entry }) {
  const { $entry } = props

  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const uuid = useMemo(() => {
    return $entry.getUuidOrThrow().getOrThrow()
  }, [$entry])

  const coords = useAnchorWithCoords(hash, `/account/${uuid}`)

  return <Fragment>
    <SubpathProvider value={hash}>
      {hash.url.pathname === `/account/${uuid}` &&
        <PathBoard>
          {(() => {
            const type = getEntryType($entry)

            if (type === "password")
              return <PasswordAccountPage $entry={$entry} />

            if (type === "card")
              return <CardAccountPage $entry={$entry} />

            if (type === "ethereum")
              return <EthereumAccountPage $entry={$entry} />

            if (type === "solana")
              return <SolanaAccountPage $entry={$entry} />

            if (type === "bitcoin")
              return // <SessionBitcoinAccountPage $entry={$entry} />

            if (type === "monero")
              return <MoneroAccountPage $entry={$entry} />

            if (type === "seed")
              return <SeedAccountPage $entry={$entry} />

            return null
          })()}
        </PathBoard>}
    </SubpathProvider>
    <a className="w-[320px] aspect-video flex flex-col p-4 rounded-xl text-left bg-default text-default select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-default
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
    data-[color=rose]:bg-rose-500/90
    focus-visible:data-[color=red]:outline-red-500/90 
    focus-visible:data-[color=orange]:outline-orange-500/90
    focus-visible:data-[color=amber]:outline-amber-500/90
    focus-visible:data-[color=yellow]:outline-yellow-500/90
    focus-visible:data-[color=lime]:outline-lime-500/90
    focus-visible:data-[color=green]:outline-green-500/90
    focus-visible:data-[color=emerald]:outline-emerald-500/90
    focus-visible:data-[color=teal]:outline-teal-500/90
    focus-visible:data-[color=cyan]:outline-cyan-500/90
    focus-visible:data-[color=sky]:outline-sky-500/90
    focus-visible:data-[color=blue]:outline-blue-500/90
    focus-visible:data-[color=indigo]:outline-indigo-500/90
    focus-visible:data-[color=violet]:outline-violet-500/90
    focus-visible:data-[color=purple]:outline-purple-500/90
    focus-visible:data-[color=fuchsia]:outline-fuchsia-500/90
    focus-visible:data-[color=pink]:outline-pink-500/90
    focus-visible:data-[color=rose]:outline-rose-500/90"
      data-theme={getEntryColor($entry) == null ? "opposite" : "dark"}
      data-color={getEntryColor($entry)}
      href={coords.url.hash}
      onClick={coords.onClick}
      onKeyDown={coords.onKeyDown}>
      <div className="font-medium text-xl text-wrap wrap-anywhere truncate">
        {getEntryTitle($entry) || "Untitled"}
      </div>
      <div className="h-2" />
      <div className="text-default-half-contrast text-wrap wrap-anywhere truncate">
        {(() => {
          const type = getEntryType($entry)

          if (type === "password")
            return $entry.getDirectStringByKeyOrNull("UserName")?.getValueOrThrow().get()

          if (type === "card")
            return $entry.getDirectStringByKeyOrNull("CardNumber")?.getValueOrThrow().get()

          if (type === "ethereum")
            return $entry.getDirectStringByKeyOrNull("EthereumAddress")?.getValueOrThrow().get()

          if (type === "solana")
            return $entry.getDirectStringByKeyOrNull("SolanaAddress")?.getValueOrThrow().get()

          if (type === "bitcoin")
            return $entry.getDirectStringByKeyOrNull("BitcoinAddress")?.getValueOrThrow().get()

          if (type === "monero")
            return $entry.getDirectStringByKeyOrNull("MoneroAddress")?.getValueOrThrow().get().slice(0, 56) + "..."

          if (type === "seed")
            return $entry.getDirectStringByKeyOrNull("SeedPhrase")?.getValueOrThrow().get().split(" ").at(0)

          return null
        })()}
      </div>
      <div className="h-4 grow" />
      <div className="flex flex-wrap items-center gap-2">
        {(() => {
          const type = getEntryType($entry)

          if (type === "card")
            return <div className="bg-default-contrast rounded-xl po-1 flex items-center gap-2">
              <Outline.CreditCardIcon className="size-5" />
              Card
            </div>

          if (type === "ethereum")
            return <div className="bg-default-contrast rounded-xl po-1 flex items-center gap-2">
              <Outline.BanknotesIcon className="size-5" />
              Ethereum
            </div>

          if (type === "solana")
            return <div className="bg-default-contrast rounded-xl po-1 flex items-center gap-2">
              <Outline.BanknotesIcon className="size-5" />
              Solana
            </div>

          if (type === "bitcoin")
            return <div className="bg-default-contrast rounded-xl po-1 flex items-center gap-2">
              <Outline.BanknotesIcon className="size-5" />
              Bitcoin
            </div>

          if (type === "monero")
            return <div className="bg-default-contrast rounded-xl po-1 flex items-center gap-2">
              <Outline.BanknotesIcon className="size-5" />
              Monero
            </div>

          if (type === "seed")
            return <div className="bg-default-contrast rounded-xl po-1 flex items-center gap-2">
              <Outline.SparklesIcon className="size-5" />
              Seed
            </div>

          if (type === "password")
            return <div className="bg-default-contrast rounded-xl po-1 flex items-center gap-2">
              <Outline.LanguageIcon className="size-5" />
              Password
            </div>

          return null
        })()}
      </div>
    </a>
  </Fragment>
}

export function AccountCard(props: { $entry: KDBX.Inner.KeePassFile.Entry }) {
  const { $entry } = props

  const [flipping, setFlipping] = useState(false)
  const [flipped, setFlipped] = useState(false)

  const onAnimationEnd = useCallback(() => {
    flushSync(() => setFlipped(flipping))
  }, [flipping])

  const onClick = useCallback((e: MouseEvent<HTMLDivElement>) => {
    setFlipping(f => !f)
  }, [])

  return <div className="w-[320px] aspect-video perspective-[640px]">
    <div className="h-full w-full data-[flip=true]:animate-flip-in data-[unflip=true]:animate-flip-out data-[flipped=true]:rotate-y-180 transform-3d relative rounded-xl bg-default text-default select-none
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
      data-flip={flipping && !flipped}
      data-unflip={!flipping && flipped}
      data-flipped={flipping && flipped}
      data-theme={getEntryColor($entry) == null ? "opposite" : "dark"}
      data-color={getEntryColor($entry)}
      onAnimationEnd={onAnimationEnd}
      onClick={onClick}>
      <div className="absolute inset-0 p-4 flex flex-col backface-hidden overflow-hidden">
        <div className="font-medium text-xl text-wrap wrap-anywhere truncate">
          {getEntryTitle($entry) || "Untitled"}
        </div>
        <div className="h-2" />
        <div className="text-default-half-contrast text-wrap wrap-anywhere truncate">
          {(() => {
            const type = getEntryType($entry)

            if (type === "password")
              return $entry.getDirectStringByKeyOrNull("UserName")?.getValueOrThrow().get()

            if (type === "card")
              return $entry.getDirectStringByKeyOrNull("CardNumber")?.getValueOrThrow().get()

            if (type === "ethereum")
              return $entry.getDirectStringByKeyOrNull("EthereumAddress")?.getValueOrThrow().get()

            if (type === "solana")
              return $entry.getDirectStringByKeyOrNull("SolanaAddress")?.getValueOrThrow().get()

            if (type === "bitcoin")
              return $entry.getDirectStringByKeyOrNull("BitcoinAddress")?.getValueOrThrow().get()

            if (type === "monero")
              return $entry.getDirectStringByKeyOrNull("MoneroAddress")?.getValueOrThrow().get().slice(0, 56) + "..."

            if (type === "seed")
              return $entry.getDirectStringByKeyOrNull("SeedPhrase")?.getValueOrThrow().get().split(" ").at(0)

            return null
          })()}
        </div>
        <div className="h-4 grow" />
        <div className="flex flex-wrap items-center gap-2">
          {(() => {
            const type = getEntryType($entry)

            if (type === "card")
              return <div className="bg-default-contrast rounded-xl po-1 flex items-center gap-2">
                <Outline.CreditCardIcon className="size-5" />
                Card
              </div>

            if (type === "ethereum")
              return <div className="bg-default-contrast rounded-xl po-1 flex items-center gap-2">
                <Outline.BanknotesIcon className="size-5" />
                Ethereum
              </div>

            if (type === "solana")
              return <div className="bg-default-contrast rounded-xl po-1 flex items-center gap-2">
                <Outline.BanknotesIcon className="size-5" />
                Solana
              </div>

            if (type === "bitcoin")
              return <div className="bg-default-contrast rounded-xl po-1 flex items-center gap-2">
                <Outline.BanknotesIcon className="size-5" />
                Bitcoin
              </div>

            if (type === "monero")
              return <div className="bg-default-contrast rounded-xl po-1 flex items-center gap-2">
                <Outline.BanknotesIcon className="size-5" />
                Monero
              </div>

            if (type === "seed")
              return <div className="bg-default-contrast rounded-xl po-1 flex items-center gap-2">
                <Outline.SparklesIcon className="size-5" />
                Seed
              </div>

            if (type === "password")
              return <div className="bg-default-contrast rounded-xl po-1 flex items-center gap-2">
                <Outline.LanguageIcon className="size-5" />
                Password
              </div>

            return null
          })()}
        </div>
      </div>
      <div className="absolute inset-0 p-4 flex items-center justify-center backface-hidden overflow-hidden rotate-y-180">
        <div className="font-mono text-default-half-contrast whitespace-pre-wrap">
          {`
00100010 01010110 01101001
01110010 01100101 01110011
00100000 01101001 01101110
00100000 01101110 01110101
01101101 01100101 01110010
01101001 01110011 00100010
        `.trim()}
        </div>
      </div>
    </div>
  </div>
}

export function AccountAddButton() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, "/add")

  return <OppositeAnchor
    href={coords.url.hash}
    onClick={coords.onClick}
    onKeyDown={coords.onKeyDown}>
    <Outline.PlusIcon className="size-5" />
    Add account
  </OppositeAnchor>
}

export function AccountAddMenu() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  return <Fragment>
    <SubpathProvider value={hash}>
      {hash.url.pathname === "/password" &&
        <PathBoard>
          <PasswordAccountAddPage />
        </PathBoard>}
      {hash.url.pathname === "/crypto" &&
        <PathPaper>
          <CryptoAccountAddMenu />
        </PathPaper>}
      {hash.url.pathname === "/card" &&
        <PathBoard>
          <CardAccountAddPage />
        </PathBoard>}
      {hash.url.pathname === "/seed" &&
        <PathBoard>
          <SeedAccountAddPage />
        </PathBoard>}
    </SubpathProvider>
    <div className="flex flex-col text-left gap-2">
      <PasswordAccountAddMenuAnchor />
      <CryptoAccountAddMenuAnchor />
      <CardAccountAddMenuAnchor />
      <SeedAccountAddMenuAnchor />
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
    <Outline.BanknotesIcon className="size-5" />
    Crypto
  </WideNakedMenuAnchor>
}

export function CryptoAccountAddMenu() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  return <Fragment>
    <SubpathProvider value={hash}>
      {hash.url.pathname === "/ethereum" &&
        <PathBoard>
          <StandaloneEthereumAccountAddPage />
        </PathBoard>}
      {hash.url.pathname === "/solana" &&
        <PathBoard>
          <StandaloneSolanaAccountAddPage />
        </PathBoard>}
      {hash.url.pathname === "/bitcoin" &&
        <PathBoard>
          {/* <StandaloneBitcoinAccountAddPage /> */}
        </PathBoard>}
      {hash.url.pathname === "/monero" &&
        <PathBoard>
          <StandaloneMoneroAccountAddPage />
        </PathBoard>
      }
    </SubpathProvider>
    <div className="flex flex-col text-left gap-2">
      <EthereumAccountAddMenuAnchor />
      <WideNakedMenuAnchor aria-disabled>
        Bitcoin
      </WideNakedMenuAnchor>
      <SolanaAccountAddMenuAnchor />
      <MoneroAccountAddMenuAnchor />
    </div>
  </Fragment>
}

export function ColorAnchor(props: { color?: Nullable<string> }) {
  const { color } = props

  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, "/color")

  return <a className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none"
    href={coords.url.hash}
    onClick={coords.onClick}
    onKeyDown={coords.onKeyDown}>
    <InAnchor>
      <div className="size-5 rounded-full bg-opposite
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
        data-color={color} />
    </InAnchor>
  </a>
}

export function ColorMenu(props: { ok(color: Nullable<string>): void }) {
  const { ok } = props

  return <div className="grid grid-cols-6 grid-auto-rows gap-2">
    <button className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none"
      onClick={() => ok(null)}
      type="button">
      <InButton>
        <div className="size-5 rounded-full bg-opposite" />
      </InButton>
    </button>
    {["red", "orange", "amber", "yellow", "lime", "green", "emerald", "teal", "cyan", "sky", "blue", "indigo", "violet", "purple", "fuchsia", "pink", "rose"].map(color =>
      <Fragment key={color}>
        <button className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none"
          onClick={() => ok(color)}
          type="button">
          <InButton>
            <div className="size-5 rounded-full
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
              data-color={color} />
          </InButton>
        </button>
      </Fragment>)}
  </div>
}