interface Uint8Array {
  toHex(): string;
}

interface Uint8ArrayConstructor {
  fromHex(hex: string): Uint8Array<ArrayBuffer>;
}

interface Uint8Array {
  toBase64(): string;
}

interface Uint8ArrayConstructor {
  fromBase64(base64: string): Uint8Array<ArrayBuffer>;
}