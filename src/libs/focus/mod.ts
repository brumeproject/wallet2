import { useEffect, useState } from "react";
import { Nullable } from "../nullable/mod.tsx";

export function useAutoFocus() {
  const [current, setCurrent] = useState<Nullable<HTMLElement>>(null)

  useEffect(() => {
    current?.focus()
  }, [current])

  return setCurrent
}