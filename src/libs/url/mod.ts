export function pathOf(hrefOrUrl: string | URL) {
  const url = new URL(hrefOrUrl, location.href)

  if (url.origin !== location.origin)
    return url.href

  return url.pathname + url.search + url.hash
}