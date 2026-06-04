import { Cursor } from "@hazae41/cursor"

export class AbiInt8 {

  static readonly kind = "static"

  readonly kind = "static"

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint | number | string) {
    const half = 128n
    const full = 256n

    /**
     * Convert to bigint or throw
     */
    value = BigInt(value)
    
    /**
     * Clamp the value to the allowed range
     */
    value = value % (half + (value < 0n ? 1n : 0n))

    /**
     * Cheap two's complement
     */
    value = (value + full) % full

    /**
     * Determine the padding based on the sign
     */
    const padding = value < half ? "0" : "f"
    
    const hex = value.toString(16).padStart(64, padding)
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
    const half = 128n
    const full = 256n

    const value = BigInt(`0x${this.value.subarray(31, 32).toHex()}`)

    /**
     * Restore the sign based on which half of the range the value falls into
     */
    return value < half ? value : value - full
  }

}
  
export namespace AbiInt8 {
  
  export class Packed {

    readonly kind = "static"
  
    constructor(
      /**
       * 1-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint | number | string) {
      const half = 128n
      const full = 256n

      /**
       * Convert to bigint or throw
       */
      value = BigInt(value)

      /**
       * Clamp the value to the allowed range
       */
      value = value % (half + (value < 0n ? 1n : 0n))

      /**
       * Cheap two's complement
       */
      value = (value + full) % full
      
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
      const half = 128n
      const full = 256n

      const value = BigInt(`0x${this.value.toHex()}`)

      /**
       * Restore the sign based on which half of the range the value falls into
       */
      return value < half ? value : value - full
    }

  }
  
}

export class AbiInt16 {

  static readonly kind = "static"

  readonly kind = "static"

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint | number | string) {
    const half = 32768n
    const full = 65536n

    /**
     * Convert to bigint or throw
     */
    value = BigInt(value)
    
    /**
     * Clamp the value to the allowed range
     */
    value = value % (half + (value < 0n ? 1n : 0n))

    /**
     * Cheap two's complement
     */
    value = (value + full) % full

    /**
     * Determine the padding based on the sign
     */
    const padding = value < half ? "0" : "f"
    
    const hex = value.toString(16).padStart(64, padding)
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
    const half = 32768n
    const full = 65536n

    const value = BigInt(`0x${this.value.subarray(30, 32).toHex()}`)

    /**
     * Restore the sign based on which half of the range the value falls into
     */
    return value < half ? value : value - full
  }

}
  
export namespace AbiInt16 {
  
  export class Packed {

    readonly kind = "static"
  
    constructor(
      /**
       * 2-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint | number | string) {
      const half = 32768n
      const full = 65536n

      /**
       * Convert to bigint or throw
       */
      value = BigInt(value)

      /**
       * Clamp the value to the allowed range
       */
      value = value % (half + (value < 0n ? 1n : 0n))

      /**
       * Cheap two's complement
       */
      value = (value + full) % full
      
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
      const half = 32768n
      const full = 65536n

      const value = BigInt(`0x${this.value.toHex()}`)

      /**
       * Restore the sign based on which half of the range the value falls into
       */
      return value < half ? value : value - full
    }

  }
  
}

export class AbiInt24 {

  static readonly kind = "static"

  readonly kind = "static"

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint | number | string) {
    const half = 8388608n
    const full = 16777216n

    /**
     * Convert to bigint or throw
     */
    value = BigInt(value)
    
    /**
     * Clamp the value to the allowed range
     */
    value = value % (half + (value < 0n ? 1n : 0n))

    /**
     * Cheap two's complement
     */
    value = (value + full) % full

    /**
     * Determine the padding based on the sign
     */
    const padding = value < half ? "0" : "f"
    
    const hex = value.toString(16).padStart(64, padding)
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
    const half = 8388608n
    const full = 16777216n

    const value = BigInt(`0x${this.value.subarray(29, 32).toHex()}`)

    /**
     * Restore the sign based on which half of the range the value falls into
     */
    return value < half ? value : value - full
  }

}
  
export namespace AbiInt24 {
  
  export class Packed {

    readonly kind = "static"
  
    constructor(
      /**
       * 3-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint | number | string) {
      const half = 8388608n
      const full = 16777216n

      /**
       * Convert to bigint or throw
       */
      value = BigInt(value)

      /**
       * Clamp the value to the allowed range
       */
      value = value % (half + (value < 0n ? 1n : 0n))

      /**
       * Cheap two's complement
       */
      value = (value + full) % full
      
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
      const half = 8388608n
      const full = 16777216n

      const value = BigInt(`0x${this.value.toHex()}`)

      /**
       * Restore the sign based on which half of the range the value falls into
       */
      return value < half ? value : value - full
    }

  }
  
}

export class AbiInt32 {

  static readonly kind = "static"

  readonly kind = "static"

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint | number | string) {
    const half = 2147483648n
    const full = 4294967296n

    /**
     * Convert to bigint or throw
     */
    value = BigInt(value)
    
    /**
     * Clamp the value to the allowed range
     */
    value = value % (half + (value < 0n ? 1n : 0n))

    /**
     * Cheap two's complement
     */
    value = (value + full) % full

    /**
     * Determine the padding based on the sign
     */
    const padding = value < half ? "0" : "f"
    
    const hex = value.toString(16).padStart(64, padding)
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
    const half = 2147483648n
    const full = 4294967296n

    const value = BigInt(`0x${this.value.subarray(28, 32).toHex()}`)

    /**
     * Restore the sign based on which half of the range the value falls into
     */
    return value < half ? value : value - full
  }

}
  
export namespace AbiInt32 {
  
  export class Packed {

    readonly kind = "static"
  
    constructor(
      /**
       * 4-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint | number | string) {
      const half = 2147483648n
      const full = 4294967296n

      /**
       * Convert to bigint or throw
       */
      value = BigInt(value)

      /**
       * Clamp the value to the allowed range
       */
      value = value % (half + (value < 0n ? 1n : 0n))

      /**
       * Cheap two's complement
       */
      value = (value + full) % full
      
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
      const half = 2147483648n
      const full = 4294967296n

      const value = BigInt(`0x${this.value.toHex()}`)

      /**
       * Restore the sign based on which half of the range the value falls into
       */
      return value < half ? value : value - full
    }

  }
  
}

export class AbiInt40 {

  static readonly kind = "static"

  readonly kind = "static"

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint | number | string) {
    const half = 549755813888n
    const full = 1099511627776n

    /**
     * Convert to bigint or throw
     */
    value = BigInt(value)
    
    /**
     * Clamp the value to the allowed range
     */
    value = value % (half + (value < 0n ? 1n : 0n))

    /**
     * Cheap two's complement
     */
    value = (value + full) % full

    /**
     * Determine the padding based on the sign
     */
    const padding = value < half ? "0" : "f"
    
    const hex = value.toString(16).padStart(64, padding)
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
    const half = 549755813888n
    const full = 1099511627776n

    const value = BigInt(`0x${this.value.subarray(27, 32).toHex()}`)

    /**
     * Restore the sign based on which half of the range the value falls into
     */
    return value < half ? value : value - full
  }

}
  
export namespace AbiInt40 {
  
  export class Packed {

    readonly kind = "static"
  
    constructor(
      /**
       * 5-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint | number | string) {
      const half = 549755813888n
      const full = 1099511627776n

      /**
       * Convert to bigint or throw
       */
      value = BigInt(value)

      /**
       * Clamp the value to the allowed range
       */
      value = value % (half + (value < 0n ? 1n : 0n))

      /**
       * Cheap two's complement
       */
      value = (value + full) % full
      
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
      const half = 549755813888n
      const full = 1099511627776n

      const value = BigInt(`0x${this.value.toHex()}`)

      /**
       * Restore the sign based on which half of the range the value falls into
       */
      return value < half ? value : value - full
    }

  }
  
}

export class AbiInt48 {

  static readonly kind = "static"

  readonly kind = "static"

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint | number | string) {
    const half = 140737488355328n
    const full = 281474976710656n

    /**
     * Convert to bigint or throw
     */
    value = BigInt(value)
    
    /**
     * Clamp the value to the allowed range
     */
    value = value % (half + (value < 0n ? 1n : 0n))

    /**
     * Cheap two's complement
     */
    value = (value + full) % full

    /**
     * Determine the padding based on the sign
     */
    const padding = value < half ? "0" : "f"
    
    const hex = value.toString(16).padStart(64, padding)
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
    const half = 140737488355328n
    const full = 281474976710656n

    const value = BigInt(`0x${this.value.subarray(26, 32).toHex()}`)

    /**
     * Restore the sign based on which half of the range the value falls into
     */
    return value < half ? value : value - full
  }

}
  
export namespace AbiInt48 {
  
  export class Packed {

    readonly kind = "static"
  
    constructor(
      /**
       * 6-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint | number | string) {
      const half = 140737488355328n
      const full = 281474976710656n

      /**
       * Convert to bigint or throw
       */
      value = BigInt(value)

      /**
       * Clamp the value to the allowed range
       */
      value = value % (half + (value < 0n ? 1n : 0n))

      /**
       * Cheap two's complement
       */
      value = (value + full) % full
      
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
      const half = 140737488355328n
      const full = 281474976710656n

      const value = BigInt(`0x${this.value.toHex()}`)

      /**
       * Restore the sign based on which half of the range the value falls into
       */
      return value < half ? value : value - full
    }

  }
  
}

export class AbiInt56 {

  static readonly kind = "static"

  readonly kind = "static"

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint | number | string) {
    const half = 36028797018963968n
    const full = 72057594037927936n

    /**
     * Convert to bigint or throw
     */
    value = BigInt(value)
    
    /**
     * Clamp the value to the allowed range
     */
    value = value % (half + (value < 0n ? 1n : 0n))

    /**
     * Cheap two's complement
     */
    value = (value + full) % full

    /**
     * Determine the padding based on the sign
     */
    const padding = value < half ? "0" : "f"
    
    const hex = value.toString(16).padStart(64, padding)
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
    const half = 36028797018963968n
    const full = 72057594037927936n

    const value = BigInt(`0x${this.value.subarray(25, 32).toHex()}`)

    /**
     * Restore the sign based on which half of the range the value falls into
     */
    return value < half ? value : value - full
  }

}
  
export namespace AbiInt56 {
  
  export class Packed {

    readonly kind = "static"
  
    constructor(
      /**
       * 7-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint | number | string) {
      const half = 36028797018963968n
      const full = 72057594037927936n

      /**
       * Convert to bigint or throw
       */
      value = BigInt(value)

      /**
       * Clamp the value to the allowed range
       */
      value = value % (half + (value < 0n ? 1n : 0n))

      /**
       * Cheap two's complement
       */
      value = (value + full) % full
      
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
      const half = 36028797018963968n
      const full = 72057594037927936n

      const value = BigInt(`0x${this.value.toHex()}`)

      /**
       * Restore the sign based on which half of the range the value falls into
       */
      return value < half ? value : value - full
    }

  }
  
}

export class AbiInt64 {

  static readonly kind = "static"

  readonly kind = "static"

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint | number | string) {
    const half = 9223372036854775808n
    const full = 18446744073709551616n

    /**
     * Convert to bigint or throw
     */
    value = BigInt(value)
    
    /**
     * Clamp the value to the allowed range
     */
    value = value % (half + (value < 0n ? 1n : 0n))

    /**
     * Cheap two's complement
     */
    value = (value + full) % full

    /**
     * Determine the padding based on the sign
     */
    const padding = value < half ? "0" : "f"
    
    const hex = value.toString(16).padStart(64, padding)
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
    const half = 9223372036854775808n
    const full = 18446744073709551616n

    const value = BigInt(`0x${this.value.subarray(24, 32).toHex()}`)

    /**
     * Restore the sign based on which half of the range the value falls into
     */
    return value < half ? value : value - full
  }

}
  
export namespace AbiInt64 {
  
  export class Packed {

    readonly kind = "static"
  
    constructor(
      /**
       * 8-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint | number | string) {
      const half = 9223372036854775808n
      const full = 18446744073709551616n

      /**
       * Convert to bigint or throw
       */
      value = BigInt(value)

      /**
       * Clamp the value to the allowed range
       */
      value = value % (half + (value < 0n ? 1n : 0n))

      /**
       * Cheap two's complement
       */
      value = (value + full) % full
      
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
      const half = 9223372036854775808n
      const full = 18446744073709551616n

      const value = BigInt(`0x${this.value.toHex()}`)

      /**
       * Restore the sign based on which half of the range the value falls into
       */
      return value < half ? value : value - full
    }

  }
  
}

export class AbiInt72 {

  static readonly kind = "static"

  readonly kind = "static"

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint | number | string) {
    const half = 2361183241434822606848n
    const full = 4722366482869645213696n

    /**
     * Convert to bigint or throw
     */
    value = BigInt(value)
    
    /**
     * Clamp the value to the allowed range
     */
    value = value % (half + (value < 0n ? 1n : 0n))

    /**
     * Cheap two's complement
     */
    value = (value + full) % full

    /**
     * Determine the padding based on the sign
     */
    const padding = value < half ? "0" : "f"
    
    const hex = value.toString(16).padStart(64, padding)
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
    const half = 2361183241434822606848n
    const full = 4722366482869645213696n

    const value = BigInt(`0x${this.value.subarray(23, 32).toHex()}`)

    /**
     * Restore the sign based on which half of the range the value falls into
     */
    return value < half ? value : value - full
  }

}
  
export namespace AbiInt72 {
  
  export class Packed {

    readonly kind = "static"
  
    constructor(
      /**
       * 9-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint | number | string) {
      const half = 2361183241434822606848n
      const full = 4722366482869645213696n

      /**
       * Convert to bigint or throw
       */
      value = BigInt(value)

      /**
       * Clamp the value to the allowed range
       */
      value = value % (half + (value < 0n ? 1n : 0n))

      /**
       * Cheap two's complement
       */
      value = (value + full) % full
      
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
      const half = 2361183241434822606848n
      const full = 4722366482869645213696n

      const value = BigInt(`0x${this.value.toHex()}`)

      /**
       * Restore the sign based on which half of the range the value falls into
       */
      return value < half ? value : value - full
    }

  }
  
}

export class AbiInt80 {

  static readonly kind = "static"

  readonly kind = "static"

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint | number | string) {
    const half = 604462909807314587353088n
    const full = 1208925819614629174706176n

    /**
     * Convert to bigint or throw
     */
    value = BigInt(value)
    
    /**
     * Clamp the value to the allowed range
     */
    value = value % (half + (value < 0n ? 1n : 0n))

    /**
     * Cheap two's complement
     */
    value = (value + full) % full

    /**
     * Determine the padding based on the sign
     */
    const padding = value < half ? "0" : "f"
    
    const hex = value.toString(16).padStart(64, padding)
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
    const half = 604462909807314587353088n
    const full = 1208925819614629174706176n

    const value = BigInt(`0x${this.value.subarray(22, 32).toHex()}`)

    /**
     * Restore the sign based on which half of the range the value falls into
     */
    return value < half ? value : value - full
  }

}
  
export namespace AbiInt80 {
  
  export class Packed {

    readonly kind = "static"
  
    constructor(
      /**
       * 10-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint | number | string) {
      const half = 604462909807314587353088n
      const full = 1208925819614629174706176n

      /**
       * Convert to bigint or throw
       */
      value = BigInt(value)

      /**
       * Clamp the value to the allowed range
       */
      value = value % (half + (value < 0n ? 1n : 0n))

      /**
       * Cheap two's complement
       */
      value = (value + full) % full
      
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
      const half = 604462909807314587353088n
      const full = 1208925819614629174706176n

      const value = BigInt(`0x${this.value.toHex()}`)

      /**
       * Restore the sign based on which half of the range the value falls into
       */
      return value < half ? value : value - full
    }

  }
  
}

export class AbiInt88 {

  static readonly kind = "static"

  readonly kind = "static"

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint | number | string) {
    const half = 154742504910672534362390528n
    const full = 309485009821345068724781056n

    /**
     * Convert to bigint or throw
     */
    value = BigInt(value)
    
    /**
     * Clamp the value to the allowed range
     */
    value = value % (half + (value < 0n ? 1n : 0n))

    /**
     * Cheap two's complement
     */
    value = (value + full) % full

    /**
     * Determine the padding based on the sign
     */
    const padding = value < half ? "0" : "f"
    
    const hex = value.toString(16).padStart(64, padding)
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
    const half = 154742504910672534362390528n
    const full = 309485009821345068724781056n

    const value = BigInt(`0x${this.value.subarray(21, 32).toHex()}`)

    /**
     * Restore the sign based on which half of the range the value falls into
     */
    return value < half ? value : value - full
  }

}
  
export namespace AbiInt88 {
  
  export class Packed {

    readonly kind = "static"
  
    constructor(
      /**
       * 11-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint | number | string) {
      const half = 154742504910672534362390528n
      const full = 309485009821345068724781056n

      /**
       * Convert to bigint or throw
       */
      value = BigInt(value)

      /**
       * Clamp the value to the allowed range
       */
      value = value % (half + (value < 0n ? 1n : 0n))

      /**
       * Cheap two's complement
       */
      value = (value + full) % full
      
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
      const half = 154742504910672534362390528n
      const full = 309485009821345068724781056n

      const value = BigInt(`0x${this.value.toHex()}`)

      /**
       * Restore the sign based on which half of the range the value falls into
       */
      return value < half ? value : value - full
    }

  }
  
}

export class AbiInt96 {

  static readonly kind = "static"

  readonly kind = "static"

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint | number | string) {
    const half = 39614081257132168796771975168n
    const full = 79228162514264337593543950336n

    /**
     * Convert to bigint or throw
     */
    value = BigInt(value)
    
    /**
     * Clamp the value to the allowed range
     */
    value = value % (half + (value < 0n ? 1n : 0n))

    /**
     * Cheap two's complement
     */
    value = (value + full) % full

    /**
     * Determine the padding based on the sign
     */
    const padding = value < half ? "0" : "f"
    
    const hex = value.toString(16).padStart(64, padding)
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
    const half = 39614081257132168796771975168n
    const full = 79228162514264337593543950336n

    const value = BigInt(`0x${this.value.subarray(20, 32).toHex()}`)

    /**
     * Restore the sign based on which half of the range the value falls into
     */
    return value < half ? value : value - full
  }

}
  
export namespace AbiInt96 {
  
  export class Packed {

    readonly kind = "static"
  
    constructor(
      /**
       * 12-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint | number | string) {
      const half = 39614081257132168796771975168n
      const full = 79228162514264337593543950336n

      /**
       * Convert to bigint or throw
       */
      value = BigInt(value)

      /**
       * Clamp the value to the allowed range
       */
      value = value % (half + (value < 0n ? 1n : 0n))

      /**
       * Cheap two's complement
       */
      value = (value + full) % full
      
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
      const half = 39614081257132168796771975168n
      const full = 79228162514264337593543950336n

      const value = BigInt(`0x${this.value.toHex()}`)

      /**
       * Restore the sign based on which half of the range the value falls into
       */
      return value < half ? value : value - full
    }

  }
  
}

export class AbiInt104 {

  static readonly kind = "static"

  readonly kind = "static"

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint | number | string) {
    const half = 10141204801825835211973625643008n
    const full = 20282409603651670423947251286016n

    /**
     * Convert to bigint or throw
     */
    value = BigInt(value)
    
    /**
     * Clamp the value to the allowed range
     */
    value = value % (half + (value < 0n ? 1n : 0n))

    /**
     * Cheap two's complement
     */
    value = (value + full) % full

    /**
     * Determine the padding based on the sign
     */
    const padding = value < half ? "0" : "f"
    
    const hex = value.toString(16).padStart(64, padding)
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
    const half = 10141204801825835211973625643008n
    const full = 20282409603651670423947251286016n

    const value = BigInt(`0x${this.value.subarray(19, 32).toHex()}`)

    /**
     * Restore the sign based on which half of the range the value falls into
     */
    return value < half ? value : value - full
  }

}
  
export namespace AbiInt104 {
  
  export class Packed {

    readonly kind = "static"
  
    constructor(
      /**
       * 13-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint | number | string) {
      const half = 10141204801825835211973625643008n
      const full = 20282409603651670423947251286016n

      /**
       * Convert to bigint or throw
       */
      value = BigInt(value)

      /**
       * Clamp the value to the allowed range
       */
      value = value % (half + (value < 0n ? 1n : 0n))

      /**
       * Cheap two's complement
       */
      value = (value + full) % full
      
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
      const half = 10141204801825835211973625643008n
      const full = 20282409603651670423947251286016n

      const value = BigInt(`0x${this.value.toHex()}`)

      /**
       * Restore the sign based on which half of the range the value falls into
       */
      return value < half ? value : value - full
    }

  }
  
}

export class AbiInt112 {

  static readonly kind = "static"

  readonly kind = "static"

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint | number | string) {
    const half = 2596148429267413814265248164610048n
    const full = 5192296858534827628530496329220096n

    /**
     * Convert to bigint or throw
     */
    value = BigInt(value)
    
    /**
     * Clamp the value to the allowed range
     */
    value = value % (half + (value < 0n ? 1n : 0n))

    /**
     * Cheap two's complement
     */
    value = (value + full) % full

    /**
     * Determine the padding based on the sign
     */
    const padding = value < half ? "0" : "f"
    
    const hex = value.toString(16).padStart(64, padding)
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
    const half = 2596148429267413814265248164610048n
    const full = 5192296858534827628530496329220096n

    const value = BigInt(`0x${this.value.subarray(18, 32).toHex()}`)

    /**
     * Restore the sign based on which half of the range the value falls into
     */
    return value < half ? value : value - full
  }

}
  
export namespace AbiInt112 {
  
  export class Packed {

    readonly kind = "static"
  
    constructor(
      /**
       * 14-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint | number | string) {
      const half = 2596148429267413814265248164610048n
      const full = 5192296858534827628530496329220096n

      /**
       * Convert to bigint or throw
       */
      value = BigInt(value)

      /**
       * Clamp the value to the allowed range
       */
      value = value % (half + (value < 0n ? 1n : 0n))

      /**
       * Cheap two's complement
       */
      value = (value + full) % full
      
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
      const half = 2596148429267413814265248164610048n
      const full = 5192296858534827628530496329220096n

      const value = BigInt(`0x${this.value.toHex()}`)

      /**
       * Restore the sign based on which half of the range the value falls into
       */
      return value < half ? value : value - full
    }

  }
  
}

export class AbiInt120 {

  static readonly kind = "static"

  readonly kind = "static"

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint | number | string) {
    const half = 664613997892457936451903530140172288n
    const full = 1329227995784915872903807060280344576n

    /**
     * Convert to bigint or throw
     */
    value = BigInt(value)
    
    /**
     * Clamp the value to the allowed range
     */
    value = value % (half + (value < 0n ? 1n : 0n))

    /**
     * Cheap two's complement
     */
    value = (value + full) % full

    /**
     * Determine the padding based on the sign
     */
    const padding = value < half ? "0" : "f"
    
    const hex = value.toString(16).padStart(64, padding)
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
    const half = 664613997892457936451903530140172288n
    const full = 1329227995784915872903807060280344576n

    const value = BigInt(`0x${this.value.subarray(17, 32).toHex()}`)

    /**
     * Restore the sign based on which half of the range the value falls into
     */
    return value < half ? value : value - full
  }

}
  
export namespace AbiInt120 {
  
  export class Packed {

    readonly kind = "static"
  
    constructor(
      /**
       * 15-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint | number | string) {
      const half = 664613997892457936451903530140172288n
      const full = 1329227995784915872903807060280344576n

      /**
       * Convert to bigint or throw
       */
      value = BigInt(value)

      /**
       * Clamp the value to the allowed range
       */
      value = value % (half + (value < 0n ? 1n : 0n))

      /**
       * Cheap two's complement
       */
      value = (value + full) % full
      
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
      const half = 664613997892457936451903530140172288n
      const full = 1329227995784915872903807060280344576n

      const value = BigInt(`0x${this.value.toHex()}`)

      /**
       * Restore the sign based on which half of the range the value falls into
       */
      return value < half ? value : value - full
    }

  }
  
}

export class AbiInt128 {

  static readonly kind = "static"

  readonly kind = "static"

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint | number | string) {
    const half = 170141183460469231731687303715884105728n
    const full = 340282366920938463463374607431768211456n

    /**
     * Convert to bigint or throw
     */
    value = BigInt(value)
    
    /**
     * Clamp the value to the allowed range
     */
    value = value % (half + (value < 0n ? 1n : 0n))

    /**
     * Cheap two's complement
     */
    value = (value + full) % full

    /**
     * Determine the padding based on the sign
     */
    const padding = value < half ? "0" : "f"
    
    const hex = value.toString(16).padStart(64, padding)
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
    const half = 170141183460469231731687303715884105728n
    const full = 340282366920938463463374607431768211456n

    const value = BigInt(`0x${this.value.subarray(16, 32).toHex()}`)

    /**
     * Restore the sign based on which half of the range the value falls into
     */
    return value < half ? value : value - full
  }

}
  
export namespace AbiInt128 {
  
  export class Packed {

    readonly kind = "static"
  
    constructor(
      /**
       * 16-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint | number | string) {
      const half = 170141183460469231731687303715884105728n
      const full = 340282366920938463463374607431768211456n

      /**
       * Convert to bigint or throw
       */
      value = BigInt(value)

      /**
       * Clamp the value to the allowed range
       */
      value = value % (half + (value < 0n ? 1n : 0n))

      /**
       * Cheap two's complement
       */
      value = (value + full) % full
      
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
      const half = 170141183460469231731687303715884105728n
      const full = 340282366920938463463374607431768211456n

      const value = BigInt(`0x${this.value.toHex()}`)

      /**
       * Restore the sign based on which half of the range the value falls into
       */
      return value < half ? value : value - full
    }

  }
  
}

export class AbiInt136 {

  static readonly kind = "static"

  readonly kind = "static"

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint | number | string) {
    const half = 43556142965880123323311949751266331066368n
    const full = 87112285931760246646623899502532662132736n

    /**
     * Convert to bigint or throw
     */
    value = BigInt(value)
    
    /**
     * Clamp the value to the allowed range
     */
    value = value % (half + (value < 0n ? 1n : 0n))

    /**
     * Cheap two's complement
     */
    value = (value + full) % full

    /**
     * Determine the padding based on the sign
     */
    const padding = value < half ? "0" : "f"
    
    const hex = value.toString(16).padStart(64, padding)
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
    const half = 43556142965880123323311949751266331066368n
    const full = 87112285931760246646623899502532662132736n

    const value = BigInt(`0x${this.value.subarray(15, 32).toHex()}`)

    /**
     * Restore the sign based on which half of the range the value falls into
     */
    return value < half ? value : value - full
  }

}
  
export namespace AbiInt136 {
  
  export class Packed {

    readonly kind = "static"
  
    constructor(
      /**
       * 17-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint | number | string) {
      const half = 43556142965880123323311949751266331066368n
      const full = 87112285931760246646623899502532662132736n

      /**
       * Convert to bigint or throw
       */
      value = BigInt(value)

      /**
       * Clamp the value to the allowed range
       */
      value = value % (half + (value < 0n ? 1n : 0n))

      /**
       * Cheap two's complement
       */
      value = (value + full) % full
      
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
      const half = 43556142965880123323311949751266331066368n
      const full = 87112285931760246646623899502532662132736n

      const value = BigInt(`0x${this.value.toHex()}`)

      /**
       * Restore the sign based on which half of the range the value falls into
       */
      return value < half ? value : value - full
    }

  }
  
}

export class AbiInt144 {

  static readonly kind = "static"

  readonly kind = "static"

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint | number | string) {
    const half = 11150372599265311570767859136324180752990208n
    const full = 22300745198530623141535718272648361505980416n

    /**
     * Convert to bigint or throw
     */
    value = BigInt(value)
    
    /**
     * Clamp the value to the allowed range
     */
    value = value % (half + (value < 0n ? 1n : 0n))

    /**
     * Cheap two's complement
     */
    value = (value + full) % full

    /**
     * Determine the padding based on the sign
     */
    const padding = value < half ? "0" : "f"
    
    const hex = value.toString(16).padStart(64, padding)
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
    const half = 11150372599265311570767859136324180752990208n
    const full = 22300745198530623141535718272648361505980416n

    const value = BigInt(`0x${this.value.subarray(14, 32).toHex()}`)

    /**
     * Restore the sign based on which half of the range the value falls into
     */
    return value < half ? value : value - full
  }

}
  
export namespace AbiInt144 {
  
  export class Packed {

    readonly kind = "static"
  
    constructor(
      /**
       * 18-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint | number | string) {
      const half = 11150372599265311570767859136324180752990208n
      const full = 22300745198530623141535718272648361505980416n

      /**
       * Convert to bigint or throw
       */
      value = BigInt(value)

      /**
       * Clamp the value to the allowed range
       */
      value = value % (half + (value < 0n ? 1n : 0n))

      /**
       * Cheap two's complement
       */
      value = (value + full) % full
      
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
      const half = 11150372599265311570767859136324180752990208n
      const full = 22300745198530623141535718272648361505980416n

      const value = BigInt(`0x${this.value.toHex()}`)

      /**
       * Restore the sign based on which half of the range the value falls into
       */
      return value < half ? value : value - full
    }

  }
  
}

export class AbiInt152 {

  static readonly kind = "static"

  readonly kind = "static"

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint | number | string) {
    const half = 2854495385411919762116571938898990272765493248n
    const full = 5708990770823839524233143877797980545530986496n

    /**
     * Convert to bigint or throw
     */
    value = BigInt(value)
    
    /**
     * Clamp the value to the allowed range
     */
    value = value % (half + (value < 0n ? 1n : 0n))

    /**
     * Cheap two's complement
     */
    value = (value + full) % full

    /**
     * Determine the padding based on the sign
     */
    const padding = value < half ? "0" : "f"
    
    const hex = value.toString(16).padStart(64, padding)
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
    const half = 2854495385411919762116571938898990272765493248n
    const full = 5708990770823839524233143877797980545530986496n

    const value = BigInt(`0x${this.value.subarray(13, 32).toHex()}`)

    /**
     * Restore the sign based on which half of the range the value falls into
     */
    return value < half ? value : value - full
  }

}
  
export namespace AbiInt152 {
  
  export class Packed {

    readonly kind = "static"
  
    constructor(
      /**
       * 19-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint | number | string) {
      const half = 2854495385411919762116571938898990272765493248n
      const full = 5708990770823839524233143877797980545530986496n

      /**
       * Convert to bigint or throw
       */
      value = BigInt(value)

      /**
       * Clamp the value to the allowed range
       */
      value = value % (half + (value < 0n ? 1n : 0n))

      /**
       * Cheap two's complement
       */
      value = (value + full) % full
      
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
      const half = 2854495385411919762116571938898990272765493248n
      const full = 5708990770823839524233143877797980545530986496n

      const value = BigInt(`0x${this.value.toHex()}`)

      /**
       * Restore the sign based on which half of the range the value falls into
       */
      return value < half ? value : value - full
    }

  }
  
}

export class AbiInt160 {

  static readonly kind = "static"

  readonly kind = "static"

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint | number | string) {
    const half = 730750818665451459101842416358141509827966271488n
    const full = 1461501637330902918203684832716283019655932542976n

    /**
     * Convert to bigint or throw
     */
    value = BigInt(value)
    
    /**
     * Clamp the value to the allowed range
     */
    value = value % (half + (value < 0n ? 1n : 0n))

    /**
     * Cheap two's complement
     */
    value = (value + full) % full

    /**
     * Determine the padding based on the sign
     */
    const padding = value < half ? "0" : "f"
    
    const hex = value.toString(16).padStart(64, padding)
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
    const half = 730750818665451459101842416358141509827966271488n
    const full = 1461501637330902918203684832716283019655932542976n

    const value = BigInt(`0x${this.value.subarray(12, 32).toHex()}`)

    /**
     * Restore the sign based on which half of the range the value falls into
     */
    return value < half ? value : value - full
  }

}
  
export namespace AbiInt160 {
  
  export class Packed {

    readonly kind = "static"
  
    constructor(
      /**
       * 20-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint | number | string) {
      const half = 730750818665451459101842416358141509827966271488n
      const full = 1461501637330902918203684832716283019655932542976n

      /**
       * Convert to bigint or throw
       */
      value = BigInt(value)

      /**
       * Clamp the value to the allowed range
       */
      value = value % (half + (value < 0n ? 1n : 0n))

      /**
       * Cheap two's complement
       */
      value = (value + full) % full
      
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
      const half = 730750818665451459101842416358141509827966271488n
      const full = 1461501637330902918203684832716283019655932542976n

      const value = BigInt(`0x${this.value.toHex()}`)

      /**
       * Restore the sign based on which half of the range the value falls into
       */
      return value < half ? value : value - full
    }

  }
  
}

export class AbiInt168 {

  static readonly kind = "static"

  readonly kind = "static"

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint | number | string) {
    const half = 187072209578355573530071658587684226515959365500928n
    const full = 374144419156711147060143317175368453031918731001856n

    /**
     * Convert to bigint or throw
     */
    value = BigInt(value)
    
    /**
     * Clamp the value to the allowed range
     */
    value = value % (half + (value < 0n ? 1n : 0n))

    /**
     * Cheap two's complement
     */
    value = (value + full) % full

    /**
     * Determine the padding based on the sign
     */
    const padding = value < half ? "0" : "f"
    
    const hex = value.toString(16).padStart(64, padding)
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
    const half = 187072209578355573530071658587684226515959365500928n
    const full = 374144419156711147060143317175368453031918731001856n

    const value = BigInt(`0x${this.value.subarray(11, 32).toHex()}`)

    /**
     * Restore the sign based on which half of the range the value falls into
     */
    return value < half ? value : value - full
  }

}
  
export namespace AbiInt168 {
  
  export class Packed {

    readonly kind = "static"
  
    constructor(
      /**
       * 21-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint | number | string) {
      const half = 187072209578355573530071658587684226515959365500928n
      const full = 374144419156711147060143317175368453031918731001856n

      /**
       * Convert to bigint or throw
       */
      value = BigInt(value)

      /**
       * Clamp the value to the allowed range
       */
      value = value % (half + (value < 0n ? 1n : 0n))

      /**
       * Cheap two's complement
       */
      value = (value + full) % full
      
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
      const half = 187072209578355573530071658587684226515959365500928n
      const full = 374144419156711147060143317175368453031918731001856n

      const value = BigInt(`0x${this.value.toHex()}`)

      /**
       * Restore the sign based on which half of the range the value falls into
       */
      return value < half ? value : value - full
    }

  }
  
}

export class AbiInt176 {

  static readonly kind = "static"

  readonly kind = "static"

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint | number | string) {
    const half = 47890485652059026823698344598447161988085597568237568n
    const full = 95780971304118053647396689196894323976171195136475136n

    /**
     * Convert to bigint or throw
     */
    value = BigInt(value)
    
    /**
     * Clamp the value to the allowed range
     */
    value = value % (half + (value < 0n ? 1n : 0n))

    /**
     * Cheap two's complement
     */
    value = (value + full) % full

    /**
     * Determine the padding based on the sign
     */
    const padding = value < half ? "0" : "f"
    
    const hex = value.toString(16).padStart(64, padding)
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
    const half = 47890485652059026823698344598447161988085597568237568n
    const full = 95780971304118053647396689196894323976171195136475136n

    const value = BigInt(`0x${this.value.subarray(10, 32).toHex()}`)

    /**
     * Restore the sign based on which half of the range the value falls into
     */
    return value < half ? value : value - full
  }

}
  
export namespace AbiInt176 {
  
  export class Packed {

    readonly kind = "static"
  
    constructor(
      /**
       * 22-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint | number | string) {
      const half = 47890485652059026823698344598447161988085597568237568n
      const full = 95780971304118053647396689196894323976171195136475136n

      /**
       * Convert to bigint or throw
       */
      value = BigInt(value)

      /**
       * Clamp the value to the allowed range
       */
      value = value % (half + (value < 0n ? 1n : 0n))

      /**
       * Cheap two's complement
       */
      value = (value + full) % full
      
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
      const half = 47890485652059026823698344598447161988085597568237568n
      const full = 95780971304118053647396689196894323976171195136475136n

      const value = BigInt(`0x${this.value.toHex()}`)

      /**
       * Restore the sign based on which half of the range the value falls into
       */
      return value < half ? value : value - full
    }

  }
  
}

export class AbiInt184 {

  static readonly kind = "static"

  readonly kind = "static"

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint | number | string) {
    const half = 12259964326927110866866776217202473468949912977468817408n
    const full = 24519928653854221733733552434404946937899825954937634816n

    /**
     * Convert to bigint or throw
     */
    value = BigInt(value)
    
    /**
     * Clamp the value to the allowed range
     */
    value = value % (half + (value < 0n ? 1n : 0n))

    /**
     * Cheap two's complement
     */
    value = (value + full) % full

    /**
     * Determine the padding based on the sign
     */
    const padding = value < half ? "0" : "f"
    
    const hex = value.toString(16).padStart(64, padding)
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
    const half = 12259964326927110866866776217202473468949912977468817408n
    const full = 24519928653854221733733552434404946937899825954937634816n

    const value = BigInt(`0x${this.value.subarray(9, 32).toHex()}`)

    /**
     * Restore the sign based on which half of the range the value falls into
     */
    return value < half ? value : value - full
  }

}
  
export namespace AbiInt184 {
  
  export class Packed {

    readonly kind = "static"
  
    constructor(
      /**
       * 23-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint | number | string) {
      const half = 12259964326927110866866776217202473468949912977468817408n
      const full = 24519928653854221733733552434404946937899825954937634816n

      /**
       * Convert to bigint or throw
       */
      value = BigInt(value)

      /**
       * Clamp the value to the allowed range
       */
      value = value % (half + (value < 0n ? 1n : 0n))

      /**
       * Cheap two's complement
       */
      value = (value + full) % full
      
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
      const half = 12259964326927110866866776217202473468949912977468817408n
      const full = 24519928653854221733733552434404946937899825954937634816n

      const value = BigInt(`0x${this.value.toHex()}`)

      /**
       * Restore the sign based on which half of the range the value falls into
       */
      return value < half ? value : value - full
    }

  }
  
}

export class AbiInt192 {

  static readonly kind = "static"

  readonly kind = "static"

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint | number | string) {
    const half = 3138550867693340381917894711603833208051177722232017256448n
    const full = 6277101735386680763835789423207666416102355444464034512896n

    /**
     * Convert to bigint or throw
     */
    value = BigInt(value)
    
    /**
     * Clamp the value to the allowed range
     */
    value = value % (half + (value < 0n ? 1n : 0n))

    /**
     * Cheap two's complement
     */
    value = (value + full) % full

    /**
     * Determine the padding based on the sign
     */
    const padding = value < half ? "0" : "f"
    
    const hex = value.toString(16).padStart(64, padding)
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
    const half = 3138550867693340381917894711603833208051177722232017256448n
    const full = 6277101735386680763835789423207666416102355444464034512896n

    const value = BigInt(`0x${this.value.subarray(8, 32).toHex()}`)

    /**
     * Restore the sign based on which half of the range the value falls into
     */
    return value < half ? value : value - full
  }

}
  
export namespace AbiInt192 {
  
  export class Packed {

    readonly kind = "static"
  
    constructor(
      /**
       * 24-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint | number | string) {
      const half = 3138550867693340381917894711603833208051177722232017256448n
      const full = 6277101735386680763835789423207666416102355444464034512896n

      /**
       * Convert to bigint or throw
       */
      value = BigInt(value)

      /**
       * Clamp the value to the allowed range
       */
      value = value % (half + (value < 0n ? 1n : 0n))

      /**
       * Cheap two's complement
       */
      value = (value + full) % full
      
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
      const half = 3138550867693340381917894711603833208051177722232017256448n
      const full = 6277101735386680763835789423207666416102355444464034512896n

      const value = BigInt(`0x${this.value.toHex()}`)

      /**
       * Restore the sign based on which half of the range the value falls into
       */
      return value < half ? value : value - full
    }

  }
  
}

export class AbiInt200 {

  static readonly kind = "static"

  readonly kind = "static"

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint | number | string) {
    const half = 803469022129495137770981046170581301261101496891396417650688n
    const full = 1606938044258990275541962092341162602522202993782792835301376n

    /**
     * Convert to bigint or throw
     */
    value = BigInt(value)
    
    /**
     * Clamp the value to the allowed range
     */
    value = value % (half + (value < 0n ? 1n : 0n))

    /**
     * Cheap two's complement
     */
    value = (value + full) % full

    /**
     * Determine the padding based on the sign
     */
    const padding = value < half ? "0" : "f"
    
    const hex = value.toString(16).padStart(64, padding)
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
    const half = 803469022129495137770981046170581301261101496891396417650688n
    const full = 1606938044258990275541962092341162602522202993782792835301376n

    const value = BigInt(`0x${this.value.subarray(7, 32).toHex()}`)

    /**
     * Restore the sign based on which half of the range the value falls into
     */
    return value < half ? value : value - full
  }

}
  
export namespace AbiInt200 {
  
  export class Packed {

    readonly kind = "static"
  
    constructor(
      /**
       * 25-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint | number | string) {
      const half = 803469022129495137770981046170581301261101496891396417650688n
      const full = 1606938044258990275541962092341162602522202993782792835301376n

      /**
       * Convert to bigint or throw
       */
      value = BigInt(value)

      /**
       * Clamp the value to the allowed range
       */
      value = value % (half + (value < 0n ? 1n : 0n))

      /**
       * Cheap two's complement
       */
      value = (value + full) % full
      
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
      const half = 803469022129495137770981046170581301261101496891396417650688n
      const full = 1606938044258990275541962092341162602522202993782792835301376n

      const value = BigInt(`0x${this.value.toHex()}`)

      /**
       * Restore the sign based on which half of the range the value falls into
       */
      return value < half ? value : value - full
    }

  }
  
}

export class AbiInt208 {

  static readonly kind = "static"

  readonly kind = "static"

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint | number | string) {
    const half = 205688069665150755269371147819668813122841983204197482918576128n
    const full = 411376139330301510538742295639337626245683966408394965837152256n

    /**
     * Convert to bigint or throw
     */
    value = BigInt(value)
    
    /**
     * Clamp the value to the allowed range
     */
    value = value % (half + (value < 0n ? 1n : 0n))

    /**
     * Cheap two's complement
     */
    value = (value + full) % full

    /**
     * Determine the padding based on the sign
     */
    const padding = value < half ? "0" : "f"
    
    const hex = value.toString(16).padStart(64, padding)
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
    const half = 205688069665150755269371147819668813122841983204197482918576128n
    const full = 411376139330301510538742295639337626245683966408394965837152256n

    const value = BigInt(`0x${this.value.subarray(6, 32).toHex()}`)

    /**
     * Restore the sign based on which half of the range the value falls into
     */
    return value < half ? value : value - full
  }

}
  
export namespace AbiInt208 {
  
  export class Packed {

    readonly kind = "static"
  
    constructor(
      /**
       * 26-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint | number | string) {
      const half = 205688069665150755269371147819668813122841983204197482918576128n
      const full = 411376139330301510538742295639337626245683966408394965837152256n

      /**
       * Convert to bigint or throw
       */
      value = BigInt(value)

      /**
       * Clamp the value to the allowed range
       */
      value = value % (half + (value < 0n ? 1n : 0n))

      /**
       * Cheap two's complement
       */
      value = (value + full) % full
      
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
      const half = 205688069665150755269371147819668813122841983204197482918576128n
      const full = 411376139330301510538742295639337626245683966408394965837152256n

      const value = BigInt(`0x${this.value.toHex()}`)

      /**
       * Restore the sign based on which half of the range the value falls into
       */
      return value < half ? value : value - full
    }

  }
  
}

export class AbiInt216 {

  static readonly kind = "static"

  readonly kind = "static"

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint | number | string) {
    const half = 52656145834278593348959013841835216159447547700274555627155488768n
    const full = 105312291668557186697918027683670432318895095400549111254310977536n

    /**
     * Convert to bigint or throw
     */
    value = BigInt(value)
    
    /**
     * Clamp the value to the allowed range
     */
    value = value % (half + (value < 0n ? 1n : 0n))

    /**
     * Cheap two's complement
     */
    value = (value + full) % full

    /**
     * Determine the padding based on the sign
     */
    const padding = value < half ? "0" : "f"
    
    const hex = value.toString(16).padStart(64, padding)
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
    const half = 52656145834278593348959013841835216159447547700274555627155488768n
    const full = 105312291668557186697918027683670432318895095400549111254310977536n

    const value = BigInt(`0x${this.value.subarray(5, 32).toHex()}`)

    /**
     * Restore the sign based on which half of the range the value falls into
     */
    return value < half ? value : value - full
  }

}
  
export namespace AbiInt216 {
  
  export class Packed {

    readonly kind = "static"
  
    constructor(
      /**
       * 27-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint | number | string) {
      const half = 52656145834278593348959013841835216159447547700274555627155488768n
      const full = 105312291668557186697918027683670432318895095400549111254310977536n

      /**
       * Convert to bigint or throw
       */
      value = BigInt(value)

      /**
       * Clamp the value to the allowed range
       */
      value = value % (half + (value < 0n ? 1n : 0n))

      /**
       * Cheap two's complement
       */
      value = (value + full) % full
      
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
      const half = 52656145834278593348959013841835216159447547700274555627155488768n
      const full = 105312291668557186697918027683670432318895095400549111254310977536n

      const value = BigInt(`0x${this.value.toHex()}`)

      /**
       * Restore the sign based on which half of the range the value falls into
       */
      return value < half ? value : value - full
    }

  }
  
}

export class AbiInt224 {

  static readonly kind = "static"

  readonly kind = "static"

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint | number | string) {
    const half = 13479973333575319897333507543509815336818572211270286240551805124608n
    const full = 26959946667150639794667015087019630673637144422540572481103610249216n

    /**
     * Convert to bigint or throw
     */
    value = BigInt(value)
    
    /**
     * Clamp the value to the allowed range
     */
    value = value % (half + (value < 0n ? 1n : 0n))

    /**
     * Cheap two's complement
     */
    value = (value + full) % full

    /**
     * Determine the padding based on the sign
     */
    const padding = value < half ? "0" : "f"
    
    const hex = value.toString(16).padStart(64, padding)
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
    const half = 13479973333575319897333507543509815336818572211270286240551805124608n
    const full = 26959946667150639794667015087019630673637144422540572481103610249216n

    const value = BigInt(`0x${this.value.subarray(4, 32).toHex()}`)

    /**
     * Restore the sign based on which half of the range the value falls into
     */
    return value < half ? value : value - full
  }

}
  
export namespace AbiInt224 {
  
  export class Packed {

    readonly kind = "static"
  
    constructor(
      /**
       * 28-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint | number | string) {
      const half = 13479973333575319897333507543509815336818572211270286240551805124608n
      const full = 26959946667150639794667015087019630673637144422540572481103610249216n

      /**
       * Convert to bigint or throw
       */
      value = BigInt(value)

      /**
       * Clamp the value to the allowed range
       */
      value = value % (half + (value < 0n ? 1n : 0n))

      /**
       * Cheap two's complement
       */
      value = (value + full) % full
      
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
      const half = 13479973333575319897333507543509815336818572211270286240551805124608n
      const full = 26959946667150639794667015087019630673637144422540572481103610249216n

      const value = BigInt(`0x${this.value.toHex()}`)

      /**
       * Restore the sign based on which half of the range the value falls into
       */
      return value < half ? value : value - full
    }

  }
  
}

export class AbiInt232 {

  static readonly kind = "static"

  readonly kind = "static"

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint | number | string) {
    const half = 3450873173395281893717377931138512726225554486085193277581262111899648n
    const full = 6901746346790563787434755862277025452451108972170386555162524223799296n

    /**
     * Convert to bigint or throw
     */
    value = BigInt(value)
    
    /**
     * Clamp the value to the allowed range
     */
    value = value % (half + (value < 0n ? 1n : 0n))

    /**
     * Cheap two's complement
     */
    value = (value + full) % full

    /**
     * Determine the padding based on the sign
     */
    const padding = value < half ? "0" : "f"
    
    const hex = value.toString(16).padStart(64, padding)
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
    const half = 3450873173395281893717377931138512726225554486085193277581262111899648n
    const full = 6901746346790563787434755862277025452451108972170386555162524223799296n

    const value = BigInt(`0x${this.value.subarray(3, 32).toHex()}`)

    /**
     * Restore the sign based on which half of the range the value falls into
     */
    return value < half ? value : value - full
  }

}
  
export namespace AbiInt232 {
  
  export class Packed {

    readonly kind = "static"
  
    constructor(
      /**
       * 29-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint | number | string) {
      const half = 3450873173395281893717377931138512726225554486085193277581262111899648n
      const full = 6901746346790563787434755862277025452451108972170386555162524223799296n

      /**
       * Convert to bigint or throw
       */
      value = BigInt(value)

      /**
       * Clamp the value to the allowed range
       */
      value = value % (half + (value < 0n ? 1n : 0n))

      /**
       * Cheap two's complement
       */
      value = (value + full) % full
      
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
      const half = 3450873173395281893717377931138512726225554486085193277581262111899648n
      const full = 6901746346790563787434755862277025452451108972170386555162524223799296n

      const value = BigInt(`0x${this.value.toHex()}`)

      /**
       * Restore the sign based on which half of the range the value falls into
       */
      return value < half ? value : value - full
    }

  }
  
}

export class AbiInt240 {

  static readonly kind = "static"

  readonly kind = "static"

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint | number | string) {
    const half = 883423532389192164791648750371459257913741948437809479060803100646309888n
    const full = 1766847064778384329583297500742918515827483896875618958121606201292619776n

    /**
     * Convert to bigint or throw
     */
    value = BigInt(value)
    
    /**
     * Clamp the value to the allowed range
     */
    value = value % (half + (value < 0n ? 1n : 0n))

    /**
     * Cheap two's complement
     */
    value = (value + full) % full

    /**
     * Determine the padding based on the sign
     */
    const padding = value < half ? "0" : "f"
    
    const hex = value.toString(16).padStart(64, padding)
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
    const half = 883423532389192164791648750371459257913741948437809479060803100646309888n
    const full = 1766847064778384329583297500742918515827483896875618958121606201292619776n

    const value = BigInt(`0x${this.value.subarray(2, 32).toHex()}`)

    /**
     * Restore the sign based on which half of the range the value falls into
     */
    return value < half ? value : value - full
  }

}
  
export namespace AbiInt240 {
  
  export class Packed {

    readonly kind = "static"
  
    constructor(
      /**
       * 30-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint | number | string) {
      const half = 883423532389192164791648750371459257913741948437809479060803100646309888n
      const full = 1766847064778384329583297500742918515827483896875618958121606201292619776n

      /**
       * Convert to bigint or throw
       */
      value = BigInt(value)

      /**
       * Clamp the value to the allowed range
       */
      value = value % (half + (value < 0n ? 1n : 0n))

      /**
       * Cheap two's complement
       */
      value = (value + full) % full
      
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
      const half = 883423532389192164791648750371459257913741948437809479060803100646309888n
      const full = 1766847064778384329583297500742918515827483896875618958121606201292619776n

      const value = BigInt(`0x${this.value.toHex()}`)

      /**
       * Restore the sign based on which half of the range the value falls into
       */
      return value < half ? value : value - full
    }

  }
  
}

export class AbiInt248 {

  static readonly kind = "static"

  readonly kind = "static"

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint | number | string) {
    const half = 226156424291633194186662080095093570025917938800079226639565593765455331328n
    const full = 452312848583266388373324160190187140051835877600158453279131187530910662656n

    /**
     * Convert to bigint or throw
     */
    value = BigInt(value)
    
    /**
     * Clamp the value to the allowed range
     */
    value = value % (half + (value < 0n ? 1n : 0n))

    /**
     * Cheap two's complement
     */
    value = (value + full) % full

    /**
     * Determine the padding based on the sign
     */
    const padding = value < half ? "0" : "f"
    
    const hex = value.toString(16).padStart(64, padding)
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
    const half = 226156424291633194186662080095093570025917938800079226639565593765455331328n
    const full = 452312848583266388373324160190187140051835877600158453279131187530910662656n

    const value = BigInt(`0x${this.value.subarray(1, 32).toHex()}`)

    /**
     * Restore the sign based on which half of the range the value falls into
     */
    return value < half ? value : value - full
  }

}
  
export namespace AbiInt248 {
  
  export class Packed {

    readonly kind = "static"
  
    constructor(
      /**
       * 31-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint | number | string) {
      const half = 226156424291633194186662080095093570025917938800079226639565593765455331328n
      const full = 452312848583266388373324160190187140051835877600158453279131187530910662656n

      /**
       * Convert to bigint or throw
       */
      value = BigInt(value)

      /**
       * Clamp the value to the allowed range
       */
      value = value % (half + (value < 0n ? 1n : 0n))

      /**
       * Cheap two's complement
       */
      value = (value + full) % full
      
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
      const half = 226156424291633194186662080095093570025917938800079226639565593765455331328n
      const full = 452312848583266388373324160190187140051835877600158453279131187530910662656n

      const value = BigInt(`0x${this.value.toHex()}`)

      /**
       * Restore the sign based on which half of the range the value falls into
       */
      return value < half ? value : value - full
    }

  }
  
}

export class AbiInt256 {

  static readonly kind = "static"

  readonly kind = "static"

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: bigint | number | string) {
    const half = 57896044618658097711785492504343953926634992332820282019728792003956564819968n
    const full = 115792089237316195423570985008687907853269984665640564039457584007913129639936n

    /**
     * Convert to bigint or throw
     */
    value = BigInt(value)
    
    /**
     * Clamp the value to the allowed range
     */
    value = value % (half + (value < 0n ? 1n : 0n))

    /**
     * Cheap two's complement
     */
    value = (value + full) % full

    /**
     * Determine the padding based on the sign
     */
    const padding = value < half ? "0" : "f"
    
    const hex = value.toString(16).padStart(64, padding)
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
    const half = 57896044618658097711785492504343953926634992332820282019728792003956564819968n
    const full = 115792089237316195423570985008687907853269984665640564039457584007913129639936n

    const value = BigInt(`0x${this.value.subarray(0, 32).toHex()}`)

    /**
     * Restore the sign based on which half of the range the value falls into
     */
    return value < half ? value : value - full
  }

}
  
export namespace AbiInt256 {
  
  export class Packed {

    readonly kind = "static"
  
    constructor(
      /**
       * 32-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: bigint | number | string) {
      const half = 57896044618658097711785492504343953926634992332820282019728792003956564819968n
      const full = 115792089237316195423570985008687907853269984665640564039457584007913129639936n

      /**
       * Convert to bigint or throw
       */
      value = BigInt(value)

      /**
       * Clamp the value to the allowed range
       */
      value = value % (half + (value < 0n ? 1n : 0n))

      /**
       * Cheap two's complement
       */
      value = (value + full) % full
      
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
      const half = 57896044618658097711785492504343953926634992332820282019728792003956564819968n
      const full = 115792089237316195423570985008687907853269984665640564039457584007913129639936n

      const value = BigInt(`0x${this.value.toHex()}`)

      /**
       * Restore the sign based on which half of the range the value falls into
       */
      return value < half ? value : value - full
    }

  }
  
}