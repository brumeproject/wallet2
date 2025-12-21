/// <reference types="@/libs/files/lib.d.ts" />

import { Errors } from "@/libs/errors/mod.ts";
import { Result } from "@hazae41/result-and-option";
import { Database } from "@hazae41/serac";
import React, { useCallback, useEffect, useMemo, useState } from "react";

React;

interface UserData {
  readonly uuid: string
  readonly file: FileSystemHandle
}

export function App() {
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

  return <div className="h-full w-full overflow-y-scroll animate-opacity-in text-pretty">
    <div className="p-safe flex flex-col items-center">
      <h1 className="text-xl font-medium">
        Users
      </h1>
      {allUsers?.map(user => (
        <button className=""
          key={user.uuid}
          type="button"
          onClick={() => openUserOrAlert(user)}>
          {user.uuid}
        </button>
      ))}
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
    </div>
  </div>
}