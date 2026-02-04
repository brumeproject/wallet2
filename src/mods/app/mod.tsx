import { ContrastAnchor } from "@/libs/anchor/mod.tsx";
import { useClientContext } from "@/libs/client/mod.tsx";
import { PathBoard } from "@/libs/dialog/board/mod.tsx";
import { PathPaper } from "@/libs/dialog/paper/mod.tsx";
import { Wall } from "@/libs/dialog/wall/mod.tsx";
import { Outline } from "@/libs/heroicons/mod.ts";
import { Lang } from "@/libs/lang/mod.ts";
import { Nullable } from "@/libs/nullable/mod.tsx";
import { useStoreContext } from "@/libs/store/mod.tsx";
import { SubpathProvider, useAnchorWithCoords, useHashSubpath, usePathContext } from "@hazae41/chemin";
import { CloseContext } from "@hazae41/react-close-context";
import React, { ChangeEvent, Fragment, useCallback, useEffect, useState } from "react";
import { SessionData, SessionPage, SessionProvider } from "./session/mod.tsx";
import { UserLoginButton, UserLoginMenu } from "./user/mod.tsx";

React;

export function App() {
  const client = useClientContext().getOrThrow()
  const store = useStoreContext().getOrThrow()

  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const [appname, setAppName] = useState<Nullable<string>>()

  const getNameOrThrow = useCallback(async () => {
    setAppName(await store.value.getOrThrow().getOrThrow<string>("appname"))
  }, [store])

  useEffect(() => {
    if (store == null)
      return
    if (store.value.isErr())
      return
    getNameOrThrow().catch(console.error)
  }, [store])

  const [appicon, setAppIcon] = useState<Nullable<string>>()

  const getAppIconOrThrow = useCallback(async () => {
    setAppIcon(await store.value.getOrThrow().getOrThrow<Uint8Array<ArrayBuffer>>("appicon").then(x => x && `data:image/png;base64,${x.toBase64()}`))
  }, [store])

  useEffect(() => {
    if (store == null)
      return
    if (store.value.isErr())
      return
    getAppIconOrThrow().catch(console.error)
  }, [store])

  const maskOrThrow = useCallback(async () => {
    const $favicon = document.querySelector("link[rel~='icon']")! as HTMLLinkElement
    const $appicon = document.querySelector("link[rel='apple-touch-icon']")! as HTMLLinkElement
    const $manifest = document.querySelector("link[rel='manifest']")! as HTMLLinkElement

    document.title = appname || "Brume Wallet"

    if (appicon == null) {
      $favicon.href = "/favicon.ico"
      $appicon.href = "/appicon.png"
    } else {
      $favicon.href = appicon
      $appicon.href = appicon
    }

    const manifest = await fetch("/manifest.json").then(res => res.json())

    manifest.start_url = location.origin + "/"
    manifest.name = appname || "Brume Wallet"
    manifest.short_name = appname || "Wallet"

    if (appicon != null)
      manifest.icons[0].src = appicon

    if (appicon == null)
      manifest.icons[0].src = location.origin + "/appicon.png"

    $manifest.href = `data:application/manifest+json,${encodeURIComponent(JSON.stringify(manifest))}`
  }, [appname, appicon])

  useEffect(() => {
    maskOrThrow().catch(console.error)
  }, [maskOrThrow])

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
        <Wall>
          <SessionProvider value={session}>
            <SessionPage />
          </SessionProvider>
        </Wall>}
    </CloseContext.Provider>
    <SubpathProvider value={hash}>
      {client && hash.url.pathname === "/login" &&
        <PathPaper>
          <UserLoginMenu login={login} />
        </PathPaper>}
      {client && hash.url.pathname === "/settings" &&
        <PathBoard>
          <SettingsPage />
        </PathBoard>}
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
            <UserLoginButton />
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
              Other wallets have more than 1000 external dependencies
            </div>
            <div className="bg-opposite text-opposite selection-opposite p-4 rounded-xl">
              We have 7
            </div>
          </div>
          <div className="h-[max(24rem,50dvh)]" />
          <a className="text-center hover:underline focus-visible:underline focus-visible:outline-none"
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

function SettingsButton() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, "/settings")

  return <ContrastAnchor
    href={coords.url.hash}
    onClick={coords.onClick}
    onKeyDown={coords.onKeyDown}>
    <Outline.CogIcon className="size-5" />
    Settings
  </ContrastAnchor>
}

function SettingsPage() {
  const store = useStoreContext().getOrThrow()

  const [name, setName] = useState<Nullable<string>>()

  const getNameOrThrow = useCallback(async () => {
    setName(await store.value.getOrThrow().getOrThrow<string>("appname"))
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

    await store.value.getOrThrow().setOrThrow("appname", e.target.value)

    store.update()
  }, [store])

  const [icon, setIcon] = useState<Nullable<string>>()

  const getIconOrThrow = useCallback(async () => {
    setIcon(await store.value.getOrThrow().getOrThrow<Uint8Array<ArrayBuffer>>("appicon").then(x => x && URL.createObjectURL(new Blob([x]))))
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

    await store.value.getOrThrow().setOrThrow("appicon", data)

    store.update()
  }, [store])

  const onIconRemove = useCallback(async () => {
    await store.value.getOrThrow().deleteOrThrow("appicon")

    setIcon(undefined)

    store.update()
  }, [store])

  return <div className="flex flex-col grow p-6">
    <h1 className="text-xl font-medium">
      Settings
    </h1>
    <form className="grow flex flex-col">
      <input className="hidden"
        autoComplete="off"
        name="username" />
      <div className="h-6" />
      <div className="font-medium">
        Custom app display
      </div>
      <div className="text-default-contrast">
        Custom name and icon to hide the app
      </div>
      <div className="h-4" />
      <div className="flex flex-col items-center border border-default-contrast rounded-xl p-6">
        {icon == null &&
          <div className="relative size-24 border-2 border-dashed border-default-contrast flex items-center justify-center rounded-xl [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
            <input className="absolute inset-0 opacity-0 cursor-pointer"
              type="file"
              accept="image/*"
              onChange={onIconChange} />
            <Outline.ArrowUpTrayIcon className="size-6 text-default-contrast" />
          </div>}
        {icon != null &&
          <button className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-default-contrast"
            type="button"
            onClick={onIconRemove}>
            <img className="size-24 rounded-xl bg-opposite" src={icon} />
          </button>}
        <div className="h-4" />
        <input className="text-center bg-default-contrast po-2 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-default-contrast"
          autoComplete="off"
          placeholder="Wallet"
          value={name || ""}
          onChange={onNameChange} />
      </div>
    </form>
  </div>
}