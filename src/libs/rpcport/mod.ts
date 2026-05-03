import { RpcCounter, RpcInvalidRequestError, RpcMessageInit, RpcRequestInit, RpcRequestPreinit, RpcResponse, RpcResponseInit } from "@hazae41/jsonrpc";
import { DataEvent, DataRespondableEvent } from "@hazae41/plume";
import { Result } from "@hazae41/result-and-option";

export interface RpcPortEventMap {
  close: CloseEvent

  request: DataRespondableEvent<RpcRequestPreinit<unknown>, unknown>

  response: DataEvent<RpcResponseInit>
}

export class RpcPort extends EventTarget {

  readonly #closed = new AbortController()

  readonly counter = new RpcCounter()

  constructor(
    readonly port: MessagePort
  ) {
    super()

    port.addEventListener("message", this.#onMessage.bind(this), { signal: this.closing })

    return
  }

  override addEventListener<K extends keyof RpcPortEventMap>(type: K, listener: (e: RpcPortEventMap[K]) => void, options?: AddEventListenerOptions): void

  override addEventListener(type: string, callback: (e: Event) => void, options?: AddEventListenerOptions): void

  override addEventListener(type: string, callback: (e: Event) => void, options?: AddEventListenerOptions): void {
    super.addEventListener(type, callback, options)
  }

  get closing() {
    return this.#closed.signal
  }

  #onMessage(event: MessageEvent) {
    const message = event.data as RpcMessageInit | string

    if (typeof message === "string")
      return this.close(message)

    if ("method" in message)
      return this.#onRequest(message).catch(console.error)

    return this.#onResponse(message).catch(console.error)
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

    this.port.postMessage(reason)

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

    this.port.postMessage(request)

    return await responded.promise
  }

}