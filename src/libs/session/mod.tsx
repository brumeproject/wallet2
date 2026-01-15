import * as KDBX from "@hazae41/kdbx";
import { Option } from "@hazae41/result-and-option";
import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { Nullable } from "../nullable/mod.tsx";
import { ChildrenProps } from "../props/mod.ts";

React;

export interface UserData {
  readonly uuid: string
  readonly name: string
  readonly fsfh?: FileSystemFileHandle
  readonly pass?: Uint8Array<ArrayBuffer>
}

export interface SessionData {
  readonly user: UserData
  readonly kdbx: KDBX.Database.Decrypted
}

export interface SessionHandle {

  readonly value: SessionData

  update: () => void

}

export const SessionContext = createContext<Nullable<SessionHandle>>(null)

export function useSessionContext() {
  return Option.wrap(useContext(SessionContext))
}

export function SessionProvider(props: ChildrenProps & { value: SessionData }) {
  const { children, value } = props

  const [counter, setCounter] = useState(0)

  const update = useCallback(() => {
    setCounter(c => c + 1)
  }, [])

  const handle = useMemo(() => {
    return { value, update }
  }, [value, update, counter])

  return <SessionContext.Provider value={handle}>
    {children}
  </SessionContext.Provider>
}