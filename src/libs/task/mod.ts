import { Awaitable } from "@/libs/awaitable/mod.ts";
import { DependencyList, useCallback, useMemo, useRef, useState } from "react";

export function useTask<P extends readonly unknown[], R>(callback: (...params: P) => Awaitable<R>, deps: DependencyList) {
  const [running, setRunning] = useState(false)

  const promise = useRef<Promise<R>>(null)

  const execute = useCallback((async (...params: P) => {
    using stack = new DisposableStack()

    if (promise.current != null)
      return await promise.current

    stack.defer(() => promise.current = null)

    stack.defer(() => setRunning(false))

    setRunning(true)

    promise.current = Promise.resolve(callback(...params))

    return await promise.current
  }), deps)

  return useMemo(() => {
    return { execute, running }
  }, [execute, running])
}