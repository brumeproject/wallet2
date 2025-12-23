// deno-lint-ignore-file require-await

/// <reference types="@/libs/files/lib.d.ts" />

import { Errors } from "@/libs/errors/mod.ts";
import { HashSubpathProvider, useCoords, useHashSubpath, usePathContext } from "@hazae41/chemin";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ClickableOppositeAnchor } from "../../libs/anchor/mod.tsx";
import { WideClickableOppositeButton } from "../../libs/button/mod.tsx";
import { useClientContext } from "../../libs/client/mod.tsx";
import { Dialog } from "../../libs/dialog/mod.tsx";
import { Outline } from "../../libs/heroicons/mod.ts";
import { Menu, WideClickableNakedMenuAnchor } from "../../libs/menu/mod.tsx";
import { useUsersDatabaseContext } from "../../libs/users/mod.tsx";

React;

interface UserData {
  readonly uuid: string
  readonly file: FileSystemHandle
}

export function App() {
  const client = useClientContext().getOrThrow()

  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const users = useUsersDatabaseContext().getOrThrow()

  const uuid = useMemo(() => {
    return crypto.randomUUID()
  }, [])

  const [file, setFile] = useState<FileSystemHandle>()

  const pickFileOrAlert = useCallback(() => Promise.try(async () => {
    const [file] = await showOpenFilePicker({ id: uuid.slice(0, 32) })

    if (file == null)
      return

    setFile(file)
  }).catch(Errors.display), [uuid])

  const [allUsers, setAllUsers] = useState<Array<UserData>>()

  const getAllUsers = useCallback(async () => {
    return await users.getOrThrow().getOrThrow<Array<UserData>>("list") || []
  }, [users])

  useEffect(() => {
    if (users == null)
      return
    if (users.isErr())
      return
    getAllUsers().then(setAllUsers).catch(console.error)
  }, [users])

  const addUserOrAlert = useCallback(() => Promise.try(async () => {
    const stale = await users.getOrThrow().getOrThrow<Array<UserData>>("list") || []

    const fresh = [...stale, { uuid, file } satisfies UserData]

    await users.getOrThrow().setOrThrow("list", fresh)

    setAllUsers(fresh)
  }).catch(Errors.display), [users, uuid, file])

  const openUserOrAlert = useCallback((user: UserData) => Promise.try(async () => {
    alert(user.uuid)
  }).catch(Errors.display), [users])

  const LoginButton = () => {
    const coords = useCoords(hash, "/login")

    return <ClickableOppositeAnchor
      href={coords.url.hash}
      onClick={coords.onClick}
      onKeyDown={coords.onKeyDown}
      onContextMenu={coords.onContextMenu}>
      Login
    </ClickableOppositeAnchor>
  }

  const LoginMenu = () => {
    return <div className="flex flex-col text-left gap-2">
      {allUsers?.map(user => (
        <WideClickableNakedMenuAnchor
          key={user.uuid}
          onClick={() => openUserOrAlert(user)}>
          {user.uuid.slice(0, 8)}
        </WideClickableNakedMenuAnchor>
      ))}
      <AddUserButton />
    </div>
  }

  const AddUserButton = () => {
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
  }

  const AddUserMenu = () => {
    return <div className="flex flex-col text-left gap-2">
      <ImportUserButton />
      <CreateUserButton />
    </div>
  }

  const ImportUserButton = () => {
    const coords = useCoords(hash, "/login/add/import")

    return <WideClickableNakedMenuAnchor
      href={coords.url.hash}
      onClick={coords.onClick}
      onKeyDown={coords.onKeyDown}
      onContextMenu={coords.onContextMenu}>
      Import user
    </WideClickableNakedMenuAnchor>
  }

  const CreateUserButton = () => {
    const coords = useCoords(hash, "/login/add/create")

    return <WideClickableNakedMenuAnchor
      href={coords.url.hash}
      onClick={coords.onClick}
      onKeyDown={coords.onKeyDown}
      onContextMenu={coords.onContextMenu}>
      Create user
    </WideClickableNakedMenuAnchor>
  }

  return <div className="h-full w-full overflow-y-scroll animate-opacity-in text-pretty">
    <div className="p-safe flex flex-col items-center">
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
            <h1 className="text-xl font-medium">
              Import user
            </h1>
            <div className="flex items-center flex-wrap-reverse gap-2">
              <WideClickableOppositeButton
                onClick={pickFileOrAlert}>
                Open file
              </WideClickableOppositeButton>
            </div>
          </Dialog>}
        {client && hash.url.pathname === "/login/add/create" &&
          <Dialog>
            <h1 className="text-xl font-medium">
              Create user
            </h1>
            <div className="flex items-center flex-wrap-reverse gap-2">
              <WideClickableOppositeButton
                onClick={pickFileOrAlert}>
                Save file
              </WideClickableOppositeButton>
            </div>
          </Dialog>}
      </HashSubpathProvider>
      <LoginButton />
    </div>
  </div>
}