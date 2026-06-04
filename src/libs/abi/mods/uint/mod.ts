import { Cursor } from "@hazae41/cursor"

export class AbiUint8 {

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint) {
    const full = 256n

    /**
     * Unsign and clamp the value to the allowed range
     */
    value = (value < 0n ? -value : value) % full
    
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
    return BigInt(`0x${this.value.subarray(31, 32).toHex()}`)
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
      const full = 256n

      /**
       * Unsign and clamp the value to the allowed range
       */
      value = (value < 0n ? -value : value) % full
      
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
    const full = 65536n

    /**
     * Unsign and clamp the value to the allowed range
     */
    value = (value < 0n ? -value : value) % full
    
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
    return BigInt(`0x${this.value.subarray(30, 32).toHex()}`)
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
      const full = 65536n

      /**
       * Unsign and clamp the value to the allowed range
       */
      value = (value < 0n ? -value : value) % full
      
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
    const full = 16777216n

    /**
     * Unsign and clamp the value to the allowed range
     */
    value = (value < 0n ? -value : value) % full
    
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
    return BigInt(`0x${this.value.subarray(29, 32).toHex()}`)
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
      const full = 16777216n

      /**
       * Unsign and clamp the value to the allowed range
       */
      value = (value < 0n ? -value : value) % full
      
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
    const full = 4294967296n

    /**
     * Unsign and clamp the value to the allowed range
     */
    value = (value < 0n ? -value : value) % full
    
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
    return BigInt(`0x${this.value.subarray(28, 32).toHex()}`)
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
      const full = 4294967296n

      /**
       * Unsign and clamp the value to the allowed range
       */
      value = (value < 0n ? -value : value) % full
      
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
    const full = 1099511627776n

    /**
     * Unsign and clamp the value to the allowed range
     */
    value = (value < 0n ? -value : value) % full
    
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
    return BigInt(`0x${this.value.subarray(27, 32).toHex()}`)
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
      const full = 1099511627776n

      /**
       * Unsign and clamp the value to the allowed range
       */
      value = (value < 0n ? -value : value) % full
      
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
    const full = 281474976710656n

    /**
     * Unsign and clamp the value to the allowed range
     */
    value = (value < 0n ? -value : value) % full
    
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
    return BigInt(`0x${this.value.subarray(26, 32).toHex()}`)
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
      const full = 281474976710656n

      /**
       * Unsign and clamp the value to the allowed range
       */
      value = (value < 0n ? -value : value) % full
      
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
    const full = 72057594037927936n

    /**
     * Unsign and clamp the value to the allowed range
     */
    value = (value < 0n ? -value : value) % full
    
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
    return BigInt(`0x${this.value.subarray(25, 32).toHex()}`)
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
      const full = 72057594037927936n

      /**
       * Unsign and clamp the value to the allowed range
       */
      value = (value < 0n ? -value : value) % full
      
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
    const full = 18446744073709551616n

    /**
     * Unsign and clamp the value to the allowed range
     */
    value = (value < 0n ? -value : value) % full
    
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
    return BigInt(`0x${this.value.subarray(24, 32).toHex()}`)
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
      const full = 18446744073709551616n

      /**
       * Unsign and clamp the value to the allowed range
       */
      value = (value < 0n ? -value : value) % full
      
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
    const full = 4722366482869645213696n

    /**
     * Unsign and clamp the value to the allowed range
     */
    value = (value < 0n ? -value : value) % full
    
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
    return BigInt(`0x${this.value.subarray(23, 32).toHex()}`)
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
      const full = 4722366482869645213696n

      /**
       * Unsign and clamp the value to the allowed range
       */
      value = (value < 0n ? -value : value) % full
      
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
    const full = 1208925819614629174706176n

    /**
     * Unsign and clamp the value to the allowed range
     */
    value = (value < 0n ? -value : value) % full
    
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
    return BigInt(`0x${this.value.subarray(22, 32).toHex()}`)
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
      const full = 1208925819614629174706176n

      /**
       * Unsign and clamp the value to the allowed range
       */
      value = (value < 0n ? -value : value) % full
      
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
    const full = 309485009821345068724781056n

    /**
     * Unsign and clamp the value to the allowed range
     */
    value = (value < 0n ? -value : value) % full
    
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
    return BigInt(`0x${this.value.subarray(21, 32).toHex()}`)
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
      const full = 309485009821345068724781056n

      /**
       * Unsign and clamp the value to the allowed range
       */
      value = (value < 0n ? -value : value) % full
      
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
    const full = 79228162514264337593543950336n

    /**
     * Unsign and clamp the value to the allowed range
     */
    value = (value < 0n ? -value : value) % full
    
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
    return BigInt(`0x${this.value.subarray(20, 32).toHex()}`)
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
      const full = 79228162514264337593543950336n

      /**
       * Unsign and clamp the value to the allowed range
       */
      value = (value < 0n ? -value : value) % full
      
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
    const full = 20282409603651670423947251286016n

    /**
     * Unsign and clamp the value to the allowed range
     */
    value = (value < 0n ? -value : value) % full
    
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
    return BigInt(`0x${this.value.subarray(19, 32).toHex()}`)
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
      const full = 20282409603651670423947251286016n

      /**
       * Unsign and clamp the value to the allowed range
       */
      value = (value < 0n ? -value : value) % full
      
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
    const full = 5192296858534827628530496329220096n

    /**
     * Unsign and clamp the value to the allowed range
     */
    value = (value < 0n ? -value : value) % full
    
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
    return BigInt(`0x${this.value.subarray(18, 32).toHex()}`)
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
      const full = 5192296858534827628530496329220096n

      /**
       * Unsign and clamp the value to the allowed range
       */
      value = (value < 0n ? -value : value) % full
      
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
    const full = 1329227995784915872903807060280344576n

    /**
     * Unsign and clamp the value to the allowed range
     */
    value = (value < 0n ? -value : value) % full
    
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
    return BigInt(`0x${this.value.subarray(17, 32).toHex()}`)
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
      const full = 1329227995784915872903807060280344576n

      /**
       * Unsign and clamp the value to the allowed range
       */
      value = (value < 0n ? -value : value) % full
      
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
    const full = 340282366920938463463374607431768211456n

    /**
     * Unsign and clamp the value to the allowed range
     */
    value = (value < 0n ? -value : value) % full
    
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
    return BigInt(`0x${this.value.subarray(16, 32).toHex()}`)
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
      const full = 340282366920938463463374607431768211456n

      /**
       * Unsign and clamp the value to the allowed range
       */
      value = (value < 0n ? -value : value) % full
      
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
    const full = 87112285931760246646623899502532662132736n

    /**
     * Unsign and clamp the value to the allowed range
     */
    value = (value < 0n ? -value : value) % full
    
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
    return BigInt(`0x${this.value.subarray(15, 32).toHex()}`)
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
      const full = 87112285931760246646623899502532662132736n

      /**
       * Unsign and clamp the value to the allowed range
       */
      value = (value < 0n ? -value : value) % full
      
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
    const full = 22300745198530623141535718272648361505980416n

    /**
     * Unsign and clamp the value to the allowed range
     */
    value = (value < 0n ? -value : value) % full
    
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
    return BigInt(`0x${this.value.subarray(14, 32).toHex()}`)
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
      const full = 22300745198530623141535718272648361505980416n

      /**
       * Unsign and clamp the value to the allowed range
       */
      value = (value < 0n ? -value : value) % full
      
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
    const full = 5708990770823839524233143877797980545530986496n

    /**
     * Unsign and clamp the value to the allowed range
     */
    value = (value < 0n ? -value : value) % full
    
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
    return BigInt(`0x${this.value.subarray(13, 32).toHex()}`)
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
      const full = 5708990770823839524233143877797980545530986496n

      /**
       * Unsign and clamp the value to the allowed range
       */
      value = (value < 0n ? -value : value) % full
      
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
    const full = 1461501637330902918203684832716283019655932542976n

    /**
     * Unsign and clamp the value to the allowed range
     */
    value = (value < 0n ? -value : value) % full
    
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
    return BigInt(`0x${this.value.subarray(12, 32).toHex()}`)
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
      const full = 1461501637330902918203684832716283019655932542976n

      /**
       * Unsign and clamp the value to the allowed range
       */
      value = (value < 0n ? -value : value) % full
      
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
    const full = 374144419156711147060143317175368453031918731001856n

    /**
     * Unsign and clamp the value to the allowed range
     */
    value = (value < 0n ? -value : value) % full
    
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
    return BigInt(`0x${this.value.subarray(11, 32).toHex()}`)
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
      const full = 374144419156711147060143317175368453031918731001856n

      /**
       * Unsign and clamp the value to the allowed range
       */
      value = (value < 0n ? -value : value) % full
      
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
    const full = 95780971304118053647396689196894323976171195136475136n

    /**
     * Unsign and clamp the value to the allowed range
     */
    value = (value < 0n ? -value : value) % full
    
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
    return BigInt(`0x${this.value.subarray(10, 32).toHex()}`)
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
      const full = 95780971304118053647396689196894323976171195136475136n

      /**
       * Unsign and clamp the value to the allowed range
       */
      value = (value < 0n ? -value : value) % full
      
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
    const full = 24519928653854221733733552434404946937899825954937634816n

    /**
     * Unsign and clamp the value to the allowed range
     */
    value = (value < 0n ? -value : value) % full
    
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
    return BigInt(`0x${this.value.subarray(9, 32).toHex()}`)
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
      const full = 24519928653854221733733552434404946937899825954937634816n

      /**
       * Unsign and clamp the value to the allowed range
       */
      value = (value < 0n ? -value : value) % full
      
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
    const full = 6277101735386680763835789423207666416102355444464034512896n

    /**
     * Unsign and clamp the value to the allowed range
     */
    value = (value < 0n ? -value : value) % full
    
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
    return BigInt(`0x${this.value.subarray(8, 32).toHex()}`)
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
      const full = 6277101735386680763835789423207666416102355444464034512896n

      /**
       * Unsign and clamp the value to the allowed range
       */
      value = (value < 0n ? -value : value) % full
      
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
    const full = 1606938044258990275541962092341162602522202993782792835301376n

    /**
     * Unsign and clamp the value to the allowed range
     */
    value = (value < 0n ? -value : value) % full
    
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
    return BigInt(`0x${this.value.subarray(7, 32).toHex()}`)
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
      const full = 1606938044258990275541962092341162602522202993782792835301376n

      /**
       * Unsign and clamp the value to the allowed range
       */
      value = (value < 0n ? -value : value) % full
      
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
    const full = 411376139330301510538742295639337626245683966408394965837152256n

    /**
     * Unsign and clamp the value to the allowed range
     */
    value = (value < 0n ? -value : value) % full
    
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
    return BigInt(`0x${this.value.subarray(6, 32).toHex()}`)
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
      const full = 411376139330301510538742295639337626245683966408394965837152256n

      /**
       * Unsign and clamp the value to the allowed range
       */
      value = (value < 0n ? -value : value) % full
      
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
    const full = 105312291668557186697918027683670432318895095400549111254310977536n

    /**
     * Unsign and clamp the value to the allowed range
     */
    value = (value < 0n ? -value : value) % full
    
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
    return BigInt(`0x${this.value.subarray(5, 32).toHex()}`)
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
      const full = 105312291668557186697918027683670432318895095400549111254310977536n

      /**
       * Unsign and clamp the value to the allowed range
       */
      value = (value < 0n ? -value : value) % full
      
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
    const full = 26959946667150639794667015087019630673637144422540572481103610249216n

    /**
     * Unsign and clamp the value to the allowed range
     */
    value = (value < 0n ? -value : value) % full
    
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
    return BigInt(`0x${this.value.subarray(4, 32).toHex()}`)
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
      const full = 26959946667150639794667015087019630673637144422540572481103610249216n

      /**
       * Unsign and clamp the value to the allowed range
       */
      value = (value < 0n ? -value : value) % full
      
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
    const full = 6901746346790563787434755862277025452451108972170386555162524223799296n

    /**
     * Unsign and clamp the value to the allowed range
     */
    value = (value < 0n ? -value : value) % full
    
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
    return BigInt(`0x${this.value.subarray(3, 32).toHex()}`)
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
      const full = 6901746346790563787434755862277025452451108972170386555162524223799296n

      /**
       * Unsign and clamp the value to the allowed range
       */
      value = (value < 0n ? -value : value) % full
      
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
    const full = 1766847064778384329583297500742918515827483896875618958121606201292619776n

    /**
     * Unsign and clamp the value to the allowed range
     */
    value = (value < 0n ? -value : value) % full
    
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
    return BigInt(`0x${this.value.subarray(2, 32).toHex()}`)
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
      const full = 1766847064778384329583297500742918515827483896875618958121606201292619776n

      /**
       * Unsign and clamp the value to the allowed range
       */
      value = (value < 0n ? -value : value) % full
      
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
    const full = 452312848583266388373324160190187140051835877600158453279131187530910662656n

    /**
     * Unsign and clamp the value to the allowed range
     */
    value = (value < 0n ? -value : value) % full
    
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
    return BigInt(`0x${this.value.subarray(1, 32).toHex()}`)
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
      const full = 452312848583266388373324160190187140051835877600158453279131187530910662656n

      /**
       * Unsign and clamp the value to the allowed range
       */
      value = (value < 0n ? -value : value) % full
      
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
    const full = 115792089237316195423570985008687907853269984665640564039457584007913129639936n

    /**
     * Unsign and clamp the value to the allowed range
     */
    value = (value < 0n ? -value : value) % full
    
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
    return BigInt(`0x${this.value.subarray(0, 32).toHex()}`)
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
      const full = 115792089237316195423570985008687907853269984665640564039457584007913129639936n

      /**
       * Unsign and clamp the value to the allowed range
       */
      value = (value < 0n ? -value : value) % full
      
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