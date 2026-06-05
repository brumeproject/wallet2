import { AbiReadableArray } from "@/libs/abi/mods/array/mod.ts";
import { AbiString } from "@/libs/abi/mods/string/mod.ts";
import { AbiReadableTuple } from "@/libs/abi/mods/tuple/mod.ts";
import { Readable } from "@hazae41/binary";
import { test } from "@hazae41/phobos";

test("array", () => {
  const Array = new AbiReadableArray(AbiString, 2)
  const Tuple = new AbiReadableTuple([Array])

  const tuple1 = Tuple.from([["hello", "world"]])
  const tuple2 = Readable.readFromBytes(Tuple, Uint8Array.fromHex("000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000568656c6c6f0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005776f726c64000000000000000000000000000000000000000000000000000000"))

  console.log(tuple1.into()) // -> ["hello", "world"]
  console.log(tuple2.into()) // -> ["hello", "world"]
})
