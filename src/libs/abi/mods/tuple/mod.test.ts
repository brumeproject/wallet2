import { AbiString } from "@/libs/abi/mods/string/mod.ts";
import { AbiReadableTuple } from "@/libs/abi/mods/tuple/mod.ts";
import { Readable } from "@hazae41/binary";
import { test } from "@hazae41/phobos";

test("tuple", () => {
  const tuple = Readable.readFromBytes(new AbiReadableTuple([AbiString]), Uint8Array.fromHex("0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000b68656c6c6f20776f726c64000000000000000000000000000000000000000000"))

  console.log(tuple.into()[0])
})