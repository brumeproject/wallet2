import { Err, Option, Result } from "@hazae41/result-and-option";
import { Database } from "@hazae41/serac";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Nullable } from "../../libs/nullable/mod.tsx";
import { ChildrenProps } from "../../libs/props/mod.ts";

React;

export interface UsersDatabaseHandle {

  readonly value: Result<Database>

  update: () => void

}

const UsersDatabaseContext = createContext<Nullable<UsersDatabaseHandle>>(null);

export function useUsersDatabaseContext() {
  return Option.wrap(useContext(UsersDatabaseContext))
}

export function UsersDatabaseProvider(props: ChildrenProps) {
  const { children } = props

  const [value, setValue] = useState<Result<Database>>(() => new Err("Database not opened yet"))

  const openAndWrap = useCallback(() => Result.runAndWrap(async () => {
    return await Database.openOrThrow("users", 1, () => { })
  }), [])

  useEffect(() => {
    openAndWrap().then(setValue)
  }, [])

  const [counter, setCounter] = useState(0)

  const update = useCallback(() => {
    setCounter(c => c + 1)
  }, [])

  const handle = useMemo(() => {
    return { value, update }
  }, [value, update, counter])

  return <UsersDatabaseContext.Provider value={handle}>
    {children}
  </UsersDatabaseContext.Provider>
}