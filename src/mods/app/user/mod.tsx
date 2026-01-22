// deno-lint-ignore-file no-window

import { InAnchor, OppositeAnchor } from "@/libs/anchor/mod.tsx";
import { InButton, WideOppositeButton } from "@/libs/button/mod.tsx";
import { Errors } from "@/libs/errors/mod.ts";
import { Events } from "@/libs/events/mod.ts";
import { Outline } from "@/libs/heroicons/mod.ts";
import { PathMenu, WideNakedMenuAnchor, WideNakedMenuButton } from "@/libs/menu/mod.tsx";
import { Nullable } from "@/libs/nullable/mod.tsx";
import { useStoreContext } from "@/libs/store/mod.tsx";
import { PathWindow } from "@/libs/window/mod.tsx";
import { Readable, Unknown, Writable } from "@hazae41/binary";
import { SubpathProvider, useAnchorWithCoords, useHashSubpath, usePathContext } from "@hazae41/chemin";
import * as KDBX from "@hazae41/kdbx";
import { useCloseContext } from "@hazae41/react-close-context";
import { webAuthnStorage } from "@hazae41/webauthnstorage";
import React, { DragEvent, Fragment, KeyboardEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useAutoFocus } from "../../../libs/focus/mod.ts";
import { SessionData } from "../session/mod.tsx";

React;

export interface UserData {
  readonly uuid: string
  readonly name: string
  readonly fsfh?: Nullable<FileSystemFileHandle>
  readonly pass?: Nullable<Uint8Array<ArrayBuffer>>
}

export function LoginButton() {
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

export function LoginMenu(props: { login(session: SessionData): void }) {
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
        <PathMenu>
          <UserAddMenu />
        </PathMenu>}
      {hash.url.pathname === "/add/import" &&
        <PathWindow>
          {"showOpenFilePicker" in window === true &&
            <UserImportFsfhWindow />}
          {"showOpenFilePicker" in window === false &&
            <UserImportFileWindow />}
        </PathWindow>}
      {hash.url.pathname === "/add/create" &&
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
    <div className="rounded-full size-7 flex justify-center items-center border-2 border-dashed border-default-contrast">
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
    <Outline.SparklesIcon className="size-5" />
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
    <Outline.PaperClipIcon className="size-5" />
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
    if (file == null)
      return "File is required"
    if (!password.length)
      return "Password is required"
    return
  }, [file, password])

  return <div className="flex flex-col grow p-6">
    <h1 className="text-xl font-medium">
      Import user
    </h1>
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
        placeholder="Anon"
        value={$name}
        onChange={e => $setName(e.target.value)} />
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
      <input className="absolute w-full h-full opacity-0 cursor-pointer"
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
      Your existing password
    </div>
    <div className="h-4" />
    <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
      <input className="w-full focus-visible:outline-none"
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
    if (fsfh == null)
      return "File is required"
    if (!password.length)
      return "Password is required"
    return
  }, [fsfh, password])

  return <div className="flex flex-col grow p-6">
    <h1 className="text-xl font-medium">
      Import user
    </h1>
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
        placeholder="Anon"
        value={$name}
        onChange={e => $setName(e.target.value)} />
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
        <button className="absolute w-full h-full opacity-0 cursor-pointer"
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
      Your existing password
    </div>
    <div className="h-4" />
    <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
      <input className="w-full focus-visible:outline-none"
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
    if (!password.length)
      return "Password is required"
    return
  }, [password])

  return <div className="flex flex-col grow p-6">
    <h1 className="text-xl font-medium">
      Create user
    </h1>
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
        placeholder="Anon"
        value={$name}
        onChange={e => $setName(e.target.value)} />
    </div>
    <div className="h-6" />
    <div className="font-medium">
      Password
    </div>
    <div className="text-default-contrast">
      At least 3 characters
    </div>
    <div className="h-4" />
    <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
      <input className="w-full focus-visible:outline-none"
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

  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, `/${user.uuid}`)

  return <Fragment>
    <SubpathProvider value={hash}>
      {hash.url.pathname === `/${user.uuid}` &&
        <PathWindow>
          <UserLoginWindow user={user} login={login} />
        </PathWindow>}
      {hash.url.pathname === `/${user.uuid}/menu` &&
        <PathMenu>
          <UserMenu user={user} />
        </PathMenu>}
      {hash.url.pathname === `/${user.uuid}/reimport` &&
        <PathWindow>
          {"showOpenFilePicker" in window === true &&
            <UserReimportFsfhWindow user={user} />}
          {"showOpenFilePicker" in window === false &&
            <UserReimportFileWindow user={user} />}
        </PathWindow>}
    </SubpathProvider>
    <div className="relative group flex-1 rounded-xl hover:bg-default-double-contrast [&:has(:focus-visible)]:bg-default-double-contrast transition-all">
      <a className="absolute w-full h-full opacity-0 cursor-pointer"
        href={coords.url.hash}
        onClick={coords.onClick}
        onKeyDown={coords.onKeyDown} />
      {/* {user.fsfh == null &&
        <input className="absolute w-full h-full opacity-0 cursor-pointer"
          type="file"
          accept="application/octet-stream,.kdbx"
          onChange={e => loadOrAlert(user, e.currentTarget.files?.[0])} />}
      {user.fsfh != null &&
        <button className="absolute w-full h-full opacity-0 cursor-pointer"
          type="button"
          onClick={() => openOrAlert(user, user.fsfh)} />} */}
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

function UserLoginWindow(props: { user: UserData } & { login(session: SessionData): void }) {
  const { user, login } = props

  const close = useCloseContext().getOrThrow()

  const [password, setPassword] = useState("")

  const [masked, setMasked] = useState(true)

  const loadOrAlert = useCallback((file?: File) => Promise.try(async () => {
    if (file == null)
      return
    if (!password)
      return

    const data = new Uint8Array(await file.arrayBuffer())

    const encrypted = Readable.readFromBytesOrThrow(KDBX.Database.Encrypted, data).cloneOrThrow()
    const composite = await KDBX.CompositeKey.digestOrThrow(await KDBX.PasswordKey.digestOrThrow(new TextEncoder().encode(password)))
    const decrypted = await encrypted.decryptOrThrow(composite)

    console.log(decrypted.inner.content.value.document)

    login({ user, kdbx: decrypted })

    close()
  }).catch(Errors.display), [user, login, password, close])

  const openOrAlert = useCallback(() => Promise.try(async () => {
    if (user.fsfh == null)
      return
    if (!password)
      return

    await user.fsfh.requestPermission({ mode: "readwrite" })

    const file = await user.fsfh.getFile()
    const data = new Uint8Array(await file.arrayBuffer())

    const encrypted = Readable.readFromBytesOrThrow(KDBX.Database.Encrypted, data).cloneOrThrow()
    const composite = await KDBX.CompositeKey.digestOrThrow(await KDBX.PasswordKey.digestOrThrow(new TextEncoder().encode(password)))
    const decrypted = await encrypted.decryptOrThrow(composite)

    console.log(decrypted.inner.content.value.document)

    login({ user, kdbx: decrypted })

    close()
  }).catch(Errors.display), [user, login, password, close])

  const loadFromPassOrAlert = useCallback((file?: File) => Promise.try(async () => {
    if (file == null)
      return
    if (user.pass == null)
      return

    const stored = await webAuthnStorage.getOrThrow(user.pass) as Uint8Array<ArrayBuffer> & { length: 32 }

    const data = new Uint8Array(await file.arrayBuffer())

    const encrypted = Readable.readFromBytesOrThrow(KDBX.Database.Encrypted, data).cloneOrThrow()
    const composite = new KDBX.CompositeKey(new Unknown(stored))
    const decrypted = await encrypted.decryptOrThrow(composite)

    console.log(decrypted.inner.content.value.document)

    login({ user, kdbx: decrypted })

    close()
  }).catch(Errors.display), [user, login, close])

  const openFromPassOrAlert = useCallback((user: UserData) => Promise.try(async () => {
    if (user.pass == null)
      return
    if (user.fsfh == null)
      return

    const stored = await webAuthnStorage.getOrThrow(user.pass) as Uint8Array<ArrayBuffer> & { length: 32 }

    await user.fsfh.requestPermission({ mode: "readwrite" })

    const file = await user.fsfh.getFile()
    const data = new Uint8Array(await file.arrayBuffer())

    const encrypted = Readable.readFromBytesOrThrow(KDBX.Database.Encrypted, data).cloneOrThrow()
    const composite = new KDBX.CompositeKey(new Unknown(stored))
    const decrypted = await encrypted.decryptOrThrow(composite)

    console.log(decrypted.inner.content.value.document)

    login({ user, kdbx: decrypted })

    close()
  }).catch(Errors.display), [user, login, close])

  const [picker1, setPicker1] = useState<Nullable<HTMLInputElement>>()
  const [picker2, setPicker2] = useState<Nullable<HTMLInputElement>>()

  const onKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter")
      return

    if (user.fsfh == null)
      return void picker1?.click()

    openOrAlert()
  }, [user, openOrAlert, picker1])

  return <div className="flex flex-col items-center justify-center grow p-6">
    <div className="grow flex flex-col items-center py-24">
      <div className="rounded-full size-16 text-4xl flex justify-center items-center border border-default-contrast bg-opposite text-opposite">
        {user.name.slice(0, 1).toUpperCase()}
      </div>
      <div className="h-4" />
      <h1 className="text-xl font-medium">
        {user.name}
      </h1>
      <div className="h-6" />
      <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
        <input className="focus-visible:outline-none"
          type={masked ? "password" : "text"}
          placeholder="Your password"
          value={password}
          onChange={e => setPassword(e.currentTarget.value)}
          onKeyDown={onKeyDown}
          ref={useAutoFocus()} />
        <div className="flex items-center gap-2">
          <button className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none transition-all"
            type="button"
            onClick={() => setMasked(!masked)}>
            <InButton>
              {masked ? <Outline.EyeIcon className="size-5" /> : <Outline.EyeSlashIcon className="size-5" />}
            </InButton>
          </button>
          {user.pass != null && user.fsfh != null &&
            <button className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none transition-all"
              type="button"
              onClick={() => openFromPassOrAlert(user)}>
              <InButton>
                <Outline.FingerPrintIcon className="size-5" />
              </InButton>
            </button>}
          {user.pass != null && user.fsfh == null &&
            <button className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none transition-all"
              type="button"
              onClick={() => picker2?.click()}>
              <InButton>
                <Outline.FingerPrintIcon className="size-5" />
              </InButton>
            </button>}
        </div>
      </div>
      {user.fsfh == null &&
        <input className="h-0 opacity-0"
          type="file"
          accept="application/octet-stream,.kdbx"
          onChange={e => loadOrAlert(e.currentTarget.files?.[0])}
          ref={setPicker1} />}
      {user.fsfh == null &&
        <input className="h-0 opacity-0"
          type="file"
          accept="application/octet-stream,.kdbx"
          onChange={e => loadFromPassOrAlert(e.currentTarget.files?.[0])}
          ref={setPicker2} />}
    </div>
  </div>
}

function UserMenuButton(props: { user: UserData }) {
  const { user } = props

  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, `/${user.uuid}/menu`)

  return <a className="z-10 rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none transition-all"
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
    <UserReimportButton user={user} />
    <UserRemoveButton user={user} />
  </div>
}

function UserReimportButton(props: { user: UserData }) {
  const { user } = props

  const path = usePathContext().getOrThrow()

  const coords = useAnchorWithCoords(path, `/${user.uuid}/reimport`)

  return <WideNakedMenuAnchor
    href={coords.url.hash}
    onClick={coords.onClick}
    onKeyDown={coords.onKeyDown}>
    <Outline.CogIcon className="size-5" />
    Reimport
  </WideNakedMenuAnchor>
}

function UserReimportFileWindow(props: { user: UserData }) {
  const { user } = props

  const close = useCloseContext().getOrThrow()
  const store = useStoreContext().getOrThrow()

  const [$name, $setName] = useState(user.name)

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
      const uuid = user.uuid

      const stale = await store.value.getOrThrow().getOrThrow<Array<UserData>>("users") || []

      const fresh = stale.map(x => x.uuid === user.uuid ? { uuid, name } : x)

      await store.value.getOrThrow().setOrThrow("users", fresh)

      store.update()

      close()

      return
    }

    const uuid = user.uuid

    const pass = await webAuthnStorage.createOrThrow(uuid.slice(0, 8), composite.value.bytes)

    const stale = await store.value.getOrThrow().getOrThrow<Array<UserData>>("users") || []

    const fresh = stale.map(x => x.uuid === user.uuid ? { uuid, name, pass } : x)

    await store.value.getOrThrow().setOrThrow("users", fresh)

    store.update()

    close()
  }).catch(Errors.display), [user, store, name, file, password, close])

  const error = useMemo(() => {
    if (file == null)
      return "File is required"
    if (!password.length)
      return "Password is required"
    return
  }, [file, password])

  return <div className="flex flex-col grow p-6">
    <h1 className="text-xl font-medium">
      Reimport user
    </h1>
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
        placeholder="Anon"
        value={$name}
        onChange={e => $setName(e.target.value)} />
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
      <input className="absolute w-full h-full opacity-0 cursor-pointer"
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
      Your existing password
    </div>
    <div className="h-4" />
    <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
      <input className="w-full focus-visible:outline-none"
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

function UserReimportFsfhWindow(props: { user: UserData }) {
  const { user } = props

  const close = useCloseContext().getOrThrow()
  const store = useStoreContext().getOrThrow()

  const [$name, $setName] = useState(user.name)

  const name = $name || "Anon"

  const [fsfh, setFsfh] = useState<Nullable<FileSystemFileHandle>>(user.fsfh)

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
      const uuid = user.uuid

      const stale = await store.value.getOrThrow().getOrThrow<Array<UserData>>("users") || []

      const fresh = stale.map(x => x.uuid === user.uuid ? { uuid, name, fsfh } : x)

      await store.value.getOrThrow().setOrThrow("users", fresh)

      store.update()

      close()

      return
    }

    const uuid = user.uuid

    const pass = await webAuthnStorage.createOrThrow(uuid.slice(0, 8), composite.value.bytes)

    const stale = await store.value.getOrThrow().getOrThrow<Array<UserData>>("users") || []

    const fresh = stale.map(x => x.uuid === user.uuid ? { uuid, name, fsfh, pass } : x)

    await store.value.getOrThrow().setOrThrow("users", fresh)

    store.update()

    close()
  }).catch(Errors.display), [user, store, name, fsfh, password, close])

  const error = useMemo(() => {
    if (fsfh == null)
      return "File is required"
    if (!password.length)
      return "Password is required"
    return
  }, [fsfh, password])

  return <div className="flex flex-col grow p-6">
    <h1 className="text-xl font-medium">
      Reimport user
    </h1>
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
        placeholder="Anon"
        value={$name}
        onChange={e => $setName(e.target.value)} />
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
        <button className="absolute w-full h-full opacity-0 cursor-pointer"
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
      Your existing password
    </div>
    <div className="h-4" />
    <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
      <input className="w-full focus-visible:outline-none"
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