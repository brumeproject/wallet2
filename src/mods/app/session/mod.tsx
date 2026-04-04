import { InAnchor } from "@/libs/anchor/mod.tsx";
import { InButton, WideOppositeButton } from "@/libs/button/mod.tsx";
import { PathBoard } from "@/libs/dialog/board/mod.tsx";
import { PathPaper, WideNakedMenuAnchor, WideNakedMenuButton } from "@/libs/dialog/paper/mod.tsx";
import { Errors } from "@/libs/errors/mod.ts";
import { Events } from "@/libs/events/mod.ts";
import { useAutoFocus } from "@/libs/focus/mod.ts";
import { Outline } from "@/libs/heroicons/mod.ts";
import { getEntryType, getRecycleBinOrNull } from "@/libs/kdbx/mod.ts";
import { Nullable } from "@/libs/nullable/mod.ts";
import { ChildrenProps } from "@/libs/props/mod.ts";
import { Writable } from "@hazae41/binary";
import { SubpathProvider, useAnchorWithCoords, useHashSubpath, usePathContext, useSearchState } from "@hazae41/chemin";
import * as KDBX from "@hazae41/kdbx";
import { useCloseContext } from "@hazae41/react-close-context";
import { Option } from "@hazae41/result-and-option";
import React, { createContext, Fragment, useCallback, useContext, useDeferredValue, useMemo, useState } from "react";
import { UserData } from "../user/mod.tsx";
import { AccountAddButtonInGrid, AccountAddMenu, AccountCardInGrid } from "./account/mod.tsx";

React;

export interface SessionData {
  readonly user: UserData
  readonly comp: KDBX.CompositeKey
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

  const [search, setSearch] = useSearchState(path, "search")
  const [filter, setFilter] = useSearchState(path, "filter")

  const trash = useMemo(() => {
    return getRecycleBinOrNull(session.value.kdbx.inner.content.value)
  }, [session])

  const entries = useMemo(() => {
    return [...session.value.kdbx.inner.content.value.document.querySelectorAll("Entry")].filter(e => !e.closest("History")).map(e => new KDBX.Inner.KeePassFile.Entry(e))
  }, [session])

  const visibles = useMemo(() => entries.filter($entry => {
    const trashed = trash != null ? trash.element.contains($entry.element) : false
    const searched = search ? $entry.element.textContent.toLowerCase().includes(search.toLowerCase()) : true

    if (!filter && !trashed)
      return searched

    if (filter === getEntryType($entry) && !trashed)
      return searched

    if (filter === "trash" && trashed)
      return searched

    return false
  }), [entries, filter, search, trash])

  const logout = useCallback(() => {
    close()
  }, [close])

  return <Fragment>
    <SubpathProvider value={hash}>
      {hash.url.pathname === "/+" &&
        <PathPaper>
          <SessionMenu logout={logout} />
        </PathPaper>}
      {hash.url.pathname === "/add" &&
        <PathPaper>
          <AccountAddMenu />
        </PathPaper>}
    </SubpathProvider>
    <div className="grow flex flex-col p-6 overflow-y-auto">
      <h1 className="text-2xl font-medium">
        Your accounts
      </h1>
      <div className="h-6 shrink-0" />
      <div className="grow flex flex-col overflow-y-auto border border-default-contrast rounded-xl py-3 px-1">
        <div className="grow flex flex-col overflow-y-auto overscroll-y-none py-1 px-3">
          <div className="grow grid grid-cols-[repeat(auto-fit,320px)] justify-center content-center gap-4">
            {visibles.map($entry =>
              <Fragment key={$entry.getUuidOrThrow().getOrThrow()}>
                <AccountCardInGrid $entry={$entry} />
              </Fragment>)}
            {filter !== "trash" && <Fragment>
              <AccountAddButtonInGrid />
            </Fragment>}
          </div>
        </div>
      </div>
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
          aria-selected={filter === "keypair"}
          onClick={() => filter === "keypair" ? setFilter(undefined) : setFilter("keypair")}>
          <Outline.KeyIcon className="size-5" />
          Keypairs
        </button>
        <button className="bg-default-contrast aria-selected:bg-opposite aria-selected:text-opposite rounded-xl po-1 flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-default-contrast aria-selected:focus-visible:outline-opposite"
          type="button"
          aria-selected={filter === "seed"}
          onClick={() => filter === "seed" ? setFilter(undefined) : setFilter("seed")}>
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
          aria-selected={filter === "trash"}
          onClick={() => filter === "trash" ? setFilter(undefined) : setFilter("trash")}>
          <Outline.TrashIcon className="size-5" />
          Trash
        </button>
      </div>
      <div className="h-4 shrink-0" />
      <div className="flex items-center gap-2">
        <SessionMenuButton />
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

function SessionMenuButton() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, "/+")

  return <a className="group p-2 bg-opposite text-opposite rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-opposite"
    href={coords.url.hash}
    onClick={coords.onClick}
    onKeyDown={coords.onKeyDown}>
    <InAnchor>
      <Outline.EllipsisVerticalIcon className="size-5" />
    </InAnchor>
  </a>
}

function SessionMenu(props: { logout(): void }) {
  const { logout } = props

  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  return <Fragment>
    <SubpathProvider value={hash}>
      {hash.url.pathname === "/add" &&
        <PathPaper>
          <AccountAddMenu />
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

  const [flipped, setFlipped] = useState(false)

  const [$pass, setPass] = useState("")

  const pass = useDeferredValue($pass)

  const encryptOrThrow = useCallback(async () => {
    const { kdbx } = session.value

    const composite = await KDBX.CompositeKey.digestOrThrow(await KDBX.PasswordKey.digestOrThrow(new TextEncoder().encode(pass)))

    return Writable.writeToBytesOrThrow(await kdbx.encryptOrThrow(composite))
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
      <form className="grow flex flex-col"
        onSubmit={Events.preventDefault}>
        <input className="hidden"
          autoComplete="off"
          name="username" />
        <div className="h-6" />
        <div className="font-medium">
          Password
        </div>
        <div className="text-default-contrast">
          A password to encrypt the exported file.
        </div>
        <div className="h-4" />
        <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
          <input className="w-full focus-visible:outline-none"
            autoComplete="off"
            type={flipped ? "text" : "password"}
            value={$pass}
            onChange={e => setPass(e.target.value)} />
          <div className="flex items-center gap-2">
            <button className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none"
              type="button"
              onClick={() => setFlipped(x => !x)}>
              <InButton>
                {flipped ? <Outline.EyeSlashIcon className="size-5" /> : <Outline.EyeIcon className="size-5" />}
              </InButton>
            </button>
          </div>
        </div>
        <div className="h-8 grow" />
        <div className="flex items-center flex-wrap-reverse gap-2">
          {"showSaveFilePicker" in window === true &&
            <WideOppositeButton
              type="button"
              disabled={error != null}
              onClick={pickOrAlert}>
              {error != null ? error : "Save file"}
            </WideOppositeButton>}
          {"showSaveFilePicker" in window === false &&
            <WideOppositeButton
              type="button"
              disabled={error != null}
              onClick={saveOrAlert}>
              {error != null ? error : "Save file"}
            </WideOppositeButton>}
        </div>
      </form>
    </div>
  </Fragment>
}
