import { ContrastAnchor, InAnchor, OppositeAnchor } from "@/libs/anchor/mod.tsx";
import { PathBoard } from "@/libs/dialog/board/mod.tsx";
import { PathPaper, WideNakedMenuAnchor, WideNakedMenuButton } from "@/libs/dialog/paper/mod.tsx";
import { useAutoFocus } from "@/libs/focus/mod.ts";
import { Outline } from "@/libs/heroicons/mod.ts";
import { getEntryColor, getEntryFilter, getEntryTitle, getEntryType } from "@/libs/kdbx/mod.ts";
import { Nullable } from "@/libs/nullable/mod.tsx";
import { ChildrenProps } from "@/libs/props/mod.ts";
import { Writable } from "@hazae41/binary";
import { SubpathProvider, useAnchorWithCoords, useHashSubpath, usePathContext, useSearchState } from "@hazae41/chemin";
import * as KDBX from "@hazae41/kdbx";
import { useCloseContext } from "@hazae41/react-close-context";
import { Option } from "@hazae41/result-and-option";
import React, { createContext, Fragment, MouseEvent, useCallback, useContext, useDeferredValue, useMemo, useState } from "react";
import { flushSync } from "react-dom";
import { InButton, WideOppositeButton } from "../../../libs/button/mod.tsx";
import { Errors } from "../../../libs/errors/mod.ts";
import { UserData } from "../user/mod.tsx";
import { SessionCardAccountPage, SessionCardAddAnchor, SessionCardAddPage } from "./card/mod.tsx";
import { SessionPasswordAccountPage, SessionPasswordAddAnchor, SessionPasswordAddPage } from "./password/mod.tsx";
import { SessionSeedAccountPage, SessionSeedAddAnchor, SessionSeedAddPage } from "./seed/mod.tsx";
import { SessionSolanaAccountPage, SessionSolanaAddAnchor, SessionSolanaAddPage } from "./solana/mod.tsx";

React;

export interface SessionData {
  readonly user: UserData
  readonly kdbx: KDBX.Database.Decrypted
}

export interface SessionHandle {

  readonly value: SessionData

  update: () => void

}

export const SessionContext = createContext<Nullable<SessionHandle>>(null)

export function useSessionContext() {
  return Option.wrap(useContext(SessionContext))
}

export function SessionProvider(props: ChildrenProps & { value: SessionData }) {
  const { children, value } = props

  const [counter, setCounter] = useState(0)

  const update = useCallback(() => {
    setCounter(c => c + 1)
  }, [])

  const handle = useMemo(() => {
    return { value, update }
  }, [value, update, counter])

  return <SessionContext.Provider value={handle}>
    {children}
  </SessionContext.Provider>
}

export function SessionPage() {
  const close = useCloseContext().getOrThrow()

  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const session = useSessionContext().getOrThrow()

  const [display, setDisplay] = useState(false)

  const [search, setSearch] = useSearchState(path, "search")
  const [filter, setFilter] = useSearchState(path, "filter")

  useMemo(() => {
    if (!filter)
      return
    setDisplay(true)
  }, [filter])

  useMemo(() => {
    if (!search)
      return
    setDisplay(true)
  }, [search])

  const entries = useMemo(() => {
    const elements = [...session.value.kdbx.inner.content.value.document.querySelectorAll("Entry")]
    const currents = elements.filter(e => !e.closest("History"))

    const entries = currents.map(e => new KDBX.Inner.KeePassFile.Entry(e))

    return entries
  }, [session])

  const visibles = useMemo(() => {
    if (!filter && !search)
      return entries

    return entries.filter($entry => {
      if (!filter)
        return search ? $entry.element.innerHTML.toLowerCase().includes(search.toLowerCase()) : true

      if (filter === getEntryFilter($entry))
        return search ? $entry.element.innerHTML.toLowerCase().includes(search.toLowerCase()) : true

      // if (filter === "trash" && $entry.getParentGroupOrThrow().isDeleted())
      //   return true

      return false
    })
  }, [entries, filter, search])

  const logout = useCallback(() => {
    close()
  }, [close])

  return <Fragment>
    <SubpathProvider value={hash}>
      {hash.url.pathname === "/menu" &&
        <PathPaper>
          <SessionMoreMenu logout={logout} />
        </PathPaper>}
      {hash.url.pathname === "/add" &&
        <PathPaper>
          <SessionAccountAddMenu />
        </PathPaper>}
    </SubpathProvider>
    <div className="grow flex flex-col p-6 overflow-y-auto">
      {!display &&
        <div className="grow flex flex-col text-center items-center justify-center">
          <h1 className="text-5xl md:text-6xl font-medium">
            Welcome back, {session.value.user.name}
          </h1>
          <div className="h-4" />
          <div className="text-center text-default-contrast text-xl md:text-2xl">
            You have {entries.length} accounts in your wallet
          </div>
          <div className="h-16" />
          <div className="flex flex-col items-center gap-4">
            <SessionAccountAddButton />
            <ContrastAnchor onClick={() => setDisplay(true)}>
              <Outline.EyeIcon className="size-5" />
              See accounts
            </ContrastAnchor>
          </div>
        </div>}
      {display &&
        <div className="grow flex flex-col overflow-y-auto border border-default-contrast rounded-xl py-3 px-1">
          <div className="grow flex flex-col overflow-y-auto overscroll-y-none py-1 px-3">
            <div className="grow grid grid-cols-[repeat(auto-fit,320px)] justify-center content-center gap-4">
              {visibles.map($entry =>
                <Fragment key={$entry.getUuidOrThrow().getOrThrow()}>
                  <SessionAccountCardInGrid $entry={$entry} />
                </Fragment>)}
              {filter !== "trash" && <Fragment>
                <SessionAccountAddButtonInGrid />
              </Fragment>}
            </div>
          </div>
        </div>}
      <div className="h-4 shrink-0" />
      <div className="flex flex-wrap items-center gap-2">
        <button className="bg-default-contrast aria-selected:bg-opposite aria-selected:text-opposite rounded-xl po-1 flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-default-contrast aria-selected:focus-visible:outline-opposite"
          type="button"
          aria-selected={filter === "password"}
          onClick={() => filter === "password" ? setFilter(undefined) : setFilter("password")}>
          <Outline.LanguageIcon className="size-5" />
          Passwords
        </button>
        <button className="bg-default-contrast aria-selected:bg-opposite aria-selected:text-opposite rounded-xl po-1 flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-default-contrast aria-selected:focus-visible:outline-opposite"
          type="button"
          aria-selected={filter === "crypto"}
          onClick={() => filter === "crypto" ? setFilter(undefined) : setFilter("crypto")}>
          <Outline.BanknotesIcon className="size-5" />
          Cryptos
        </button>
        <button className="bg-default-contrast aria-selected:bg-opposite aria-selected:text-opposite rounded-xl po-1 flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-default-contrast aria-selected:focus-visible:outline-opposite"
          type="button"
          aria-selected={filter === "card"}
          onClick={() => filter === "card" ? setFilter(undefined) : setFilter("card")}>
          <Outline.CreditCardIcon className="size-5" />
          Cards
        </button>
        <button className="bg-default-contrast aria-selected:bg-opposite aria-selected:text-opposite rounded-xl po-1 flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-default-contrast aria-selected:focus-visible:outline-opposite"
          type="button"
          aria-selected={filter === "seed"}
          onClick={() => filter === "seed" ? setFilter(undefined) : setFilter("seed")}>
          <Outline.SparklesIcon className="size-5" />
          Seeds
        </button>
        <button className="bg-default-contrast aria-selected:bg-opposite aria-selected:text-opposite rounded-xl po-1 flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-default-contrast aria-selected:focus-visible:outline-opposite"
          type="button"
          aria-selected={filter === "trash"}
          onClick={() => filter === "trash" ? setFilter(undefined) : setFilter("trash")}>
          <Outline.TrashIcon className="size-5" />
          Trash
        </button>
      </div>
      <div className="h-4 shrink-0" />
      <div className="flex items-center gap-2">
        <SessionMoreButton />
        <div className="grow bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <Outline.MagnifyingGlassIcon className="size-5" />
          <input className="w-full focus-visible:outline-none"
            autoComplete="off"
            placeholder="Search"
            onChange={e => setSearch(e.target.value)}
            ref={useAutoFocus()}
            value={search || ""} />
        </div>
      </div>
    </div>
  </Fragment>
}

function SessionAccountAddButtonInGrid() {
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

function SessionAccountCardInGrid(props: { $entry: KDBX.Inner.KeePassFile.Entry }) {
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
              return <SessionPasswordAccountPage $entry={$entry} />

            if (type === "card")
              return <SessionCardAccountPage $entry={$entry} />

            if (type === "ethereum")
              return // <SessionEthereumAccountPage $entry={$entry} />

            if (type === "solana")
              return <SessionSolanaAccountPage $entry={$entry} />

            if (type === "bitcoin")
              return // <SessionBitcoinAccountPage $entry={$entry} />

            if (type === "monero")
              return // <SessionMoneroAccountPage $entry={$entry} />

            if (type === "seed")
              return <SessionSeedAccountPage $entry={$entry} />

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
            return $entry.getDirectStringByKeyOrNull("MoneroAddress")?.getValueOrThrow().get()

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

export function SessionAccountCard(props: { $entry: KDBX.Inner.KeePassFile.Entry }) {
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
    <div className="h-full w-full overflow-hidden data-[flip=true]:animate-flip-in data-[unflip=true]:animate-flip-out data-[flipped=true]:rotate-y-180 transform-3d relative rounded-xl bg-default text-default select-none
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
      <div className="absolute inset-0 p-4 flex flex-col backface-hidden">
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
              return $entry.getDirectStringByKeyOrNull("MoneroAddress")?.getValueOrThrow().get()

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
      <div className="absolute inset-0 p-4 flex items-center justify-center backface-hidden rotate-y-180">
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

function SessionAccountAddButton() {
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

function SessionAccountAddMenu() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  return <Fragment>
    <SubpathProvider value={hash}>
      {hash.url.pathname === "/password" &&
        <PathBoard>
          <SessionPasswordAddPage />
        </PathBoard>}
      {hash.url.pathname === "/crypto" &&
        <PathPaper>
          <SessionCryptoAddMenu />
        </PathPaper>}
      {hash.url.pathname === "/card" &&
        <PathBoard>
          <SessionCardAddPage />
        </PathBoard>}
      {hash.url.pathname === "/seed" &&
        <PathBoard>
          <SessionSeedAddPage />
        </PathBoard>}
    </SubpathProvider>
    <div className="flex flex-col text-left gap-2">
      <SessionPasswordAddAnchor />
      <SessionCryptoAddAnchor />
      <SessionCardAddAnchor />
      <SessionSeedAddAnchor />
    </div>
  </Fragment>
}

function SessionCryptoAddAnchor() {
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

function SessionCryptoAddMenu() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  return <Fragment>
    <SubpathProvider value={hash}>
      {hash.url.pathname === "/solana" &&
        <PathBoard>
          <SessionSolanaAddPage />
        </PathBoard>}
    </SubpathProvider>
    <div className="flex flex-col text-left gap-2">
      <SessionCryptoEthereumAddAnchor />
      <WideNakedMenuAnchor aria-disabled>
        Bitcoin
      </WideNakedMenuAnchor>
      <SessionSolanaAddAnchor />
      <WideNakedMenuAnchor aria-disabled>
        Monero
      </WideNakedMenuAnchor>
    </div>
  </Fragment>
}

function SessionCryptoEthereumAddAnchor() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, "/ethereum")

  return <WideNakedMenuAnchor
    href={coords.url.hash}
    onClick={coords.onClick}
    onKeyDown={coords.onKeyDown}
    aria-disabled>
    Ethereum
  </WideNakedMenuAnchor>
}

function SessionMoreButton() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, "/menu")

  return <a className="group p-2 bg-opposite text-opposite rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-opposite"
    href={coords.url.hash}
    onClick={coords.onClick}
    onKeyDown={coords.onKeyDown}>
    <InAnchor>
      <Outline.EllipsisVerticalIcon className="size-5" />
    </InAnchor>
  </a>
}

function SessionMoreMenu(props: { logout(): void }) {
  const { logout } = props

  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  return <Fragment>
    <SubpathProvider value={hash}>
      {hash.url.pathname === "/add" &&
        <PathPaper>
          <SessionAccountAddMenu />
        </PathPaper>}
      {hash.url.pathname === "/export" &&
        <PathBoard>
          <SessionExportPage />
        </PathBoard>}
    </SubpathProvider>
    <div className="flex flex-col text-left gap-2">
      <WideNakedMenuButton>
        <Outline.GlobeAltIcon className="size-5" />
        Connections
      </WideNakedMenuButton>
      <SessionExportAnchor />
      <WideNakedMenuButton
        onClick={logout}>
        <Outline.LockClosedIcon className="size-5" />
        Logout
      </WideNakedMenuButton>
    </div>
  </Fragment>
}

export function SessionExportAnchor() {
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

export function SessionExportPage() {
  const close = useCloseContext().getOrThrow()

  const session = useSessionContext().getOrThrow()

  const [masked, setMasked] = useState(true)

  const [$pass, setPass] = useState("")

  const pass = useDeferredValue($pass)

  const encryptOrThrow = useCallback(async () => {
    const { kdbx } = session.value

    const composite = await KDBX.CompositeKey.digestOrThrow(await KDBX.PasswordKey.digestOrThrow(new TextEncoder().encode(pass)))

    const rotated = await kdbx.rotateOrThrow(composite)

    return Writable.writeToBytesOrThrow(await rotated.encryptOrThrow())
  }, [session, pass])

  const pickOrAlert = useCallback(() => Promise.try(async () => {
    const fsfh = await window.showSaveFilePicker!({ id: "root", startIn: "documents", suggestedName: `wallet.kdbx`, types: [{ description: "KDBX", accept: { "application/kdbx": [".kdbx"] } }] })

    const content = await encryptOrThrow()

    const writable = await fsfh.createWritable()
    await writable.write(content)
    await writable.close()

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
    if (!pass.length)
      return "Password is required"
    return
  }, [pass])

  return <Fragment>
    <div className="flex flex-col grow p-6">
      <h1 className="text-xl font-medium">
        Export user
      </h1>
      <form className="grow flex flex-col">
        <input className="hidden"
          autoComplete="off"
          name="username" />
        <div className="h-6" />
        <div className="font-medium">
          Password
        </div>
        <div className="text-default-contrast">
          A password to encrypt the exported file
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <input className="w-full focus-visible:outline-none"
            autoComplete="off"
            type={masked ? "password" : "text"}
            value={$pass}
            onChange={e => setPass(e.target.value)} />
          <div className="flex items-center gap-2">
            <button className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none"
              type="button"
              onClick={() => setMasked(!masked)}>
              <InButton>
                {masked ? <Outline.EyeIcon className="size-5" /> : <Outline.EyeSlashIcon className="size-5" />}
              </InButton>
            </button>
          </div>
        </div>
        <div className="h-8 grow" />
        <div className="flex items-center flex-wrap-reverse gap-2">
          {"showSaveFilePicker" in window === true &&
            <WideOppositeButton
              disabled={error != null}
              onClick={pickOrAlert}>
              {error != null ? error : "Save file"}
            </WideOppositeButton>}
          {"showSaveFilePicker" in window === false &&
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

export function AccountColorAnchor(props: { color?: Nullable<string> }) {
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