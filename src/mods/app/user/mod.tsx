// deno-lint-ignore-file no-window

import { InAnchor, OppositeAnchor } from "@/libs/anchor/mod.tsx";
import { InButton, WideOppositeButton } from "@/libs/button/mod.tsx";
import { PathBoard } from "@/libs/dialog/board/mod.tsx";
import { PathPaper, WideNakedMenuAnchor, WideNakedMenuButton } from "@/libs/dialog/paper/mod.tsx";
import { Errors } from "@/libs/errors/mod.ts";
import { Events } from "@/libs/events/mod.ts";
import { useAutoFocus } from "@/libs/focus/mod.ts";
import { Outline } from "@/libs/heroicons/mod.ts";
import { Nullable } from "@/libs/nullable/mod.ts";
import { useStoreContext } from "@/libs/store/mod.tsx";
import { Readable, Unknown, Writable } from "@hazae41/binary";
import { SubpathProvider, useAnchorWithCoords, useHashSubpath, usePathContext } from "@hazae41/chemin";
import * as KDBX from "@hazae41/kdbx";
import { useCloseContext } from "@hazae41/react-close-context";
import { webAuthnStorage } from "@hazae41/webauthnstorage";
import React, { DragEvent, Fragment, KeyboardEvent, useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";
import { SessionData } from "../session/mod.tsx";

React;

export interface UserData {
  readonly uuid: string
  readonly name: string
  readonly fsfh?: Nullable<FileSystemFileHandle>
  readonly auth?: Nullable<Uint8Array<ArrayBuffer>>
}

export function UserLoginButton() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, "/login")

  return <OppositeAnchor
    href={coords.url.hash}
    onClick={coords.onClick}
    onKeyDown={coords.onKeyDown}>
    <Outline.LockClosedIcon className="size-5" />
    Login
  </OppositeAnchor>
}

export function UserLoginMenu(props: { login(session: SessionData): void }) {
  const { login } = props

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
      {hash.url.pathname === "/add" &&
        <PathPaper>
          <UserAddMenu />
        </PathPaper>}
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
    <div className="rounded-full size-7 flex justify-center items-center border-2 border-dashed border-default-contrast">
      <Outline.PlusIcon className="size-4" />
    </div>
    Add user
  </WideNakedMenuAnchor>
}

function UserAddMenu() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  return <Fragment>
    <SubpathProvider value={hash}>
      {hash.url.pathname === "/import" &&
        <PathBoard>
          {"showOpenFilePicker" in window === true &&
            <UserImportFsfhPage />}
          {"showOpenFilePicker" in window === false &&
            <UserImportFilePage />}
        </PathBoard>}
      {hash.url.pathname === "/create" &&
        <PathBoard>
          <UserCreatePage />
        </PathBoard>}
    </SubpathProvider>
    <div className="flex flex-col text-left gap-2">
      <UserCreateButton />
      <UserImportButton />
    </div>
  </Fragment>
}

function UserCreateButton() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, "/create")

  return <WideNakedMenuAnchor
    href={coords.url.hash}
    onClick={coords.onClick}
    onKeyDown={coords.onKeyDown}>
    <Outline.SparklesIcon className="size-5" />
    Create user
  </WideNakedMenuAnchor>
}

function UserImportButton() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, "/import")

  return <WideNakedMenuAnchor
    href={coords.url.hash}
    onClick={coords.onClick}
    onKeyDown={coords.onKeyDown}>
    <Outline.ArrowDownOnSquareIcon className="size-5" />
    Import user
  </WideNakedMenuAnchor>
}

function UserImportFilePage() {
  const close = useCloseContext().getOrThrow()
  const store = useStoreContext().getOrThrow()

  const [masked, setMasked] = useState(true)

  const [$name, setName] = useState("")
  const [$pass, setPass] = useState("")

  const name = useDeferredValue($name || "Anon")
  const pass = useDeferredValue($pass)

  const [file, setFile] = useState<Nullable<File>>()

  const loadOrAlert = useCallback(() => Promise.try(async () => {
    if (file == null)
      return

    const data = new Uint8Array(await file.arrayBuffer())

    const encrypted = Readable.readFromBytesOrThrow(KDBX.Database.Encrypted, data).cloneOrThrow()
    const composite = await KDBX.CompositeKey.digestOrThrow(await KDBX.PasswordKey.digestOrThrow(new TextEncoder().encode(pass)))

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

    const auth = await webAuthnStorage.createOrThrow(uuid.slice(0, 8), composite.value.bytes)

    const stale = await store.value.getOrThrow().getOrThrow<Array<UserData>>("users") || []

    const fresh = [...stale, { uuid, name, auth } satisfies UserData]

    await store.value.getOrThrow().setOrThrow("users", fresh)

    store.update()

    close()
  }).catch(Errors.display), [store, name, file, pass, close])

  const error = useMemo(() => {
    if (file == null)
      return "File is required"
    if (!pass.length)
      return "Password is required"
    return
  }, [file, pass])

  return <div className="flex flex-col grow p-6">
    <h1 className="text-xl font-medium">
      Import user
    </h1>
    <form className="grow flex flex-col"
      onSubmit={Events.preventDefault}>
      <input className="hidden"
        autoComplete="off"
        name="username" />
      <div className="h-6" />
      <div className="font-medium">
        Name
      </div>
      <div className="text-default-contrast">
        Will be used locally for display purposes
      </div>
      <div className="h-4" />
      <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
        <input className="w-full focus-visible:outline-none"
          autoComplete="off"
          placeholder="Anon"
          value={$name}
          onChange={e => setName(e.target.value)} />
      </div>
      <div className="h-6" />
      <div className="font-medium">
        File
      </div>
      <div className="text-default-contrast">
        Your existing KDBX file
      </div>
      <div className="h-4" />
      <div className="relative bg-default-contrast rounded-xl [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
        <input className="absolute inset-0 opacity-0 cursor-pointer"
          type="file"
          accept="application/octet-stream,.kdbx"
          onChange={e => setFile(e.target.files?.item(0))} />
        {file != null &&
          <div className="po-2">
            {file.name}
          </div>}
        {file == null &&
          <div className="po-2">
            Pick or drop file here
          </div>}
      </div>
      <div className="h-6" />
      <div className="font-medium">
        Password
      </div>
      <div className="text-default-contrast">
        Your existing password to decrypt the file
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
        <WideOppositeButton
          type="button"
          disabled={error != null}
          onClick={loadOrAlert}>
          {error != null ? error : "Open file"}
        </WideOppositeButton>
      </div>
    </form>
  </div>
}

function UserImportFsfhPage() {
  const close = useCloseContext().getOrThrow()
  const store = useStoreContext().getOrThrow()

  const [masked, setMasked] = useState(true)

  const [$name, setName] = useState("")
  const [$pass, setPass] = useState("")

  const name = useDeferredValue($name || "Anon")
  const pass = useDeferredValue($pass)

  const [fsfh, setFsfh] = useState<FileSystemFileHandle>()

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
    const composite = await KDBX.CompositeKey.digestOrThrow(await KDBX.PasswordKey.digestOrThrow(new TextEncoder().encode(pass)))

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

    const auth = await webAuthnStorage.createOrThrow(uuid.slice(0, 8), composite.value.bytes)

    const stale = await store.value.getOrThrow().getOrThrow<Array<UserData>>("users") || []

    const fresh = [...stale, { uuid, name, fsfh, auth } satisfies UserData]

    await store.value.getOrThrow().setOrThrow("users", fresh)

    store.update()

    close()
  }).catch(Errors.display), [store, name, fsfh, pass, close])

  const error = useMemo(() => {
    if (fsfh == null)
      return "File is required"
    if (!pass.length)
      return "Password is required"
    return
  }, [fsfh, pass])

  return <div className="flex flex-col grow p-6">
    <h1 className="text-xl font-medium">
      Import user
    </h1>
    <form className="grow flex flex-col"
      onSubmit={Events.preventDefault}>
      <input className="hidden"
        autoComplete="off"
        name="username" />
      <div className="h-6" />
      <div className="font-medium">
        Name
      </div>
      <div className="text-default-contrast">
        Will be used locally for display purposes
      </div>
      <div className="h-4" />
      <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
        <input className="w-full focus-visible:outline-none"
          autoComplete="off"
          placeholder="Anon"
          value={$name}
          onChange={e => setName(e.target.value)} />
      </div>
      <div className="h-6" />
      <div className="font-medium">
        File
      </div>
      <div className="text-default-contrast">
        Your existing KDBX file
      </div>
      <div className="h-4" />
      <div className="relative bg-default-contrast rounded-xl [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
        {"showOpenFilePicker" in window === true &&
          <button className="absolute inset-0 opacity-0 cursor-pointer"
            type="button"
            onClick={pickOrAlert}
            onDragOver={Events.preventDefault}
            onDrop={dropOrAlert} />}
        {fsfh != null &&
          <div className="po-2">
            {fsfh.name}
          </div>}
        {fsfh == null &&
          <div className="po-2">
            Pick or drop file here
          </div>}
      </div>
      <div className="h-6" />
      <div className="font-medium">
        Password
      </div>
      <div className="text-default-contrast">
        Your existing password to decrypt the file
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
        <WideOppositeButton
          type="button"
          disabled={error != null}
          onClick={openOrAlert}>
          {error != null ? error : "Open file"}
        </WideOppositeButton>
      </div>
    </form>
  </div>
}

function UserCreatePage() {
  const close = useCloseContext().getOrThrow()
  const store = useStoreContext().getOrThrow()

  const [masked, setMasked] = useState(true)

  const [$name, setName] = useState("")
  const [$pass, setPass] = useState("")

  const name = useDeferredValue($name || "Anon")
  const pass = useDeferredValue($pass)

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

  const outerizeOrThrow = useCallback(async (composite: KDBX.CompositeKey) => {
    const cipher = KDBX.Outer.Cipher.Aes256Cbc
    const compression = KDBX.Outer.Compression.Gzip

    const seed = new Unknown(crypto.getRandomValues(new Uint8Array(32)) as Uint8Array<ArrayBuffer> & { length: 32 })
    const iv = new Unknown(crypto.getRandomValues(new Uint8Array(cipher.IV.length)))
    const kdf = KDBX.Outer.KdfParameters.Argon2d.createOrThrow()

    const headers = KDBX.Outer.Headers.initOrThrow({ cipher, compression, seed, iv, kdf })
    const wrapper = new KDBX.Outer.MagicAndVersionAndHeaders(new KDBX.Outer.Version(4, 0), headers)

    const derived = await headers.deriveOrThrow(composite)

    const bytes = KDBX.Outer.MagicAndVersionAndHeadersWithBytes.computeOrThrow(wrapper)
    const hashs = await KDBX.Outer.MagicAndVersionAndHeadersWithBytesWithHashAndHmac.computeOrThrow(bytes, derived)

    return new KDBX.Outer.MagicAndVersionAndHeadersWithBytesWithHashAndHmacWithKeys(hashs, derived)
  }, [])

  const encryptOrThrow = useCallback(async () => {
    const composite = await KDBX.CompositeKey.digestOrThrow(await KDBX.PasswordKey.digestOrThrow(new TextEncoder().encode(pass)))

    const inner = innerizeOrThrow()
    const outer = await outerizeOrThrow(composite)

    const decrypted = new KDBX.Database.Decrypted(outer, inner)
    const encrypted = await decrypted.encryptOrThrow(composite)

    return Writable.writeToBytesOrThrow(encrypted)
  }, [pass, innerizeOrThrow, outerizeOrThrow])

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
    if (!pass.length)
      return "Password is required"
    return
  }, [pass])

  return <div className="flex flex-col grow p-6">
    <h1 className="text-xl font-medium">
      Create user
    </h1>
    <form className="grow flex flex-col"
      onSubmit={Events.preventDefault}>
      <input className="hidden"
        autoComplete="off"
        name="username" />
      <div className="h-6" />
      <div className="font-medium">
        Name
      </div>
      <div className="text-default-contrast">
        Will be used locally for display purposes
      </div>
      <div className="h-4" />
      <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
        <input className="w-full focus-visible:outline-none"
          autoComplete="off"
          placeholder="Anon"
          value={$name}
          onChange={e => setName(e.target.value)} />
      </div>
      <div className="h-6" />
      <div className="font-medium">
        Password
      </div>
      <div className="text-default-contrast">
        A password to encrypt the created file
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
}

function UserItem(props: { user: UserData } & { login(session: SessionData): void }) {
  const { user, login } = props

  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, `/${user.uuid}`)

  return <Fragment>
    <SubpathProvider value={hash}>
      {hash.url.pathname === `/${user.uuid}` &&
        <PathBoard>
          <UserLoginPage user={user} login={login} />
        </PathBoard>}
      {hash.url.pathname === `/${user.uuid}/+` &&
        <PathPaper>
          <UserMenu user={user} />
        </PathPaper>}
    </SubpathProvider>
    <div className="relative group flex-1 rounded-xl hover:bg-default-double-contrast [&:has(:focus-visible)]:bg-default-double-contrast">
      <a className="absolute inset-0 opacity-0 cursor-pointer"
        href={coords.url.hash}
        onClick={coords.onClick}
        onKeyDown={coords.onKeyDown} />
      <div className="po-2 flex items-center justify-start">
        <div className="flex items-center gap-4">
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

function UserLoginPage(props: { user: UserData } & { login(session: SessionData): void }) {
  const { user, login } = props

  const close = useCloseContext().getOrThrow()

  const [masked, setMasked] = useState(true)

  const [$pass, setPass] = useState("")

  const pass = useDeferredValue($pass)

  const [auth, setAuth] = useState<Nullable<Uint8Array<ArrayBuffer> & { length: 32 }>>()

  const [picker1, setPicker1] = useState<Nullable<HTMLInputElement>>()
  const [picker2, setPicker2] = useState<Nullable<HTMLInputElement>>()

  const [file1, setFile1] = useState<Nullable<File>>()
  const [file2, setFile2] = useState<Nullable<File>>()

  const loadOrAlert1 = useCallback(() => Promise.try(async () => {
    if (file1 == null)
      return
    if (!pass)
      return

    const data = new Uint8Array(await file1.arrayBuffer())

    const encrypted = Readable.readFromBytesOrThrow(KDBX.Database.Encrypted, data).cloneOrThrow()
    const composite = await KDBX.CompositeKey.digestOrThrow(await KDBX.PasswordKey.digestOrThrow(new TextEncoder().encode(pass)))
    const decrypted = await encrypted.decryptOrThrow(composite)

    console.log(decrypted.inner.content.value.document)

    login({ user, comp: composite, kdbx: decrypted })

    close()
  }).catch(Errors.display), [user, login, file1, pass, close])

  const loadOrAlert2 = useCallback(() => Promise.try(async () => {
    if (file2 == null)
      return
    if (auth == null)
      return

    const data = new Uint8Array(await file2.arrayBuffer())

    const encrypted = Readable.readFromBytesOrThrow(KDBX.Database.Encrypted, data).cloneOrThrow()
    const composite = new KDBX.CompositeKey(new Unknown(auth))
    const decrypted = await encrypted.decryptOrThrow(composite)

    console.log(decrypted.inner.content.value.document)

    login({ user, comp: composite, kdbx: decrypted })

    close()
  }).catch(Errors.display), [user, login, file2, auth, close])

  useEffect(() => {
    if (file1 == null)
      return
    if (!pass)
      return
    loadOrAlert1().catch(console.error)
  }, [file1, pass, loadOrAlert1])

  useEffect(() => {
    if (file2 == null)
      return
    if (auth == null)
      return
    loadOrAlert2().catch(console.error)
  }, [file2, auth, loadOrAlert2])

  const openOrAlert1 = useCallback(() => Promise.try(async () => {
    if (user.fsfh == null)
      return
    if (!pass)
      return

    await user.fsfh.requestPermission({ mode: "readwrite" })

    const file = await user.fsfh.getFile()
    const data = new Uint8Array(await file.arrayBuffer())

    const encrypted = Readable.readFromBytesOrThrow(KDBX.Database.Encrypted, data).cloneOrThrow()
    const composite = await KDBX.CompositeKey.digestOrThrow(await KDBX.PasswordKey.digestOrThrow(new TextEncoder().encode(pass)))
    const decrypted = await encrypted.decryptOrThrow(composite)

    console.log(decrypted.inner.content.value.document)

    login({ user, comp: composite, kdbx: decrypted })

    close()
  }).catch(Errors.display), [user, login, pass, close])

  const openOrAlert2 = useCallback((stored: Uint8Array<ArrayBuffer> & { length: 32 }) => Promise.try(async () => {
    if (user.auth == null)
      return
    if (user.fsfh == null)
      return
    if (stored == null)
      return

    await user.fsfh.requestPermission({ mode: "readwrite" })

    const file = await user.fsfh.getFile()
    const data = new Uint8Array(await file.arrayBuffer())

    const encrypted = Readable.readFromBytesOrThrow(KDBX.Database.Encrypted, data).cloneOrThrow()
    const composite = new KDBX.CompositeKey(new Unknown(stored))
    const decrypted = await encrypted.decryptOrThrow(composite)

    console.log(decrypted.inner.content.value.document)

    login({ user, comp: composite, kdbx: decrypted })

    close()
  }).catch(Errors.display), [user, login, auth, close])

  const onKeyDown = useCallback(async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter")
      return

    if (user.fsfh == null) {
      picker1!.click()
      return
    }

    await openOrAlert1()
  }, [user, openOrAlert1, picker1])

  const onPassClick = useCallback(async () => {
    if (user.auth == null)
      return

    if (user.fsfh == null) {
      picker2!.click()

      setAuth(await webAuthnStorage.getOrThrow(user.auth) as Uint8Array<ArrayBuffer> & { length: 32 })

      return
    }

    await openOrAlert2(await webAuthnStorage.getOrThrow(user.auth) as Uint8Array<ArrayBuffer> & { length: 32 })
  }, [user, openOrAlert2, picker2])

  return <div className="flex flex-col items-center justify-center grow p-6 py-24">
    <div className="rounded-full size-16 text-4xl flex justify-center items-center border border-default-contrast bg-opposite text-opposite">
      {user.name.slice(0, 1).toUpperCase()}
    </div>
    <div className="h-4" />
    <h1 className="text-xl font-medium">
      {user.name}
    </h1>
    <div className="h-6" />
    <form className="grow flex flex-col items-center"
      onSubmit={Events.preventDefault}>
      <input className="hidden"
        autoComplete="off"
        name="username" />
      <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
        <input className="focus-visible:outline-none"
          autoComplete="off"
          type={masked ? "password" : "text"}
          placeholder="Password"
          value={$pass}
          onChange={e => setPass(e.currentTarget.value)}
          onKeyDown={onKeyDown}
          ref={useAutoFocus()} />
        <div className="flex items-center gap-2">
          <button className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none"
            type="button"
            onClick={() => setMasked(!masked)}>
            <InButton>
              {masked ? <Outline.EyeIcon className="size-5" /> : <Outline.EyeSlashIcon className="size-5" />}
            </InButton>
          </button>
          {user.auth != null &&
            <button className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none"
              type="button"
              onClick={onPassClick}>
              <InButton>
                <Outline.FingerPrintIcon className="size-5" />
              </InButton>
            </button>}
        </div>
      </div>
      {user.fsfh == null &&
        <input className="hidden"
          type="file"
          accept="application/octet-stream,.kdbx"
          onChange={e => setFile1(e.currentTarget.files?.[0])}
          ref={setPicker1} />}
      {user.fsfh == null &&
        <input className="hidden"
          type="file"
          accept="application/octet-stream,.kdbx"
          onChange={e => setFile2(e.currentTarget.files?.[0])}
          ref={setPicker2} />}
    </form>
  </div>
}

function UserMenuButton(props: { user: UserData }) {
  const { user } = props

  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, `/${user.uuid}/+`)

  return <a className="z-10 rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none"
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

  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  return <Fragment>
    <SubpathProvider value={hash}>
      {hash.url.pathname === "/reimport" &&
        <PathBoard>
          {"showOpenFilePicker" in window === true &&
            <UserReimportFsfhPage user={user} />}
          {"showOpenFilePicker" in window === false &&
            <UserReimportFilePage user={user} />}
        </PathBoard>}
    </SubpathProvider>
    <div className="flex flex-col text-left gap-2">
      <UserReimportButton />
      <UserRemoveButton user={user} />
    </div>
  </Fragment>
}

function UserReimportButton() {
  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, "/reimport")

  return <WideNakedMenuAnchor
    href={coords.url.hash}
    onClick={coords.onClick}
    onKeyDown={coords.onKeyDown}>
    <Outline.ArrowDownOnSquareIcon className="size-5" />
    Reimport
  </WideNakedMenuAnchor>
}

function UserReimportFilePage(props: { user: UserData }) {
  const { user } = props

  const close = useCloseContext().getOrThrow()
  const store = useStoreContext().getOrThrow()

  const [masked, setMasked] = useState(true)

  const [$name, setName] = useState(user.name)
  const [$pass, setPass] = useState("")

  const name = useDeferredValue($name || "Anon")
  const pass = useDeferredValue($pass)

  const [file, setFile] = useState<Nullable<File>>()

  const loadOrAlert = useCallback(() => Promise.try(async () => {
    if (file == null)
      return

    const data = new Uint8Array(await file.arrayBuffer())

    const encrypted = Readable.readFromBytesOrThrow(KDBX.Database.Encrypted, data).cloneOrThrow()
    const composite = await KDBX.CompositeKey.digestOrThrow(await KDBX.PasswordKey.digestOrThrow(new TextEncoder().encode(pass)))

    await encrypted.decryptOrThrow(composite)

    if (!confirm("Do you want to create a passkey?")) {
      const uuid = user.uuid

      const stale = await store.value.getOrThrow().getOrThrow<Array<UserData>>("users") || []

      const fresh = stale.map(x => x.uuid === user.uuid ? { uuid, name } : x)

      await store.value.getOrThrow().setOrThrow("users", fresh)

      store.update()

      close()

      return
    }

    const uuid = user.uuid

    const auth = await webAuthnStorage.createOrThrow(uuid.slice(0, 8), composite.value.bytes)

    const stale = await store.value.getOrThrow().getOrThrow<Array<UserData>>("users") || []

    const fresh = stale.map(x => x.uuid === user.uuid ? { uuid, name, auth } : x)

    await store.value.getOrThrow().setOrThrow("users", fresh)

    store.update()

    close()
  }).catch(Errors.display), [user, store, name, file, pass, close])

  const error = useMemo(() => {
    if (file == null)
      return "File is required"
    if (!pass.length)
      return "Password is required"
    return
  }, [file, pass])

  return <div className="flex flex-col grow p-6">
    <h1 className="text-xl font-medium">
      Reimport user
    </h1>
    <form className="grow flex flex-col"
      onSubmit={Events.preventDefault}>
      <input className="hidden"
        autoComplete="off"
        name="username" />
      <div className="h-6" />
      <div className="font-medium">
        Name
      </div>
      <div className="text-default-contrast">
        Will be used locally for display purposes
      </div>
      <div className="h-4" />
      <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
        <input className="w-full focus-visible:outline-none"
          autoComplete="off"
          placeholder="Anon"
          value={$name}
          onChange={e => setName(e.target.value)} />
      </div>
      <div className="h-6" />
      <div className="font-medium">
        File
      </div>
      <div className="text-default-contrast">
        Your existing KDBX file
      </div>
      <div className="h-4" />
      <div className="relative bg-default-contrast rounded-xl [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
        <input className="absolute inset-0 opacity-0 cursor-pointer"
          type="file"
          accept="application/octet-stream,.kdbx"
          onChange={e => setFile(e.target.files?.item(0))} />
        {file != null &&
          <div className="po-2">
            {file.name}
          </div>}
        {file == null &&
          <div className="po-2">
            Pick or drop file here
          </div>}
      </div>
      <div className="h-6" />
      <div className="font-medium">
        Password
      </div>
      <div className="text-default-contrast">
        Your existing password to decrypt the file
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
        <WideOppositeButton
          type="button"
          disabled={error != null}
          onClick={loadOrAlert}>
          {error != null ? error : "Open file"}
        </WideOppositeButton>
      </div>
    </form>
  </div>
}

function UserReimportFsfhPage(props: { user: UserData }) {
  const { user } = props

  const close = useCloseContext().getOrThrow()
  const store = useStoreContext().getOrThrow()

  const [masked, setMasked] = useState(true)

  const [$name, setName] = useState(user.name)
  const [$pass, setPass] = useState("")

  const name = useDeferredValue($name || "Anon")
  const pass = useDeferredValue($pass)

  const [fsfh, setFsfh] = useState<Nullable<FileSystemFileHandle>>(user.fsfh)

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
    const composite = await KDBX.CompositeKey.digestOrThrow(await KDBX.PasswordKey.digestOrThrow(new TextEncoder().encode(pass)))

    await encrypted.decryptOrThrow(composite)

    if (!confirm("Do you want to create a passkey?")) {
      const uuid = user.uuid

      const stale = await store.value.getOrThrow().getOrThrow<Array<UserData>>("users") || []

      const fresh = stale.map(x => x.uuid === user.uuid ? { uuid, name, fsfh } : x)

      await store.value.getOrThrow().setOrThrow("users", fresh)

      store.update()

      close()

      return
    }

    const uuid = user.uuid

    const auth = await webAuthnStorage.createOrThrow(uuid.slice(0, 8), composite.value.bytes)

    const stale = await store.value.getOrThrow().getOrThrow<Array<UserData>>("users") || []

    const fresh = stale.map(x => x.uuid === user.uuid ? { uuid, name, fsfh, auth } : x)

    await store.value.getOrThrow().setOrThrow("users", fresh)

    store.update()

    close()
  }).catch(Errors.display), [user, store, name, fsfh, pass, close])

  const error = useMemo(() => {
    if (fsfh == null)
      return "File is required"
    if (!pass.length)
      return "Password is required"
    return
  }, [fsfh, pass])

  return <div className="flex flex-col grow p-6">
    <h1 className="text-xl font-medium">
      Reimport user
    </h1>
    <form className="grow flex flex-col"
      onSubmit={Events.preventDefault}>
      <input className="hidden"
        autoComplete="off"
        name="username" />
      <div className="h-6" />
      <div className="font-medium">
        Name
      </div>
      <div className="text-default-contrast">
        Will be used locally for display purposes
      </div>
      <div className="h-4" />
      <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
        <input className="w-full focus-visible:outline-none"
          autoComplete="off"
          placeholder="Anon"
          value={$name}
          onChange={e => setName(e.target.value)} />
      </div>
      <div className="h-6" />
      <div className="font-medium">
        File
      </div>
      <div className="text-default-contrast">
        Your existing KDBX file
      </div>
      <div className="h-4" />
      <div className="relative bg-default-contrast rounded-xl [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
        {"showOpenFilePicker" in window === true &&
          <button className="absolute inset-0 opacity-0 cursor-pointer"
            type="button"
            onClick={pickOrAlert}
            onDragOver={Events.preventDefault}
            onDrop={dropOrAlert} />}
        {fsfh != null &&
          <div className="po-2">
            {fsfh.name}
          </div>}
        {fsfh == null &&
          <div className="po-2">
            Pick or drop file here
          </div>}
      </div>
      <div className="h-6" />
      <div className="font-medium">
        Password
      </div>
      <div className="text-default-contrast">
        Your existing password to decrypt the file
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
        <WideOppositeButton
          type="button"
          disabled={error != null}
          onClick={openOrAlert}>
          {error != null ? error : "Open file"}
        </WideOppositeButton>
      </div>
    </form>
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
    <Outline.TrashIcon className="size-5" />
    Remove
  </WideNakedMenuButton>
}