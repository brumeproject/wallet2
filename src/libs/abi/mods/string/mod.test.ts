import { AbiString } from "@/libs/abi/mods/string/mod.ts";
import { Readable, Writable } from "@hazae41/binary";
import { assert, test } from "@hazae41/phobos";

test("string", () => {
  function f(str: string, hex: string) {
    const raw = Writable.writeToBytes(AbiString.from(str))

    assert(raw.toHex() === hex)

    const abi = Readable.readFromBytes(AbiString, raw)

    assert(abi.into() === str)
  }

  f("Hello world", "000000000000000000000000000000000000000000000000000000000000000b48656c6c6f20776f726c64000000000000000000000000000000000000000000")
})