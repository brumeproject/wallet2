import { AbiInt8 } from "@/libs/abi/mods/int/mod.ts";
import { Readable, Writable } from "@hazae41/binary";
import { assert, test } from "@hazae41/phobos";

test("int8", () => {
  function f(from: bigint, into: bigint, hex: string) {
    const raw = Writable.writeToBytes(AbiInt8.from(from))

    assert(raw.toHex() === hex, "hex should match")

    assert(Readable.readFromBytes(AbiInt8, raw).into() === into, "value should match")
  }

  f(0n, 0n, "0000000000000000000000000000000000000000000000000000000000000000")

  f(1n, 1n, "0000000000000000000000000000000000000000000000000000000000000001")
  f(-1n, -1n, "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")

  f(42n, 42n, "000000000000000000000000000000000000000000000000000000000000002a")

  f(127n, 127n, "000000000000000000000000000000000000000000000000000000000000007f")
  f(-128n, -128n, "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff80")

  f(128n, 0n, "0000000000000000000000000000000000000000000000000000000000000000")
  f(129n, 1n, "0000000000000000000000000000000000000000000000000000000000000001")

  f(-129n, 0n, "0000000000000000000000000000000000000000000000000000000000000000")
  f(-130n, -1n, "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")
})

test("int8 packed", () => {
  function f(from: bigint, hex: string) {
    const raw = Writable.writeToBytes(AbiInt8.pack(from))

    assert(raw.toHex() === hex, "hex should match")
  }

  f(0n, "00")

  f(1n, "01")
  f(-1n, "ff")

  f(42n, "2a")

  f(127n, "7f")
  f(-128n, "80")

  f(128n, "00")
  f(129n, "01")

  f(-129n, "00")
  f(-130n, "ff")
})