import { Cursor } from "@hazae41/cursor";

export class AbiAddress {

  static readonly kind = "static"

  readonly kind = "static"

  constructor(
    /**
     * 20-sized bytes
     */
    readonly value: Uint8Array
  ) { }

  static from(value: string) {
    return new AbiAddress(Uint8Array.fromHex(value.slice(2)))
  }

  static read(cursor: Cursor) {
    cursor.offset += 12

    const bytes = new Uint8Array(cursor.read(20))

    return new AbiAddress(bytes)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.offset += 12

    cursor.write(this.value)

    return
  }

  into() {
    return `0x${this.value.toHex()}`
  }

}

export namespace AbiAddress {

  export class Packed {

    readonly kind = "static"

    constructor(
      /**
       * 20-sized bytes
       */
      readonly value: Uint8Array
    ) { }

    static from(value: string) {
      return new Packed(Uint8Array.fromHex(value.slice(2)))
    }

    size() {
      return 20
    }

    write(cursor: Cursor) {
      cursor.write(this.value)
    }

    into() {
      return `0x${this.value.toHex()}`
    }

  }

}