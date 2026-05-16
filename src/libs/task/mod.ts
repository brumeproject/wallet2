import { Awaitable } from "@/libs/awaitable/mod.ts";
import { Errors } from "@/libs/errors/mod.ts";
import { DependencyList, useCallback, useMemo, useState } from "react";

export function useTask<P extends readonly unknown[]>(callback: (...params: P) => Awaitable<void>, deps: DependencyList) {
  const [running, setRunning] = useState(false)

  const execute = useCallback(() => Promise.try(async (...params: P) => {
    using stack = new DisposableStack()

    if (running)
      return

    setRunning(true)

    stack.defer(() => setRunning(false))

    await callback(...params)
  }).catch(Errors.display), [running, ...deps])

  return useMemo(() => {
    return { execute, running }
  }, [execute, running])
}