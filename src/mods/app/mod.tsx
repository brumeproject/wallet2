/// <reference types="@/libs/files/lib.d.ts" />
// deno-lint-ignore-file no-window

import { ClickableOppositeAnchor, GapperAndClickerInAnchor } from "@/libs/anchor/mod.tsx";
import { WideClickableOppositeButton } from "@/libs/button/mod.tsx";
import { useClientContext } from "@/libs/client/mod.tsx";
import { Dialog } from "@/libs/dialog/mod.tsx";
import { Errors } from "@/libs/errors/mod.ts";
import { Events } from "@/libs/events/mod.ts";
import { Outline } from "@/libs/heroicons/mod.ts";
import { Lang } from "@/libs/lang/mod.ts";
import { Menu, WideClickableNakedMenuAnchor } from "@/libs/menu/mod.tsx";
import { useStoreContext } from "@/libs/store/mod.tsx";
import { Readable, Unknown, Writable } from "@hazae41/binary";
import { HashSubpathProvider, useCoords, useHashSubpath, usePathContext } from "@hazae41/chemin";
import * as KDBX from "@hazae41/kdbx";
import { useCloseContext } from "@hazae41/react-close-context";
import { webAuthnStorage } from "@hazae41/webauthnstorage";
import React, { DragEvent, Fragment, useCallback, useEffect, useMemo, useState } from "react";

React;

interface UserData {
  readonly uuid: string
  readonly name: string
  readonly fsfh?: FileSystemFileHandle
  readonly pass?: Uint8Array<ArrayBuffer>
}

export function App() {
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
      {users?.map(user => <Fragment key={user.uuid}>
        <UserItem user={user} />
      </Fragment>)}
      <AddUserButton />
    </div>
  }, [client, hash, users, AddUserButton])

  const UserImportButton = useCallback(() => {
    const coords = useCoords(hash, "/login/add/import")

    return <WideClickableNakedMenuAnchor
      href={coords.url.hash}
      onClick={coords.onClick}
      onKeyDown={coords.onKeyDown}>
      Import user
    </WideClickableNakedMenuAnchor>
  }, [hash])

  const UserCreateButton = useCallback(() => {
    const coords = useCoords(hash, "/login/add/create")

    return <WideClickableNakedMenuAnchor
      href={coords.url.hash}
      onClick={coords.onClick}
      onKeyDown={coords.onKeyDown}>
      Create user
    </WideClickableNakedMenuAnchor>
  }, [hash])

  const UserAddMenu = useCallback(() => {
    return <div className="flex flex-col text-left gap-2">
      <UserCreateButton />
      <UserImportButton />
    </div>
  }, [UserImportButton, UserCreateButton])

  return <Fragment>
    <HashSubpathProvider>
      {client && hash.url.pathname === "/login" &&
        <Menu>
          <LoginMenu />
        </Menu>}
      {client && hash.url.pathname === "/login/add" &&
        <Menu>
          <UserAddMenu />
        </Menu>}
      {client && hash.url.pathname === "/login/add/import" &&
        <Dialog>
          <UserImportDialog />
        </Dialog>}
      {client && hash.url.pathname === "/login/add/create" &&
        <Dialog>
          <UserCreateDialog />
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
              Argon2
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
          <div className="flex flex-wrap flex-col md:flex-row items-center text-center gap-4">
            <div className="p-4 bg-default-contrast rounded-xl">
              You
            </div>
            <div className="text-default-contrast whitespace-pre rotate-90 md:rotate-0">
              {`<--->`}
            </div>
            <div className="p-4 bg-opposite text-opposite rounded-xl">
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

function UserImportDialog() {
  const close = useCloseContext().getOrThrow()
  const store = useStoreContext().getOrThrow()

  const [rawName, setRawName] = useState("")

  const name = rawName || "Anon"

  const [fileOrFsfh, setFileOrFsfh] = useState<File | FileSystemFileHandle>()

  const [password, setPassword] = useState("")

  const pickOrAlert = useCallback(() => Promise.try(async () => {
    const [fsfh] = await window.showOpenFilePicker({ id: "root", startIn: "documents", types: [{ description: "KDBX", accept: { "application/kdbx": [".kdbx"] } }] })

    if (fsfh == null)
      return
    if (fsfh.kind !== "file")
      return

    setFileOrFsfh(fsfh)
  }).catch(Errors.display), [store, name, fileOrFsfh, password, close])

  const dropOrAlert = useCallback((e: DragEvent<HTMLButtonElement>) => Promise.try(async () => {
    e.preventDefault()

    const [item] = e.dataTransfer.items as unknown as Iterable<DataTransferItem>

    const fsfh = await item.getAsFileSystemHandle()

    if (fsfh.kind !== "file")
      return

    setFileOrFsfh(fsfh)
  }).catch(Errors.display), [])

  const submitOrAlert = useCallback(() => Promise.try(async () => {
    if (fileOrFsfh instanceof FileSystemFileHandle) {
      const fsfh = fileOrFsfh
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
    } else {
      const file = fileOrFsfh
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
    }
  }).catch(Errors.display), [store, name, fileOrFsfh, password, close])

  const error = useMemo(() => {
    if (!name.length)
      return "Name is required"
    if (fileOrFsfh == null)
      return "File is required"
    if (!password.length)
      return "Password is required"
    return
  }, [name, fileOrFsfh, password])

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
      {"showOpenFilePicker" in window === true &&
        <button className="absolute w-full h-full opacity-0 cursor-pointer"
          type="button"
          onClick={pickOrAlert}
          onDragOver={Events.preventDefault}
          onDrop={dropOrAlert} />}
      {"showOpenFilePicker" in window === false &&
        <input className="absolute w-full h-full opacity-0 cursor-pointer"
          type="file"
          accept="application/octet-stream,.kdbx"
          onChange={e => setFileOrFsfh(e.target.files.item(0))} />}
      {fileOrFsfh != null &&
        <div className="bg-default-contrast po-2 rounded-xl">
          {fileOrFsfh.name}
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
        disabled={error != null}
        onClick={submitOrAlert}>
        {error != null ? error : "OK"}
      </WideClickableOppositeButton>
    </div>
  </Fragment>
}

function UserCreateDialog() {
  const close = useCloseContext().getOrThrow()
  const store = useStoreContext().getOrThrow()

  const [rawName, setRawName] = useState("")

  const name = rawName || "Anon"

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

    return encrypted
  }, [innerizeOrThrow, outerizeOrThrow])

  const pickOrAlert = useCallback(() => Promise.try(async () => {
    const fsfh = await window.showSaveFilePicker({ id: "root", startIn: "documents", suggestedName: `wallet.kdbx`, types: [{ description: "KDBX", accept: { "application/kdbx": [".kdbx"] } }] })

    const database = await encryptOrThrow()

    const writable = await fsfh.createWritable()
    await writable.write(Writable.writeToBytesOrThrow(database))
    await writable.close()

    const uuid = crypto.randomUUID()

    const stale = await store.value.getOrThrow().getOrThrow<Array<UserData>>("users") || []

    const fresh = [...stale, { uuid, name, fsfh } satisfies UserData]

    await store.value.getOrThrow().setOrThrow("users", fresh)

    store.update()

    close()
  }).catch(Errors.display), [store, encryptOrThrow, close])

  const saveOrAlert = useCallback(() => Promise.try(async () => {
    const database = await encryptOrThrow()

    const file = new File([Writable.writeToBytesOrThrow(database)], "wallet.kdbx", { type: "application/kdbx" })

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
        value={rawName}
        onChange={e => setRawName(e.target.value)} />
    </div>
    <div className="h-4" />
    <div className="font-medium">
      Password
    </div>
    <div className="text-default-contrast">
      At least 3 characters
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
      {"showSaveFilePicker" in window === true &&
        <WideClickableOppositeButton
          disabled={error != null}
          onClick={pickOrAlert}>
          {error != null ? error : "Save file"}
        </WideClickableOppositeButton>}
      {"showSaveFilePicker" in window === false &&
        <WideClickableOppositeButton
          disabled={error != null}
          onClick={saveOrAlert}>
          {error != null ? error : "Save file"}
        </WideClickableOppositeButton>}
    </div>
  </Fragment>
}

function UserRenameDialog(props: { user: UserData }) {
  const { user } = props

  const close = useCloseContext().getOrThrow()
  const store = useStoreContext().getOrThrow()

  const [rawName, setRawName] = useState(user.name)

  const name = rawName || "Anon"

  const submitOrAlert = useCallback(() => Promise.try(async () => {
    const stale = await store.value.getOrThrow().getOrThrow<Array<UserData>>("users") || []

    const fresh = stale.map(x => x.uuid === user.uuid ? { ...x, name } : x)

    await store.value.getOrThrow().setOrThrow("users", fresh)

    store.update()

    close(true) // TODO fix
  }).catch(Errors.display), [store, user, name, close])

  const error = useMemo(() => {
    if (!name.length)
      return "New name is required"
    return
  }, [name])

  return <Fragment>
    <h1 className="text-xl font-medium">
      Rename user
    </h1>
    <div className="h-4" />
    <div className="font-medium">
      New name
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
    <div className="h-4 grow" />
    <div className="flex items-center flex-wrap-reverse gap-2">
      <WideClickableOppositeButton
        disabled={error != null}
        onClick={submitOrAlert}>
        {error != null ? error : "OK"}
      </WideClickableOppositeButton>
    </div>
  </Fragment>
}

function UserItem(props: { user: UserData }) {
  const { user } = props

  const client = useClientContext().getOrThrow()

  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const loadOrAlert = useCallback((user: UserData, file: File) => Promise.try(async () => {
    const data = new Uint8Array(await file.arrayBuffer())

    if (user.pass != null && confirm("Use passkey to login?")) {
      const stored = await webAuthnStorage.getOrThrow(user.pass) as Uint8Array<ArrayBuffer> & { length: 32 }

      const encrypted = Readable.readFromBytesOrThrow(KDBX.Database.Encrypted, data).cloneOrThrow()
      const composite = new KDBX.CompositeKey(new Unknown(stored))
      const decrypted = await encrypted.decryptOrThrow(composite)

      console.log(decrypted.inner.content.value.document)

      alert("Logged in successfully")

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
  }).catch(Errors.display), [])

  const UserRenameButton = useCallback(() => {
    const coords = useCoords(hash, `/users/${user.uuid}/rename`)

    return <WideClickableNakedMenuAnchor
      href={coords.url.hash}
      onClick={coords.onClick}
      onKeyDown={coords.onKeyDown}>
      Rename
    </WideClickableNakedMenuAnchor>
  }, [hash, user])

  const UserSettingsButton = useCallback(() => {
    const coords = useCoords(hash, `/users/${user.uuid}/settings`)

    return <WideClickableNakedMenuAnchor
      href={coords.url.hash}
      onClick={coords.onClick}
      onKeyDown={coords.onKeyDown}>
      Settings
    </WideClickableNakedMenuAnchor>
  }, [hash, user])

  const UserMenu = useCallback(() => {
    return <div className="flex flex-col text-left gap-2">
      <UserRenameButton />
      <UserSettingsButton />
    </div>
  }, [UserRenameButton, UserSettingsButton])

  const UserMenuButton = useCallback(() => {
    const coords = useCoords(hash, `/users/${user.uuid}/menu`)

    return <a className="z-10 hover:bg-default-contrast focus-visible:bg-default-contrast rounded-full p-1 cursor-pointer transition-opacity"
      href={coords.url.hash}
      onClick={coords.onClick}
      onKeyDown={coords.onKeyDown}>
      <GapperAndClickerInAnchor>
        <Outline.EllipsisVerticalIcon className="size-6" />
      </GapperAndClickerInAnchor>
    </a>
  }, [hash, user])

  return <Fragment>
    <HashSubpathProvider>
      {client && hash.url.pathname === `/users/${user.uuid}/menu` &&
        <Menu>
          <UserMenu />
        </Menu>}
      {client && hash.url.pathname === `/users/${user.uuid}/rename` &&
        <Dialog>
          <UserRenameDialog user={user} />
        </Dialog>}
      {client && hash.url.pathname === `/users/${user.uuid}/settings` &&
        <Dialog>
          <h1 className="text-xl font-medium">
            {user.name}
          </h1>
          <div className="text-default-contrast">
            {user.uuid}
          </div>
          <div className="h-4" />
        </Dialog>}
    </HashSubpathProvider>
    <div className="relative group flex-1 rounded-xl has-[>:first-child:not([aria-disabled='true'])]:hover:bg-default-contrast has-[>:first-child:focus-visible]:bg-default-contrast transition-opacity">
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
          <UserMenuButton />
        </div>
      </div>
    </div>
  </Fragment>
}