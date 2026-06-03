import { AbiUint8 } from "@/libs/abi/mods/uint/mod.ts";
import { Readable, Writable } from "@hazae41/binary";
import { test } from "@hazae41/phobos";

function f(value: bigint) {
  const raw = Writable.writeToBytes(AbiUint8.from(value))

  console.log(raw.toHex())

  console.log(value, Readable.readFromBytes(AbiUint8, raw).into())
}

test("uint", () => {
  f(42n)
  f(-100n)
})