import { Cursor } from "@hazae41/cursor"

export class AbiUint8 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const full = 2n ** 8n

    value = ((value % full) + full) % full
    
    const hex = value.toString(16).padStart(64, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint8(raw)
  }

  static read(cursor: Cursor) {
    return new AbiUint8(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    return BigInt(`0x${this.value.subarray(32 - 1, 32).toHex()}`)
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
      const full = 2n ** 8n

      value = ((value % full) + full) % full
      
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
      return BigInt(`0x${this.value.toHex()}`)
    }

  }
  
}

export class AbiUint16 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const full = 2n ** 16n

    value = ((value % full) + full) % full
    
    const hex = value.toString(16).padStart(64, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint16(raw)
  }

  static read(cursor: Cursor) {
    return new AbiUint16(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    return BigInt(`0x${this.value.subarray(32 - 2, 32).toHex()}`)
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
      const full = 2n ** 16n

      value = ((value % full) + full) % full
      
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
      return BigInt(`0x${this.value.toHex()}`)
    }

  }
  
}

export class AbiUint24 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const full = 2n ** 24n

    value = ((value % full) + full) % full
    
    const hex = value.toString(16).padStart(64, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint24(raw)
  }

  static read(cursor: Cursor) {
    return new AbiUint24(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    return BigInt(`0x${this.value.subarray(32 - 3, 32).toHex()}`)
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
      const full = 2n ** 24n

      value = ((value % full) + full) % full
      
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
      return BigInt(`0x${this.value.toHex()}`)
    }

  }
  
}

export class AbiUint32 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const full = 2n ** 32n

    value = ((value % full) + full) % full
    
    const hex = value.toString(16).padStart(64, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint32(raw)
  }

  static read(cursor: Cursor) {
    return new AbiUint32(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    return BigInt(`0x${this.value.subarray(32 - 4, 32).toHex()}`)
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
      const full = 2n ** 32n

      value = ((value % full) + full) % full
      
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
      return BigInt(`0x${this.value.toHex()}`)
    }

  }
  
}

export class AbiUint40 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const full = 2n ** 40n

    value = ((value % full) + full) % full
    
    const hex = value.toString(16).padStart(64, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint40(raw)
  }

  static read(cursor: Cursor) {
    return new AbiUint40(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    return BigInt(`0x${this.value.subarray(32 - 5, 32).toHex()}`)
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
      const full = 2n ** 40n

      value = ((value % full) + full) % full
      
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
      return BigInt(`0x${this.value.toHex()}`)
    }

  }
  
}

export class AbiUint48 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const full = 2n ** 48n

    value = ((value % full) + full) % full
    
    const hex = value.toString(16).padStart(64, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint48(raw)
  }

  static read(cursor: Cursor) {
    return new AbiUint48(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    return BigInt(`0x${this.value.subarray(32 - 6, 32).toHex()}`)
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
      const full = 2n ** 48n

      value = ((value % full) + full) % full
      
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
      return BigInt(`0x${this.value.toHex()}`)
    }

  }
  
}

export class AbiUint56 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const full = 2n ** 56n

    value = ((value % full) + full) % full
    
    const hex = value.toString(16).padStart(64, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint56(raw)
  }

  static read(cursor: Cursor) {
    return new AbiUint56(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    return BigInt(`0x${this.value.subarray(32 - 7, 32).toHex()}`)
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
      const full = 2n ** 56n

      value = ((value % full) + full) % full
      
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
      return BigInt(`0x${this.value.toHex()}`)
    }

  }
  
}

export class AbiUint64 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const full = 2n ** 64n

    value = ((value % full) + full) % full
    
    const hex = value.toString(16).padStart(64, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint64(raw)
  }

  static read(cursor: Cursor) {
    return new AbiUint64(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    return BigInt(`0x${this.value.subarray(32 - 8, 32).toHex()}`)
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
      const full = 2n ** 64n

      value = ((value % full) + full) % full
      
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
      return BigInt(`0x${this.value.toHex()}`)
    }

  }
  
}

export class AbiUint72 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const full = 2n ** 72n

    value = ((value % full) + full) % full
    
    const hex = value.toString(16).padStart(64, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint72(raw)
  }

  static read(cursor: Cursor) {
    return new AbiUint72(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    return BigInt(`0x${this.value.subarray(32 - 9, 32).toHex()}`)
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
      const full = 2n ** 72n

      value = ((value % full) + full) % full
      
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
      return BigInt(`0x${this.value.toHex()}`)
    }

  }
  
}

export class AbiUint80 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const full = 2n ** 80n

    value = ((value % full) + full) % full
    
    const hex = value.toString(16).padStart(64, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint80(raw)
  }

  static read(cursor: Cursor) {
    return new AbiUint80(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    return BigInt(`0x${this.value.subarray(32 - 10, 32).toHex()}`)
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
      const full = 2n ** 80n

      value = ((value % full) + full) % full
      
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
      return BigInt(`0x${this.value.toHex()}`)
    }

  }
  
}

export class AbiUint88 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const full = 2n ** 88n

    value = ((value % full) + full) % full
    
    const hex = value.toString(16).padStart(64, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint88(raw)
  }

  static read(cursor: Cursor) {
    return new AbiUint88(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    return BigInt(`0x${this.value.subarray(32 - 11, 32).toHex()}`)
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
      const full = 2n ** 88n

      value = ((value % full) + full) % full
      
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
      return BigInt(`0x${this.value.toHex()}`)
    }

  }
  
}

export class AbiUint96 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const full = 2n ** 96n

    value = ((value % full) + full) % full
    
    const hex = value.toString(16).padStart(64, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint96(raw)
  }

  static read(cursor: Cursor) {
    return new AbiUint96(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    return BigInt(`0x${this.value.subarray(32 - 12, 32).toHex()}`)
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
      const full = 2n ** 96n

      value = ((value % full) + full) % full
      
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
      return BigInt(`0x${this.value.toHex()}`)
    }

  }
  
}

export class AbiUint104 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const full = 2n ** 104n

    value = ((value % full) + full) % full
    
    const hex = value.toString(16).padStart(64, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint104(raw)
  }

  static read(cursor: Cursor) {
    return new AbiUint104(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    return BigInt(`0x${this.value.subarray(32 - 13, 32).toHex()}`)
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
      const full = 2n ** 104n

      value = ((value % full) + full) % full
      
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
      return BigInt(`0x${this.value.toHex()}`)
    }

  }
  
}

export class AbiUint112 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const full = 2n ** 112n

    value = ((value % full) + full) % full
    
    const hex = value.toString(16).padStart(64, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint112(raw)
  }

  static read(cursor: Cursor) {
    return new AbiUint112(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    return BigInt(`0x${this.value.subarray(32 - 14, 32).toHex()}`)
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
      const full = 2n ** 112n

      value = ((value % full) + full) % full
      
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
      return BigInt(`0x${this.value.toHex()}`)
    }

  }
  
}

export class AbiUint120 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const full = 2n ** 120n

    value = ((value % full) + full) % full
    
    const hex = value.toString(16).padStart(64, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint120(raw)
  }

  static read(cursor: Cursor) {
    return new AbiUint120(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    return BigInt(`0x${this.value.subarray(32 - 15, 32).toHex()}`)
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
      const full = 2n ** 120n

      value = ((value % full) + full) % full
      
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
      return BigInt(`0x${this.value.toHex()}`)
    }

  }
  
}

export class AbiUint128 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const full = 2n ** 128n

    value = ((value % full) + full) % full
    
    const hex = value.toString(16).padStart(64, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint128(raw)
  }

  static read(cursor: Cursor) {
    return new AbiUint128(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    return BigInt(`0x${this.value.subarray(32 - 16, 32).toHex()}`)
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
      const full = 2n ** 128n

      value = ((value % full) + full) % full
      
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
      return BigInt(`0x${this.value.toHex()}`)
    }

  }
  
}

export class AbiUint136 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const full = 2n ** 136n

    value = ((value % full) + full) % full
    
    const hex = value.toString(16).padStart(64, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint136(raw)
  }

  static read(cursor: Cursor) {
    return new AbiUint136(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    return BigInt(`0x${this.value.subarray(32 - 17, 32).toHex()}`)
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
      const full = 2n ** 136n

      value = ((value % full) + full) % full
      
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
      return BigInt(`0x${this.value.toHex()}`)
    }

  }
  
}

export class AbiUint144 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const full = 2n ** 144n

    value = ((value % full) + full) % full
    
    const hex = value.toString(16).padStart(64, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint144(raw)
  }

  static read(cursor: Cursor) {
    return new AbiUint144(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    return BigInt(`0x${this.value.subarray(32 - 18, 32).toHex()}`)
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
      const full = 2n ** 144n

      value = ((value % full) + full) % full
      
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
      return BigInt(`0x${this.value.toHex()}`)
    }

  }
  
}

export class AbiUint152 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const full = 2n ** 152n

    value = ((value % full) + full) % full
    
    const hex = value.toString(16).padStart(64, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint152(raw)
  }

  static read(cursor: Cursor) {
    return new AbiUint152(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    return BigInt(`0x${this.value.subarray(32 - 19, 32).toHex()}`)
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
      const full = 2n ** 152n

      value = ((value % full) + full) % full
      
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
      return BigInt(`0x${this.value.toHex()}`)
    }

  }
  
}

export class AbiUint160 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const full = 2n ** 160n

    value = ((value % full) + full) % full
    
    const hex = value.toString(16).padStart(64, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint160(raw)
  }

  static read(cursor: Cursor) {
    return new AbiUint160(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    return BigInt(`0x${this.value.subarray(32 - 20, 32).toHex()}`)
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
      const full = 2n ** 160n

      value = ((value % full) + full) % full
      
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
      return BigInt(`0x${this.value.toHex()}`)
    }

  }
  
}

export class AbiUint168 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const full = 2n ** 168n

    value = ((value % full) + full) % full
    
    const hex = value.toString(16).padStart(64, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint168(raw)
  }

  static read(cursor: Cursor) {
    return new AbiUint168(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    return BigInt(`0x${this.value.subarray(32 - 21, 32).toHex()}`)
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
      const full = 2n ** 168n

      value = ((value % full) + full) % full
      
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
      return BigInt(`0x${this.value.toHex()}`)
    }

  }
  
}

export class AbiUint176 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const full = 2n ** 176n

    value = ((value % full) + full) % full
    
    const hex = value.toString(16).padStart(64, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint176(raw)
  }

  static read(cursor: Cursor) {
    return new AbiUint176(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    return BigInt(`0x${this.value.subarray(32 - 22, 32).toHex()}`)
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
      const full = 2n ** 176n

      value = ((value % full) + full) % full
      
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
      return BigInt(`0x${this.value.toHex()}`)
    }

  }
  
}

export class AbiUint184 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const full = 2n ** 184n

    value = ((value % full) + full) % full
    
    const hex = value.toString(16).padStart(64, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint184(raw)
  }

  static read(cursor: Cursor) {
    return new AbiUint184(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    return BigInt(`0x${this.value.subarray(32 - 23, 32).toHex()}`)
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
      const full = 2n ** 184n

      value = ((value % full) + full) % full
      
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
      return BigInt(`0x${this.value.toHex()}`)
    }

  }
  
}

export class AbiUint192 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const full = 2n ** 192n

    value = ((value % full) + full) % full
    
    const hex = value.toString(16).padStart(64, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint192(raw)
  }

  static read(cursor: Cursor) {
    return new AbiUint192(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    return BigInt(`0x${this.value.subarray(32 - 24, 32).toHex()}`)
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
      const full = 2n ** 192n

      value = ((value % full) + full) % full
      
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
      return BigInt(`0x${this.value.toHex()}`)
    }

  }
  
}

export class AbiUint200 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const full = 2n ** 200n

    value = ((value % full) + full) % full
    
    const hex = value.toString(16).padStart(64, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint200(raw)
  }

  static read(cursor: Cursor) {
    return new AbiUint200(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    return BigInt(`0x${this.value.subarray(32 - 25, 32).toHex()}`)
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
      const full = 2n ** 200n

      value = ((value % full) + full) % full
      
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
      return BigInt(`0x${this.value.toHex()}`)
    }

  }
  
}

export class AbiUint208 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const full = 2n ** 208n

    value = ((value % full) + full) % full
    
    const hex = value.toString(16).padStart(64, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint208(raw)
  }

  static read(cursor: Cursor) {
    return new AbiUint208(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    return BigInt(`0x${this.value.subarray(32 - 26, 32).toHex()}`)
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
      const full = 2n ** 208n

      value = ((value % full) + full) % full
      
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
      return BigInt(`0x${this.value.toHex()}`)
    }

  }
  
}

export class AbiUint216 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const full = 2n ** 216n

    value = ((value % full) + full) % full
    
    const hex = value.toString(16).padStart(64, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint216(raw)
  }

  static read(cursor: Cursor) {
    return new AbiUint216(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    return BigInt(`0x${this.value.subarray(32 - 27, 32).toHex()}`)
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
      const full = 2n ** 216n

      value = ((value % full) + full) % full
      
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
      return BigInt(`0x${this.value.toHex()}`)
    }

  }
  
}

export class AbiUint224 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const full = 2n ** 224n

    value = ((value % full) + full) % full
    
    const hex = value.toString(16).padStart(64, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint224(raw)
  }

  static read(cursor: Cursor) {
    return new AbiUint224(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    return BigInt(`0x${this.value.subarray(32 - 28, 32).toHex()}`)
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
      const full = 2n ** 224n

      value = ((value % full) + full) % full
      
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
      return BigInt(`0x${this.value.toHex()}`)
    }

  }
  
}

export class AbiUint232 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const full = 2n ** 232n

    value = ((value % full) + full) % full
    
    const hex = value.toString(16).padStart(64, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint232(raw)
  }

  static read(cursor: Cursor) {
    return new AbiUint232(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    return BigInt(`0x${this.value.subarray(32 - 29, 32).toHex()}`)
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
      const full = 2n ** 232n

      value = ((value % full) + full) % full
      
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
      return BigInt(`0x${this.value.toHex()}`)
    }

  }
  
}

export class AbiUint240 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const full = 2n ** 240n

    value = ((value % full) + full) % full
    
    const hex = value.toString(16).padStart(64, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint240(raw)
  }

  static read(cursor: Cursor) {
    return new AbiUint240(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    return BigInt(`0x${this.value.subarray(32 - 30, 32).toHex()}`)
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
      const full = 2n ** 240n

      value = ((value % full) + full) % full
      
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
      return BigInt(`0x${this.value.toHex()}`)
    }

  }
  
}

export class AbiUint248 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const full = 2n ** 248n

    value = ((value % full) + full) % full
    
    const hex = value.toString(16).padStart(64, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint248(raw)
  }

  static read(cursor: Cursor) {
    return new AbiUint248(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    return BigInt(`0x${this.value.subarray(32 - 31, 32).toHex()}`)
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
      const full = 2n ** 248n

      value = ((value % full) + full) % full
      
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
      return BigInt(`0x${this.value.toHex()}`)
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
    const full = 2n ** 256n

    value = ((value % full) + full) % full
    
    const hex = value.toString(16).padStart(64, "0")
    const raw = Uint8Array.fromHex(hex)

    return new AbiUint256(raw)
  }

  static read(cursor: Cursor) {
    return new AbiUint256(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    return BigInt(`0x${this.value.subarray(32 - 32, 32).toHex()}`)
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
      const full = 2n ** 256n

      value = ((value % full) + full) % full
      
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
      return BigInt(`0x${this.value.toHex()}`)
    }

  }
  
}