// deno-lint-ignore-file require-await no-unused-vars

/// <reference types="@/libs/files/lib.d.ts" />

import { ClickableOppositeAnchor } from "@/libs/anchor/mod.tsx";
import { WideClickableOppositeButton } from "@/libs/button/mod.tsx";
import { useClientContext } from "@/libs/client/mod.tsx";
import { Dialog } from "@/libs/dialog/mod.tsx";
import { Errors } from "@/libs/errors/mod.ts";
import { Outline } from "@/libs/heroicons/mod.ts";
import { Lang } from "@/libs/lang/mod.ts";
import { Menu, WideClickableNakedMenuAnchor } from "@/libs/menu/mod.tsx";
import { useUsersDatabaseContext } from "@/libs/users/mod.tsx";
import { Readable } from "@hazae41/binary";
import { HashSubpathProvider, useCoords, useHashSubpath, usePathContext } from "@hazae41/chemin";
import * as KDBX from "@hazae41/kdbx";
import { useCloseContext } from "@hazae41/react-close-context";
import { webAuthnStorage } from "@hazae41/webauthnstorage";
import React, { Fragment, useCallback, useEffect, useMemo, useState } from "react";

React;

interface UserData {
  readonly uuid: string
  readonly name: string
  readonly file: FileSystemHandle
}

export function App() {
  const client = useClientContext().getOrThrow()

  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const users = useUsersDatabaseContext().getOrThrow()

  const [allUsers, setAllUsers] = useState<Array<UserData>>()

  const getAllUsers = useCallback(async () => {
    return await users.value.getOrThrow().getOrThrow<Array<UserData>>("list") || []
  }, [users])

  useEffect(() => {
    if (users == null)
      return
    if (users.value.isErr())
      return
    getAllUsers().then(setAllUsers).catch(console.error)
  }, [users])

  const openUserOrAlert = useCallback((user: UserData) => Promise.try(async () => {
    alert(user.uuid)
  }).catch(Errors.display), [users])

  const LoginButton = useCallback(() => {
    const coords = useCoords(hash, "/login")

    return <ClickableOppositeAnchor
      href={coords.url.hash}
      onClick={coords.onClick}
      onKeyDown={coords.onKeyDown}
      onContextMenu={coords.onContextMenu}>
      Login
    </ClickableOppositeAnchor>
  }, [hash])

  const AddUserButton = useCallback(() => {
    const coords = useCoords(hash, "/login/add")

    return <WideClickableNakedMenuAnchor
      href={coords.url.hash}
      onClick={coords.onClick}
      onKeyDown={coords.onKeyDown}
      onContextMenu={coords.onContextMenu}>
      <div className="rounded-full size-7 flex justify-center items-center border border-default-contrast border-dashed">
        <Outline.PlusIcon className="size-4" />
      </div>
      Add user
    </WideClickableNakedMenuAnchor>
  }, [hash])

  const LoginMenu = useCallback(() => {
    return <div className="flex flex-col text-left gap-2">
      {allUsers?.map(user => (
        <WideClickableNakedMenuAnchor
          key={user.uuid}
          onClick={() => openUserOrAlert(user)}>
          {user.name}
        </WideClickableNakedMenuAnchor>
      ))}
      <AddUserButton />
    </div>
  }, [allUsers, openUserOrAlert, AddUserButton])

  const ImportUserButton = useCallback(() => {
    const coords = useCoords(hash, "/login/add/import")

    return <WideClickableNakedMenuAnchor
      href={coords.url.hash}
      onClick={coords.onClick}
      onKeyDown={coords.onKeyDown}
      onContextMenu={coords.onContextMenu}>
      Import user
    </WideClickableNakedMenuAnchor>
  }, [hash])

  const CreateUserButton = useCallback(() => {
    const coords = useCoords(hash, "/login/add/create")

    return <WideClickableNakedMenuAnchor
      href={coords.url.hash}
      onClick={coords.onClick}
      onKeyDown={coords.onKeyDown}
      onContextMenu={coords.onContextMenu}>
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
      {client && hash.url.pathname === "/login/add/create" &&
        <Dialog>
          <CreateUserDialog />
        </Dialog>}
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
  const users = useUsersDatabaseContext().getOrThrow()

  const uuid = useMemo(() => {
    return crypto.randomUUID()
  }, [])

  const [name0, setName0] = useState("")

  const name = name0 || "Anon"

  const [password, setPassword] = useState("")

  const submitOrAlert = useCallback(() => Promise.try(async () => {
    const [handle] = await showOpenFilePicker({ id: uuid.slice(0, 8), startIn: "documents", types: [{ description: "KDBX", accept: { "application/kdbx": [".kdbx"] } }] })

    if (handle == null)
      return
    if (handle.kind !== "file")
      return

    const file = await handle.getFile()

    const composite = await KDBX.CompositeKey.digestOrThrow(await KDBX.PasswordKey.digestOrThrow(new TextEncoder().encode(password)))

    const encrypted = Readable.readFromBytesOrThrow(KDBX.Database.Encrypted, new Uint8Array(await file.arrayBuffer())).cloneOrThrow()
    const decrypted = await encrypted.decryptOrThrow(composite)

    const stale = await users.value.getOrThrow().getOrThrow<Array<UserData>>("list") || []

    const fresh = [...stale, { uuid, name, file: handle } satisfies UserData]

    await users.value.getOrThrow().setOrThrow("list", fresh)

    users.update()

    if (!confirm("Do you want to create a passkey?"))
      return close()

    await webAuthnStorage.createOrThrow(uuid, composite.value.bytes)

    close()
  }).catch(Errors.display), [uuid, users, name, password, close])

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
        value={name0}
        onChange={e => setName0(e.target.value)} />
    </div>
    <div className="h-4" />
    <div className="font-medium">
      Password
    </div>
    <div className="text-default-contrast">
      At least 3 characters, will be used to decrypt your file
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
        Open file
      </WideClickableOppositeButton>
    </div>
  </Fragment>
}

function CreateUserDialog() {
  const users = useUsersDatabaseContext().getOrThrow()

  const uuid = useMemo(() => {
    return crypto.randomUUID()
  }, [])

  const [name, setName] = useState("")

  const [password, setPassword] = useState("")

  const submitOrAlert = useCallback(() => Promise.try(async () => {
    const handle = await showSaveFilePicker({ id: uuid.slice(0, 8), startIn: "documents", suggestedName: `wallet.kdbx`, types: [{ description: "KDBX", accept: { "application/kdbx": [".kdbx"] } }] })

    const stale = await users.value.getOrThrow().getOrThrow<Array<UserData>>("list") || []

    const fresh = [...stale, { uuid, name, file: handle } satisfies UserData]

    await users.value.getOrThrow().setOrThrow("list", fresh)

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
        onClick={submitOrAlert}>
        Save file
      </WideClickableOppositeButton>
    </div>
  </Fragment>
}