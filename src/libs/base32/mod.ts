export namespace base32 {

  export const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"

  export function encode(bytes: Uint8Array): string {
    if (bytes.length === 0)
      return ""

    let bits = 0;
    let value = 0;

    let base32 = "";

    for (let i = 0; i < bytes.length; i++) {
      value = (value << 8) | bytes[i];
      bits += 8;

      while (bits >= 5) {
        base32 += alphabet[(value >>> (bits - 5)) & 31];
        bits -= 5;
      }
    }

    if (bits > 0) {
      base32 += alphabet[(value << (5 - bits)) & 31];
    }

    return base32;
  }

  export function decode(base32: string): Uint8Array {
    if (base32.length === 0)
      return new Uint8Array(0)

    let bits = 0;
    let value = 0;

    const bytes: number[] = [];

    for (const char of base32) {
      const index = alphabet.indexOf(char);

      if (index === -1)
        throw new Error();

      value = (value << 5) | index;
      bits += 5;

      if (bits >= 8) {
        bytes.push((value >>> (bits - 8)) & 0xFF);
        bits -= 8;
      }
    }

    return new Uint8Array(bytes);
  }

}