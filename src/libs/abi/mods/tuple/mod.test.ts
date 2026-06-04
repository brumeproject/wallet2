import { AbiBool } from "@/libs/abi/mods/bool/mod.ts";
import { AbiString } from "@/libs/abi/mods/string/mod.ts";
import { AbiReadableTuple } from "@/libs/abi/mods/tuple/mod.ts";
import { Readable } from "@hazae41/binary";
import { test } from "@hazae41/phobos";

test("tuple", () => {
  const Tuple = new AbiReadableTuple([AbiString, AbiBool])

  Tuple.from(["hello world", true]).into()

  const tuple = Readable.readFromBytes(Tuple, Uint8Array.fromHex("0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000b68656c6c6f20776f726c64000000000000000000000000000000000000000000"))

  console.log(tuple.into())
})