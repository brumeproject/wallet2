// deno-lint-ignore-file no-process-global

/// <reference lib="webworker" />

import { immutable } from "@hazae41/immutable";

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