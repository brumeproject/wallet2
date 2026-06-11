import { Awaitable } from "@/libs/awaitable/mod.ts";
import { DependencyList, useCallback, useMemo, useState } from "react";
import { flushSync } from "react-dom";

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

    flushSync(() => setRunning(true))

    stack.defer(() => setRunning(false))

    await callback(...params)
  }), [running, ...deps])

  return useMemo(() => {
    return { execute, running }
  }, [execute, running])
}

// export function useTask<P extends readonly unknown[], R>(callback: (...params: P) => Awaitable<R>, deps: DependencyList) {
//   const [running, setRunning] = useState(false)

//   const execute = useCallback((async (...params: P) => {
//     using stack = new DisposableStack()

//     if (running) // TODO return current promise
//       throw new Error("Task is already running")

//     flushSync(() => setRunning(true))

//     stack.defer(() => setRunning(false))

//     return await callback(...params)
//   }), [running, ...deps])

//   return useMemo(() => {
//     return { execute, running }
//   }, [execute, running])
// }