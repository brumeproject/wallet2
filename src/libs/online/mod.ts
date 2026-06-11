import { useEffect, useState } from "react";

export function useOnline() {
  const [online, setOnline] = useState(true)

  useEffect(() => {
    const f = () => setOnline(true)

    addEventListener("online", f)

    return () => removeEventListener("online", f)
  }, [])

  useEffect(() => {
    const f = () => setOnline(false)

    addEventListener("offline", f)

    return () => removeEventListener("offline", f)
  }, [])

  return online
}