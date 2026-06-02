import { RlpType } from "@/libs/rlp/mods/type/mod.ts";
import { Readable, Writable } from "@hazae41/binary";
import { assert, test } from "@hazae41/phobos";

function f(hex: string) {
  const rlp = Readable.readFromBytesOrThrow(RlpType, Uint8Array.fromHex(hex))

  console.log(rlp)

  const hex2 = Writable.writeToBytesOrThrow(rlp).toHex()

  assert(hex === hex2)
}

test("rlp tx", () => {
  f("ec808504a817c80082520894d8da6bf26964af9d7eed9e03e53415d37aa96045880de0b6b3a764000080018080")
  f("f86a058506fc23ac00830186a094d8da6bf26964af9d7eed9e03e53415d37aa9604580b844a9059cbb000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa960450000000000000000000000000000000000000000000000000de0b6b3a7640000018080")
  f("f8760c8505d21dba0082520894d8da6bf26964af9d7eed9e03e53415d37aa9604588112210f4768db4008a48656c6c6f20524c502126a0aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa0bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb")
  f("f0012a843b9aca008506fc23ac0082c35094d8da6bf26964af9d7eed9e03e53415d37aa960458806f05b59d3b2000080c0")
})