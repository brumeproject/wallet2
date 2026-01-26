// deno-lint-ignore-file no-namespace

import { Result } from "@hazae41/result-and-option";
import { base32 } from "@scure/base";
import { useEffect, useMemo, useState } from "react";
import { Nullable } from "../nullable/mod.tsx";

export function useTotpCode(seed: Nullable<string>) {
  const [code, setCode] = useState<Nullable<string>>()

  const totp = useMemo(() => {
    if (!seed)
      return

    const totp = Result.runAndWrapSync(() => {
      return Totp.parseOrThrow(seed)
    }).getOrNull()

    return totp
  }, [seed])

  useEffect(() => {
    if (totp == null)
      return

    const interval = setInterval(async () => {
      setCode(await totp.generate())
    }, 1000)

    return () => clearInterval(interval)
  }, [totp])

  useEffect(() => () => {
    setCode(null)
  }, [totp])

  return code
}

export namespace Totp {

  export function parseOrThrow(text: string) {
    const url = Result.runAndWrapSync(() => {
      return new URL(text)
    }).getOrNull()

    if (url == null)
      return new Sha1Totp(base32.decode(text).slice())

    if (url.protocol !== "otpauth:")
      throw new Error("Invalid protocol")

    const secret = url.searchParams.get("secret")
    const digits = url.searchParams.get("digits")
    const period = url.searchParams.get("period")

    if (secret == null)
      throw new Error("Missing secret")

    const digits2 = digits != null ? Number(digits) : undefined
    const period2 = period != null ? Number(period) : undefined

    return new Sha1Totp(base32.decode(secret).slice(), digits2, period2)
  }

}

export class Sha1Totp {

  constructor(
    readonly secret: Uint8Array<ArrayBuffer>,
    readonly digits: number = 6,
    readonly period: number = 30,
  ) { }

  get url() {
    const url = new URL("otpauth://totp/")

    url.searchParams.set("secret", base32.encode(this.secret))
    url.searchParams.set("digits", this.digits.toString())
    url.searchParams.set("period", this.period.toString())

    return url
  }

  async generate() {
    const hmac = await crypto.subtle.importKey("raw", this.secret, { name: "HMAC", hash: "SHA-1" }, false, ["sign"])

    const time = BigInt(Date.now()) / (BigInt(this.period) * 1000n)

    const data = new DataView(new ArrayBuffer(8))

    data.setBigUint64(0, time, false)

    const digest = new Uint8Array(await crypto.subtle.sign("HMAC", hmac, data.buffer))

    const offset = digest[digest.length - 1] & 0x0f

    const code = 0
      | ((digest[offset + 0] & 0x7f) << 24)
      | ((digest[offset + 1] & 0xff) << 16)
      | ((digest[offset + 2] & 0xff) << 8)
      | ((digest[offset + 3] & 0xff) << 0)

    const pass = BigInt(code) % (10n ** BigInt(this.digits))

    return pass.toString().padStart(this.digits, "0")
  }

}