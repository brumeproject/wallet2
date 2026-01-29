import { Nullable } from "@/libs/nullable/mod.tsx";
import { ChildrenProps } from "@/libs/props/mod.ts";
import { Err, Option, Result } from "@hazae41/result-and-option";
import { Database } from "@hazae41/serac";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

React;

export interface StoreHandle {

  readonly value: Result<Database>

  update: () => void

}

const StoreContext = createContext<Nullable<StoreHandle>>(null);

export function useStoreContext() {
  return Option.wrap(useContext(StoreContext))
}

export function StoreProvider(props: ChildrenProps) {
  const { children } = props

  const [value, setValue] = useState<Result<Database>>(() => new Err("Database not opened yet"))

  const openAndWrap = useCallback(() => Result.runAndWrap(async () => {
    return await Database.openOrThrow("app", 1, () => { })
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

  return <StoreContext.Provider value={handle}>
    {children}
  </StoreContext.Provider>
}