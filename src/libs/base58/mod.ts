/// <reference types="@/libs/bytes/lib.d.ts" />

export namespace base58 {

  export const alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"

  export function encode(bytes: Uint8Array): string {
    if (bytes.length === 0)
      return ""

    let zeros = 0;

    while (zeros < bytes.length && bytes[zeros] === 0)
      zeros++

    let base58 = "";

    let number = BigInt("0x" + bytes.toHex())

    while (number > 0n) {
      const remainder = Number(number % 58n)

      base58 = alphabet[remainder] + base58;

      number = number / 58n;
    }

    return "1".repeat(zeros) + base58;
  }

  export function decode(base58: string): Uint8Array {
    if (base58.length === 0)
      return new Uint8Array(0)

    let zeros = 0;

    while (zeros < base58.length && base58[zeros] === '1')
      zeros++

    let number = 0n

    for (let i = zeros; i < base58.length; i++) {
      const index = alphabet.indexOf(base58[i])

      if (index === -1)
        throw new Error()

      number = (number * 58n) + BigInt(index);
    }

    const base16 = number.toString(16)

    const start = base16.length + (base16.length % 2)
    const bytes = Uint8Array.fromHex(base16.padStart(start, "0"))

    const result = new Uint8Array(zeros + bytes.length)

    result.set(bytes, zeros)

    return result
  }

}