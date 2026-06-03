import { $$ } from "@hazae41/saumon"

$$(() => {
  const code = [`
    import { Cursor } from "@hazae41/cursor"
  `.trim()]

  for (let i = 1; i < 32 + 1; i++)
    code.push(`
export class AbiInt${i * 8} {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const pad = value < 0 ? "f" : "0"

    const mod = 2n ** ${i * 8 - 1}n
    const sup = 2n ** ${i * 8}n

    value = value % mod
    value = (value + sup) % sup
    
    const hex = value.toString(16).padStart(64, pad)
    const raw = Uint8Array.fromHex(hex)

    return new AbiInt${i * 8}(raw)
  }

  static read(cursor: Cursor) {
    return new AbiInt${i * 8}(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    const mod = 2n ** ${i * 8 - 1}n
    const sup = 2n ** ${i * 8}n

    let value = BigInt(\`0x\${this.value.subarray(32 - ${i}, 32).toHex()}\`)

    value = value % sup
    value = value < mod ? value : value - sup

    return value
  }

}
  
export namespace AbiInt${i * 8} {
  
  export class Packed {
  
    constructor(
      /**
       * ${i}-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      const mod = 2n ** ${i * 8 - 1}n
      const sup = 2n ** ${i * 8}n

      value = value % mod
      value = (value + sup) % sup
      
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
      const mod = 2n ** ${i * 8 - 1}n
      const sup = 2n ** ${i * 8}n

      let value = BigInt(\`0x\${this.value.toHex()}\`)

      value = value % sup
      value = value < mod ? value : value - sup

      return value
    }

  }
  
}`.trim())

  return code.join("\n\n")
})