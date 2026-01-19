// deno-lint-ignore-file no-window

/// <reference types="@/libs/files/lib.d.ts" />
/// <reference types="@/libs/bytes/lib.d.ts" />

import { ContrastAnchor, InAnchor, OppositeAnchor } from "@/libs/anchor/mod.tsx";
import { InButton, WideOppositeButton } from "@/libs/button/mod.tsx";
import { useClientContext } from "@/libs/client/mod.tsx";
import { Errors } from "@/libs/errors/mod.ts";
import { Events } from "@/libs/events/mod.ts";
import { Outline } from "@/libs/heroicons/mod.ts";
import { Lang } from "@/libs/lang/mod.ts";
import { PathMenu, WideNakedMenuAnchor, WideNakedMenuButton } from "@/libs/menu/mod.tsx";
import { Screen } from "@/libs/screen/mod.tsx";
import { useStoreContext } from "@/libs/store/mod.tsx";
import { PathWindow } from "@/libs/window/mod.tsx";
import { Readable, Unknown, Writable } from "@hazae41/binary";
import { SubpathProvider, useAnchorWithCoords, useHashSubpath, usePathContext, useSearchState } from "@hazae41/chemin";
import * as KDBX from "@hazae41/kdbx";
import { CloseContext, useCloseContext } from "@hazae41/react-close-context";
import { Result } from "@hazae41/result-and-option";
import { webAuthnStorage } from "@hazae41/webauthnstorage";
import React, { ChangeEvent, DragEvent, Fragment, useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";
import { Nullable } from "../../libs/nullable/mod.tsx";
import { SessionData, SessionProvider, UserData, useSessionContext } from "../../libs/session/mod.tsx";
import { Totp } from "../../libs/totp/mod.ts";

React;

export function App() {
  const client = useClientContext().getOrThrow()
  const store = useStoreContext().getOrThrow()

  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const [name = "", setName] = useState<Nullable<string>>()

  const getNameOrThrow = useCallback(async () => {
    setName(await store.value.getOrThrow().getOrThrow<string>("name"))
  }, [store])

  useEffect(() => {
    if (store == null)
      return
    if (store.value.isErr())
      return
    getNameOrThrow().catch(console.error)
  }, [store])

  const [icon, setIcon] = useState<Nullable<string>>()

  const getIconOrThrow = useCallback(async () => {
    setIcon(await store.value.getOrThrow().getOrThrow<Uint8Array<ArrayBuffer>>("icon").then(x => x && `data:image/png;base64,${x.toBase64()}`))
  }, [store])

  useEffect(() => {
    if (store == null)
      return
    if (store.value.isErr())
      return
    getIconOrThrow().catch(console.error)
  }, [store])

  const loadOrThrow = useCallback(async () => {
    const $favicon = document.querySelector("link[rel~='icon']")! as HTMLLinkElement
    const $appicon = document.querySelector("link[rel='apple-touch-icon']")! as HTMLLinkElement
    const $manifest = document.querySelector("link[rel='manifest']")! as HTMLLinkElement

    document.title = name || "Brume Wallet"

    if (icon == null) {
      $favicon.href = "/favicon.ico"
      $appicon.href = "/appicon.png"
    } else {
      $favicon.href = icon
      $appicon.href = icon
    }

    const manifest = await fetch("/manifest.json").then(res => res.json())

    manifest.start_url = location.origin + "/"
    manifest.name = name || "Brume Wallet"
    manifest.short_name = name || "Wallet"

    if (icon != null)
      manifest.icons[0].src = icon

    if (icon == null)
      manifest.icons[0].src = location.origin + "/appicon.png"

    $manifest.href = `data:application/manifest+json,${encodeURIComponent(JSON.stringify(manifest))}`
  }, [name, icon])

  useEffect(() => {
    loadOrThrow().catch(console.error)
  }, [loadOrThrow])

  const [session, setSession] = useState<SessionData>()

  const login = useCallback((session: SessionData) => {
    setSession(session)
  }, [])

  const logout = useCallback(() => {
    setSession(undefined)
  }, [])

  return <Fragment>
    <CloseContext.Provider value={logout}>
      {client && session != null &&
        <Screen>
          <SessionProvider value={session}>
            <SessionScreen />
          </SessionProvider>
        </Screen>}
    </CloseContext.Provider>
    <SubpathProvider value={hash}>
      {client && hash.url.pathname === "/login" &&
        <PathMenu>
          <LoginMenu login={login} />
        </PathMenu>}
      {client && hash.url.pathname === "/settings" &&
        <PathWindow>
          <SettingsWindow />
        </PathWindow>}
    </SubpathProvider>
    <div className="h-full w-full overflow-y-scroll animate-opacity-in text-pretty">
      <div className="p-safe flex flex-col items-center">
        <div className="p-6 flex flex-col items-center w-full max-w-[1000px] m-auto">
          <div className="h-[max(12rem,25dvh)]" />
          <h1 className="text-center text-5xl md:text-6xl font-medium">
            The secure and private wallet
          </h1>
          <div className="h-4" />
          <div className="text-center text-default-contrast text-xl md:text-2xl">
            Meet the only crypto-wallet with maximum security and privacy
          </div>
          <div className="h-16" />
          <div className="flex items-center gap-4">
            <LoginButton />
            <SettingsButton />
          </div>
          <div className="h-16" />
          <Outline.ChevronDownIcon className="size-6 text-default-half-contrast" />
          <div className="h-[max(24rem,50dvh)]" />
          <h1 className="text-center text-5xl md:text-6xl font-medium">
            Your everything manager
          </h1>
          <div className="h-4" />
          <div className="text-center text-default-contrast text-xl md:text-2xl">
            Manage all your sensitive data in one secure and private place
          </div>
          <div className="h-16" />
          <div className="flex flex-wrap flex-col md:flex-row items-center text-center gap-4">
            <div className="p-4 bg-default-contrast rounded-xl">
              Cryptos
            </div>
            <div className="p-4 bg-default-contrast rounded-xl">
              NFTs
            </div>
            <div className="p-4 bg-default-contrast rounded-xl">
              Passwords
            </div>
            <div className="p-4 bg-default-contrast rounded-xl">
              Credit cards
            </div>
            <div className="p-4 bg-default-contrast rounded-xl">
              Notes
            </div>
            <div className="p-4 bg-default-contrast rounded-xl">
              Files
            </div>
          </div>
          <div className="h-[max(24rem,50dvh)]" />
          <h1 className="text-center text-5xl md:text-6xl font-medium">
            Military-grade encryption
          </h1>
          <div className="h-4" />
          <div className="text-center text-default-contrast text-xl md:text-2xl">
            Your data uses the KeePass file format with military-grade encryption
          </div>
          <div className="h-16" />
          <div className="flex items-center gap-4">
            <div className="p-4 bg-default-contrast rounded-xl">
              AES-256
            </div>
            <div className="p-4 bg-default-contrast rounded-xl">
              ChaCha20
            </div>
            <div className="p-4 bg-default-contrast rounded-xl">
              Argon2
            </div>
          </div>
          <div className="h-[max(24rem,50dvh)]" />
          <h1 className="text-center text-5xl md:text-6xl font-medium">
            Your IP address is hidden
          </h1>
          <div className="h-4" />
          <div className="text-center text-default-contrast text-xl md:text-2xl">
            Traffic is sent through Tor with a different circuit for each identity
          </div>
          <div className="h-16" />
          <div className="flex flex-wrap flex-col md:flex-row items-center text-center gap-4">
            <div className="p-4 bg-default-contrast rounded-xl">
              You
            </div>
            <div className="text-default-contrast whitespace-pre rotate-90 md:rotate-0">
              {`<--->`}
            </div>
            <div className="p-4 bg-opposite text-opposite selection-opposite rounded-xl">
              Tor darknet
            </div>
            <div className="text-default-contrast whitespace-pre rotate-90 md:rotate-0">
              {`<--->`}
            </div>
            <div className="p-4 bg-default-contrast rounded-xl">
              Services
            </div>
          </div>
          <div className="h-[max(24rem,50dvh)]" />
          <h1 className="text-center text-5xl md:text-6xl font-medium">
            Supply-chain hardened
          </h1>
          <div className="h-4" />
          <div className="text-center text-default-contrast text-xl md:text-2xl">
            Most of our code is made in-house to prevent supply-chain attacks
          </div>
          <div className="h-16" />
          <div className="flex flex-col items-start w-full gap-4">
            <div className="bg-default-contrast w-full p-4 rounded-xl">
              Other wallets have around 1000 external dependencies
            </div>
            <div className="bg-opposite text-opposite selection-opposite p-4 rounded-xl">
              We have 3
            </div>
          </div>
          <div className="h-[max(24rem,50dvh)]" />
          <a className="text-center hover:underline focus:underline focus:outline-none"
            href="https://brume.tech"
            target="_blank noreferrer">
            {Lang.match({
              en: "Made by cypherpunks",
              zh: "由赛博朋克制作",
              hi: "साइबरपंक द्वारा बनाया गया",
              es: "Hecho por cypherpunks",
              ar: "مصنوع من قبل سايفربانكس",
              fr: "Fait par des cypherpunks",
              de: "Hergestellt von Cypherpunks",
              ru: "Создано киберпанками",
              pt: "Feito por cypherpunks",
              ja: "サイバーパンクによって作られた",
              pa: "ਸਾਈਬਰਪੰਕਸ ਦੁਆਰਾ ਬਣਾਇਆ ਗਿਆ",
              bn: "সাইফারপাঙ্ক দ্বারা তৈরি",
              id: "Dibuat oleh cypherpunks",
              ur: "سائبرپنکس کے ذریعہ بنایا گیا",
              ms: "Dibuat oleh cypherpunks",
              it: "Realizzato da cypherpunks",
              tr: "Cypherpunks tarafından yapıldı",
              ta: "சைபர்பங்க்ஸ் மூலம் உருவாக்கப்பட்டது",
              te: "సైఫర్పంక్స్ ద్వారా తయారు చేయబడింది",
              ko: "사이버펑크가 제작",
              vi: "Được tạo bởi cypherpunks",
              pl: "Stworzone przez cypherpunks",
              ro: "Realizat de cypherpunks",
              nl: "Gemaakt door cypherpunks",
              el: "Κατασκευάστηκε από cypherpunks",
              th: "สร้างโดย cypherpunks",
              cs: "Vytvořeno cypherpunks",
              hu: "Cypherpunks által készített",
              sv: "Gjord av cypherpunks",
              da: "Lavet af cypherpunks",
            })}
          </a>
          <div className="h-4" />
        </div>
      </div>
    </div>
  </Fragment>
}

function SessionScreen() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const session = useSessionContext().getOrThrow()

  const count = useMemo(() => {
    return [...session.value.kdbx.inner.content.value.document.querySelectorAll("Entry")].filter(e => !e.closest("History")).reduce(n => n + 1, 0)
  }, [session])

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

    return currents.map(e => new KDBX.Inner.KeePassFile.Entry(e)).filter($entry => {
      if (filter == null)
        return dsearch ? $entry.element.innerHTML.toLowerCase().includes(dsearch.toLowerCase()) : true

      if (filter === "password" && $entry.getDirectStringByKeyOrNull("Password")?.getValueOrThrow().get())
        return dsearch ? $entry.element.innerHTML.toLowerCase().includes(dsearch.toLowerCase()) : true

      if (filter === "ethereum" && $entry.getDirectStringByKeyOrNull("EthereumAddress")?.getValueOrThrow().get())
        return dsearch ? $entry.element.innerHTML.toLowerCase().includes(dsearch.toLowerCase()) : true

      if (filter === "bitcoin" && $entry.getDirectStringByKeyOrNull("BitcoinAddress")?.getValueOrThrow().get())
        return dsearch ? $entry.element.innerHTML.toLowerCase().includes(dsearch.toLowerCase()) : true

      if (filter === "card" && $entry.getDirectStringByKeyOrNull("CardNumber")?.getValueOrThrow().get())
        return dsearch ? $entry.element.innerHTML.toLowerCase().includes(dsearch.toLowerCase()) : true

      if (filter === "seed" && $entry.getDirectStringByKeyOrNull("Seed")?.getValueOrThrow().get())
        return dsearch ? $entry.element.innerHTML.toLowerCase().includes(dsearch.toLowerCase()) : true

      // if (filter === "trash" && $entry.getParentGroupOrThrow().isDeleted())
      //   return true

      return false
    })
  }, [session, filter, dsearch])

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
            You have {count} accounts in your wallet
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
            {entries.map($entry =>
              <Fragment key={$entry.getUuidOrThrow().getOrThrow()}>
                <div className="aspect-video flex flex-col bg-default text-default selection-default data-[color=red]:bg-red-500/90 data-[color=blue]:bg-blue-500/90 data-[color=3]:bg-green-500/90 p-4 rounded-xl"
                  data-theme={$entry.getDirectStringByKeyOrNull("Color")?.getValueOrThrow().get() == null ? "opposite" : "dark"}
                  data-color={$entry.getDirectStringByKeyOrNull("Color")?.getValueOrThrow().get()}>
                  <div className="font-medium text-xl text-wrap wrap-anywhere">
                    {$entry.getDirectStringByKeyOrNull("Title")?.getValueOrThrow().get() || "Untitled"}
                  </div>
                  <div className="h-2" />
                  <div className="text-default-half-contrast text-wrap wrap-anywhere">
                    {(() => {
                      if ($entry.getDirectStringByKeyOrNull("CardNumber")?.getValueOrThrow().get())
                        return $entry.getDirectStringByKeyOrNull("CardNumber")?.getValueOrThrow().get()

                      if ($entry.getDirectStringByKeyOrNull("EthereumAddress")?.getValueOrThrow().get())
                        return $entry.getDirectStringByKeyOrNull("EthereumAddress")?.getValueOrThrow().get()

                      if ($entry.getDirectStringByKeyOrNull("BitcoinAddress")?.getValueOrThrow().get())
                        return $entry.getDirectStringByKeyOrNull("BitcoinAddress")?.getValueOrThrow().get()

                      return $entry.getDirectStringByKeyOrNull("UserName")?.getValueOrThrow().get()
                    })()}
                  </div>
                  <div className="h-4 grow" />
                  <div className="flex flex-wrap items-center gap-2">
                    {(() => {
                      if ($entry.getDirectStringByKeyOrNull("CardNumber") != null)
                        return <div className="bg-default-contrast rounded-xl po-1 flex items-center gap-2">
                          <Outline.CreditCardIcon className="size-5" />
                          Card
                        </div>

                      if ($entry.getDirectStringByKeyOrNull("EthereumAddress") != null)
                        return <div className="bg-default-contrast rounded-xl po-1 flex items-center gap-2">
                          <Outline.CubeIcon className="size-5" />
                          Ethereum
                        </div>

                      return <div className="bg-default-contrast rounded-xl po-1 flex items-center gap-2">
                        <Outline.LanguageIcon className="size-5" />
                        Password
                      </div>
                    })()}
                  </div>
                </div>
              </Fragment>)}
          </div>
        </div>}
      <div className="h-4" />
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
      <div className="h-4" />
      <div className="flex items-center gap-2">
        <SessionMoreButton />
        <div className="grow bg-default-contrast po-2 rounded-xl flex items-center gap-4 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-default-contrast">
          <Outline.MagnifyingGlassIcon className="size-5" />
          <input className="w-full focus:outline-none"
            placeholder="Search"
            onChange={e => setSearch(e.target.value)}
            ref={e => void setTimeout(() => e?.focus(), 1)}
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

  const [title = "", setTitle] = useState<string>()

  const [username = "", setUsername] = useState<string>()
  const [password = "", setPassword] = useState<string>()
  const [totpseed = "", setTotpseed] = useState<string>()

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
      Badges
    </WideNakedMenuButton>
    <WideNakedMenuButton>
      Sessions
    </WideNakedMenuButton>
    <WideNakedMenuButton>
      Settings
    </WideNakedMenuButton>
  </div>
}

function SettingsButton() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, "/settings")

  return <ContrastAnchor
    href={coords.url.hash}
    onClick={coords.onClick}
    onKeyDown={coords.onKeyDown}>
    Settings
  </ContrastAnchor>
}

function SettingsWindow() {
  const store = useStoreContext().getOrThrow()

  const [name = "", setName] = useState<Nullable<string>>()

  const getNameOrThrow = useCallback(async () => {
    setName(await store.value.getOrThrow().getOrThrow<string>("name"))
  }, [store])

  useEffect(() => {
    if (store == null)
      return
    if (store.value.isErr())
      return
    getNameOrThrow().catch(console.error)
  }, [store])

  const onNameChange = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)

    if (store == null)
      return
    if (store.value.isErr())
      return

    await store.value.getOrThrow().setOrThrow("name", e.target.value)

    store.update()
  }, [store])

  const [icon, setIcon] = useState<Nullable<string>>()

  const getIconOrThrow = useCallback(async () => {
    setIcon(await store.value.getOrThrow().getOrThrow<Uint8Array<ArrayBuffer>>("icon").then(x => x && URL.createObjectURL(new Blob([x]))))
  }, [store])

  useEffect(() => {
    if (store == null)
      return
    if (store.value.isErr())
      return
    getIconOrThrow().catch(console.error)
  }, [store])

  const onIconChange = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0)

    if (file == null)
      return

    setIcon(URL.createObjectURL(file))

    const data = new Uint8Array(await file.arrayBuffer())

    await store.value.getOrThrow().setOrThrow("icon", data)

    store.update()
  }, [store])

  const onIconRemove = useCallback(async () => {
    await store.value.getOrThrow().deleteOrThrow("icon")

    setIcon(undefined)

    store.update()
  }, [store])

  return <div className="flex flex-col grow p-6">
    <h1 className="text-xl font-medium">
      Settings
    </h1>
    <div className="h-4" />
    <div className="font-medium">
      Custom app display
    </div>
    <div className="text-default-contrast">
      Custom name and icon to hide the app
    </div>
    <div className="h-2" />
    <div className="flex flex-col items-center p-8">
      {icon == null &&
        <div className="relative size-24 border border-dashed border-default-contrast flex items-center justify-center rounded-xl focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-default-contrast">
          <input className="absolute w-full h-full opacity-0 cursor-pointer rounded-xl"
            type="file"
            accept="image/*"
            onChange={onIconChange} />
          <Outline.ArrowUpTrayIcon className="size-6 text-default-contrast" />
        </div>}
      {icon != null &&
        <button className="focus:outline-2 focus:outline-offset-2 focus:outline-default-contrast"
          type="button"
          onClick={onIconRemove}>
          <img className="size-24 rounded-xl bg-opposite" src={icon} />
        </button>}
      <div className="h-4" />
      <input className="text-center bg-default-contrast po-2 rounded-xl focus:outline-2 focus:outline-offset-2 focus:outline-default-contrast"
        placeholder="Wallet"
        value={name || ""}
        onChange={onNameChange} />
    </div>
  </div>
}

function LoginButton() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, "/login")

  return <OppositeAnchor
    href={coords.url.hash}
    onClick={coords.onClick}
    onKeyDown={coords.onKeyDown}>
    Login
  </OppositeAnchor>
}

function LoginMenu(props: { login(session: SessionData): void }) {
  const { login } = props

  const client = useClientContext().getOrThrow()
  const store = useStoreContext().getOrThrow()

  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const [users, setUsers] = useState<Array<UserData>>()

  const getUsers = useCallback(async () => {
    return await store.value.getOrThrow().getOrThrow<Array<UserData>>("users") || []
  }, [store])

  useEffect(() => {
    if (store == null)
      return
    if (store.value.isErr())
      return
    getUsers().then(setUsers).catch(console.error)
  }, [store])

  return <Fragment>
    <SubpathProvider value={hash}>
      {client && hash.url.pathname === "/add" &&
        <PathMenu>
          <UserAddMenu />
        </PathMenu>}
      {client && hash.url.pathname === "/add/import" &&
        <PathWindow>
          {"showOpenFilePicker" in window === true &&
            <UserImportFsfhWindow />}
          {"showOpenFilePicker" in window === false &&
            <UserImportFileWindow />}
        </PathWindow>}
      {client && hash.url.pathname === "/add/create" &&
        <PathWindow>
          <UserCreateWindow />
        </PathWindow>}
    </SubpathProvider>
    <div className="flex flex-col text-left gap-2">
      {users?.map(user =>
        <Fragment key={user.uuid}>
          <UserItem
            login={login}
            user={user} />
        </Fragment>)}
      <UserAddButton />
    </div>
  </Fragment>
}

function UserAddButton() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, "/add")

  return <WideNakedMenuAnchor
    href={coords.url.hash}
    onClick={coords.onClick}
    onKeyDown={coords.onKeyDown}>
    <div className="rounded-full size-7 flex justify-center items-center border border-default-contrast border-dashed">
      <Outline.PlusIcon className="size-4" />
    </div>
    Add user
  </WideNakedMenuAnchor>
}

function UserAddMenu() {
  return <div className="flex flex-col text-left gap-2">
    <UserCreateButton />
    <UserImportButton />
  </div>
}

function UserCreateButton() {
  const path = usePathContext().getOrThrow()

  const coords = useAnchorWithCoords(path, "/add/create")

  return <WideNakedMenuAnchor
    href={coords.url.hash}
    onClick={coords.onClick}
    onKeyDown={coords.onKeyDown}>
    Create user
  </WideNakedMenuAnchor>
}

function UserImportButton() {
  const path = usePathContext().getOrThrow()

  const coords = useAnchorWithCoords(path, "/add/import")

  return <WideNakedMenuAnchor
    href={coords.url.hash}
    onClick={coords.onClick}
    onKeyDown={coords.onKeyDown}>
    Import user
  </WideNakedMenuAnchor>
}

function UserImportFileWindow() {
  const close = useCloseContext().getOrThrow()
  const store = useStoreContext().getOrThrow()

  const [$name, $setName] = useState("")

  const name = $name || "Anon"

  const [file, setFile] = useState<Nullable<File>>()

  const [password, setPassword] = useState("")

  const loadOrAlert = useCallback(() => Promise.try(async () => {
    if (file == null)
      return

    const data = new Uint8Array(await file.arrayBuffer())

    const encrypted = Readable.readFromBytesOrThrow(KDBX.Database.Encrypted, data).cloneOrThrow()
    const composite = await KDBX.CompositeKey.digestOrThrow(await KDBX.PasswordKey.digestOrThrow(new TextEncoder().encode(password)))

    await encrypted.decryptOrThrow(composite)

    if (!confirm("Do you want to create a passkey?")) {
      const uuid = crypto.randomUUID()

      const stale = await store.value.getOrThrow().getOrThrow<Array<UserData>>("users") || []

      const fresh = [...stale, { uuid, name } satisfies UserData]

      await store.value.getOrThrow().setOrThrow("users", fresh)

      store.update()

      close()

      return
    }

    const uuid = crypto.randomUUID()

    const pass = await webAuthnStorage.createOrThrow(uuid.slice(0, 8), composite.value.bytes)

    const stale = await store.value.getOrThrow().getOrThrow<Array<UserData>>("users") || []

    const fresh = [...stale, { uuid, name, pass } satisfies UserData]

    await store.value.getOrThrow().setOrThrow("users", fresh)

    store.update()

    close()
  }).catch(Errors.display), [store, name, file, password, close])

  const error = useMemo(() => {
    if (!name.length)
      return "Name is required"
    if (file == null)
      return "File is required"
    if (!password.length)
      return "Password is required"
    return
  }, [name, file, password])

  return <div className="flex flex-col grow p-6">
    <h1 className="text-xl font-medium">
      Import user
    </h1>
    <div className="h-4" />
    <div className="font-medium">
      Name
    </div>
    <div className="text-default-contrast">
      Will be used locally for display purposes
    </div>
    <div className="h-2" />
    <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-default-contrast">
      <input className="w-full focus:outline-none"
        placeholder="Anon"
        value={$name}
        onChange={e => $setName(e.target.value)} />
    </div>
    <div className="h-4" />
    <div className="font-medium">
      File
    </div>
    <div className="text-default-contrast">
      Your existing KDBX file
    </div>
    <div className="h-2" />
    <div className="relative">
      <input className="absolute w-full h-full opacity-0 cursor-pointer"
        type="file"
        accept="application/octet-stream,.kdbx"
        onChange={e => setFile(e.target.files?.item(0))} />
      {file != null &&
        <div className="bg-default-contrast po-2 rounded-xl">
          {file.name}
        </div>}
      {file == null &&
        <div className="bg-default-contrast po-2 rounded-xl">
          Pick or drop file here
        </div>}
    </div>
    <div className="h-4" />
    <div className="font-medium">
      Password
    </div>
    <div className="text-default-contrast">
      Your existing password
    </div>
    <div className="h-2" />
    <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-default-contrast">
      <input className="w-full focus:outline-none"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)} />
    </div>
    <div className="h-8 grow" />
    <div className="flex items-center flex-wrap-reverse gap-2">
      <WideOppositeButton
        disabled={error != null}
        onClick={loadOrAlert}>
        {error != null ? error : "Open file"}
      </WideOppositeButton>
    </div>
  </div>
}

function UserImportFsfhWindow() {
  const close = useCloseContext().getOrThrow()
  const store = useStoreContext().getOrThrow()

  const [$name, $setName] = useState("")

  const name = $name || "Anon"

  const [fsfh, setFsfh] = useState<FileSystemFileHandle>()

  const [password, setPassword] = useState("")

  const pickOrAlert = useCallback(() => Promise.try(async () => {
    const [fsfh] = await window.showOpenFilePicker!({ id: "root", startIn: "documents", types: [{ description: "KDBX", accept: { "application/kdbx": [".kdbx"] } }] })

    if (fsfh == null)
      return
    if (fsfh.kind !== "file")
      return

    setFsfh(fsfh)
  }).catch(Errors.display), [])

  const dropOrAlert = useCallback((e: DragEvent<HTMLButtonElement>) => Promise.try(async () => {
    e.preventDefault()

    const [item] = e.dataTransfer.items as unknown as Iterable<DataTransferItem>

    const fsfh = await item.getAsFileSystemHandle!()

    if (fsfh.kind !== "file")
      return

    setFsfh(fsfh)
  }).catch(Errors.display), [])

  const openOrAlert = useCallback(() => Promise.try(async () => {
    if (fsfh == null)
      return

    const file = await fsfh.getFile()
    const data = new Uint8Array(await file.arrayBuffer())

    const encrypted = Readable.readFromBytesOrThrow(KDBX.Database.Encrypted, data).cloneOrThrow()
    const composite = await KDBX.CompositeKey.digestOrThrow(await KDBX.PasswordKey.digestOrThrow(new TextEncoder().encode(password)))

    await encrypted.decryptOrThrow(composite)

    if (!confirm("Do you want to create a passkey?")) {
      const uuid = crypto.randomUUID()

      const stale = await store.value.getOrThrow().getOrThrow<Array<UserData>>("users") || []

      const fresh = [...stale, { uuid, name, fsfh } satisfies UserData]

      await store.value.getOrThrow().setOrThrow("users", fresh)

      store.update()

      close()

      return
    }

    const uuid = crypto.randomUUID()

    const pass = await webAuthnStorage.createOrThrow(uuid.slice(0, 8), composite.value.bytes)

    const stale = await store.value.getOrThrow().getOrThrow<Array<UserData>>("users") || []

    const fresh = [...stale, { uuid, name, fsfh, pass } satisfies UserData]

    await store.value.getOrThrow().setOrThrow("users", fresh)

    store.update()

    close()
  }).catch(Errors.display), [store, name, fsfh, password, close])

  const error = useMemo(() => {
    if (!name.length)
      return "Name is required"
    if (fsfh == null)
      return "File is required"
    if (!password.length)
      return "Password is required"
    return
  }, [name, fsfh, password])

  return <div className="flex flex-col grow p-6">
    <h1 className="text-xl font-medium">
      Import user
    </h1>
    <div className="h-4" />
    <div className="font-medium">
      Name
    </div>
    <div className="text-default-contrast">
      Will be used locally for display purposes
    </div>
    <div className="h-2" />
    <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-default-contrast">
      <input className="w-full focus:outline-none"
        placeholder="Anon"
        value={$name}
        onChange={e => $setName(e.target.value)} />
    </div>
    <div className="h-4" />
    <div className="font-medium">
      File
    </div>
    <div className="text-default-contrast">
      Your existing KDBX file
    </div>
    <div className="h-2" />
    <div className="relative">
      {"showOpenFilePicker" in window === true &&
        <button className="absolute w-full h-full opacity-0 cursor-pointer"
          type="button"
          onClick={pickOrAlert}
          onDragOver={Events.preventDefault}
          onDrop={dropOrAlert} />}
      {fsfh != null &&
        <div className="bg-default-contrast po-2 rounded-xl">
          {fsfh.name}
        </div>}
      {fsfh == null &&
        <div className="bg-default-contrast po-2 rounded-xl">
          Pick or drop file here
        </div>}
    </div>
    <div className="h-4" />
    <div className="font-medium">
      Password
    </div>
    <div className="text-default-contrast">
      Your existing password
    </div>
    <div className="h-2" />
    <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-default-contrast">
      <input className="w-full focus:outline-none"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)} />
    </div>
    <div className="h-8 grow" />
    <div className="flex items-center flex-wrap-reverse gap-2">
      <WideOppositeButton
        disabled={error != null}
        onClick={openOrAlert}>
        {error != null ? error : "Open file"}
      </WideOppositeButton>
    </div>
  </div>
}

function UserCreateWindow() {
  const close = useCloseContext().getOrThrow()
  const store = useStoreContext().getOrThrow()

  const [$name, $setName] = useState("")

  const name = $name || "Anon"

  const [password, setPassword] = useState("")

  const xml = useMemo(() => `
    <KeePassFile>
      <Meta>
        <Generator>Brume</Generator>
        <DatabaseName>${name}</DatabaseName>
        <HistoryMaxItems>10</HistoryMaxItems>
        <HistoryMaxSize>6291456</HistoryMaxSize>
        <RecycleBinEnabled>True</RecycleBinEnabled>
        <RecycleBinUUID>KitVu0Z+S26bU0ek9ghs7g==</RecycleBinUUID>
      </Meta>
      <Root>
        <Group>
          <Name>Database</Name>
          <UUID>H2qgo3GARAW5tSvIO/mYtQ==</UUID>
          <Group>
            <Name>Deleted</Name>
            <UUID>KitVu0Z+S26bU0ek9ghs7g==</UUID>
            <IconID>43</IconID>
            <EnableAutoType>False</EnableAutoType>
            <EnableSearching>False</EnableSearching>
          </Group>
        </Group>
      </Root>
    </KeePassFile>
  `.trim(), [name])

  const innerizeOrThrow = useCallback(() => {
    const document = new DOMParser().parseFromString(xml, "text/xml")

    const content = new KDBX.Inner.KeePassFile(document)
    const headers = KDBX.Inner.Headers.createOrThrow(KDBX.Inner.Cipher.ChaCha20)

    return KDBX.Inner.HeadersAndContentWithBytes.computeOrThrow(headers, content)
  }, [xml])

  const outerizeOrThrow = useCallback(async () => {
    const cipher = KDBX.Outer.Cipher.Aes256Cbc
    const compression = KDBX.Outer.Compression.Gzip

    const seed = new Unknown(crypto.getRandomValues(new Uint8Array(32)) as Uint8Array<ArrayBuffer> & { length: 32 })
    const iv = new Unknown(crypto.getRandomValues(new Uint8Array(cipher.IV.length)))
    const kdf = KDBX.Outer.KdfParameters.Argon2d.createOrThrow()

    const headers = KDBX.Outer.Headers.initOrThrow({ cipher, compression, seed, iv, kdf })
    const wrapper = new KDBX.Outer.MagicAndVersionAndHeaders(new KDBX.Outer.Version(4, 0), headers)

    const composite = await KDBX.CompositeKey.digestOrThrow(await KDBX.PasswordKey.digestOrThrow(new TextEncoder().encode(password)))

    const derived = await headers.deriveOrThrow(composite)

    const bytes = KDBX.Outer.MagicAndVersionAndHeadersWithBytes.computeOrThrow(wrapper)
    const hashs = await KDBX.Outer.MagicAndVersionAndHeadersWithBytesWithHashAndHmac.computeOrThrow(bytes, derived)

    return new KDBX.Outer.MagicAndVersionAndHeadersWithBytesWithHashAndHmacWithKeys(hashs, derived)
  }, [password])

  const encryptOrThrow = useCallback(async () => {
    const inner = innerizeOrThrow()
    const outer = await outerizeOrThrow()

    const decrypted = new KDBX.Database.Decrypted(outer, inner)
    const encrypted = await decrypted.encryptOrThrow()

    return Writable.writeToBytesOrThrow(encrypted)
  }, [innerizeOrThrow, outerizeOrThrow])

  const pickOrAlert = useCallback(() => Promise.try(async () => {
    const fsfh = await window.showSaveFilePicker!({ id: "root", startIn: "documents", suggestedName: `wallet.kdbx`, types: [{ description: "KDBX", accept: { "application/kdbx": [".kdbx"] } }] })

    const content = await encryptOrThrow()

    const writable = await fsfh.createWritable()
    await writable.write(content)
    await writable.close()

    const uuid = crypto.randomUUID()

    const stale = await store.value.getOrThrow().getOrThrow<Array<UserData>>("users") || []

    const fresh = [...stale, { uuid, name, fsfh } satisfies UserData]

    await store.value.getOrThrow().setOrThrow("users", fresh)

    store.update()

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

    const uuid = crypto.randomUUID()

    const stale = await store.value.getOrThrow().getOrThrow<Array<UserData>>("users") || []

    const fresh = [...stale, { uuid, name } satisfies UserData]

    await store.value.getOrThrow().setOrThrow("users", fresh)

    store.update()

    close()
  }).catch(Errors.display), [store, encryptOrThrow, close])

  const error = useMemo(() => {
    if (!name.length)
      return "Name is required"
    if (!password.length)
      return "Password is required"
    return
  }, [name, password])

  return <div className="flex flex-col grow p-6">
    <h1 className="text-xl font-medium">
      Create user
    </h1>
    <div className="h-4" />
    <div className="font-medium">
      Name
    </div>
    <div className="text-default-contrast">
      Will be used locally for display purposes
    </div>
    <div className="h-2" />
    <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-default-contrast">
      <input className="w-full focus:outline-none"
        placeholder="Anon"
        value={$name}
        onChange={e => $setName(e.target.value)} />
    </div>
    <div className="h-4" />
    <div className="font-medium">
      Password
    </div>
    <div className="text-default-contrast">
      At least 3 characters
    </div>
    <div className="h-2" />
    <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-default-contrast">
      <input className="w-full focus:outline-none"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)} />
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
  </div>
}

function UserItem(props: { user: UserData } & { login(session: SessionData): void }) {
  const { user, login } = props

  const client = useClientContext().getOrThrow()

  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const loadOrAlert = useCallback((user: UserData, file?: File) => Promise.try(async () => {
    if (file == null)
      return

    const data = new Uint8Array(await file.arrayBuffer())

    if (user.pass != null && confirm("Use passkey to login?")) {
      const stored = await webAuthnStorage.getOrThrow(user.pass) as Uint8Array<ArrayBuffer> & { length: 32 }

      const encrypted = Readable.readFromBytesOrThrow(KDBX.Database.Encrypted, data).cloneOrThrow()
      const composite = new KDBX.CompositeKey(new Unknown(stored))
      const decrypted = await encrypted.decryptOrThrow(composite)

      console.log(decrypted.inner.content.value.document)

      login({ user, kdbx: decrypted })

      return
    }

    const password = prompt("Enter your password")

    if (password == null)
      return

    const encrypted = Readable.readFromBytesOrThrow(KDBX.Database.Encrypted, data).cloneOrThrow()
    const composite = await KDBX.CompositeKey.digestOrThrow(await KDBX.PasswordKey.digestOrThrow(new TextEncoder().encode(password)))
    const decrypted = await encrypted.decryptOrThrow(composite)

    console.log(decrypted.inner.content.value.document)

    login({ user, kdbx: decrypted })
  }).catch(Errors.display), [login])

  const openOrAlert = useCallback((user: UserData, fsfh?: FileSystemFileHandle) => Promise.try(async () => {
    if (fsfh == null)
      return

    await fsfh.requestPermission({ mode: "readwrite" })

    const file = await fsfh.getFile()
    const data = new Uint8Array(await file.arrayBuffer())

    if (user.pass != null && confirm("Use passkey to login?")) {
      const stored = await webAuthnStorage.getOrThrow(user.pass) as Uint8Array<ArrayBuffer> & { length: 32 }

      const encrypted = Readable.readFromBytesOrThrow(KDBX.Database.Encrypted, data).cloneOrThrow()
      const composite = new KDBX.CompositeKey(new Unknown(stored))
      const decrypted = await encrypted.decryptOrThrow(composite)

      console.log(decrypted.inner.content.value.document)

      login({ user, kdbx: decrypted })

      return
    }

    const password = prompt("Enter your password")

    if (password == null)
      return

    const encrypted = Readable.readFromBytesOrThrow(KDBX.Database.Encrypted, data).cloneOrThrow()
    const composite = await KDBX.CompositeKey.digestOrThrow(await KDBX.PasswordKey.digestOrThrow(new TextEncoder().encode(password)))
    const decrypted = await encrypted.decryptOrThrow(composite)

    console.log(decrypted.inner.content.value.document)

    login({ user, kdbx: decrypted })
  }).catch(Errors.display), [login])

  return <Fragment>
    <SubpathProvider value={hash}>
      {client && hash.url.pathname === `/${user.uuid}` &&
        <PathMenu>
          <UserMenu user={user} />
        </PathMenu>}
      {client && hash.url.pathname === `/${user.uuid}/settings` &&
        <PathWindow>
          <UserSettingsWindow user={user} />
        </PathWindow>}
    </SubpathProvider>
    <div className="relative group flex-1 rounded-xl has-[>:first-child:not([aria-disabled='true'])]:hover:bg-default-double-contrast has-[>:first-child:focus]:bg-default-double-contrast transition-opacity">
      {user.fsfh == null &&
        <input className="absolute w-full h-full opacity-0 cursor-pointer"
          type="file"
          accept="application/octet-stream,.kdbx"
          onChange={e => loadOrAlert(user, e.currentTarget.files?.[0])} />}
      {user.fsfh != null &&
        <button className="absolute w-full h-full opacity-0 cursor-pointer"
          type="button"
          onClick={() => openOrAlert(user, user.fsfh)} />}
      <div className="po-2 flex items-center justify-start">
        <div className="grow flex items-center justify-start gap-4 whitespace-nowrap aria-disabled:opacity-50 transition-opacity">
          <div className="rounded-full size-7 flex justify-center items-center border border-default-contrast bg-opposite text-opposite">
            {user.name.slice(0, 1).toUpperCase()}
          </div>
          {user.name}
        </div>
        <div className="w-8" />
        <div className="flex items-center gap-2">
          <UserMenuButton user={user} />
        </div>
      </div>
    </div>
  </Fragment>
}

function UserMenuButton(props: { user: UserData }) {
  const { user } = props

  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, `/${user.uuid}`)

  return <a className="z-10 rounded-full p-1 hover:bg-default-double-contrast focus:bg-default-double-contrast focus:outline-none transition-opacity"
    href={coords.url.hash}
    onClick={coords.onClick}
    onKeyDown={coords.onKeyDown}>
    <InAnchor>
      <Outline.EllipsisVerticalIcon className="size-6" />
    </InAnchor>
  </a>
}

function UserMenu(props: { user: UserData }) {
  const { user } = props

  return <div className="flex flex-col text-left gap-2">
    <UserRenameButton user={user} />
    <UserSettingsButton user={user} />
    <UserRemoveButton user={user} />
  </div>
}

function UserRenameButton(props: { user: UserData }) {
  const { user } = props

  const close = useCloseContext().getOrThrow()
  const store = useStoreContext().getOrThrow()

  const renameOrAlert = useCallback(() => Promise.try(async () => {
    const name = prompt("Enter new name")

    if (name == null)
      return

    const stale = await store.value.getOrThrow().getOrThrow<Array<UserData>>("users") || []

    const fresh = stale.map(x => x.uuid === user.uuid ? { ...x, name } : x)

    await store.value.getOrThrow().setOrThrow("users", fresh)

    store.update()

    close()
  }).catch(Errors.display), [store, user, close])

  return <WideNakedMenuButton
    onClick={renameOrAlert}>
    Rename
  </WideNakedMenuButton>
}

function UserSettingsButton(props: { user: UserData }) {
  const { user } = props

  const path = usePathContext().getOrThrow()

  const coords = useAnchorWithCoords(path, `/${user.uuid}/settings`)

  return <WideNakedMenuAnchor
    href={coords.url.hash}
    onClick={coords.onClick}
    onKeyDown={coords.onKeyDown}>
    Settings
  </WideNakedMenuAnchor>
}

function UserSettingsWindow(props: { user: UserData }) {
  const { user } = props

  return <div className="flex flex-col grow p-6">
    <h1 className="text-xl font-medium">
      {user.name}
    </h1>
    <div className="text-default-contrast">
      {user.uuid}
    </div>
  </div>
}

function UserRemoveButton(props: { user: UserData }) {
  const { user } = props

  const close = useCloseContext().getOrThrow()
  const store = useStoreContext().getOrThrow()

  const removeOrAlert = useCallback(() => Promise.try(async () => {
    if (!confirm("Are you sure you want to remove this user?"))
      return

    const stale = await store.value.getOrThrow().getOrThrow<Array<UserData>>("users") || []

    const fresh = stale.filter(x => x.uuid !== user.uuid)

    await store.value.getOrThrow().setOrThrow("users", fresh)

    store.update()

    close()
  }).catch(Errors.display), [store, user, close])

  return <WideNakedMenuButton
    onClick={removeOrAlert}>
    Remove
  </WideNakedMenuButton>
}