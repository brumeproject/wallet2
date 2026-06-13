import { $$ } from "@hazae41/saumon"

export const version = $$<string>(async () => {
  const { readFileSync } = await import("node:fs")

  const utf8 = readFileSync("./package.json", "utf8")
  const json = JSON.parse(utf8)

  return JSON.stringify(json.version)
})