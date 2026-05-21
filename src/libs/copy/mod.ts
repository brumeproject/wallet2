import { useCallback, useState } from "react";
import { flushSync } from "react-dom";
import { Errors } from "../errors/mod.ts";
import { Nullable } from "../nullable/mod.ts";

export function useCopy(value: Nullable<string>) {
  const [copied, setCopied] = useState(false)

  const copyOrDisplay = useCallback(() => Promise.try(async () => {
    if (value == null)
      return

    await navigator.clipboard.writeText(value)

    setTimeout(() => setCopied(false), 300)

    flushSync(() => setCopied(true))
  }).catch(Errors.display), [value])

  return { copied, copyOrDisplay }
}