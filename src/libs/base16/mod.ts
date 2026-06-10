// deno-lint-ignore-file no-namespace

export namespace base16 {

  export function padStart(self: string) {
    return "0".repeat(self.length % 2) + self
  }

  export function trimStart(self: string) {
    return self.replace(/^0+/, "")
  }

}