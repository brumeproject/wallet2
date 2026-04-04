import { useEffect, useState } from "react";
import { Nullable } from "../nullable/mod.ts";

export function useAutoFocus() {
  const [current, setCurrent] = useState<Nullable<HTMLElement>>(null)

  useEffect(() => {
    if (current == null)
      return
    if (navigator.maxTouchPoints > 0)
      return
    current.focus()
  }, [current])

  return setCurrent
}