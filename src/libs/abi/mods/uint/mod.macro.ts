import { $$ } from "@hazae41/saumon"

$$(() => {
  const code = [`
    import { Cursor } from "@hazae41/cursor"
  `.trim()]

  for (let i = 1; i < 32 + 1; i++)
    code.push(`
export class AbiUint${i * 8} {

  constructor(
    /**
     * ${i}-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    value = value % (2n ** ${i * 8}n)
    
    const hex = value.toString(16).padStart(${i * 2}, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint${i * 8}(raw)
  }

  static read(cursor: Cursor) {
    cursor.offset += 32 - ${i}

    const raw = new Uint8Array(cursor.read(${i}))

    return new AbiUint${i * 8}(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.offset += 32 - ${i}

    cursor.write(this.value)

    return
  }

  into() {
    return BigInt(\`0x\${this.value.toHex()}\`) % (2n ** ${i * 8}n)
  }

}
  
export namespace AbiUint${i * 8} {
  
  export class Packed {
  
    constructor(
      /**
       * ${i}-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      value = value % (2n ** ${i * 8}n)
      
      const hex = value.toString(16).padStart(${i * 2}, "0")
      const raw = Uint8Array.fromHex(hex)

      return new Packed(raw)
    }

    size() {
      return this.value.length
    }

    write(cursor: Cursor) {
      cursor.write(this.value)
    }

    into() {
      return BigInt(\`0x\${this.value.toHex()}\`) % (2n ** ${i * 8}n)
    }

  }
  
}`.trim())

  return code.join("\n\n")
})