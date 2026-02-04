import { assert } from "@hazae41/phobos";
import { getRandomValues } from "node:crypto";
import { base32 } from "./mod.ts";

const input = new Uint8Array(24)

getRandomValues(input.subarray(8, 16))

console.log(input.toHex())

const output = base32.encode(input)

console.log(output)

const reinput = base32.decode(output)

console.log(reinput.toHex())

assert(reinput.toHex() === input.toHex())