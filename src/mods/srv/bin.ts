#!/usr/bin/env node

import { createReadStream, statSync } from "node:fs";
import http from "node:http";
import path from "node:path";
import process from "node:process";

const dev = process.argv.slice(2).includes("--dev")

const headers = new Headers({
  /**
   * Recommended to be embedded with extra security enforcement
   */
  "Allow-CSP-from": "*",

  /**
   * Recommended to allow external webapps or embedders to fetch manifest.json and HTML pages metadata
   */
  "Access-Control-Allow-Origin": "*",

  /**
   * Recommended to get immutable service worker, but suggested for everything else too
   */
  "Cache-Control": dev ? "no-cache" : "public, max-age=31536000, immutable",
})

/**
 * Add your own file types here
 */
const mimes: Record<string, string> = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".wasm": "application/wasm"
}

const port = 3000;
const root = "./out";

const server = http.createServer((req, res) => {
  console.log(req.url!)

  const url = new URL(req.url!, "http://localhost")

  res.setHeaders(headers)

  const wanted = path.join(root, url.pathname)

  let served = wanted

  if (wanted.endsWith("/index.html")) {
    res.statusCode = 302;
    res.setHeader("Location", url.pathname.slice(0, -"index.html".length));
    res.end();
    return
  }

  if (wanted.endsWith(".html")) {
    res.statusCode = 302;
    res.setHeader("Location", url.pathname.slice(0, -".html".length));
    res.end();
    return
  }

  if (wanted.endsWith("/")) {
    if (statSync(served = wanted + "index.html", { throwIfNoEntry: false })?.isFile()) {
      res.setHeader("Content-Type", mimes[".html"]);
      createReadStream(served).pipe(res)
      return
    }

    if (statSync(served = wanted.slice(0, -1), { throwIfNoEntry: false })?.isFile()) {
      res.statusCode = 302;
      res.setHeader("Location", url.pathname.slice(0, -1));
      res.end();
      return
    }

    if (statSync(served = wanted.slice(0, -1) + ".html", { throwIfNoEntry: false })?.isFile()) {
      res.statusCode = 302;
      res.setHeader("Location", url.pathname.slice(0, -1));
      res.end();
      return
    }

    res.statusCode = 404;
    res.end("Not Found")
    return
  }

  if (statSync(wanted, { throwIfNoEntry: false })?.isFile()) {
    res.setHeader("Content-Type", mimes[path.extname(wanted)]);
    createReadStream(wanted).pipe(res)
    return
  }

  if (statSync(served = wanted + ".html", { throwIfNoEntry: false })?.isFile()) {
    res.setHeader("Content-Type", mimes[".html"]);
    createReadStream(served).pipe(res)
    return
  }

  if (statSync(served = wanted + "/index.html", { throwIfNoEntry: false })?.isFile()) {
    res.statusCode = 302;
    res.setHeader("Location", url.pathname + "/");
    res.end();
    return
  }

  res.statusCode = 404;
  res.end("Not Found")
  return
})

for (let offset = port; true; offset++) {
  try {
    const future = Promise.withResolvers<void>()

    server.listen(offset, () => future.resolve())
    server.on("error", (e) => future.reject(e))

    await future.promise

    console.log(`Serving at http://localhost:${offset}`)

    break
  } catch {
    console.warn(`Could not bind to port ${offset}`)

    continue
  }
}