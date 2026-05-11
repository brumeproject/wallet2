import { Nullable } from "@/libs/nullable/mod.ts";
import { useEffect, useState } from "react";

export function useController() {
  const [controller, setController] = useState<Nullable<ServiceWorker>>()

  useEffect(() => {
    setController(navigator.serviceWorker?.controller)
  }, [])

  useEffect(() => {
    const f = () => setController(navigator.serviceWorker?.controller)

    navigator.serviceWorker?.addEventListener("controllerchange", f)

    return () => navigator.serviceWorker?.removeEventListener("controllerchange", f)
  }, [])

  return controller
}