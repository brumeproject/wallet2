import { AbiString } from "@/libs/abi/mods/string/mod.ts";
import { AbiReadableTuple } from "@/libs/abi/mods/tuple/mod.ts";
import { AbiUint8 } from "@/libs/abi/mods/uint/mod.ts";
import { Readable } from "@hazae41/binary";
import { test } from "@hazae41/phobos";

test("tuple", () => {
  const Tuple = new AbiReadableTuple([AbiString, AbiUint8])

  const tuple1 = Tuple.from(["hello world", 1n])
  const tuple2 = Readable.readFromBytes(Tuple, Uint8Array.fromHex("00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000b68656c6c6f20776f726c64000000000000000000000000000000000000000000"))

  console.log(tuple1.into()) // -> ["hello world", 1n]
  console.log(tuple2.into()) // -> ["hello world", 1n]
})

