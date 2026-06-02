import { base16 } from "@/libs/eip155/libs/base16/mod.ts";
import { RlpItem } from "@/libs/rlp/mods/item/mod.ts";

export type RlpUintLike =
  | `0x${string}`
  | bigint
  | number

export type RlpDataLike =
  | `0x${string}`
  | Uint8Array

export namespace RlpUintLike {

  export type From = RlpItem
  export type Into = RlpItem

  export function from(from: From): RlpUintLike {
    return BigInt(`0x${from.value.toHex()}`)
  }

  export function into(self: RlpUintLike): Into {
    if (typeof self === "string")
      return RlpItem.fromOrThrow(Uint8Array.fromHex(base16.padStart(base16.trimStart(self.slice(2)))))
    if (typeof self === "bigint")
      return RlpItem.fromOrThrow(Uint8Array.fromHex(base16.padStart(base16.trimStart(self.toString(16)))))
    if (typeof self === "number")
      return RlpItem.fromOrThrow(Uint8Array.fromHex(base16.padStart(base16.trimStart(self.toString(16)))))
    throw new Error()
  }

}

export namespace RlpDataLike {

  export type From = RlpItem
  export type Into = RlpItem

  export function from(from: From): RlpDataLike {
    return `0x${from.value.toHex()}`
  }

  export function into(self: RlpDataLike): Into {
    if (typeof self === "string")
      return RlpItem.fromOrThrow(Uint8Array.fromHex(base16.padStart(self.slice(2))))
    if (self instanceof Uint8Array)
      return RlpItem.fromOrThrow(self)
    throw new Error()
  }

}