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
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const full = 2n ** ${i * 8}n

    value = ((value % full) + full) % full
    
    const hex = value.toString(16).padStart(64, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint${i * 8}(raw)
  }

  static read(cursor: Cursor) {
    return new AbiUint${i * 8}(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    return BigInt(\`0x\${this.value.subarray(32 - ${i}, 32).toHex()}\`)
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
      const full = 2n ** ${i * 8}n

      value = ((value % full) + full) % full
      
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
      return BigInt(\`0x\${this.value.toHex()}\`)
    }

  }
  
}`.trim())

  return code.join("\n\n")
})