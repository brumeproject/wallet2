import { ContrastAnchor, InAnchor, OppositeAnchor } from "@/libs/anchor/mod.tsx";
import { PathBoard } from "@/libs/dialog/board/mod.tsx";
import { PathPaper, WideNakedMenuAnchor, WideNakedMenuButton } from "@/libs/dialog/paper/mod.tsx";
import { useAutoFocus } from "@/libs/focus/mod.ts";
import { Outline } from "@/libs/heroicons/mod.ts";
import { getEntryColor, getEntryFilter, getEntryTitle, getEntryType } from "@/libs/kdbx/mod.ts";
import { Nullable } from "@/libs/nullable/mod.tsx";
import { ChildrenProps } from "@/libs/props/mod.ts";
import { SubpathProvider, useAnchorWithCoords, useHashSubpath, usePathContext, useSearchState } from "@hazae41/chemin";
import * as KDBX from "@hazae41/kdbx";
import { useCloseContext } from "@hazae41/react-close-context";
import { Option } from "@hazae41/result-and-option";
import React, { createContext, Fragment, MouseEvent, useCallback, useContext, useDeferredValue, useMemo, useState } from "react";
import { flushSync } from "react-dom";
import { UserData } from "../user/mod.tsx";
import { SessionCardAccountPage, SessionCardAddAnchor } from "./card/mod.tsx";
import { SessionPasswordAccountPage, SessionPasswordAddAnchor, SessionPasswordAddPage } from "./password/mod.tsx";

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

  const dsearch = useDeferredValue(search)

  useMemo(() => {
    if (!filter)
      return
    setDisplay(true)
  }, [filter])

  useMemo(() => {
    if (!dsearch)
      return
    setDisplay(true)
  }, [dsearch])

  const entries = useMemo(() => {
    const elements = [...session.value.kdbx.inner.content.value.document.querySelectorAll("Entry")]
    const currents = elements.filter(e => !e.closest("History"))

    const entries = currents.map(e => new KDBX.Inner.KeePassFile.Entry(e))

    return entries
  }, [session])

  const visibles = useMemo(() => {
    if (!filter && !dsearch)
      return entries

    return entries.filter($entry => {
      if (!filter)
        return dsearch ? $entry.element.innerHTML.toLowerCase().includes(dsearch.toLowerCase()) : true

      if (filter === getEntryFilter($entry))
        return dsearch ? $entry.element.innerHTML.toLowerCase().includes(dsearch.toLowerCase()) : true

      // if (filter === "trash" && $entry.getParentGroupOrThrow().isDeleted())
      //   return true

      return false
    })
  }, [entries, filter, dsearch])

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
      {hash.url.pathname === "/add/password" &&
        <PathBoard>
          <SessionPasswordAddPage />
        </PathBoard>}
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

  return <a className="group w-[320px] aspect-video rounded-xl border-2 border-dashed border-default-contrast focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-default-contrast transition-all"
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

            return null
          })()}
        </PathBoard>}
    </SubpathProvider>
    <a className="w-[320px] aspect-video flex flex-col p-4 rounded-xl text-left bg-default text-default select-none data-[color=red]:bg-red-500/90 data-[color=blue]:bg-blue-500/90 data-[color=3]:bg-green-500/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-default focus-visible:data-[color=red]:outline-red-500/90 focus-visible:data-[color=blue]:outline-blue-500/90 focus-visible:data-[color=3]:outline-green-500/90 transition-all"
      data-theme={getEntryColor($entry) == null ? "opposite" : "dark"}
      data-color={getEntryColor($entry)}
      href={coords.url.hash}
      onClick={coords.onClick}
      onKeyDown={coords.onKeyDown}>
      <div className="font-medium text-xl text-wrap wrap-anywhere">
        {getEntryTitle($entry) || "Untitled"}
      </div>
      <div className="h-2" />
      <div className="text-default-half-contrast text-wrap wrap-anywhere">
        {(() => {
          const type = getEntryType($entry)

          if (type === "card")
            return $entry.getDirectStringByKeyOrNull("CardNumber")?.getValueOrThrow().get()

          if (type === "ethereum")
            return $entry.getDirectStringByKeyOrNull("EthereumAddress")?.getValueOrThrow().get()

          if (type === "bitcoin")
            return $entry.getDirectStringByKeyOrNull("BitcoinAddress")?.getValueOrThrow().get()

          if (type === "password")
            return $entry.getDirectStringByKeyOrNull("UserName")?.getValueOrThrow().get()

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
              <Outline.CubeIcon className="size-5" />
              Ethereum
            </div>

          if (type === "solana")
            return <div className="bg-default-contrast rounded-xl po-1 flex items-center gap-2">
              <Outline.CubeIcon className="size-5" />
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
    <div className="h-full w-full data-[flip=true]:animate-flip-in data-[unflip=true]:animate-flip-out data-[flipped=true]:rotate-y-180 transform-3d relative rounded-xl bg-default text-default select-none data-[color=red]:bg-red-500/90 data-[color=blue]:bg-blue-500/90 data-[color=3]:bg-green-500/90"
      data-flip={flipping && !flipped}
      data-unflip={!flipping && flipped}
      data-flipped={flipping && flipped}
      data-theme={getEntryColor($entry) == null ? "opposite" : "dark"}
      data-color={getEntryColor($entry)}
      onAnimationEnd={onAnimationEnd}
      onClick={onClick}>
      <div className="absolute inset-0 p-4 flex flex-col backface-hidden">
        <div className="font-medium text-xl text-wrap wrap-anywhere">
          {getEntryTitle($entry) || "Untitled"}
        </div>
        <div className="h-2" />
        <div className="text-default-half-contrast text-wrap wrap-anywhere">
          {(() => {
            const type = getEntryType($entry)

            if (type === "card")
              return $entry.getDirectStringByKeyOrNull("CardNumber")?.getValueOrThrow().get()

            if (type === "ethereum")
              return $entry.getDirectStringByKeyOrNull("EthereumAddress")?.getValueOrThrow().get()

            if (type === "bitcoin")
              return $entry.getDirectStringByKeyOrNull("BitcoinAddress")?.getValueOrThrow().get()

            if (type === "password")
              return $entry.getDirectStringByKeyOrNull("UserName")?.getValueOrThrow().get()

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
                <Outline.CubeIcon className="size-5" />
                Ethereum
              </div>

            if (type === "solana")
              return <div className="bg-default-contrast rounded-xl po-1 flex items-center gap-2">
                <Outline.CubeIcon className="size-5" />
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
  return <div className="flex flex-col text-left gap-2">
    <SessionPasswordAddAnchor />
    <SessionCardAddAnchor />
    <WideNakedMenuAnchor
      aria-disabled>
      Seed
    </WideNakedMenuAnchor>
    <WideNakedMenuAnchor
      aria-disabled>
      Ethereum
    </WideNakedMenuAnchor>
    <WideNakedMenuAnchor
      aria-disabled>
      Solana
    </WideNakedMenuAnchor>
    <WideNakedMenuAnchor
      aria-disabled>
      Bitcoin
    </WideNakedMenuAnchor>
    <WideNakedMenuAnchor
      aria-disabled>
      Monero
    </WideNakedMenuAnchor>
  </div>
}

function SessionMoreButton() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, "/menu")

  return <a className="group p-2 bg-opposite text-opposite rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-opposite transition-all"
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
      {hash.url.pathname === "/add/password" &&
        <PathBoard>
          <SessionPasswordAddPage />
        </PathBoard>}
      {/* {hash.url.pathname === "/add/card" &&
        <PathPage>
          <SessionCardAddPage />
        </PathPage>} */}
    </SubpathProvider>
    <div className="flex flex-col text-left gap-2">
      <WideNakedMenuButton>
        <Outline.GlobeAltIcon className="size-5" />
        Connections
      </WideNakedMenuButton>
      <WideNakedMenuButton
        onClick={logout}>
        <Outline.LockClosedIcon className="size-5" />
        Logout
      </WideNakedMenuButton>
    </div>
  </Fragment>
}