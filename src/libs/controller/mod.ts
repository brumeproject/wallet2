import { RpcPort } from "@/libs/jsonrpc/mod.ts";
import { Nullable } from "@/libs/nullable/mod.ts";
import { useCallback, useEffect, useState } from "react";

export function useController() {
  const [controller, setController] = useState<Nullable<ServiceWorker>>()

  useEffect(() => {
    setController(navigator.serviceWorker?.controller)
  }, [])

  useEffect(() => {
    const f = () => setController(navigator.serviceWorker?.controller)

    navigator.serviceWorker?.addEventListener("controllerchange", f)

    return () => navigator.serviceWorker?.removeEventListener("controllerchange", f)
  }, [])

  return controller
}

export function useBackground(controller: Nullable<ServiceWorker>) {
  const [background, setBackground] = useState<Nullable<RpcPort>>()

  const openOrThrow = useCallback(async () => {
    if (controller == null)
      return

    const { port1, port2 } = new MessageChannel()

    const background = new RpcPort(port1)

    background.addEventListener("request", (event) => {
      return
    }, { signal: background.closing })

    controller.postMessage(null, [port2])

    setBackground(background)
  }, [controller])

  useEffect(() => {
    openOrThrow().catch(console.error)
  }, [openOrThrow])

  useEffect(() => {
    background?.open()
  }, [background])

  useEffect(() => () => {
    background?.close()
  }, [background])

  useEffect(() => {
    const f = () => background?.close()

    addEventListener("beforeunload", f)

    return () => removeEventListener("beforeunload", f)
  }, [background])
}