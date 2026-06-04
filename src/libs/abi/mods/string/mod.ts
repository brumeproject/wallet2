import { AbiUint32 } from "@/libs/abi/mods/uint/mod.ts";
import { Cursor } from "@hazae41/cursor";

export class AbiString {

  static readonly kind = "dynamic"

  constructor(
    readonly value: Uint8Array
  ) { }

  static from(value: string) {
    return new AbiString(new TextEncoder().encode(value))
  }

  static read(cursor: Cursor) {
    const length = Number(AbiUint32.read(cursor).into())
    const padded = Math.ceil(length / 32) * 32

    const value = new Uint8Array(cursor.read(length))

    cursor.offset += padded - length

    return new AbiString(value)
  }

  size() {
    return 32 + Math.ceil(this.value.length / 32) * 32
  }

  write(cursor: Cursor) {
    const length = this.value.length
    const padded = Math.ceil(length / 32) * 32

    AbiUint32.from(length).write(cursor)

    cursor.write(this.value)

    cursor.offset += padded - length
  }

  into() {
    return new TextDecoder().decode(this.value)
  }

}

export namespace AbiString {

  export class Packed {

    constructor(
      readonly value: Uint8Array
    ) { }

    static from(value: string) {
      return new Packed(new TextEncoder().encode(value))
    }

    size() {
      return 32 + this.value.length
    }

    write(cursor: Cursor) {
      const length = this.value.length

      AbiUint32.Packed.from(length).write(cursor)

      cursor.write(this.value)
    }

    into() {
      return new TextDecoder().decode(this.value)
    }

  }

}