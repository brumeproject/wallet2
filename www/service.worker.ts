// deno-lint-ignore-file no-process-global

/// <reference lib="webworker" />

import { Nullable } from "@/libs/nullable/mod.ts";
import { Peer } from "@/libs/peer/mod.ts";
import { immutable } from "@hazae41/immutable";
import { RpcRequestPreinit } from "@hazae41/jsonrpc";

declare const self: ServiceWorkerGlobalScope

declare const CACHE: string
declare const FILES: [string, string][]

if (process.env.NODE_ENV === "production") {
  const cache = new immutable.cache.Cacher(CACHE, new Map(FILES))

  self.addEventListener("install", (event) => {
    /**
     * Precache new version
     */
    event.waitUntil(cache.precache().then(() => self.skipWaiting()))
  })

  self.addEventListener("activate", (event) => {
    /**
     * Uncache previous versions
     */
    event.waitUntil(cache.uncache())
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
     * Become the active service worker
     */
    event.waitUntil(self.skipWaiting())
  })

  self.addEventListener("activate", (event) => {
    /**
     * Claim all clients
     */
    event.waitUntil(self.clients.claim())
  })
}

export interface UserData {
  readonly uuid: string
  readonly name: string
  readonly fsfh?: Nullable<FileSystemFileHandle>
  readonly auth?: Nullable<Uint8Array<ArrayBuffer>>
}

export interface SessionInit {
  readonly user: UserData
  readonly comp: Uint8Array<ArrayBuffer>
  readonly data: Uint8Array<ArrayBuffer>
}

let current: Nullable<SessionInit> = null

const peers = new Set<Peer>()

self.addEventListener("message", async (event) => {
  if (event.origin !== self.origin)
    return
  if (event.source instanceof WindowClient === false)
    return

  const peer = new Peer(event.ports[0])

  const onClose = () => {
    peer.close()
  }

  const onLogin = async (request: RpcRequestPreinit<unknown>) => {
    const [session] = request.params as [SessionInit]

    current = session

    for (const peer of peers)
      peer.request({ method: "login", params: [session] }).then(r => r.getOrThrow()).catch(console.error)

    return
  }

  const onLogout = async (request: RpcRequestPreinit<unknown>) => {
    current = null

    for (const peer of peers)
      peer.request({ method: "logout" }).then(r => r.getOrThrow()).catch(console.error)

    return
  }

  peer.addEventListener("request", (event) => {
    const request = event.data

    if (request.method === "close")
      return event.respondWith(onClose())

    if (request.method === "login")
      return event.respondWith(Promise.resolve(onLogin(request)))
    if (request.method === "logout")
      return event.respondWith(Promise.resolve(onLogout(request)))

    if (request.method === "resume")
      return event.respondWith(current)

    return
  }, { signal: peer.closing })

  peer.addEventListener("close", () => {
    peers.delete(peer)
  }, { signal: peer.closing })

  peers.add(peer)

  peer.open()
})