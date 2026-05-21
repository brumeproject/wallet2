import { useCallback, useState } from "react";
import { Errors } from "../errors/mod.ts";
import { Nullable } from "../nullable/mod.ts";

export function useCopy(value: Nullable<string>) {
  const [copied, setCopied] = useState(false)

  const copyOrDisplay = useCallback(() => Promise.try(async () => {
    if (value == null)
      return
    await navigator.clipboard.writeText(value)
    setTimeout(() => setCopied(false), 300)
    setCopied(true)
  }).catch(Errors.display), [value])

  return { copied, copyOrDisplay }
}