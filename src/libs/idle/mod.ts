export function requestIdleCallback(callback: () => void, options?: IdleRequestOptions) {
  if ("requestIdleCallback" in globalThis) {
    globalThis.requestIdleCallback(callback, options)
  } else {
    setTimeout(callback, options?.timeout)
  }
}