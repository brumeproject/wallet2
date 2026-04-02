// deno-lint-ignore-file no-namespace

import { Nullable } from "@/libs/nullable/mod.ts";
import { Sha1Totp } from "@hazae41/pendule";
import { Result } from "@hazae41/result-and-option";
import { useEffect, useMemo, useState } from "react";

export function useTotpCode(seed: Nullable<string>) {
  const [code, setCode] = useState<Nullable<string>>()

  const totp = useMemo(() => {
    if (!seed)
      return

    const totp = Result.runAndWrapSync(() => {
      return Sha1Totp.parseOrThrow(seed)
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