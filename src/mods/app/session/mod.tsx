import { ContrastAnchor, InAnchor, OppositeAnchor } from "@/libs/anchor/mod.tsx";
import { InButton, WideOppositeButton } from "@/libs/button/mod.tsx";
import { Errors } from "@/libs/errors/mod.ts";
import { Outline } from "@/libs/heroicons/mod.ts";
import { PathMenu, WideNakedMenuAnchor, WideNakedMenuButton } from "@/libs/menu/mod.tsx";
import { Nullable } from "@/libs/nullable/mod.tsx";
import { ChildrenProps } from "@/libs/props/mod.ts";
import { useStoreContext } from "@/libs/store/mod.tsx";
import { Totp } from "@/libs/totp/mod.ts";
import { PathWindow } from "@/libs/window/mod.tsx";
import { Writable } from "@hazae41/binary";
import { SubpathProvider, useAnchorWithCoords, useHashSubpath, usePathContext, useSearchState } from "@hazae41/chemin";
import * as KDBX from "@hazae41/kdbx";
import { useCloseContext } from "@hazae41/react-close-context";
import { Option, Result } from "@hazae41/result-and-option";
import React, { createContext, Fragment, useCallback, useContext, useDeferredValue, useEffect, useMemo, useState } from "react";
import { useAutoFocus } from "../../../libs/focus/mod.ts";
import { UserData } from "../user/mod.tsx";

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

function getEntryType($entry: KDBX.Inner.KeePassFile.Entry): "password" | "ethereum" | "bitcoin" | "card" | "seed" {
  if ($entry.getDirectStringByKeyOrNull("CardNumber")?.getValueOrThrow().get())
    return "card"

  if ($entry.getDirectStringByKeyOrNull("EthereumAddress")?.getValueOrThrow().get())
    return "ethereum"

  if ($entry.getDirectStringByKeyOrNull("BitcoinAddress")?.getValueOrThrow().get())
    return "bitcoin"

  if ($entry.getDirectStringByKeyOrNull("Seed")?.getValueOrThrow().get())
    return "seed"

  return "password"
}

export function SessionScreen() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const session = useSessionContext().getOrThrow()

  const [display, setDisplay] = useState(false)

  const [search, setSearch] = useSearchState(path, "search")
  const [filter, setFilter] = useSearchState(path, "filter")

  const dsearch = useDeferredValue(search)

  useEffect(() => () => {
    console.log("SessionScreen unmounted")
  }, [])

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
    return entries.filter($entry => {
      if (filter == null)
        return dsearch ? $entry.element.innerHTML.toLowerCase().includes(dsearch.toLowerCase()) : true

      if (filter === getEntryType($entry))
        return dsearch ? $entry.element.innerHTML.toLowerCase().includes(dsearch.toLowerCase()) : true

      // if (filter === "trash" && $entry.getParentGroupOrThrow().isDeleted())
      //   return true

      return false
    })
  }, [entries, filter, dsearch])

  return <Fragment>
    <SubpathProvider value={hash}>
      {hash.url.pathname === "/menu" &&
        <PathMenu>
          <SessionMoreMenu />
        </PathMenu>}
      {hash.url.pathname === "/add" &&
        <PathMenu>
          <SessionAccountAddMenu />
        </PathMenu>}
      {hash.url.pathname === "/add/password" &&
        <PathWindow>
          <SessionPasswordAddWindow />
        </PathWindow>}
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
          <div className="flex items-center gap-4">
            <SessionAccountAddButton />
            <ContrastAnchor onClick={() => setDisplay(true)}>
              <Outline.EyeIcon className="size-5" />
              See all
            </ContrastAnchor>
          </div>
        </div>}
      {display &&
        <div className="grow flex flex-col overflow-y-auto border border-default-contrast rounded-xl py-3 px-1">
          <div className="grow grid grid-cols-[repeat(auto-fit,320px)] justify-center content-baseline overflow-y-scroll overscroll-y-none gap-4 py-1 px-3">
            {visibles.map($entry =>
              <Fragment key={$entry.getUuidOrThrow().getOrThrow()}>
                <div className="w-80 aspect-video flex flex-col bg-default text-default selection-default data-[color=red]:bg-red-500/90 data-[color=blue]:bg-blue-500/90 data-[color=3]:bg-green-500/90 p-4 rounded-xl"
                  data-theme={$entry.getDirectStringByKeyOrNull("Color")?.getValueOrThrow().get() == null ? "opposite" : "dark"}
                  data-color={$entry.getDirectStringByKeyOrNull("Color")?.getValueOrThrow().get()}>
                  <div className="font-medium text-xl text-wrap wrap-anywhere">
                    {$entry.getDirectStringByKeyOrNull("Title")?.getValueOrThrow().get() || "Untitled"}
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

                      if (type === "bitcoin")
                        return <div className="bg-default-contrast rounded-xl po-1 flex items-center gap-2">
                          <Outline.BanknotesIcon className="size-5" />
                          Bitcoin
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
              </Fragment>)}
          </div>
        </div>}
      <div className="h-4 shrink-0" />
      <div className="flex flex-wrap items-center gap-2">
        <button className="bg-default-contrast aria-selected:bg-opposite aria-selected:text-opposite rounded-xl po-1 flex items-center gap-2 focus:outline-2 focus:outline-offset-2 focus:outline-default-contrast aria-selected:focus:outline-opposite"
          type="button"
          aria-selected={filter === "password"}
          onClick={() => filter === "password" ? setFilter(undefined) : setFilter("password")}>
          <Outline.LanguageIcon className="size-5" />
          Passwords
        </button>
        <button className="bg-default-contrast aria-selected:bg-opposite aria-selected:text-opposite rounded-xl po-1 flex items-center gap-2 focus:outline-2 focus:outline-offset-2 focus:outline-default-contrast aria-selected:focus:outline-opposite"
          type="button"
          aria-selected={filter === "ethereum"}
          onClick={() => filter === "ethereum" ? setFilter(undefined) : setFilter("ethereum")}>
          <Outline.CubeIcon className="size-5" />
          Ethereum
        </button>
        <button className="bg-default-contrast aria-selected:bg-opposite aria-selected:text-opposite rounded-xl po-1 flex items-center gap-2 focus:outline-2 focus:outline-offset-2 focus:outline-default-contrast aria-selected:focus:outline-opposite"
          type="button"
          aria-selected={filter === "bitcoin"}
          onClick={() => filter === "bitcoin" ? setFilter(undefined) : setFilter("bitcoin")}>
          <Outline.BanknotesIcon className="size-5" />
          Bitcoin
        </button>
        <button className="bg-default-contrast aria-selected:bg-opposite aria-selected:text-opposite rounded-xl po-1 flex items-center gap-2 focus:outline-2 focus:outline-offset-2 focus:outline-default-contrast aria-selected:focus:outline-opposite"
          type="button"
          aria-selected={filter === "card"}
          onClick={() => filter === "card" ? setFilter(undefined) : setFilter("card")}>
          <Outline.CreditCardIcon className="size-5" />
          Cards
        </button>
        <button className="bg-default-contrast aria-selected:bg-opposite aria-selected:text-opposite rounded-xl po-1 flex items-center gap-2 focus:outline-2 focus:outline-offset-2 focus:outline-default-contrast aria-selected:focus:outline-opposite"
          type="button"
          aria-selected={filter === "seed"}
          onClick={() => filter === "seed" ? setFilter(undefined) : setFilter("seed")}>
          <Outline.SparklesIcon className="size-5" />
          Seeds
        </button>
        <button className="bg-default-contrast aria-selected:bg-opposite aria-selected:text-opposite rounded-xl po-1 flex items-center gap-2 focus:outline-2 focus:outline-offset-2 focus:outline-default-contrast aria-selected:focus:outline-opposite"
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
        <div className="grow bg-default-contrast po-2 rounded-xl flex items-center gap-4 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-default-contrast">
          <Outline.MagnifyingGlassIcon className="size-5" />
          <input className="w-full focus:outline-none"
            placeholder="Search"
            onChange={e => setSearch(e.target.value)}
            ref={useAutoFocus()}
            value={search} />
        </div>
      </div>
    </div>
  </Fragment>
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
    Add
  </OppositeAnchor>
}

function SessionAccountAddMenu() {
  return <div className="flex flex-col text-left gap-2">
    <SessionPasswordAddButton />
    <WideNakedMenuAnchor
      aria-disabled>
      Ethereum
    </WideNakedMenuAnchor>
  </div>
}

function SessionPasswordAddButton() {
  const path = usePathContext().getOrThrow()

  const coords = useAnchorWithCoords(path, "/add/password")

  return <WideNakedMenuAnchor
    href={coords.url.hash}
    onClick={coords.onClick}
    onKeyDown={coords.onKeyDown}>
    Password
  </WideNakedMenuAnchor>
}

function SessionPasswordAddWindow() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const close = useCloseContext().getOrThrow()
  const store = useStoreContext().getOrThrow()

  const session = useSessionContext().getOrThrow()

  const [title, setTitle] = useState("")
  const [color, setColor] = useState<Nullable<string>>()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [totpseed, setTotpseed] = useState("")

  const totp = useMemo(() => {
    if (!totpseed.length)
      return

    const generator = Result.runAndWrapSync(() => {
      return Totp.parseOrThrow(totpseed)
    }).getOrNull()

    return generator
  }, [totpseed])

  const [totpcode, setTotpcode] = useState<Nullable<string>>()

  useEffect(() => {
    if (totp == null)
      return

    const interval = setInterval(async () => {
      setTotpcode(await totp.generate())
    }, 1000)

    return () => clearInterval(interval)
  }, [totp])

  const [masked, setMasked] = useState<boolean>(true)

  const encryptOrThrow = useCallback(async () => {
    const kdbx = session.value.kdbx

    const $file = kdbx.inner.content.value
    const $root = $file.getRootOrThrow()

    const $group = $root.getDirectGroupByIndexOrThrow(0)
    const $entry = $file.createEntryOrThrow()

    $entry.createStringOrThrow("Title", title)
    $entry.createStringOrThrow("UserName", username)
    $entry.createStringOrThrow("Password", password, true)

    if (totp != null)
      $entry.createStringOrThrow("otp", totp.url.toString(), true)

    $group.element.appendChild($entry.element)

    return Writable.writeToBytesOrThrow(await kdbx.encryptOrThrow())
  }, [session, title, username, password, totpseed])

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
    if (!title.length)
      return "Title is required"
    if (!password.length)
      return "Password is required"
    return
  }, [title, password])

  return <Fragment>
    <SubpathProvider value={hash}>
      {hash.url.pathname === "/password" &&
        <PathMenu>
          <div className="flex flex-col text-left gap-2">

          </div>
        </PathMenu>}
      {hash.url.pathname === "/password/alphanumeric" &&
        <PathMenu>
          <div className="flex flex-col text-left gap-2">

          </div>
        </PathMenu>}
      {hash.url.pathname === "/password/correcthorse" &&
        <PathMenu>

        </PathMenu>}
    </SubpathProvider>
    <div className="flex flex-col grow p-6">
      <h1 className="text-xl font-medium">
        Add password
      </h1>
      <div className="h-4" />
      <div className="flex items-center justify-center py-4">
        <div className="w-80 aspect-video flex flex-col bg-default text-default selection-default data-[color=red]:bg-red-500/90 data-[color=blue]:bg-blue-500/90 data-[color=3]:bg-green-500/90 p-4 rounded-xl"
          data-theme={color == null ? "opposite" : "dark"}
          data-color={color}>
          <div className="font-medium text-xl text-wrap wrap-anywhere">
            {title || "Untitled"}
          </div>
          <div className="h-2" />
          <div className="text-default-half-contrast text-wrap wrap-anywhere">
            {username}
          </div>
          <div className="h-4 grow" />
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-default-contrast rounded-xl po-1 flex items-center gap-2">
              <Outline.LanguageIcon className="size-5" />
              Password
            </div>
          </div>
        </div>
      </div>
      <div className="h-4 grow" />
      <div className="font-medium">
        Title
      </div>
      <div className="text-default-contrast">
        A name to identify this account
      </div>
      <div className="h-2" />
      <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-default-contrast">
        <Outline.TagIcon className="size-5" />
        <input className="w-full focus:outline-none"
          placeholder="My Account"
          onChange={e => setTitle(e.target.value)}
          value={title} />
      </div>
      <div className="h-4" />
      <div className="font-medium">
        Username
      </div>
      <div className="text-default-contrast">
        Your username or email for this account
      </div>
      <div className="h-2" />
      <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-default-contrast">
        <Outline.AtSymbolIcon className="size-5" />
        <input className="w-full focus:outline-none"
          placeholder="john.doe@mail.com"
          onChange={e => setUsername(e.target.value)}
          value={username} />
      </div>
      <div className="h-4" />
      <div className="font-medium">
        Password
      </div>
      <div className="text-default-contrast">
        Your password for this account
      </div>
      <div className="h-2" />
      <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-default-contrast">
        <Outline.LanguageIcon className="size-5" />
        <input className="w-full focus:outline-none"
          type={masked ? "password" : "text"}
          placeholder={masked ? "••••••••••••••••••••••••" : "u#fH@WMNn3BY7LFzaR$B4GBM"}
          onChange={e => setPassword(e.target.value)}
          value={password} />
        <div className="flex items-center gap-2">
          <button className="group rounded-full p-1 hover:bg-default-double-contrast focus:bg-default-double-contrast focus:outline-none transition-opacity"
            type="button"
            onClick={() => setMasked(!masked)}>
            <InButton>
              {masked ? <Outline.EyeIcon className="size-5" /> : <Outline.EyeSlashIcon className="size-5" />}
            </InButton>
          </button>
          <a className="group rounded-full p-1 hover:bg-default-double-contrast focus:bg-default-double-contrast focus:outline-none transition-opacity">
            <InAnchor>
              <Outline.SparklesIcon className="size-5" />
            </InAnchor>
          </a>
        </div>
      </div>
      <div className="h-4" />
      <div className="font-medium">
        One-time passcode
      </div>
      <div className="text-default-contrast">
        Your TOTP seed for this account
      </div>
      <div className="h-2" />
      <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-default-contrast">
        <Outline.HashtagIcon className="size-5" />
        <input className="w-full focus:outline-none"
          type={masked ? "password" : "text"}
          placeholder={masked ? "••••••••••••••••••••••••••••••••" : "MQCHJLS6FJXT2BGQJ6QMG3WCAVUC2HJZ"}
          onChange={e => setTotpseed(e.target.value)}
          value={totpseed} />
        <div className="flex items-center gap-2">
          <button className="group rounded-full p-1 hover:bg-default-double-contrast focus:bg-default-double-contrast focus:outline-none transition-opacity"
            type="button"
            onClick={() => setMasked(!masked)}>
            <InButton>
              {masked ? <Outline.EyeIcon className="size-5" /> : <Outline.EyeSlashIcon className="size-5" />}
            </InButton>
          </button>
          <a className="group rounded-full p-1 hover:bg-default-double-contrast focus:bg-default-double-contrast focus:outline-none transition-opacity">
            <InAnchor>
              <Outline.QrCodeIcon className="size-5" />
            </InAnchor>
          </a>
        </div>
      </div>
      <div className="h-2" />
      {totpcode &&
        <div className="p-8 rounded-xl bg-default-contrast flex items-center justify-center text-6xl font-mono tracking-widest">
          {totpcode}
        </div>}
      <div className="h-8 grow" />
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
    </div>
  </Fragment>
}

function SessionMoreButton() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, "/menu")

  return <a className="group p-2 bg-opposite text-opposite rounded-xl not-aria-disabled:hover:bg-opposite-double-contrast focus:outline-2 focus:outline-offset-2 focus:outline-opposite aria-disabled:opacity-50 transition-opacity"
    href={coords.url.hash}
    onClick={coords.onClick}
    onKeyDown={coords.onKeyDown}>
    <InAnchor>
      <Outline.EllipsisVerticalIcon className="size-5" />
    </InAnchor>
  </a>
}

function SessionMoreMenu() {
  return <div className="flex flex-col text-left gap-2">
    <WideNakedMenuButton>
      Sessions
    </WideNakedMenuButton>
    <WideNakedMenuButton>
      Settings
    </WideNakedMenuButton>
  </div>
}