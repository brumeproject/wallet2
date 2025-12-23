// deno-lint-ignore-file require-await

/// <reference types="@/libs/files/lib.d.ts" />

import { Errors } from "@/libs/errors/mod.ts";
import { HashSubpathProvider, useCoords, useHashSubpath, usePathContext } from "@hazae41/chemin";
import { Result } from "@hazae41/result-and-option";
import { Database } from "@hazae41/serac";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useClientContext } from "../../libs/client/mod.tsx";
import { Dialog } from "../../libs/dialog/mod.tsx";
import { Menu } from "../../libs/menu/mod.tsx";

React;

interface UserData {
  readonly uuid: string
  readonly file: FileSystemHandle
}

export function App() {
  const client = useClientContext().getOrThrow()

  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const [users, setUsers] = useState<Result<Database>>()

  const openUsersAndWrap = useCallback(() => Result.runAndWrap(async () => {
    return await Database.openOrThrow("users", 1, () => { })
  }), [])

  useEffect(() => {
    openUsersAndWrap().then(setUsers)
  }, [])

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
    getAllUsers().then(setAllUsers).catch(console.error)
  }, [users])

  const addUserOrAlert = useCallback(() => Promise.try(async () => {
    const stale = await users.getOrThrow().getOrThrow<Array<UserData>>("list") || []

    const fresh = [...stale, { uuid, file } satisfies UserData]

    await users.getOrThrow().setOrThrow("list", fresh)

    setAllUsers(fresh)
  }).catch(Errors.display), [users, uuid, file])

  const openUserOrAlert = useCallback((user: UserData) => Promise.try(async () => {
    console.log(user)
  }).catch(Errors.display), [users])

  const LoginButton = () => {
    const coords = useCoords(hash, "/login")

    return <a className=""
      href={coords.url.hash}
      onClick={coords.onClick}
      onKeyDown={coords.onKeyDown}
      onContextMenu={coords.onContextMenu}
      type="button">
      Login
    </a>
  }

  const AddUserButton = () => {
    const coords = useCoords(hash, "/login/add")

    return <a className=""
      href={coords.url.hash}
      onClick={coords.onClick}
      onKeyDown={coords.onKeyDown}
      onContextMenu={coords.onContextMenu}
      type="button">
      Add user
    </a>
  }

  return <div className="h-full w-full overflow-y-scroll animate-opacity-in text-pretty">
    <div className="p-safe flex flex-col items-center">
      <HashSubpathProvider>
        {client && hash.url.pathname === "/login" &&
          <Menu>
            {allUsers?.map(user => (
              <button className=""
                key={user.uuid}
                type="button"
                onClick={() => openUserOrAlert(user)}>
                {user.uuid}
              </button>
            ))}
            <AddUserButton />
          </Menu>}
        {client && hash.url.pathname === "/login/add" &&
          <Dialog>
            <h1 className="text-xl font-medium">
              Add user
            </h1>
            <button className=""
              type="button"
              onClick={pickFileOrAlert}>
              Open
            </button>
            <button className=""
              type="button"
              onClick={addUserOrAlert}>
              Submit
            </button>
          </Dialog>}
      </HashSubpathProvider>
      <LoginButton />
    </div>
  </div>
}