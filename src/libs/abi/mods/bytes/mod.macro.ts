import { AbiUint32 } from "@/libs/abi/mods/uint/mod.ts";
import { Cursor } from "@hazae41/cursor";
import { $$ } from "@hazae41/saumon";

export class AbiBytes {

  static readonly kind = "dynamic"

  constructor(
    readonly value: Uint8Array
  ) { }

  static from(value: Uint8Array) {
    return new AbiBytes(value)
  }

  static pack(value: Uint8Array) {
    return new AbiBytes.Packed(value)
  }

  static read(cursor: Cursor) {
    const length = Number(AbiUint32.read(cursor).into())
    const padded = Math.ceil(length / 32) * 32

    const value = new Uint8Array(cursor.read(length))

    cursor.offset += padded - length

    return new AbiBytes(value)
  }

  size() {
    return 32 + Math.ceil(this.value.length / 32) * 32
  }

  write(cursor: Cursor) {
    const length = this.value.length
    const padded = Math.ceil(length / 32) * 32

    AbiUint32.from(BigInt(length)).write(cursor)

    cursor.write(this.value)

    cursor.offset += padded - length
  }

  into() {
    return this.value
  }

}

export namespace AbiBytes {

  export class Packed {

    constructor(
      readonly value: Uint8Array
    ) { }

    size() {
      return this.value.length
    }

    write(cursor: Cursor) {
      cursor.write(this.value)
    }

    into() {
      return this.value
    }

  }

}

$$(() => {
  const code = []

  for (let i = 1; i < 32 + 1; i++)
    code.push(`
export class AbiBytes${i} {

  static readonly kind = "static"

  constructor(
    /**
     * ${i}-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: Uint8Array) {
    return new AbiBytes${i}(value.subarray(0, ${i}))
  }

  static pack(value: Uint8Array) {
    return new AbiBytes${i}.Packed(value.subarray(0, ${i}))
  }

  static read(cursor: Cursor) {
    const raw = new Uint8Array(cursor.read(${i}))

    cursor.offset += 32 - ${i}

    return new AbiBytes${i}(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
    
    cursor.offset += 32 - ${i}

    return
  }

  into() {
    return this.value.subarray(0, ${i})
  }

}
  
export namespace AbiBytes${i} {
  
  export class Packed {

    constructor(
      /**
       * ${i}-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    size() {
      return this.value.length
    }

    write(cursor: Cursor) {
      cursor.write(this.value)
    }

    into() {
      return this.value.subarray(0, ${i})
    }

  }
  
}`.trim())

  return code.join("\n\n")
})