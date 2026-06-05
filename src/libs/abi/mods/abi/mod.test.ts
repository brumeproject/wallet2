import { abi } from "@/libs/abi/mods/abi/mod.ts";
import { AbiString } from "@/libs/abi/mods/string/mod.ts";
import { AbiUint8 } from "@/libs/abi/mods/uint/mod.ts";
import { test } from "@hazae41/phobos";

test("decode", () => {
  console.log(abi.decode([AbiString, AbiUint8], Uint8Array.fromHex("00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000b68656c6c6f20776f726c64000000000000000000000000000000000000000000")))
})

test("encode", () => {
  console.log(abi.encode([AbiString, AbiUint8], ["hello world", 1n]).toHex())
})

test("encodePacked", () => {
  console.log(abi.encodePacked([AbiString, AbiUint8], ["hello world", 1n]).toHex())
})