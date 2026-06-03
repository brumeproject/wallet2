import { Cursor } from "@hazae41/cursor"

export class AbiUint8 {

  constructor(
    /**
     * 1-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    value = value % (2n ** 8n)
    
    const hex = value.toString(16).padStart(2, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint8(raw)
  }

  static read(cursor: Cursor) {
    cursor.offset += 32 - 1

    const raw = new Uint8Array(cursor.read(1))

    return new AbiUint8(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.offset += 32 - 1

    cursor.write(this.value)

    return
  }

  into() {
    return BigInt(`0x${this.value.toHex()}`) % (2n ** 8n)
  }

}
  
export namespace AbiUint8 {
  
  export class Packed {
  
    constructor(
      /**
       * 1-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      value = value % (2n ** 8n)
      
      const hex = value.toString(16).padStart(2, "0")
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
      return BigInt(`0x${this.value.toHex()}`) % (2n ** 8n)
    }

  }
  
}

export class AbiUint16 {

  constructor(
    /**
     * 2-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    value = value % (2n ** 16n)
    
    const hex = value.toString(16).padStart(4, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint16(raw)
  }

  static read(cursor: Cursor) {
    cursor.offset += 32 - 2

    const raw = new Uint8Array(cursor.read(2))

    return new AbiUint16(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.offset += 32 - 2

    cursor.write(this.value)

    return
  }

  into() {
    return BigInt(`0x${this.value.toHex()}`) % (2n ** 16n)
  }

}
  
export namespace AbiUint16 {
  
  export class Packed {
  
    constructor(
      /**
       * 2-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      value = value % (2n ** 16n)
      
      const hex = value.toString(16).padStart(4, "0")
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
      return BigInt(`0x${this.value.toHex()}`) % (2n ** 16n)
    }

  }
  
}

export class AbiUint24 {

  constructor(
    /**
     * 3-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    value = value % (2n ** 24n)
    
    const hex = value.toString(16).padStart(6, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint24(raw)
  }

  static read(cursor: Cursor) {
    cursor.offset += 32 - 3

    const raw = new Uint8Array(cursor.read(3))

    return new AbiUint24(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.offset += 32 - 3

    cursor.write(this.value)

    return
  }

  into() {
    return BigInt(`0x${this.value.toHex()}`) % (2n ** 24n)
  }

}
  
export namespace AbiUint24 {
  
  export class Packed {
  
    constructor(
      /**
       * 3-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      value = value % (2n ** 24n)
      
      const hex = value.toString(16).padStart(6, "0")
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
      return BigInt(`0x${this.value.toHex()}`) % (2n ** 24n)
    }

  }
  
}

export class AbiUint32 {

  constructor(
    /**
     * 4-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    value = value % (2n ** 32n)
    
    const hex = value.toString(16).padStart(8, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint32(raw)
  }

  static read(cursor: Cursor) {
    cursor.offset += 32 - 4

    const raw = new Uint8Array(cursor.read(4))

    return new AbiUint32(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.offset += 32 - 4

    cursor.write(this.value)

    return
  }

  into() {
    return BigInt(`0x${this.value.toHex()}`) % (2n ** 32n)
  }

}
  
export namespace AbiUint32 {
  
  export class Packed {
  
    constructor(
      /**
       * 4-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      value = value % (2n ** 32n)
      
      const hex = value.toString(16).padStart(8, "0")
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
      return BigInt(`0x${this.value.toHex()}`) % (2n ** 32n)
    }

  }
  
}

export class AbiUint40 {

  constructor(
    /**
     * 5-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    value = value % (2n ** 40n)
    
    const hex = value.toString(16).padStart(10, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint40(raw)
  }

  static read(cursor: Cursor) {
    cursor.offset += 32 - 5

    const raw = new Uint8Array(cursor.read(5))

    return new AbiUint40(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.offset += 32 - 5

    cursor.write(this.value)

    return
  }

  into() {
    return BigInt(`0x${this.value.toHex()}`) % (2n ** 40n)
  }

}
  
export namespace AbiUint40 {
  
  export class Packed {
  
    constructor(
      /**
       * 5-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      value = value % (2n ** 40n)
      
      const hex = value.toString(16).padStart(10, "0")
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
      return BigInt(`0x${this.value.toHex()}`) % (2n ** 40n)
    }

  }
  
}

export class AbiUint48 {

  constructor(
    /**
     * 6-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    value = value % (2n ** 48n)
    
    const hex = value.toString(16).padStart(12, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint48(raw)
  }

  static read(cursor: Cursor) {
    cursor.offset += 32 - 6

    const raw = new Uint8Array(cursor.read(6))

    return new AbiUint48(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.offset += 32 - 6

    cursor.write(this.value)

    return
  }

  into() {
    return BigInt(`0x${this.value.toHex()}`) % (2n ** 48n)
  }

}
  
export namespace AbiUint48 {
  
  export class Packed {
  
    constructor(
      /**
       * 6-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      value = value % (2n ** 48n)
      
      const hex = value.toString(16).padStart(12, "0")
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
      return BigInt(`0x${this.value.toHex()}`) % (2n ** 48n)
    }

  }
  
}

export class AbiUint56 {

  constructor(
    /**
     * 7-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    value = value % (2n ** 56n)
    
    const hex = value.toString(16).padStart(14, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint56(raw)
  }

  static read(cursor: Cursor) {
    cursor.offset += 32 - 7

    const raw = new Uint8Array(cursor.read(7))

    return new AbiUint56(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.offset += 32 - 7

    cursor.write(this.value)

    return
  }

  into() {
    return BigInt(`0x${this.value.toHex()}`) % (2n ** 56n)
  }

}
  
export namespace AbiUint56 {
  
  export class Packed {
  
    constructor(
      /**
       * 7-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      value = value % (2n ** 56n)
      
      const hex = value.toString(16).padStart(14, "0")
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
      return BigInt(`0x${this.value.toHex()}`) % (2n ** 56n)
    }

  }
  
}

export class AbiUint64 {

  constructor(
    /**
     * 8-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    value = value % (2n ** 64n)
    
    const hex = value.toString(16).padStart(16, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint64(raw)
  }

  static read(cursor: Cursor) {
    cursor.offset += 32 - 8

    const raw = new Uint8Array(cursor.read(8))

    return new AbiUint64(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.offset += 32 - 8

    cursor.write(this.value)

    return
  }

  into() {
    return BigInt(`0x${this.value.toHex()}`) % (2n ** 64n)
  }

}
  
export namespace AbiUint64 {
  
  export class Packed {
  
    constructor(
      /**
       * 8-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      value = value % (2n ** 64n)
      
      const hex = value.toString(16).padStart(16, "0")
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
      return BigInt(`0x${this.value.toHex()}`) % (2n ** 64n)
    }

  }
  
}

export class AbiUint72 {

  constructor(
    /**
     * 9-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    value = value % (2n ** 72n)
    
    const hex = value.toString(16).padStart(18, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint72(raw)
  }

  static read(cursor: Cursor) {
    cursor.offset += 32 - 9

    const raw = new Uint8Array(cursor.read(9))

    return new AbiUint72(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.offset += 32 - 9

    cursor.write(this.value)

    return
  }

  into() {
    return BigInt(`0x${this.value.toHex()}`) % (2n ** 72n)
  }

}
  
export namespace AbiUint72 {
  
  export class Packed {
  
    constructor(
      /**
       * 9-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      value = value % (2n ** 72n)
      
      const hex = value.toString(16).padStart(18, "0")
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
      return BigInt(`0x${this.value.toHex()}`) % (2n ** 72n)
    }

  }
  
}

export class AbiUint80 {

  constructor(
    /**
     * 10-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    value = value % (2n ** 80n)
    
    const hex = value.toString(16).padStart(20, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint80(raw)
  }

  static read(cursor: Cursor) {
    cursor.offset += 32 - 10

    const raw = new Uint8Array(cursor.read(10))

    return new AbiUint80(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.offset += 32 - 10

    cursor.write(this.value)

    return
  }

  into() {
    return BigInt(`0x${this.value.toHex()}`) % (2n ** 80n)
  }

}
  
export namespace AbiUint80 {
  
  export class Packed {
  
    constructor(
      /**
       * 10-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      value = value % (2n ** 80n)
      
      const hex = value.toString(16).padStart(20, "0")
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
      return BigInt(`0x${this.value.toHex()}`) % (2n ** 80n)
    }

  }
  
}

export class AbiUint88 {

  constructor(
    /**
     * 11-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    value = value % (2n ** 88n)
    
    const hex = value.toString(16).padStart(22, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint88(raw)
  }

  static read(cursor: Cursor) {
    cursor.offset += 32 - 11

    const raw = new Uint8Array(cursor.read(11))

    return new AbiUint88(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.offset += 32 - 11

    cursor.write(this.value)

    return
  }

  into() {
    return BigInt(`0x${this.value.toHex()}`) % (2n ** 88n)
  }

}
  
export namespace AbiUint88 {
  
  export class Packed {
  
    constructor(
      /**
       * 11-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      value = value % (2n ** 88n)
      
      const hex = value.toString(16).padStart(22, "0")
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
      return BigInt(`0x${this.value.toHex()}`) % (2n ** 88n)
    }

  }
  
}

export class AbiUint96 {

  constructor(
    /**
     * 12-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    value = value % (2n ** 96n)
    
    const hex = value.toString(16).padStart(24, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint96(raw)
  }

  static read(cursor: Cursor) {
    cursor.offset += 32 - 12

    const raw = new Uint8Array(cursor.read(12))

    return new AbiUint96(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.offset += 32 - 12

    cursor.write(this.value)

    return
  }

  into() {
    return BigInt(`0x${this.value.toHex()}`) % (2n ** 96n)
  }

}
  
export namespace AbiUint96 {
  
  export class Packed {
  
    constructor(
      /**
       * 12-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      value = value % (2n ** 96n)
      
      const hex = value.toString(16).padStart(24, "0")
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
      return BigInt(`0x${this.value.toHex()}`) % (2n ** 96n)
    }

  }
  
}

export class AbiUint104 {

  constructor(
    /**
     * 13-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    value = value % (2n ** 104n)
    
    const hex = value.toString(16).padStart(26, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint104(raw)
  }

  static read(cursor: Cursor) {
    cursor.offset += 32 - 13

    const raw = new Uint8Array(cursor.read(13))

    return new AbiUint104(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.offset += 32 - 13

    cursor.write(this.value)

    return
  }

  into() {
    return BigInt(`0x${this.value.toHex()}`) % (2n ** 104n)
  }

}
  
export namespace AbiUint104 {
  
  export class Packed {
  
    constructor(
      /**
       * 13-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      value = value % (2n ** 104n)
      
      const hex = value.toString(16).padStart(26, "0")
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
      return BigInt(`0x${this.value.toHex()}`) % (2n ** 104n)
    }

  }
  
}

export class AbiUint112 {

  constructor(
    /**
     * 14-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    value = value % (2n ** 112n)
    
    const hex = value.toString(16).padStart(28, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint112(raw)
  }

  static read(cursor: Cursor) {
    cursor.offset += 32 - 14

    const raw = new Uint8Array(cursor.read(14))

    return new AbiUint112(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.offset += 32 - 14

    cursor.write(this.value)

    return
  }

  into() {
    return BigInt(`0x${this.value.toHex()}`) % (2n ** 112n)
  }

}
  
export namespace AbiUint112 {
  
  export class Packed {
  
    constructor(
      /**
       * 14-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      value = value % (2n ** 112n)
      
      const hex = value.toString(16).padStart(28, "0")
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
      return BigInt(`0x${this.value.toHex()}`) % (2n ** 112n)
    }

  }
  
}

export class AbiUint120 {

  constructor(
    /**
     * 15-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    value = value % (2n ** 120n)
    
    const hex = value.toString(16).padStart(30, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint120(raw)
  }

  static read(cursor: Cursor) {
    cursor.offset += 32 - 15

    const raw = new Uint8Array(cursor.read(15))

    return new AbiUint120(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.offset += 32 - 15

    cursor.write(this.value)

    return
  }

  into() {
    return BigInt(`0x${this.value.toHex()}`) % (2n ** 120n)
  }

}
  
export namespace AbiUint120 {
  
  export class Packed {
  
    constructor(
      /**
       * 15-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      value = value % (2n ** 120n)
      
      const hex = value.toString(16).padStart(30, "0")
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
      return BigInt(`0x${this.value.toHex()}`) % (2n ** 120n)
    }

  }
  
}

export class AbiUint128 {

  constructor(
    /**
     * 16-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    value = value % (2n ** 128n)
    
    const hex = value.toString(16).padStart(32, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint128(raw)
  }

  static read(cursor: Cursor) {
    cursor.offset += 32 - 16

    const raw = new Uint8Array(cursor.read(16))

    return new AbiUint128(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.offset += 32 - 16

    cursor.write(this.value)

    return
  }

  into() {
    return BigInt(`0x${this.value.toHex()}`) % (2n ** 128n)
  }

}
  
export namespace AbiUint128 {
  
  export class Packed {
  
    constructor(
      /**
       * 16-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      value = value % (2n ** 128n)
      
      const hex = value.toString(16).padStart(32, "0")
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
      return BigInt(`0x${this.value.toHex()}`) % (2n ** 128n)
    }

  }
  
}

export class AbiUint136 {

  constructor(
    /**
     * 17-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    value = value % (2n ** 136n)
    
    const hex = value.toString(16).padStart(34, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint136(raw)
  }

  static read(cursor: Cursor) {
    cursor.offset += 32 - 17

    const raw = new Uint8Array(cursor.read(17))

    return new AbiUint136(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.offset += 32 - 17

    cursor.write(this.value)

    return
  }

  into() {
    return BigInt(`0x${this.value.toHex()}`) % (2n ** 136n)
  }

}
  
export namespace AbiUint136 {
  
  export class Packed {
  
    constructor(
      /**
       * 17-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      value = value % (2n ** 136n)
      
      const hex = value.toString(16).padStart(34, "0")
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
      return BigInt(`0x${this.value.toHex()}`) % (2n ** 136n)
    }

  }
  
}

export class AbiUint144 {

  constructor(
    /**
     * 18-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    value = value % (2n ** 144n)
    
    const hex = value.toString(16).padStart(36, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint144(raw)
  }

  static read(cursor: Cursor) {
    cursor.offset += 32 - 18

    const raw = new Uint8Array(cursor.read(18))

    return new AbiUint144(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.offset += 32 - 18

    cursor.write(this.value)

    return
  }

  into() {
    return BigInt(`0x${this.value.toHex()}`) % (2n ** 144n)
  }

}
  
export namespace AbiUint144 {
  
  export class Packed {
  
    constructor(
      /**
       * 18-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      value = value % (2n ** 144n)
      
      const hex = value.toString(16).padStart(36, "0")
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
      return BigInt(`0x${this.value.toHex()}`) % (2n ** 144n)
    }

  }
  
}

export class AbiUint152 {

  constructor(
    /**
     * 19-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    value = value % (2n ** 152n)
    
    const hex = value.toString(16).padStart(38, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint152(raw)
  }

  static read(cursor: Cursor) {
    cursor.offset += 32 - 19

    const raw = new Uint8Array(cursor.read(19))

    return new AbiUint152(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.offset += 32 - 19

    cursor.write(this.value)

    return
  }

  into() {
    return BigInt(`0x${this.value.toHex()}`) % (2n ** 152n)
  }

}
  
export namespace AbiUint152 {
  
  export class Packed {
  
    constructor(
      /**
       * 19-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      value = value % (2n ** 152n)
      
      const hex = value.toString(16).padStart(38, "0")
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
      return BigInt(`0x${this.value.toHex()}`) % (2n ** 152n)
    }

  }
  
}

export class AbiUint160 {

  constructor(
    /**
     * 20-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    value = value % (2n ** 160n)
    
    const hex = value.toString(16).padStart(40, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint160(raw)
  }

  static read(cursor: Cursor) {
    cursor.offset += 32 - 20

    const raw = new Uint8Array(cursor.read(20))

    return new AbiUint160(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.offset += 32 - 20

    cursor.write(this.value)

    return
  }

  into() {
    return BigInt(`0x${this.value.toHex()}`) % (2n ** 160n)
  }

}
  
export namespace AbiUint160 {
  
  export class Packed {
  
    constructor(
      /**
       * 20-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      value = value % (2n ** 160n)
      
      const hex = value.toString(16).padStart(40, "0")
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
      return BigInt(`0x${this.value.toHex()}`) % (2n ** 160n)
    }

  }
  
}

export class AbiUint168 {

  constructor(
    /**
     * 21-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    value = value % (2n ** 168n)
    
    const hex = value.toString(16).padStart(42, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint168(raw)
  }

  static read(cursor: Cursor) {
    cursor.offset += 32 - 21

    const raw = new Uint8Array(cursor.read(21))

    return new AbiUint168(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.offset += 32 - 21

    cursor.write(this.value)

    return
  }

  into() {
    return BigInt(`0x${this.value.toHex()}`) % (2n ** 168n)
  }

}
  
export namespace AbiUint168 {
  
  export class Packed {
  
    constructor(
      /**
       * 21-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      value = value % (2n ** 168n)
      
      const hex = value.toString(16).padStart(42, "0")
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
      return BigInt(`0x${this.value.toHex()}`) % (2n ** 168n)
    }

  }
  
}

export class AbiUint176 {

  constructor(
    /**
     * 22-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    value = value % (2n ** 176n)
    
    const hex = value.toString(16).padStart(44, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint176(raw)
  }

  static read(cursor: Cursor) {
    cursor.offset += 32 - 22

    const raw = new Uint8Array(cursor.read(22))

    return new AbiUint176(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.offset += 32 - 22

    cursor.write(this.value)

    return
  }

  into() {
    return BigInt(`0x${this.value.toHex()}`) % (2n ** 176n)
  }

}
  
export namespace AbiUint176 {
  
  export class Packed {
  
    constructor(
      /**
       * 22-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      value = value % (2n ** 176n)
      
      const hex = value.toString(16).padStart(44, "0")
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
      return BigInt(`0x${this.value.toHex()}`) % (2n ** 176n)
    }

  }
  
}

export class AbiUint184 {

  constructor(
    /**
     * 23-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    value = value % (2n ** 184n)
    
    const hex = value.toString(16).padStart(46, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint184(raw)
  }

  static read(cursor: Cursor) {
    cursor.offset += 32 - 23

    const raw = new Uint8Array(cursor.read(23))

    return new AbiUint184(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.offset += 32 - 23

    cursor.write(this.value)

    return
  }

  into() {
    return BigInt(`0x${this.value.toHex()}`) % (2n ** 184n)
  }

}
  
export namespace AbiUint184 {
  
  export class Packed {
  
    constructor(
      /**
       * 23-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      value = value % (2n ** 184n)
      
      const hex = value.toString(16).padStart(46, "0")
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
      return BigInt(`0x${this.value.toHex()}`) % (2n ** 184n)
    }

  }
  
}

export class AbiUint192 {

  constructor(
    /**
     * 24-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    value = value % (2n ** 192n)
    
    const hex = value.toString(16).padStart(48, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint192(raw)
  }

  static read(cursor: Cursor) {
    cursor.offset += 32 - 24

    const raw = new Uint8Array(cursor.read(24))

    return new AbiUint192(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.offset += 32 - 24

    cursor.write(this.value)

    return
  }

  into() {
    return BigInt(`0x${this.value.toHex()}`) % (2n ** 192n)
  }

}
  
export namespace AbiUint192 {
  
  export class Packed {
  
    constructor(
      /**
       * 24-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      value = value % (2n ** 192n)
      
      const hex = value.toString(16).padStart(48, "0")
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
      return BigInt(`0x${this.value.toHex()}`) % (2n ** 192n)
    }

  }
  
}

export class AbiUint200 {

  constructor(
    /**
     * 25-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    value = value % (2n ** 200n)
    
    const hex = value.toString(16).padStart(50, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint200(raw)
  }

  static read(cursor: Cursor) {
    cursor.offset += 32 - 25

    const raw = new Uint8Array(cursor.read(25))

    return new AbiUint200(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.offset += 32 - 25

    cursor.write(this.value)

    return
  }

  into() {
    return BigInt(`0x${this.value.toHex()}`) % (2n ** 200n)
  }

}
  
export namespace AbiUint200 {
  
  export class Packed {
  
    constructor(
      /**
       * 25-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      value = value % (2n ** 200n)
      
      const hex = value.toString(16).padStart(50, "0")
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
      return BigInt(`0x${this.value.toHex()}`) % (2n ** 200n)
    }

  }
  
}

export class AbiUint208 {

  constructor(
    /**
     * 26-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    value = value % (2n ** 208n)
    
    const hex = value.toString(16).padStart(52, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint208(raw)
  }

  static read(cursor: Cursor) {
    cursor.offset += 32 - 26

    const raw = new Uint8Array(cursor.read(26))

    return new AbiUint208(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.offset += 32 - 26

    cursor.write(this.value)

    return
  }

  into() {
    return BigInt(`0x${this.value.toHex()}`) % (2n ** 208n)
  }

}
  
export namespace AbiUint208 {
  
  export class Packed {
  
    constructor(
      /**
       * 26-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      value = value % (2n ** 208n)
      
      const hex = value.toString(16).padStart(52, "0")
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
      return BigInt(`0x${this.value.toHex()}`) % (2n ** 208n)
    }

  }
  
}

export class AbiUint216 {

  constructor(
    /**
     * 27-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    value = value % (2n ** 216n)
    
    const hex = value.toString(16).padStart(54, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint216(raw)
  }

  static read(cursor: Cursor) {
    cursor.offset += 32 - 27

    const raw = new Uint8Array(cursor.read(27))

    return new AbiUint216(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.offset += 32 - 27

    cursor.write(this.value)

    return
  }

  into() {
    return BigInt(`0x${this.value.toHex()}`) % (2n ** 216n)
  }

}
  
export namespace AbiUint216 {
  
  export class Packed {
  
    constructor(
      /**
       * 27-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      value = value % (2n ** 216n)
      
      const hex = value.toString(16).padStart(54, "0")
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
      return BigInt(`0x${this.value.toHex()}`) % (2n ** 216n)
    }

  }
  
}

export class AbiUint224 {

  constructor(
    /**
     * 28-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    value = value % (2n ** 224n)
    
    const hex = value.toString(16).padStart(56, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint224(raw)
  }

  static read(cursor: Cursor) {
    cursor.offset += 32 - 28

    const raw = new Uint8Array(cursor.read(28))

    return new AbiUint224(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.offset += 32 - 28

    cursor.write(this.value)

    return
  }

  into() {
    return BigInt(`0x${this.value.toHex()}`) % (2n ** 224n)
  }

}
  
export namespace AbiUint224 {
  
  export class Packed {
  
    constructor(
      /**
       * 28-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      value = value % (2n ** 224n)
      
      const hex = value.toString(16).padStart(56, "0")
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
      return BigInt(`0x${this.value.toHex()}`) % (2n ** 224n)
    }

  }
  
}

export class AbiUint232 {

  constructor(
    /**
     * 29-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    value = value % (2n ** 232n)
    
    const hex = value.toString(16).padStart(58, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint232(raw)
  }

  static read(cursor: Cursor) {
    cursor.offset += 32 - 29

    const raw = new Uint8Array(cursor.read(29))

    return new AbiUint232(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.offset += 32 - 29

    cursor.write(this.value)

    return
  }

  into() {
    return BigInt(`0x${this.value.toHex()}`) % (2n ** 232n)
  }

}
  
export namespace AbiUint232 {
  
  export class Packed {
  
    constructor(
      /**
       * 29-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      value = value % (2n ** 232n)
      
      const hex = value.toString(16).padStart(58, "0")
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
      return BigInt(`0x${this.value.toHex()}`) % (2n ** 232n)
    }

  }
  
}

export class AbiUint240 {

  constructor(
    /**
     * 30-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    value = value % (2n ** 240n)
    
    const hex = value.toString(16).padStart(60, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint240(raw)
  }

  static read(cursor: Cursor) {
    cursor.offset += 32 - 30

    const raw = new Uint8Array(cursor.read(30))

    return new AbiUint240(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.offset += 32 - 30

    cursor.write(this.value)

    return
  }

  into() {
    return BigInt(`0x${this.value.toHex()}`) % (2n ** 240n)
  }

}
  
export namespace AbiUint240 {
  
  export class Packed {
  
    constructor(
      /**
       * 30-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      value = value % (2n ** 240n)
      
      const hex = value.toString(16).padStart(60, "0")
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
      return BigInt(`0x${this.value.toHex()}`) % (2n ** 240n)
    }

  }
  
}

export class AbiUint248 {

  constructor(
    /**
     * 31-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    value = value % (2n ** 248n)
    
    const hex = value.toString(16).padStart(62, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint248(raw)
  }

  static read(cursor: Cursor) {
    cursor.offset += 32 - 31

    const raw = new Uint8Array(cursor.read(31))

    return new AbiUint248(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.offset += 32 - 31

    cursor.write(this.value)

    return
  }

  into() {
    return BigInt(`0x${this.value.toHex()}`) % (2n ** 248n)
  }

}
  
export namespace AbiUint248 {
  
  export class Packed {
  
    constructor(
      /**
       * 31-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      value = value % (2n ** 248n)
      
      const hex = value.toString(16).padStart(62, "0")
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
      return BigInt(`0x${this.value.toHex()}`) % (2n ** 248n)
    }

  }
  
}

export class AbiUint256 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    value = value % (2n ** 256n)
    
    const hex = value.toString(16).padStart(64, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint256(raw)
  }

  static read(cursor: Cursor) {
    cursor.offset += 32 - 32

    const raw = new Uint8Array(cursor.read(32))

    return new AbiUint256(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.offset += 32 - 32

    cursor.write(this.value)

    return
  }

  into() {
    return BigInt(`0x${this.value.toHex()}`) % (2n ** 256n)
  }

}
  
export namespace AbiUint256 {
  
  export class Packed {
  
    constructor(
      /**
       * 32-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      value = value % (2n ** 256n)
      
      const hex = value.toString(16).padStart(64, "0")
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
      return BigInt(`0x${this.value.toHex()}`) % (2n ** 256n)
    }

  }
  
}