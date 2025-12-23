import { Option, Result } from "@hazae41/result-and-option";
import { Database } from "@hazae41/serac";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Nullable } from "../../libs/nullable/mod.tsx";
import { ChildrenProps } from "../../libs/props/mod.ts";

React;

const UsersDatabaseContext = createContext<Nullable<Result<Database>>>(null)

export function useUsersDatabaseContext() {
  return Option.wrap(useContext(UsersDatabaseContext))
}

export function UsersDatabaseProvider(props: ChildrenProps) {
  const { children } = props

  const [result, setResult] = useState<Result<Database>>(null)

  const openAndWrap = useCallback(() => Result.runAndWrap(async () => {
    return await Database.openOrThrow("users", 1, () => { })
  }), [])

  useEffect(() => {
    openAndWrap().then(setResult)
  }, [])

  return <UsersDatabaseContext.Provider value={result}>
    {children}
  </UsersDatabaseContext.Provider>
}