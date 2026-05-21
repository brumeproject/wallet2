import { Awaitable } from "@/libs/awaitable/mod.ts";
import { DependencyList, useCallback, useMemo, useState } from "react";

/**
 * A hook to execute an async function once and track its execution state
 * @param callback 
 * @param deps 
 * @returns 
 */
export function useSubmit<P extends readonly unknown[]>(callback: (...params: P) => Awaitable<void>, deps: DependencyList) {
  const [running, setRunning] = useState(false)

  const execute = useCallback((async (...params: P) => {
    using stack = new DisposableStack()

    if (running)
      return

    setRunning(true)

    stack.defer(() => setRunning(false))

    await callback(...params)
  }), [running, ...deps])

  return useMemo(() => {
    return { execute, running }
  }, [execute, running])
}