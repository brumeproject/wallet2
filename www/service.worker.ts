// deno-lint-ignore-file no-process-global require-await

/// <reference lib="webworker" />

import { immutable } from "@hazae41/immutable";
import { RpcCounter } from "@hazae41/jsonrpc";

declare const self: ServiceWorkerGlobalScope

declare const CACHE: string
declare const FILES: [string, string][]

/**
 * Only cache on production
 */
if (process.env.NODE_ENV === "production") {
  const cache = new immutable.cache.Cacher(CACHE, new Map(FILES))

  self.addEventListener("install", (event) => {
    /**
     * Precache new version and auto-activate as the update was already accepted
     */
    event.waitUntil(cache.precache().then(() => self.skipWaiting()))
  })

  self.addEventListener("activate", (event) => {
    /**
     * Take control of all clients and uncache previous versions
     */
    event.waitUntil(self.clients.claim().then(() => cache.uncache()))
  })

  /**
   * Respond with cache
   */
  self.addEventListener("fetch", (event) => {
    const response = cache.handle(event.request)

    if (response == null)
      return

    event.respondWith(response)
  })
}

if (process.env.NODE_ENV === "development") {
  self.addEventListener("install", (event) => {
    /**
     * Auto-activate
     */
    event.waitUntil(self.skipWaiting())
  })

  self.addEventListener("activate", (event) => {
    /**
     * Take control of all clients
     */
    event.waitUntil(self.clients.claim())
  })
}

class RpcMessenger {

  readonly counter = new RpcCounter()

  constructor(
    readonly name: string,
    readonly port: MessagePort
  ) { }

}

const onForegroundMessage = async (event: ExtendableMessageEvent) => {
  // using stack = new DisposableStack()

  // const aborter = new AbortController()
  // stack.defer(() => aborter.abort())

  // const name = `foreground-${crypto.randomUUID().slice(0, 8)}`
  // const port = event.ports[0]

  // const ping = Promise.withResolvers<void>()

  // const onRequest = async (request: RpcRequestInit<unknown>) => {
  //   if (request.method === "ping") {
  //     ping.resolve()
  //     port.postMessage(JSON.stringify(new RpcOk(request.id, "pong")))
  //     return
  //   }

  //   console.log(name, request)
  // }

  // port.addEventListener("message", async (event) => {
  //   const message = JSON.parse(event.data) as RpcMessage

  //   if ("method" in message)
  //     return await onRequest(message)

  //   console.log(name, message)
  // }, { signal: aborter.signal })

  // port.postMessage(JSON.stringify(new RpcRequest(null, "ping", "ping")))

  // port.start()
  // stack.defer(() => port.close())

  // AbortSignal.timeout(5000).addEventListener("abort", () => {
  //   ping.reject(new Error("Timeout"))
  // }, { signal: aborter.signal })

  // await ping.promise

  // console.log(name, "connected")
}

self.addEventListener("message", (event) => {
  if (event.origin !== location.origin)
    return
  if (event.data === "PING")
    return void event.source?.postMessage("PONG")
  if (event.data === "FOREGROUND->BACKGROUND")
    return void onForegroundMessage(event)
  return
})