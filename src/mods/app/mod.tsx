/// <reference types="@/libs/files/lib.d.ts" />
// deno-lint-ignore-file no-window

import { ClickableOppositeAnchor } from "@/libs/anchor/mod.tsx";
import { WideClickableOppositeButton } from "@/libs/button/mod.tsx";
import { useClientContext } from "@/libs/client/mod.tsx";
import { useAppDatabaseContext } from "@/libs/database/mod.tsx";
import { Dialog } from "@/libs/dialog/mod.tsx";
import { Errors } from "@/libs/errors/mod.ts";
import { Outline } from "@/libs/heroicons/mod.ts";
import { Lang } from "@/libs/lang/mod.ts";
import { Menu, WideClickableNakedMenuAnchor } from "@/libs/menu/mod.tsx";
import { Readable, Unknown } from "@hazae41/binary";
import { HashSubpathProvider, useCoords, useHashSubpath, usePathContext } from "@hazae41/chemin";
import * as KDBX from "@hazae41/kdbx";
import { useCloseContext } from "@hazae41/react-close-context";
import { webAuthnStorage } from "@hazae41/webauthnstorage";
import React, { Fragment, useCallback, useEffect, useMemo, useState } from "react";

React;

interface UserData {
  readonly uuid: string
  readonly name: string
  readonly fsfh?: FileSystemFileHandle
  readonly pass?: Uint8Array<ArrayBuffer>
}

export function App() {
  const client = useClientContext().getOrThrow()

  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const users = useAppDatabaseContext().getOrThrow()

  const [allUsers, setAllUsers] = useState<Array<UserData>>()

  const getAllUsers = useCallback(async () => {
    return await users.value.getOrThrow().getOrThrow<Array<UserData>>("users") || []
  }, [users])

  useEffect(() => {
    if (users == null)
      return
    if (users.value.isErr())
      return
    getAllUsers().then(setAllUsers).catch(console.error)
  }, [users])

  const loadOrAlert = useCallback((user: UserData, file: File) => Promise.try(async () => {
    const data = new Uint8Array(await file.arrayBuffer())

    if (user.pass != null && confirm("Use passkey to login?")) {
      const stored = await webAuthnStorage.getOrThrow(user.pass) as Uint8Array<ArrayBuffer> & { length: 32 }

      const encrypted = Readable.readFromBytesOrThrow(KDBX.Database.Encrypted, data).cloneOrThrow()
      const composite = new KDBX.CompositeKey(new Unknown(stored))
      const decrypted = await encrypted.decryptOrThrow(composite)

      console.log(decrypted.inner.content.value.document)

      alert(decrypted.inner.content.value.getMetaOrThrow().getGeneratorOrThrow().get())

      return
    }

    const password = prompt("Enter your password")

    const encrypted = Readable.readFromBytesOrThrow(KDBX.Database.Encrypted, data).cloneOrThrow()
    const composite = await KDBX.CompositeKey.digestOrThrow(await KDBX.PasswordKey.digestOrThrow(new TextEncoder().encode(password)))
    const decrypted = await encrypted.decryptOrThrow(composite)

    console.log(decrypted.inner.content.value.document)

    alert("Logged in successfully")
  }).catch(Errors.display), [])

  const openOrAlert = useCallback((user: UserData, fsfh: FileSystemFileHandle) => Promise.try(async () => {
    await fsfh.requestPermission({ mode: "readwrite" })

    const file = await fsfh.getFile()
    const data = new Uint8Array(await file.arrayBuffer())

    if (user.pass != null && confirm("Use passkey to login?")) {
      const stored = await webAuthnStorage.getOrThrow(user.pass) as Uint8Array<ArrayBuffer> & { length: 32 }

      const encrypted = Readable.readFromBytesOrThrow(KDBX.Database.Encrypted, data).cloneOrThrow()
      const composite = new KDBX.CompositeKey(new Unknown(stored))
      const decrypted = await encrypted.decryptOrThrow(composite)

      console.log(decrypted.inner.content.value.document)

      alert(decrypted.inner.content.value.getMetaOrThrow().getGeneratorOrThrow().get())

      return
    }

    const password = prompt("Enter your password")

    const encrypted = Readable.readFromBytesOrThrow(KDBX.Database.Encrypted, data).cloneOrThrow()
    const composite = await KDBX.CompositeKey.digestOrThrow(await KDBX.PasswordKey.digestOrThrow(new TextEncoder().encode(password)))
    const decrypted = await encrypted.decryptOrThrow(composite)

    console.log(decrypted.inner.content.value.document)

    alert("Logged in successfully")
  }).catch(Errors.display), [users])

  const LoginButton = useCallback(() => {
    const coords = useCoords(hash, "/login")

    return <ClickableOppositeAnchor
      href={coords.url.hash}
      onClick={coords.onClick}
      onKeyDown={coords.onKeyDown}>
      Login
    </ClickableOppositeAnchor>
  }, [hash])

  const AddUserButton = useCallback(() => {
    const coords = useCoords(hash, "/login/add")

    return <WideClickableNakedMenuAnchor
      href={coords.url.hash}
      onClick={coords.onClick}
      onKeyDown={coords.onKeyDown}>
      <div className="rounded-full size-7 flex justify-center items-center border border-default-contrast border-dashed">
        <Outline.PlusIcon className="size-4" />
      </div>
      Add user
    </WideClickableNakedMenuAnchor>
  }, [hash])

  const LoginMenu = useCallback(() => {
    return <div className="flex flex-col text-left gap-2">
      {allUsers?.map(user => <Fragment key={user.uuid}>
        <UserMenuItem user={user} />
      </Fragment>)}
      <AddUserButton />
    </div>
  }, [allUsers, openOrAlert, AddUserButton])

  const UserMenuItem = useCallback(({ user }: { user: UserData }) => {
    const settings = useCoords(hash, `/settings/${user.uuid}`)

    return <div className="relative group flex-1 rounded-xl has-[>:first-child:not([aria-disabled='true'])]:hover:bg-default-contrast has-[>:first-child:focus-visible]:bg-default-contrast transition-opacity">
      {user.fsfh == null &&
        <input className="absolute w-full h-full opacity-0"
          type="file"
          onChange={e => loadOrAlert(user, e.currentTarget.files?.[0])} />}
      {user.fsfh != null &&
        <button className="absolute w-full h-full opacity-0"
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
          <a className="z-10 bg-default-contrast rounded-full p-1 aria-disabled:opacity-50 transition-opacity"
            href={settings.url.hash}
            onClick={settings.onClick}
            onKeyDown={settings.onKeyDown}>
            <Outline.CogIcon className="size-6" />
          </a>
        </div>
      </div>
    </div>
  }, [loadOrAlert, openOrAlert])

  const ImportUserButton = useCallback(() => {
    const coords = useCoords(hash, "/login/add/import")

    return <WideClickableNakedMenuAnchor
      href={coords.url.hash}
      onClick={coords.onClick}
      onKeyDown={coords.onKeyDown}>
      Import user
    </WideClickableNakedMenuAnchor>
  }, [hash])

  const CreateUserButton = useCallback(() => {
    const coords = useCoords(hash, "/login/add/create")

    return <WideClickableNakedMenuAnchor
      aria-disabled
      href={coords.url.hash}
      onClick={coords.onClick}
      onKeyDown={coords.onKeyDown}>
      Create user
    </WideClickableNakedMenuAnchor>
  }, [hash])

  const AddUserMenu = useCallback(() => {
    return <div className="flex flex-col text-left gap-2">
      <CreateUserButton />
      <ImportUserButton />
    </div>
  }, [ImportUserButton, CreateUserButton])

  return <Fragment>
    <HashSubpathProvider>
      {client && hash.url.pathname === "/login" &&
        <Menu>
          <LoginMenu />
        </Menu>}
      {client && hash.url.pathname === "/login/add" &&
        <Menu>
          <AddUserMenu />
        </Menu>}
      {client && hash.url.pathname === "/login/add/import" &&
        <Dialog>
          <ImportUserDialog />
        </Dialog>}
      {/* {client && hash.url.pathname === "/login/add/create" &&
        <Dialog>
          <CreateUserDialog />
        </Dialog>} */}
    </HashSubpathProvider>
    <div className="h-full w-full overflow-y-scroll animate-opacity-in text-pretty">
      <div className="p-safe flex flex-col items-center">
        <div className="p-8 flex flex-col items-center w-full max-w-[1000px] m-auto">
          <div className="h-[max(12rem,25dvh)]" />
          <h1 className="text-center text-5xl md:text-6xl font-medium">
            The secure and private wallet
          </h1>
          <div className="h-4" />
          <div className="text-center text-default-contrast text-xl md:text-2xl">
            Meet the only crypto-wallet with maximum security and privacy
          </div>
          <div className="h-16" />
          <LoginButton />
          <div className="h-16" />
          <Outline.ChevronDownIcon className="size-6 text-default-half-contrast" />
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
              Argon2id
            </div>
          </div>
          <div className="h-[max(24rem,50dvh)]" />
          <h1 className="text-center text-5xl md:text-6xl font-medium">
            Your IP address is hidden
          </h1>
          <div className="h-4" />
          <div className="text-center text-default-contrast text-xl md:text-2xl">
            Network traffic is routed through the Tor darknet with a different circuit for each identity
          </div>
          <div className="h-16" />
          <div className="flex items-center gap-4">
            <div className="p-4 bg-default-contrast rounded-xl">
              You
            </div>
            <div className="text-default-contrast">
              {`<--->`}
            </div>
            <div className="p-4 bg-opposite text-opposite rounded-xl">
              Tor darknet
            </div>
            <div className="text-default-contrast">
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
          <div className="h-[max(24rem,50dvh)]" />
          <a className="text-center hover:underline"
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

function ImportUserDialog() {
  const close = useCloseContext().getOrThrow()
  const users = useAppDatabaseContext().getOrThrow()

  const uuid = useMemo(() => {
    return crypto.randomUUID()
  }, [])

  const [rawName, setRawName] = useState("")

  const name = rawName || "Anon"

  const [fileOrFsfh, setFileOrFsfh] = useState<File | FileSystemFileHandle>()

  const [password, setPassword] = useState("")

  const openOrAlert = useCallback(() => Promise.try(async () => {
    const [fsfh] = await window.showOpenFilePicker({ id: uuid.slice(0, 8), startIn: "documents", types: [{ description: "KDBX", accept: { "application/kdbx": [".kdbx"] } }] })

    if (fsfh == null)
      return
    if (fsfh.kind !== "file")
      return

    setFileOrFsfh(fsfh)
  }).catch(Errors.display), [uuid, users, name, fileOrFsfh, password, close])

  const submitOrAlert = useCallback(() => Promise.try(async () => {
    if (fileOrFsfh instanceof FileSystemFileHandle) {
      const fsfh = fileOrFsfh
      const file = await fsfh.getFile()
      const data = new Uint8Array(await file.arrayBuffer())

      const encrypted = Readable.readFromBytesOrThrow(KDBX.Database.Encrypted, data).cloneOrThrow()
      const composite = await KDBX.CompositeKey.digestOrThrow(await KDBX.PasswordKey.digestOrThrow(new TextEncoder().encode(password)))

      await encrypted.decryptOrThrow(composite)

      if (!confirm("Do you want to create a passkey?")) {
        const stale = await users.value.getOrThrow().getOrThrow<Array<UserData>>("users") || []

        const fresh = [...stale, { uuid, name, fsfh } satisfies UserData]

        await users.value.getOrThrow().setOrThrow("users", fresh)

        users.update()

        close()

        return
      }

      const pass = await webAuthnStorage.createOrThrow(uuid.slice(0, 8), composite.value.bytes)

      const stale = await users.value.getOrThrow().getOrThrow<Array<UserData>>("users") || []

      const fresh = [...stale, { uuid, name, fsfh, pass } satisfies UserData]

      await users.value.getOrThrow().setOrThrow("users", fresh)

      users.update()

      close()
    } else {
      const file = fileOrFsfh
      const data = new Uint8Array(await file.arrayBuffer())

      const encrypted = Readable.readFromBytesOrThrow(KDBX.Database.Encrypted, data).cloneOrThrow()
      const composite = await KDBX.CompositeKey.digestOrThrow(await KDBX.PasswordKey.digestOrThrow(new TextEncoder().encode(password)))

      await encrypted.decryptOrThrow(composite)

      if (!confirm("Do you want to create a passkey?")) {
        const stale = await users.value.getOrThrow().getOrThrow<Array<UserData>>("users") || []

        const fresh = [...stale, { uuid, name } satisfies UserData]

        await users.value.getOrThrow().setOrThrow("users", fresh)

        users.update()

        close()

        return
      }

      const pass = await webAuthnStorage.createOrThrow(uuid.slice(0, 8), composite.value.bytes)

      const stale = await users.value.getOrThrow().getOrThrow<Array<UserData>>("users") || []

      const fresh = [...stale, { uuid, name, pass } satisfies UserData]

      await users.value.getOrThrow().setOrThrow("users", fresh)

      users.update()

      close()
    }
  }).catch(Errors.display), [uuid, users, name, fileOrFsfh, password, close])

  useEffect(() => {
    const aborter = new AbortController()
    const { signal } = aborter

    document.body.addEventListener("drop", async e => {
      e.preventDefault()

      const [item] = e.dataTransfer.items as unknown as Iterable<DataTransferItem>

      if ("getAsFileSystemHandle" in item === false) {
        setFileOrFsfh(item.getAsFile())
        return
      }

      const fsfh = await item.getAsFileSystemHandle()

      if (fsfh.kind !== "file")
        return

      setFileOrFsfh(fsfh)
      return
    }, { signal })

    document.body.addEventListener("dragover", e => {
      e.preventDefault()
    }, { signal })

    return () => aborter.abort()
  }, [])

  return <Fragment>
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
    <div className="bg-default-contrast po-2 rounded-xl">
      <input className="w-full outline-none"
        placeholder="Anon"
        value={rawName}
        onChange={e => setRawName(e.target.value)} />
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
      {"showOpenFilePicker" in window === false &&
        <input className="absolute w-full h-full opacity-0"
          type="file"
          accept=".kdbx"
          onChange={e => setFileOrFsfh(e.target.files.item(0))} />}
      {"showOpenFilePicker" in window === true &&
        <button className="absolute w-full h-full opacity-0"
          type="button"
          onClick={openOrAlert} />}
      {fileOrFsfh != null &&
        <div className="bg-default-contrast po-2 rounded-xl">
          {fileOrFsfh.name} {fileOrFsfh instanceof FileSystemFileHandle ? "(file handle)" : "(file)"}
        </div>}
      {fileOrFsfh == null &&
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
    <div className="bg-default-contrast po-2 rounded-xl">
      <input className="w-full outline-none"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)} />
    </div>
    <div className="h-4 grow" />
    <div className="flex items-center flex-wrap-reverse gap-2">
      <WideClickableOppositeButton
        onClick={submitOrAlert}>
        Add
      </WideClickableOppositeButton>
    </div>
  </Fragment>
}

function CreateUserDialog() {
  const users = useAppDatabaseContext().getOrThrow()

  const uuid = useMemo(() => {
    return crypto.randomUUID()
  }, [])

  const [name, setName] = useState("")

  const [password, setPassword] = useState("")

  const saveOrAlert = useCallback(() => Promise.try(async () => {
    const fsfh = await window.showSaveFilePicker({ id: uuid.slice(0, 8), startIn: "documents", suggestedName: `wallet.kdbx`, types: [{ description: "KDBX", accept: { "application/kdbx": [".kdbx"] } }] })

    const stale = await users.value.getOrThrow().getOrThrow<Array<UserData>>("users") || []

    const fresh = [...stale, { uuid, name, fsfh } satisfies UserData]

    await users.value.getOrThrow().setOrThrow("users", fresh)

    users.update()
  }).catch(Errors.display), [uuid, users, name, password])

  return <Fragment>
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
    <div className="bg-default-contrast po-2 rounded-xl">
      <input className="w-full outline-none"
        placeholder="Anon"
        value={name}
        onChange={e => setName(e.target.value)} />
    </div>
    <div className="h-4" />
    <div className="font-medium">
      Password
    </div>
    <div className="text-default-contrast">
      At least 3 characters, will be used to encrypt your file
    </div>
    <div className="h-2" />
    <div className="bg-default-contrast po-2 rounded-xl">
      <input className="w-full outline-none"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)} />
    </div>
    <div className="h-4 grow" />
    <div className="flex items-center flex-wrap-reverse gap-2">
      <WideClickableOppositeButton
        onClick={saveOrAlert}>
        Save file
      </WideClickableOppositeButton>
    </div>
  </Fragment>
}