// deno-lint-ignore-file no-process-global

/// <reference lib="webworker" />

import { Nullable } from "@/libs/nullable/mod.ts";
import { immutable } from "@hazae41/immutable";
import { RpcCounter, RpcInvalidRequestError, RpcMessageInit, RpcRequestInit, RpcRequestPreinit, RpcResponse, RpcResponseInit } from "@hazae41/jsonrpc";
import { DataEvent, DataRespondableEvent } from "@hazae41/plume";
import { Result } from "@hazae41/result-and-option";

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

export interface PeerEventMap {
  close: CloseEvent

  request: DataRespondableEvent<RpcRequestPreinit<unknown>, unknown>

  response: DataEvent<RpcResponseInit>
}

export class Peer extends EventTarget {

  readonly #closed = new AbortController()

  readonly counter = new RpcCounter()

  constructor(
    readonly port: MessagePort
  ) {
    super()

    port.addEventListener("message", this.#onMessage.bind(this), { signal: this.closing })

    return
  }

  override addEventListener<K extends keyof PeerEventMap>(type: K, listener: (e: PeerEventMap[K]) => void, options?: AddEventListenerOptions): void

  override addEventListener(type: string, callback: (e: Event) => void, options?: AddEventListenerOptions): void

  override addEventListener(type: string, callback: (e: Event) => void, options?: AddEventListenerOptions): void {
    super.addEventListener(type, callback, options)
  }

  get closing() {
    return this.#closed.signal
  }

  #onMessage(event: MessageEvent) {
    const message = event.data as RpcMessageInit

    if ("method" in message)
      this.#onRequest(message).catch(console.error)
    else
      this.#onResponse(message).catch(console.error)

    return
  }

  async #onRequest(request: RpcRequestInit<unknown>) {
    const result = await Result.runAndWrap(() => this.#respond(request))

    const response = RpcResponse.rewrap(request.id, result)

    this.port.postMessage(response)
  }

  async #respond(request: RpcRequestInit<unknown>) {
    const subevent = new DataRespondableEvent("request", { data: request })

    this.dispatchEvent(subevent)

    await subevent.extension

    if (subevent.response != null)
      return await subevent.response

    throw new RpcInvalidRequestError()
  }

  async #onResponse(response: RpcResponseInit) {
    this.dispatchEvent(new DataEvent("response", { data: response }))
  }

  open() {
    this.port.start()
  }

  close(reason?: string) {
    const subevent = new CloseEvent("close", { reason })

    this.dispatchEvent(subevent)

    this.#closed.abort(reason)

    this.port.close()
  }

  async request<T>(reqinit: RpcRequestPreinit<unknown>, signal = new AbortController().signal): Promise<RpcResponse<T>> {
    using stack = new DisposableStack()

    const cleaner = new AbortController()
    stack.defer(() => cleaner.abort())

    const responded = Promise.withResolvers<RpcResponse<T>>()
    stack.defer(() => responded.reject())
    responded.promise.catch(() => { })

    const request = this.counter.prepare(reqinit)

    this.addEventListener("response", (event: DataEvent<RpcResponseInit<unknown>>) => {
      const resinit = event.data as RpcResponseInit<T>
      const response = RpcResponse.from<T>(resinit)

      if (response.id !== request.id)
        return

      responded.resolve(response)
    }, { signal: cleaner.signal })

    this.addEventListener("close", responded.reject, { signal: cleaner.signal })
    signal.addEventListener("abort", responded.reject, { signal: cleaner.signal })

    return await responded.promise
  }

}

export interface UserData {
  readonly uuid: string
  readonly name: string
  readonly fsfh?: Nullable<FileSystemFileHandle>
  readonly auth?: Nullable<Uint8Array<ArrayBuffer>>
}

export interface SessionData {
  readonly user: UserData
  readonly comp: Uint8Array<ArrayBuffer>
  readonly data: Uint8Array<ArrayBuffer>
}

let current: Nullable<SessionData> = null

const peers = new Set<Peer>()

self.addEventListener("message", (event) => {
  if (event.origin !== self.origin)
    return
  if (event.source instanceof WindowClient === false)
    return

  const peer = new Peer(event.ports[0])

  const onClose = () => {
    peer.close()
  }

  const onLogin = async (request: RpcRequestPreinit<unknown>) => {
    const [session] = request.params as [SessionData]

    current = session

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
      return event.respondWith(onLogin(request))
    if (request.method === "logout")
      return event.respondWith(onLogout(request))
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