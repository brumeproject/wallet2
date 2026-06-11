import { CompactUint16 } from "@/libs/solana/mod.ts";
import { Readable, Writable } from "@hazae41/binary";
import { assert, test } from "@hazae41/phobos";

test("compact uint16", () => {
  function f(int: CompactUint16, hex: string) {
    const int2 = Readable.readFromBytes(CompactUint16, Uint8Array.fromHex(hex))

    assert(int.value === int2.value)

    const hex2 = Writable.writeToBytes(int2).toHex()

    assert(hex.toLowerCase() === hex2.toLowerCase())
  }

  f(new CompactUint16(0), "00")
  f(new CompactUint16(1), "01")
  f(new CompactUint16(2), "02")
  f(new CompactUint16(3), "03")
  f(new CompactUint16(5), "05")
  f(new CompactUint16(32), "20")
  f(new CompactUint16(42), "2A")
  f(new CompactUint16(127), "7F")
  f(new CompactUint16(128), "8001")
  f(new CompactUint16(129), "8101")
  f(new CompactUint16(200), "C801")
  f(new CompactUint16(300), "AC02")
  f(new CompactUint16(500), "F403")
  f(new CompactUint16(1000), "E807")
  f(new CompactUint16(2000), "D00F")
  f(new CompactUint16(16383), "FF7F")
  f(new CompactUint16(16384), "808001")
  f(new CompactUint16(65535), "FFFF03")
})