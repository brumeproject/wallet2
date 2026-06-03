import { Cursor } from "@hazae41/cursor"

export class AbiInt8 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const pad = value < 0 ? "f" : "0"

    const mod = 2n ** 7n
    const sup = 2n ** 8n

    value = value % mod
    value = (value + sup) % sup
    
    const hex = value.toString(16).padStart(64, pad)
    const raw = Uint8Array.fromHex(hex)

    return new AbiInt8(raw)
  }

  static read(cursor: Cursor) {
    return new AbiInt8(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    const mod = 2n ** 7n
    const sup = 2n ** 8n

    let value = BigInt(`0x${this.value.subarray(32 - 1, 32).toHex()}`)

    value = value % sup
    value = value < mod ? value : value - sup

    return value
  }

}
  
export namespace AbiInt8 {
  
  export class Packed {
  
    constructor(
      /**
       * 1-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      const mod = 2n ** 7n
      const sup = 2n ** 8n

      value = value % mod
      value = (value + sup) % sup
      
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
      const mod = 2n ** 7n
      const sup = 2n ** 8n

      let value = BigInt(`0x${this.value.toHex()}`)

      value = value % sup
      value = value < mod ? value : value - sup

      return value
    }

  }
  
}

export class AbiInt16 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const pad = value < 0 ? "f" : "0"

    const mod = 2n ** 15n
    const sup = 2n ** 16n

    value = value % mod
    value = (value + sup) % sup
    
    const hex = value.toString(16).padStart(64, pad)
    const raw = Uint8Array.fromHex(hex)

    return new AbiInt16(raw)
  }

  static read(cursor: Cursor) {
    return new AbiInt16(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    const mod = 2n ** 15n
    const sup = 2n ** 16n

    let value = BigInt(`0x${this.value.subarray(32 - 2, 32).toHex()}`)

    value = value % sup
    value = value < mod ? value : value - sup

    return value
  }

}
  
export namespace AbiInt16 {
  
  export class Packed {
  
    constructor(
      /**
       * 2-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      const mod = 2n ** 15n
      const sup = 2n ** 16n

      value = value % mod
      value = (value + sup) % sup
      
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
      const mod = 2n ** 15n
      const sup = 2n ** 16n

      let value = BigInt(`0x${this.value.toHex()}`)

      value = value % sup
      value = value < mod ? value : value - sup

      return value
    }

  }
  
}

export class AbiInt24 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const pad = value < 0 ? "f" : "0"

    const mod = 2n ** 23n
    const sup = 2n ** 24n

    value = value % mod
    value = (value + sup) % sup
    
    const hex = value.toString(16).padStart(64, pad)
    const raw = Uint8Array.fromHex(hex)

    return new AbiInt24(raw)
  }

  static read(cursor: Cursor) {
    return new AbiInt24(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    const mod = 2n ** 23n
    const sup = 2n ** 24n

    let value = BigInt(`0x${this.value.subarray(32 - 3, 32).toHex()}`)

    value = value % sup
    value = value < mod ? value : value - sup

    return value
  }

}
  
export namespace AbiInt24 {
  
  export class Packed {
  
    constructor(
      /**
       * 3-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      const mod = 2n ** 23n
      const sup = 2n ** 24n

      value = value % mod
      value = (value + sup) % sup
      
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
      const mod = 2n ** 23n
      const sup = 2n ** 24n

      let value = BigInt(`0x${this.value.toHex()}`)

      value = value % sup
      value = value < mod ? value : value - sup

      return value
    }

  }
  
}

export class AbiInt32 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const pad = value < 0 ? "f" : "0"

    const mod = 2n ** 31n
    const sup = 2n ** 32n

    value = value % mod
    value = (value + sup) % sup
    
    const hex = value.toString(16).padStart(64, pad)
    const raw = Uint8Array.fromHex(hex)

    return new AbiInt32(raw)
  }

  static read(cursor: Cursor) {
    return new AbiInt32(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    const mod = 2n ** 31n
    const sup = 2n ** 32n

    let value = BigInt(`0x${this.value.subarray(32 - 4, 32).toHex()}`)

    value = value % sup
    value = value < mod ? value : value - sup

    return value
  }

}
  
export namespace AbiInt32 {
  
  export class Packed {
  
    constructor(
      /**
       * 4-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      const mod = 2n ** 31n
      const sup = 2n ** 32n

      value = value % mod
      value = (value + sup) % sup
      
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
      const mod = 2n ** 31n
      const sup = 2n ** 32n

      let value = BigInt(`0x${this.value.toHex()}`)

      value = value % sup
      value = value < mod ? value : value - sup

      return value
    }

  }
  
}

export class AbiInt40 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const pad = value < 0 ? "f" : "0"

    const mod = 2n ** 39n
    const sup = 2n ** 40n

    value = value % mod
    value = (value + sup) % sup
    
    const hex = value.toString(16).padStart(64, pad)
    const raw = Uint8Array.fromHex(hex)

    return new AbiInt40(raw)
  }

  static read(cursor: Cursor) {
    return new AbiInt40(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    const mod = 2n ** 39n
    const sup = 2n ** 40n

    let value = BigInt(`0x${this.value.subarray(32 - 5, 32).toHex()}`)

    value = value % sup
    value = value < mod ? value : value - sup

    return value
  }

}
  
export namespace AbiInt40 {
  
  export class Packed {
  
    constructor(
      /**
       * 5-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      const mod = 2n ** 39n
      const sup = 2n ** 40n

      value = value % mod
      value = (value + sup) % sup
      
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
      const mod = 2n ** 39n
      const sup = 2n ** 40n

      let value = BigInt(`0x${this.value.toHex()}`)

      value = value % sup
      value = value < mod ? value : value - sup

      return value
    }

  }
  
}

export class AbiInt48 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const pad = value < 0 ? "f" : "0"

    const mod = 2n ** 47n
    const sup = 2n ** 48n

    value = value % mod
    value = (value + sup) % sup
    
    const hex = value.toString(16).padStart(64, pad)
    const raw = Uint8Array.fromHex(hex)

    return new AbiInt48(raw)
  }

  static read(cursor: Cursor) {
    return new AbiInt48(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    const mod = 2n ** 47n
    const sup = 2n ** 48n

    let value = BigInt(`0x${this.value.subarray(32 - 6, 32).toHex()}`)

    value = value % sup
    value = value < mod ? value : value - sup

    return value
  }

}
  
export namespace AbiInt48 {
  
  export class Packed {
  
    constructor(
      /**
       * 6-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      const mod = 2n ** 47n
      const sup = 2n ** 48n

      value = value % mod
      value = (value + sup) % sup
      
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
      const mod = 2n ** 47n
      const sup = 2n ** 48n

      let value = BigInt(`0x${this.value.toHex()}`)

      value = value % sup
      value = value < mod ? value : value - sup

      return value
    }

  }
  
}

export class AbiInt56 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const pad = value < 0 ? "f" : "0"

    const mod = 2n ** 55n
    const sup = 2n ** 56n

    value = value % mod
    value = (value + sup) % sup
    
    const hex = value.toString(16).padStart(64, pad)
    const raw = Uint8Array.fromHex(hex)

    return new AbiInt56(raw)
  }

  static read(cursor: Cursor) {
    return new AbiInt56(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    const mod = 2n ** 55n
    const sup = 2n ** 56n

    let value = BigInt(`0x${this.value.subarray(32 - 7, 32).toHex()}`)

    value = value % sup
    value = value < mod ? value : value - sup

    return value
  }

}
  
export namespace AbiInt56 {
  
  export class Packed {
  
    constructor(
      /**
       * 7-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      const mod = 2n ** 55n
      const sup = 2n ** 56n

      value = value % mod
      value = (value + sup) % sup
      
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
      const mod = 2n ** 55n
      const sup = 2n ** 56n

      let value = BigInt(`0x${this.value.toHex()}`)

      value = value % sup
      value = value < mod ? value : value - sup

      return value
    }

  }
  
}

export class AbiInt64 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const pad = value < 0 ? "f" : "0"

    const mod = 2n ** 63n
    const sup = 2n ** 64n

    value = value % mod
    value = (value + sup) % sup
    
    const hex = value.toString(16).padStart(64, pad)
    const raw = Uint8Array.fromHex(hex)

    return new AbiInt64(raw)
  }

  static read(cursor: Cursor) {
    return new AbiInt64(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    const mod = 2n ** 63n
    const sup = 2n ** 64n

    let value = BigInt(`0x${this.value.subarray(32 - 8, 32).toHex()}`)

    value = value % sup
    value = value < mod ? value : value - sup

    return value
  }

}
  
export namespace AbiInt64 {
  
  export class Packed {
  
    constructor(
      /**
       * 8-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      const mod = 2n ** 63n
      const sup = 2n ** 64n

      value = value % mod
      value = (value + sup) % sup
      
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
      const mod = 2n ** 63n
      const sup = 2n ** 64n

      let value = BigInt(`0x${this.value.toHex()}`)

      value = value % sup
      value = value < mod ? value : value - sup

      return value
    }

  }
  
}

export class AbiInt72 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const pad = value < 0 ? "f" : "0"

    const mod = 2n ** 71n
    const sup = 2n ** 72n

    value = value % mod
    value = (value + sup) % sup
    
    const hex = value.toString(16).padStart(64, pad)
    const raw = Uint8Array.fromHex(hex)

    return new AbiInt72(raw)
  }

  static read(cursor: Cursor) {
    return new AbiInt72(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    const mod = 2n ** 71n
    const sup = 2n ** 72n

    let value = BigInt(`0x${this.value.subarray(32 - 9, 32).toHex()}`)

    value = value % sup
    value = value < mod ? value : value - sup

    return value
  }

}
  
export namespace AbiInt72 {
  
  export class Packed {
  
    constructor(
      /**
       * 9-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      const mod = 2n ** 71n
      const sup = 2n ** 72n

      value = value % mod
      value = (value + sup) % sup
      
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
      const mod = 2n ** 71n
      const sup = 2n ** 72n

      let value = BigInt(`0x${this.value.toHex()}`)

      value = value % sup
      value = value < mod ? value : value - sup

      return value
    }

  }
  
}

export class AbiInt80 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const pad = value < 0 ? "f" : "0"

    const mod = 2n ** 79n
    const sup = 2n ** 80n

    value = value % mod
    value = (value + sup) % sup
    
    const hex = value.toString(16).padStart(64, pad)
    const raw = Uint8Array.fromHex(hex)

    return new AbiInt80(raw)
  }

  static read(cursor: Cursor) {
    return new AbiInt80(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    const mod = 2n ** 79n
    const sup = 2n ** 80n

    let value = BigInt(`0x${this.value.subarray(32 - 10, 32).toHex()}`)

    value = value % sup
    value = value < mod ? value : value - sup

    return value
  }

}
  
export namespace AbiInt80 {
  
  export class Packed {
  
    constructor(
      /**
       * 10-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      const mod = 2n ** 79n
      const sup = 2n ** 80n

      value = value % mod
      value = (value + sup) % sup
      
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
      const mod = 2n ** 79n
      const sup = 2n ** 80n

      let value = BigInt(`0x${this.value.toHex()}`)

      value = value % sup
      value = value < mod ? value : value - sup

      return value
    }

  }
  
}

export class AbiInt88 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const pad = value < 0 ? "f" : "0"

    const mod = 2n ** 87n
    const sup = 2n ** 88n

    value = value % mod
    value = (value + sup) % sup
    
    const hex = value.toString(16).padStart(64, pad)
    const raw = Uint8Array.fromHex(hex)

    return new AbiInt88(raw)
  }

  static read(cursor: Cursor) {
    return new AbiInt88(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    const mod = 2n ** 87n
    const sup = 2n ** 88n

    let value = BigInt(`0x${this.value.subarray(32 - 11, 32).toHex()}`)

    value = value % sup
    value = value < mod ? value : value - sup

    return value
  }

}
  
export namespace AbiInt88 {
  
  export class Packed {
  
    constructor(
      /**
       * 11-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      const mod = 2n ** 87n
      const sup = 2n ** 88n

      value = value % mod
      value = (value + sup) % sup
      
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
      const mod = 2n ** 87n
      const sup = 2n ** 88n

      let value = BigInt(`0x${this.value.toHex()}`)

      value = value % sup
      value = value < mod ? value : value - sup

      return value
    }

  }
  
}

export class AbiInt96 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const pad = value < 0 ? "f" : "0"

    const mod = 2n ** 95n
    const sup = 2n ** 96n

    value = value % mod
    value = (value + sup) % sup
    
    const hex = value.toString(16).padStart(64, pad)
    const raw = Uint8Array.fromHex(hex)

    return new AbiInt96(raw)
  }

  static read(cursor: Cursor) {
    return new AbiInt96(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    const mod = 2n ** 95n
    const sup = 2n ** 96n

    let value = BigInt(`0x${this.value.subarray(32 - 12, 32).toHex()}`)

    value = value % sup
    value = value < mod ? value : value - sup

    return value
  }

}
  
export namespace AbiInt96 {
  
  export class Packed {
  
    constructor(
      /**
       * 12-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      const mod = 2n ** 95n
      const sup = 2n ** 96n

      value = value % mod
      value = (value + sup) % sup
      
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
      const mod = 2n ** 95n
      const sup = 2n ** 96n

      let value = BigInt(`0x${this.value.toHex()}`)

      value = value % sup
      value = value < mod ? value : value - sup

      return value
    }

  }
  
}

export class AbiInt104 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const pad = value < 0 ? "f" : "0"

    const mod = 2n ** 103n
    const sup = 2n ** 104n

    value = value % mod
    value = (value + sup) % sup
    
    const hex = value.toString(16).padStart(64, pad)
    const raw = Uint8Array.fromHex(hex)

    return new AbiInt104(raw)
  }

  static read(cursor: Cursor) {
    return new AbiInt104(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    const mod = 2n ** 103n
    const sup = 2n ** 104n

    let value = BigInt(`0x${this.value.subarray(32 - 13, 32).toHex()}`)

    value = value % sup
    value = value < mod ? value : value - sup

    return value
  }

}
  
export namespace AbiInt104 {
  
  export class Packed {
  
    constructor(
      /**
       * 13-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      const mod = 2n ** 103n
      const sup = 2n ** 104n

      value = value % mod
      value = (value + sup) % sup
      
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
      const mod = 2n ** 103n
      const sup = 2n ** 104n

      let value = BigInt(`0x${this.value.toHex()}`)

      value = value % sup
      value = value < mod ? value : value - sup

      return value
    }

  }
  
}

export class AbiInt112 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const pad = value < 0 ? "f" : "0"

    const mod = 2n ** 111n
    const sup = 2n ** 112n

    value = value % mod
    value = (value + sup) % sup
    
    const hex = value.toString(16).padStart(64, pad)
    const raw = Uint8Array.fromHex(hex)

    return new AbiInt112(raw)
  }

  static read(cursor: Cursor) {
    return new AbiInt112(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    const mod = 2n ** 111n
    const sup = 2n ** 112n

    let value = BigInt(`0x${this.value.subarray(32 - 14, 32).toHex()}`)

    value = value % sup
    value = value < mod ? value : value - sup

    return value
  }

}
  
export namespace AbiInt112 {
  
  export class Packed {
  
    constructor(
      /**
       * 14-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      const mod = 2n ** 111n
      const sup = 2n ** 112n

      value = value % mod
      value = (value + sup) % sup
      
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
      const mod = 2n ** 111n
      const sup = 2n ** 112n

      let value = BigInt(`0x${this.value.toHex()}`)

      value = value % sup
      value = value < mod ? value : value - sup

      return value
    }

  }
  
}

export class AbiInt120 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const pad = value < 0 ? "f" : "0"

    const mod = 2n ** 119n
    const sup = 2n ** 120n

    value = value % mod
    value = (value + sup) % sup
    
    const hex = value.toString(16).padStart(64, pad)
    const raw = Uint8Array.fromHex(hex)

    return new AbiInt120(raw)
  }

  static read(cursor: Cursor) {
    return new AbiInt120(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    const mod = 2n ** 119n
    const sup = 2n ** 120n

    let value = BigInt(`0x${this.value.subarray(32 - 15, 32).toHex()}`)

    value = value % sup
    value = value < mod ? value : value - sup

    return value
  }

}
  
export namespace AbiInt120 {
  
  export class Packed {
  
    constructor(
      /**
       * 15-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      const mod = 2n ** 119n
      const sup = 2n ** 120n

      value = value % mod
      value = (value + sup) % sup
      
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
      const mod = 2n ** 119n
      const sup = 2n ** 120n

      let value = BigInt(`0x${this.value.toHex()}`)

      value = value % sup
      value = value < mod ? value : value - sup

      return value
    }

  }
  
}

export class AbiInt128 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const pad = value < 0 ? "f" : "0"

    const mod = 2n ** 127n
    const sup = 2n ** 128n

    value = value % mod
    value = (value + sup) % sup
    
    const hex = value.toString(16).padStart(64, pad)
    const raw = Uint8Array.fromHex(hex)

    return new AbiInt128(raw)
  }

  static read(cursor: Cursor) {
    return new AbiInt128(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    const mod = 2n ** 127n
    const sup = 2n ** 128n

    let value = BigInt(`0x${this.value.subarray(32 - 16, 32).toHex()}`)

    value = value % sup
    value = value < mod ? value : value - sup

    return value
  }

}
  
export namespace AbiInt128 {
  
  export class Packed {
  
    constructor(
      /**
       * 16-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      const mod = 2n ** 127n
      const sup = 2n ** 128n

      value = value % mod
      value = (value + sup) % sup
      
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
      const mod = 2n ** 127n
      const sup = 2n ** 128n

      let value = BigInt(`0x${this.value.toHex()}`)

      value = value % sup
      value = value < mod ? value : value - sup

      return value
    }

  }
  
}

export class AbiInt136 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const pad = value < 0 ? "f" : "0"

    const mod = 2n ** 135n
    const sup = 2n ** 136n

    value = value % mod
    value = (value + sup) % sup
    
    const hex = value.toString(16).padStart(64, pad)
    const raw = Uint8Array.fromHex(hex)

    return new AbiInt136(raw)
  }

  static read(cursor: Cursor) {
    return new AbiInt136(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    const mod = 2n ** 135n
    const sup = 2n ** 136n

    let value = BigInt(`0x${this.value.subarray(32 - 17, 32).toHex()}`)

    value = value % sup
    value = value < mod ? value : value - sup

    return value
  }

}
  
export namespace AbiInt136 {
  
  export class Packed {
  
    constructor(
      /**
       * 17-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      const mod = 2n ** 135n
      const sup = 2n ** 136n

      value = value % mod
      value = (value + sup) % sup
      
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
      const mod = 2n ** 135n
      const sup = 2n ** 136n

      let value = BigInt(`0x${this.value.toHex()}`)

      value = value % sup
      value = value < mod ? value : value - sup

      return value
    }

  }
  
}

export class AbiInt144 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const pad = value < 0 ? "f" : "0"

    const mod = 2n ** 143n
    const sup = 2n ** 144n

    value = value % mod
    value = (value + sup) % sup
    
    const hex = value.toString(16).padStart(64, pad)
    const raw = Uint8Array.fromHex(hex)

    return new AbiInt144(raw)
  }

  static read(cursor: Cursor) {
    return new AbiInt144(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    const mod = 2n ** 143n
    const sup = 2n ** 144n

    let value = BigInt(`0x${this.value.subarray(32 - 18, 32).toHex()}`)

    value = value % sup
    value = value < mod ? value : value - sup

    return value
  }

}
  
export namespace AbiInt144 {
  
  export class Packed {
  
    constructor(
      /**
       * 18-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      const mod = 2n ** 143n
      const sup = 2n ** 144n

      value = value % mod
      value = (value + sup) % sup
      
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
      const mod = 2n ** 143n
      const sup = 2n ** 144n

      let value = BigInt(`0x${this.value.toHex()}`)

      value = value % sup
      value = value < mod ? value : value - sup

      return value
    }

  }
  
}

export class AbiInt152 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const pad = value < 0 ? "f" : "0"

    const mod = 2n ** 151n
    const sup = 2n ** 152n

    value = value % mod
    value = (value + sup) % sup
    
    const hex = value.toString(16).padStart(64, pad)
    const raw = Uint8Array.fromHex(hex)

    return new AbiInt152(raw)
  }

  static read(cursor: Cursor) {
    return new AbiInt152(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    const mod = 2n ** 151n
    const sup = 2n ** 152n

    let value = BigInt(`0x${this.value.subarray(32 - 19, 32).toHex()}`)

    value = value % sup
    value = value < mod ? value : value - sup

    return value
  }

}
  
export namespace AbiInt152 {
  
  export class Packed {
  
    constructor(
      /**
       * 19-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      const mod = 2n ** 151n
      const sup = 2n ** 152n

      value = value % mod
      value = (value + sup) % sup
      
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
      const mod = 2n ** 151n
      const sup = 2n ** 152n

      let value = BigInt(`0x${this.value.toHex()}`)

      value = value % sup
      value = value < mod ? value : value - sup

      return value
    }

  }
  
}

export class AbiInt160 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const pad = value < 0 ? "f" : "0"

    const mod = 2n ** 159n
    const sup = 2n ** 160n

    value = value % mod
    value = (value + sup) % sup
    
    const hex = value.toString(16).padStart(64, pad)
    const raw = Uint8Array.fromHex(hex)

    return new AbiInt160(raw)
  }

  static read(cursor: Cursor) {
    return new AbiInt160(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    const mod = 2n ** 159n
    const sup = 2n ** 160n

    let value = BigInt(`0x${this.value.subarray(32 - 20, 32).toHex()}`)

    value = value % sup
    value = value < mod ? value : value - sup

    return value
  }

}
  
export namespace AbiInt160 {
  
  export class Packed {
  
    constructor(
      /**
       * 20-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      const mod = 2n ** 159n
      const sup = 2n ** 160n

      value = value % mod
      value = (value + sup) % sup
      
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
      const mod = 2n ** 159n
      const sup = 2n ** 160n

      let value = BigInt(`0x${this.value.toHex()}`)

      value = value % sup
      value = value < mod ? value : value - sup

      return value
    }

  }
  
}

export class AbiInt168 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const pad = value < 0 ? "f" : "0"

    const mod = 2n ** 167n
    const sup = 2n ** 168n

    value = value % mod
    value = (value + sup) % sup
    
    const hex = value.toString(16).padStart(64, pad)
    const raw = Uint8Array.fromHex(hex)

    return new AbiInt168(raw)
  }

  static read(cursor: Cursor) {
    return new AbiInt168(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    const mod = 2n ** 167n
    const sup = 2n ** 168n

    let value = BigInt(`0x${this.value.subarray(32 - 21, 32).toHex()}`)

    value = value % sup
    value = value < mod ? value : value - sup

    return value
  }

}
  
export namespace AbiInt168 {
  
  export class Packed {
  
    constructor(
      /**
       * 21-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      const mod = 2n ** 167n
      const sup = 2n ** 168n

      value = value % mod
      value = (value + sup) % sup
      
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
      const mod = 2n ** 167n
      const sup = 2n ** 168n

      let value = BigInt(`0x${this.value.toHex()}`)

      value = value % sup
      value = value < mod ? value : value - sup

      return value
    }

  }
  
}

export class AbiInt176 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const pad = value < 0 ? "f" : "0"

    const mod = 2n ** 175n
    const sup = 2n ** 176n

    value = value % mod
    value = (value + sup) % sup
    
    const hex = value.toString(16).padStart(64, pad)
    const raw = Uint8Array.fromHex(hex)

    return new AbiInt176(raw)
  }

  static read(cursor: Cursor) {
    return new AbiInt176(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    const mod = 2n ** 175n
    const sup = 2n ** 176n

    let value = BigInt(`0x${this.value.subarray(32 - 22, 32).toHex()}`)

    value = value % sup
    value = value < mod ? value : value - sup

    return value
  }

}
  
export namespace AbiInt176 {
  
  export class Packed {
  
    constructor(
      /**
       * 22-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      const mod = 2n ** 175n
      const sup = 2n ** 176n

      value = value % mod
      value = (value + sup) % sup
      
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
      const mod = 2n ** 175n
      const sup = 2n ** 176n

      let value = BigInt(`0x${this.value.toHex()}`)

      value = value % sup
      value = value < mod ? value : value - sup

      return value
    }

  }
  
}

export class AbiInt184 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const pad = value < 0 ? "f" : "0"

    const mod = 2n ** 183n
    const sup = 2n ** 184n

    value = value % mod
    value = (value + sup) % sup
    
    const hex = value.toString(16).padStart(64, pad)
    const raw = Uint8Array.fromHex(hex)

    return new AbiInt184(raw)
  }

  static read(cursor: Cursor) {
    return new AbiInt184(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    const mod = 2n ** 183n
    const sup = 2n ** 184n

    let value = BigInt(`0x${this.value.subarray(32 - 23, 32).toHex()}`)

    value = value % sup
    value = value < mod ? value : value - sup

    return value
  }

}
  
export namespace AbiInt184 {
  
  export class Packed {
  
    constructor(
      /**
       * 23-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      const mod = 2n ** 183n
      const sup = 2n ** 184n

      value = value % mod
      value = (value + sup) % sup
      
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
      const mod = 2n ** 183n
      const sup = 2n ** 184n

      let value = BigInt(`0x${this.value.toHex()}`)

      value = value % sup
      value = value < mod ? value : value - sup

      return value
    }

  }
  
}

export class AbiInt192 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const pad = value < 0 ? "f" : "0"

    const mod = 2n ** 191n
    const sup = 2n ** 192n

    value = value % mod
    value = (value + sup) % sup
    
    const hex = value.toString(16).padStart(64, pad)
    const raw = Uint8Array.fromHex(hex)

    return new AbiInt192(raw)
  }

  static read(cursor: Cursor) {
    return new AbiInt192(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    const mod = 2n ** 191n
    const sup = 2n ** 192n

    let value = BigInt(`0x${this.value.subarray(32 - 24, 32).toHex()}`)

    value = value % sup
    value = value < mod ? value : value - sup

    return value
  }

}
  
export namespace AbiInt192 {
  
  export class Packed {
  
    constructor(
      /**
       * 24-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      const mod = 2n ** 191n
      const sup = 2n ** 192n

      value = value % mod
      value = (value + sup) % sup
      
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
      const mod = 2n ** 191n
      const sup = 2n ** 192n

      let value = BigInt(`0x${this.value.toHex()}`)

      value = value % sup
      value = value < mod ? value : value - sup

      return value
    }

  }
  
}

export class AbiInt200 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const pad = value < 0 ? "f" : "0"

    const mod = 2n ** 199n
    const sup = 2n ** 200n

    value = value % mod
    value = (value + sup) % sup
    
    const hex = value.toString(16).padStart(64, pad)
    const raw = Uint8Array.fromHex(hex)

    return new AbiInt200(raw)
  }

  static read(cursor: Cursor) {
    return new AbiInt200(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    const mod = 2n ** 199n
    const sup = 2n ** 200n

    let value = BigInt(`0x${this.value.subarray(32 - 25, 32).toHex()}`)

    value = value % sup
    value = value < mod ? value : value - sup

    return value
  }

}
  
export namespace AbiInt200 {
  
  export class Packed {
  
    constructor(
      /**
       * 25-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      const mod = 2n ** 199n
      const sup = 2n ** 200n

      value = value % mod
      value = (value + sup) % sup
      
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
      const mod = 2n ** 199n
      const sup = 2n ** 200n

      let value = BigInt(`0x${this.value.toHex()}`)

      value = value % sup
      value = value < mod ? value : value - sup

      return value
    }

  }
  
}

export class AbiInt208 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const pad = value < 0 ? "f" : "0"

    const mod = 2n ** 207n
    const sup = 2n ** 208n

    value = value % mod
    value = (value + sup) % sup
    
    const hex = value.toString(16).padStart(64, pad)
    const raw = Uint8Array.fromHex(hex)

    return new AbiInt208(raw)
  }

  static read(cursor: Cursor) {
    return new AbiInt208(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    const mod = 2n ** 207n
    const sup = 2n ** 208n

    let value = BigInt(`0x${this.value.subarray(32 - 26, 32).toHex()}`)

    value = value % sup
    value = value < mod ? value : value - sup

    return value
  }

}
  
export namespace AbiInt208 {
  
  export class Packed {
  
    constructor(
      /**
       * 26-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      const mod = 2n ** 207n
      const sup = 2n ** 208n

      value = value % mod
      value = (value + sup) % sup
      
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
      const mod = 2n ** 207n
      const sup = 2n ** 208n

      let value = BigInt(`0x${this.value.toHex()}`)

      value = value % sup
      value = value < mod ? value : value - sup

      return value
    }

  }
  
}

export class AbiInt216 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const pad = value < 0 ? "f" : "0"

    const mod = 2n ** 215n
    const sup = 2n ** 216n

    value = value % mod
    value = (value + sup) % sup
    
    const hex = value.toString(16).padStart(64, pad)
    const raw = Uint8Array.fromHex(hex)

    return new AbiInt216(raw)
  }

  static read(cursor: Cursor) {
    return new AbiInt216(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    const mod = 2n ** 215n
    const sup = 2n ** 216n

    let value = BigInt(`0x${this.value.subarray(32 - 27, 32).toHex()}`)

    value = value % sup
    value = value < mod ? value : value - sup

    return value
  }

}
  
export namespace AbiInt216 {
  
  export class Packed {
  
    constructor(
      /**
       * 27-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      const mod = 2n ** 215n
      const sup = 2n ** 216n

      value = value % mod
      value = (value + sup) % sup
      
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
      const mod = 2n ** 215n
      const sup = 2n ** 216n

      let value = BigInt(`0x${this.value.toHex()}`)

      value = value % sup
      value = value < mod ? value : value - sup

      return value
    }

  }
  
}

export class AbiInt224 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const pad = value < 0 ? "f" : "0"

    const mod = 2n ** 223n
    const sup = 2n ** 224n

    value = value % mod
    value = (value + sup) % sup
    
    const hex = value.toString(16).padStart(64, pad)
    const raw = Uint8Array.fromHex(hex)

    return new AbiInt224(raw)
  }

  static read(cursor: Cursor) {
    return new AbiInt224(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    const mod = 2n ** 223n
    const sup = 2n ** 224n

    let value = BigInt(`0x${this.value.subarray(32 - 28, 32).toHex()}`)

    value = value % sup
    value = value < mod ? value : value - sup

    return value
  }

}
  
export namespace AbiInt224 {
  
  export class Packed {
  
    constructor(
      /**
       * 28-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      const mod = 2n ** 223n
      const sup = 2n ** 224n

      value = value % mod
      value = (value + sup) % sup
      
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
      const mod = 2n ** 223n
      const sup = 2n ** 224n

      let value = BigInt(`0x${this.value.toHex()}`)

      value = value % sup
      value = value < mod ? value : value - sup

      return value
    }

  }
  
}

export class AbiInt232 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const pad = value < 0 ? "f" : "0"

    const mod = 2n ** 231n
    const sup = 2n ** 232n

    value = value % mod
    value = (value + sup) % sup
    
    const hex = value.toString(16).padStart(64, pad)
    const raw = Uint8Array.fromHex(hex)

    return new AbiInt232(raw)
  }

  static read(cursor: Cursor) {
    return new AbiInt232(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    const mod = 2n ** 231n
    const sup = 2n ** 232n

    let value = BigInt(`0x${this.value.subarray(32 - 29, 32).toHex()}`)

    value = value % sup
    value = value < mod ? value : value - sup

    return value
  }

}
  
export namespace AbiInt232 {
  
  export class Packed {
  
    constructor(
      /**
       * 29-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      const mod = 2n ** 231n
      const sup = 2n ** 232n

      value = value % mod
      value = (value + sup) % sup
      
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
      const mod = 2n ** 231n
      const sup = 2n ** 232n

      let value = BigInt(`0x${this.value.toHex()}`)

      value = value % sup
      value = value < mod ? value : value - sup

      return value
    }

  }
  
}

export class AbiInt240 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const pad = value < 0 ? "f" : "0"

    const mod = 2n ** 239n
    const sup = 2n ** 240n

    value = value % mod
    value = (value + sup) % sup
    
    const hex = value.toString(16).padStart(64, pad)
    const raw = Uint8Array.fromHex(hex)

    return new AbiInt240(raw)
  }

  static read(cursor: Cursor) {
    return new AbiInt240(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    const mod = 2n ** 239n
    const sup = 2n ** 240n

    let value = BigInt(`0x${this.value.subarray(32 - 30, 32).toHex()}`)

    value = value % sup
    value = value < mod ? value : value - sup

    return value
  }

}
  
export namespace AbiInt240 {
  
  export class Packed {
  
    constructor(
      /**
       * 30-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      const mod = 2n ** 239n
      const sup = 2n ** 240n

      value = value % mod
      value = (value + sup) % sup
      
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
      const mod = 2n ** 239n
      const sup = 2n ** 240n

      let value = BigInt(`0x${this.value.toHex()}`)

      value = value % sup
      value = value < mod ? value : value - sup

      return value
    }

  }
  
}

export class AbiInt248 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const pad = value < 0 ? "f" : "0"

    const mod = 2n ** 247n
    const sup = 2n ** 248n

    value = value % mod
    value = (value + sup) % sup
    
    const hex = value.toString(16).padStart(64, pad)
    const raw = Uint8Array.fromHex(hex)

    return new AbiInt248(raw)
  }

  static read(cursor: Cursor) {
    return new AbiInt248(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    const mod = 2n ** 247n
    const sup = 2n ** 248n

    let value = BigInt(`0x${this.value.subarray(32 - 31, 32).toHex()}`)

    value = value % sup
    value = value < mod ? value : value - sup

    return value
  }

}
  
export namespace AbiInt248 {
  
  export class Packed {
  
    constructor(
      /**
       * 31-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      const mod = 2n ** 247n
      const sup = 2n ** 248n

      value = value % mod
      value = (value + sup) % sup
      
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
      const mod = 2n ** 247n
      const sup = 2n ** 248n

      let value = BigInt(`0x${this.value.toHex()}`)

      value = value % sup
      value = value < mod ? value : value - sup

      return value
    }

  }
  
}

export class AbiInt256 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const pad = value < 0 ? "f" : "0"

    const mod = 2n ** 255n
    const sup = 2n ** 256n

    value = value % mod
    value = (value + sup) % sup
    
    const hex = value.toString(16).padStart(64, pad)
    const raw = Uint8Array.fromHex(hex)

    return new AbiInt256(raw)
  }

  static read(cursor: Cursor) {
    return new AbiInt256(new Uint8Array(cursor.read(32)))
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
  }

  into() {
    const mod = 2n ** 255n
    const sup = 2n ** 256n

    let value = BigInt(`0x${this.value.subarray(32 - 32, 32).toHex()}`)

    value = value % sup
    value = value < mod ? value : value - sup

    return value
  }

}
  
export namespace AbiInt256 {
  
  export class Packed {
  
    constructor(
      /**
       * 32-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint) {
      const mod = 2n ** 255n
      const sup = 2n ** 256n

      value = value % mod
      value = (value + sup) % sup
      
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
      const mod = 2n ** 255n
      const sup = 2n ** 256n

      let value = BigInt(`0x${this.value.toHex()}`)

      value = value % sup
      value = value < mod ? value : value - sup

      return value
    }

  }
  
}