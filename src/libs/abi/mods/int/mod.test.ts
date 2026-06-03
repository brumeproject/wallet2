import { AbiInt32 } from "@/libs/abi/mods/int/mod.ts";
import { Writable } from "@hazae41/binary";
import { test } from "@hazae41/phobos";

function f(value: bigint) {
  const raw = Writable.writeToBytes(AbiInt32.Packed.from(value))

  console.log(raw.toHex())

  // console.log(value, Readable.readFromBytes(AbiInt32, raw).into())
}

test("int", () => {
  f(42n)
  f(127n)
  f(-127n)
  f(-1n)
  f(129n)
})