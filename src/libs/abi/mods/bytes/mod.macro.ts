import { $$ } from "@hazae41/saumon"

$$(() => {
  const code = [`
    import { Cursor } from "@hazae41/cursor";
  `.trim()]

  for (let i = 1; i < 32 + 1; i++)
    code.push(`
export class AbiBytes${i} {

  constructor(
    /**
     * ${i}-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: Uint8Array) {
    return new AbiBytes${i}(value.subarray(0, ${i}))
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

    static from(value: Uint8Array) {
      return new Packed(value.subarray(0, ${i}))
    }

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