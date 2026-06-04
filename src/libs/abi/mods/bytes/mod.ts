import { AbiUint32 } from "@/libs/abi/mods/uint/mod.ts";
import { Cursor } from "@hazae41/cursor";
export class AbiBytes {

  static readonly kind = "dynamic"

  constructor(
    readonly value: Uint8Array
  ) { }

  static from(value: Uint8Array) {
    return new AbiBytes(value)
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

    AbiUint32.from(length).write(cursor)

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

    static from(value: Uint8Array) {
      return new Packed(value)
    }

    size() {
      return 32 + this.value.length
    }

    write(cursor: Cursor) {
      const length = this.value.length

      AbiUint32.Packed.from(length).write(cursor)

      cursor.write(this.value)
    }

    into() {
      return this.value
    }

  }

}

export class AbiBytes1 {

  static readonly kind = "static"

  constructor(
    /**
     * 1-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: Uint8Array) {
    return new AbiBytes1(value.subarray(0, 1))
  }

  static read(cursor: Cursor) {
    const raw = new Uint8Array(cursor.read(1))

    cursor.offset += 32 - 1

    return new AbiBytes1(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
    
    cursor.offset += 32 - 1

    return
  }

  into() {
    return this.value.subarray(0, 1)
  }

}
  
export namespace AbiBytes1 {
  
  export class Packed {

    constructor(
      /**
       * 1-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: Uint8Array) {
      return new Packed(value.subarray(0, 1))
    }

    size() {
      return this.value.length
    }

    write(cursor: Cursor) {
      cursor.write(this.value)
    }

    into() {
      return this.value.subarray(0, 1)
    }

  }
  
}

export class AbiBytes2 {

  static readonly kind = "static"

  constructor(
    /**
     * 2-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: Uint8Array) {
    return new AbiBytes2(value.subarray(0, 2))
  }

  static read(cursor: Cursor) {
    const raw = new Uint8Array(cursor.read(2))

    cursor.offset += 32 - 2

    return new AbiBytes2(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
    
    cursor.offset += 32 - 2

    return
  }

  into() {
    return this.value.subarray(0, 2)
  }

}
  
export namespace AbiBytes2 {
  
  export class Packed {

    constructor(
      /**
       * 2-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: Uint8Array) {
      return new Packed(value.subarray(0, 2))
    }

    size() {
      return this.value.length
    }

    write(cursor: Cursor) {
      cursor.write(this.value)
    }

    into() {
      return this.value.subarray(0, 2)
    }

  }
  
}

export class AbiBytes3 {

  static readonly kind = "static"

  constructor(
    /**
     * 3-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: Uint8Array) {
    return new AbiBytes3(value.subarray(0, 3))
  }

  static read(cursor: Cursor) {
    const raw = new Uint8Array(cursor.read(3))

    cursor.offset += 32 - 3

    return new AbiBytes3(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
    
    cursor.offset += 32 - 3

    return
  }

  into() {
    return this.value.subarray(0, 3)
  }

}
  
export namespace AbiBytes3 {
  
  export class Packed {

    constructor(
      /**
       * 3-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: Uint8Array) {
      return new Packed(value.subarray(0, 3))
    }

    size() {
      return this.value.length
    }

    write(cursor: Cursor) {
      cursor.write(this.value)
    }

    into() {
      return this.value.subarray(0, 3)
    }

  }
  
}

export class AbiBytes4 {

  static readonly kind = "static"

  constructor(
    /**
     * 4-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: Uint8Array) {
    return new AbiBytes4(value.subarray(0, 4))
  }

  static read(cursor: Cursor) {
    const raw = new Uint8Array(cursor.read(4))

    cursor.offset += 32 - 4

    return new AbiBytes4(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
    
    cursor.offset += 32 - 4

    return
  }

  into() {
    return this.value.subarray(0, 4)
  }

}
  
export namespace AbiBytes4 {
  
  export class Packed {

    constructor(
      /**
       * 4-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: Uint8Array) {
      return new Packed(value.subarray(0, 4))
    }

    size() {
      return this.value.length
    }

    write(cursor: Cursor) {
      cursor.write(this.value)
    }

    into() {
      return this.value.subarray(0, 4)
    }

  }
  
}

export class AbiBytes5 {

  static readonly kind = "static"

  constructor(
    /**
     * 5-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: Uint8Array) {
    return new AbiBytes5(value.subarray(0, 5))
  }

  static read(cursor: Cursor) {
    const raw = new Uint8Array(cursor.read(5))

    cursor.offset += 32 - 5

    return new AbiBytes5(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
    
    cursor.offset += 32 - 5

    return
  }

  into() {
    return this.value.subarray(0, 5)
  }

}
  
export namespace AbiBytes5 {
  
  export class Packed {

    constructor(
      /**
       * 5-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: Uint8Array) {
      return new Packed(value.subarray(0, 5))
    }

    size() {
      return this.value.length
    }

    write(cursor: Cursor) {
      cursor.write(this.value)
    }

    into() {
      return this.value.subarray(0, 5)
    }

  }
  
}

export class AbiBytes6 {

  static readonly kind = "static"

  constructor(
    /**
     * 6-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: Uint8Array) {
    return new AbiBytes6(value.subarray(0, 6))
  }

  static read(cursor: Cursor) {
    const raw = new Uint8Array(cursor.read(6))

    cursor.offset += 32 - 6

    return new AbiBytes6(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
    
    cursor.offset += 32 - 6

    return
  }

  into() {
    return this.value.subarray(0, 6)
  }

}
  
export namespace AbiBytes6 {
  
  export class Packed {

    constructor(
      /**
       * 6-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: Uint8Array) {
      return new Packed(value.subarray(0, 6))
    }

    size() {
      return this.value.length
    }

    write(cursor: Cursor) {
      cursor.write(this.value)
    }

    into() {
      return this.value.subarray(0, 6)
    }

  }
  
}

export class AbiBytes7 {

  static readonly kind = "static"

  constructor(
    /**
     * 7-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: Uint8Array) {
    return new AbiBytes7(value.subarray(0, 7))
  }

  static read(cursor: Cursor) {
    const raw = new Uint8Array(cursor.read(7))

    cursor.offset += 32 - 7

    return new AbiBytes7(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
    
    cursor.offset += 32 - 7

    return
  }

  into() {
    return this.value.subarray(0, 7)
  }

}
  
export namespace AbiBytes7 {
  
  export class Packed {

    constructor(
      /**
       * 7-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: Uint8Array) {
      return new Packed(value.subarray(0, 7))
    }

    size() {
      return this.value.length
    }

    write(cursor: Cursor) {
      cursor.write(this.value)
    }

    into() {
      return this.value.subarray(0, 7)
    }

  }
  
}

export class AbiBytes8 {

  static readonly kind = "static"

  constructor(
    /**
     * 8-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: Uint8Array) {
    return new AbiBytes8(value.subarray(0, 8))
  }

  static read(cursor: Cursor) {
    const raw = new Uint8Array(cursor.read(8))

    cursor.offset += 32 - 8

    return new AbiBytes8(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
    
    cursor.offset += 32 - 8

    return
  }

  into() {
    return this.value.subarray(0, 8)
  }

}
  
export namespace AbiBytes8 {
  
  export class Packed {

    constructor(
      /**
       * 8-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: Uint8Array) {
      return new Packed(value.subarray(0, 8))
    }

    size() {
      return this.value.length
    }

    write(cursor: Cursor) {
      cursor.write(this.value)
    }

    into() {
      return this.value.subarray(0, 8)
    }

  }
  
}

export class AbiBytes9 {

  static readonly kind = "static"

  constructor(
    /**
     * 9-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: Uint8Array) {
    return new AbiBytes9(value.subarray(0, 9))
  }

  static read(cursor: Cursor) {
    const raw = new Uint8Array(cursor.read(9))

    cursor.offset += 32 - 9

    return new AbiBytes9(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
    
    cursor.offset += 32 - 9

    return
  }

  into() {
    return this.value.subarray(0, 9)
  }

}
  
export namespace AbiBytes9 {
  
  export class Packed {

    constructor(
      /**
       * 9-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: Uint8Array) {
      return new Packed(value.subarray(0, 9))
    }

    size() {
      return this.value.length
    }

    write(cursor: Cursor) {
      cursor.write(this.value)
    }

    into() {
      return this.value.subarray(0, 9)
    }

  }
  
}

export class AbiBytes10 {

  static readonly kind = "static"

  constructor(
    /**
     * 10-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: Uint8Array) {
    return new AbiBytes10(value.subarray(0, 10))
  }

  static read(cursor: Cursor) {
    const raw = new Uint8Array(cursor.read(10))

    cursor.offset += 32 - 10

    return new AbiBytes10(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
    
    cursor.offset += 32 - 10

    return
  }

  into() {
    return this.value.subarray(0, 10)
  }

}
  
export namespace AbiBytes10 {
  
  export class Packed {

    constructor(
      /**
       * 10-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: Uint8Array) {
      return new Packed(value.subarray(0, 10))
    }

    size() {
      return this.value.length
    }

    write(cursor: Cursor) {
      cursor.write(this.value)
    }

    into() {
      return this.value.subarray(0, 10)
    }

  }
  
}

export class AbiBytes11 {

  static readonly kind = "static"

  constructor(
    /**
     * 11-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: Uint8Array) {
    return new AbiBytes11(value.subarray(0, 11))
  }

  static read(cursor: Cursor) {
    const raw = new Uint8Array(cursor.read(11))

    cursor.offset += 32 - 11

    return new AbiBytes11(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
    
    cursor.offset += 32 - 11

    return
  }

  into() {
    return this.value.subarray(0, 11)
  }

}
  
export namespace AbiBytes11 {
  
  export class Packed {

    constructor(
      /**
       * 11-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: Uint8Array) {
      return new Packed(value.subarray(0, 11))
    }

    size() {
      return this.value.length
    }

    write(cursor: Cursor) {
      cursor.write(this.value)
    }

    into() {
      return this.value.subarray(0, 11)
    }

  }
  
}

export class AbiBytes12 {

  static readonly kind = "static"

  constructor(
    /**
     * 12-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: Uint8Array) {
    return new AbiBytes12(value.subarray(0, 12))
  }

  static read(cursor: Cursor) {
    const raw = new Uint8Array(cursor.read(12))

    cursor.offset += 32 - 12

    return new AbiBytes12(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
    
    cursor.offset += 32 - 12

    return
  }

  into() {
    return this.value.subarray(0, 12)
  }

}
  
export namespace AbiBytes12 {
  
  export class Packed {

    constructor(
      /**
       * 12-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: Uint8Array) {
      return new Packed(value.subarray(0, 12))
    }

    size() {
      return this.value.length
    }

    write(cursor: Cursor) {
      cursor.write(this.value)
    }

    into() {
      return this.value.subarray(0, 12)
    }

  }
  
}

export class AbiBytes13 {

  static readonly kind = "static"

  constructor(
    /**
     * 13-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: Uint8Array) {
    return new AbiBytes13(value.subarray(0, 13))
  }

  static read(cursor: Cursor) {
    const raw = new Uint8Array(cursor.read(13))

    cursor.offset += 32 - 13

    return new AbiBytes13(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
    
    cursor.offset += 32 - 13

    return
  }

  into() {
    return this.value.subarray(0, 13)
  }

}
  
export namespace AbiBytes13 {
  
  export class Packed {

    constructor(
      /**
       * 13-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: Uint8Array) {
      return new Packed(value.subarray(0, 13))
    }

    size() {
      return this.value.length
    }

    write(cursor: Cursor) {
      cursor.write(this.value)
    }

    into() {
      return this.value.subarray(0, 13)
    }

  }
  
}

export class AbiBytes14 {

  static readonly kind = "static"

  constructor(
    /**
     * 14-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: Uint8Array) {
    return new AbiBytes14(value.subarray(0, 14))
  }

  static read(cursor: Cursor) {
    const raw = new Uint8Array(cursor.read(14))

    cursor.offset += 32 - 14

    return new AbiBytes14(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
    
    cursor.offset += 32 - 14

    return
  }

  into() {
    return this.value.subarray(0, 14)
  }

}
  
export namespace AbiBytes14 {
  
  export class Packed {

    constructor(
      /**
       * 14-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: Uint8Array) {
      return new Packed(value.subarray(0, 14))
    }

    size() {
      return this.value.length
    }

    write(cursor: Cursor) {
      cursor.write(this.value)
    }

    into() {
      return this.value.subarray(0, 14)
    }

  }
  
}

export class AbiBytes15 {

  static readonly kind = "static"

  constructor(
    /**
     * 15-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: Uint8Array) {
    return new AbiBytes15(value.subarray(0, 15))
  }

  static read(cursor: Cursor) {
    const raw = new Uint8Array(cursor.read(15))

    cursor.offset += 32 - 15

    return new AbiBytes15(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
    
    cursor.offset += 32 - 15

    return
  }

  into() {
    return this.value.subarray(0, 15)
  }

}
  
export namespace AbiBytes15 {
  
  export class Packed {

    constructor(
      /**
       * 15-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: Uint8Array) {
      return new Packed(value.subarray(0, 15))
    }

    size() {
      return this.value.length
    }

    write(cursor: Cursor) {
      cursor.write(this.value)
    }

    into() {
      return this.value.subarray(0, 15)
    }

  }
  
}

export class AbiBytes16 {

  static readonly kind = "static"

  constructor(
    /**
     * 16-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: Uint8Array) {
    return new AbiBytes16(value.subarray(0, 16))
  }

  static read(cursor: Cursor) {
    const raw = new Uint8Array(cursor.read(16))

    cursor.offset += 32 - 16

    return new AbiBytes16(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
    
    cursor.offset += 32 - 16

    return
  }

  into() {
    return this.value.subarray(0, 16)
  }

}
  
export namespace AbiBytes16 {
  
  export class Packed {

    constructor(
      /**
       * 16-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: Uint8Array) {
      return new Packed(value.subarray(0, 16))
    }

    size() {
      return this.value.length
    }

    write(cursor: Cursor) {
      cursor.write(this.value)
    }

    into() {
      return this.value.subarray(0, 16)
    }

  }
  
}

export class AbiBytes17 {

  static readonly kind = "static"

  constructor(
    /**
     * 17-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: Uint8Array) {
    return new AbiBytes17(value.subarray(0, 17))
  }

  static read(cursor: Cursor) {
    const raw = new Uint8Array(cursor.read(17))

    cursor.offset += 32 - 17

    return new AbiBytes17(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
    
    cursor.offset += 32 - 17

    return
  }

  into() {
    return this.value.subarray(0, 17)
  }

}
  
export namespace AbiBytes17 {
  
  export class Packed {

    constructor(
      /**
       * 17-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: Uint8Array) {
      return new Packed(value.subarray(0, 17))
    }

    size() {
      return this.value.length
    }

    write(cursor: Cursor) {
      cursor.write(this.value)
    }

    into() {
      return this.value.subarray(0, 17)
    }

  }
  
}

export class AbiBytes18 {

  static readonly kind = "static"

  constructor(
    /**
     * 18-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: Uint8Array) {
    return new AbiBytes18(value.subarray(0, 18))
  }

  static read(cursor: Cursor) {
    const raw = new Uint8Array(cursor.read(18))

    cursor.offset += 32 - 18

    return new AbiBytes18(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
    
    cursor.offset += 32 - 18

    return
  }

  into() {
    return this.value.subarray(0, 18)
  }

}
  
export namespace AbiBytes18 {
  
  export class Packed {

    constructor(
      /**
       * 18-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: Uint8Array) {
      return new Packed(value.subarray(0, 18))
    }

    size() {
      return this.value.length
    }

    write(cursor: Cursor) {
      cursor.write(this.value)
    }

    into() {
      return this.value.subarray(0, 18)
    }

  }
  
}

export class AbiBytes19 {

  static readonly kind = "static"

  constructor(
    /**
     * 19-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: Uint8Array) {
    return new AbiBytes19(value.subarray(0, 19))
  }

  static read(cursor: Cursor) {
    const raw = new Uint8Array(cursor.read(19))

    cursor.offset += 32 - 19

    return new AbiBytes19(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
    
    cursor.offset += 32 - 19

    return
  }

  into() {
    return this.value.subarray(0, 19)
  }

}
  
export namespace AbiBytes19 {
  
  export class Packed {

    constructor(
      /**
       * 19-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: Uint8Array) {
      return new Packed(value.subarray(0, 19))
    }

    size() {
      return this.value.length
    }

    write(cursor: Cursor) {
      cursor.write(this.value)
    }

    into() {
      return this.value.subarray(0, 19)
    }

  }
  
}

export class AbiBytes20 {

  static readonly kind = "static"

  constructor(
    /**
     * 20-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: Uint8Array) {
    return new AbiBytes20(value.subarray(0, 20))
  }

  static read(cursor: Cursor) {
    const raw = new Uint8Array(cursor.read(20))

    cursor.offset += 32 - 20

    return new AbiBytes20(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
    
    cursor.offset += 32 - 20

    return
  }

  into() {
    return this.value.subarray(0, 20)
  }

}
  
export namespace AbiBytes20 {
  
  export class Packed {

    constructor(
      /**
       * 20-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: Uint8Array) {
      return new Packed(value.subarray(0, 20))
    }

    size() {
      return this.value.length
    }

    write(cursor: Cursor) {
      cursor.write(this.value)
    }

    into() {
      return this.value.subarray(0, 20)
    }

  }
  
}

export class AbiBytes21 {

  static readonly kind = "static"

  constructor(
    /**
     * 21-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: Uint8Array) {
    return new AbiBytes21(value.subarray(0, 21))
  }

  static read(cursor: Cursor) {
    const raw = new Uint8Array(cursor.read(21))

    cursor.offset += 32 - 21

    return new AbiBytes21(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
    
    cursor.offset += 32 - 21

    return
  }

  into() {
    return this.value.subarray(0, 21)
  }

}
  
export namespace AbiBytes21 {
  
  export class Packed {

    constructor(
      /**
       * 21-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: Uint8Array) {
      return new Packed(value.subarray(0, 21))
    }

    size() {
      return this.value.length
    }

    write(cursor: Cursor) {
      cursor.write(this.value)
    }

    into() {
      return this.value.subarray(0, 21)
    }

  }
  
}

export class AbiBytes22 {

  static readonly kind = "static"

  constructor(
    /**
     * 22-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: Uint8Array) {
    return new AbiBytes22(value.subarray(0, 22))
  }

  static read(cursor: Cursor) {
    const raw = new Uint8Array(cursor.read(22))

    cursor.offset += 32 - 22

    return new AbiBytes22(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
    
    cursor.offset += 32 - 22

    return
  }

  into() {
    return this.value.subarray(0, 22)
  }

}
  
export namespace AbiBytes22 {
  
  export class Packed {

    constructor(
      /**
       * 22-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: Uint8Array) {
      return new Packed(value.subarray(0, 22))
    }

    size() {
      return this.value.length
    }

    write(cursor: Cursor) {
      cursor.write(this.value)
    }

    into() {
      return this.value.subarray(0, 22)
    }

  }
  
}

export class AbiBytes23 {

  static readonly kind = "static"

  constructor(
    /**
     * 23-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: Uint8Array) {
    return new AbiBytes23(value.subarray(0, 23))
  }

  static read(cursor: Cursor) {
    const raw = new Uint8Array(cursor.read(23))

    cursor.offset += 32 - 23

    return new AbiBytes23(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
    
    cursor.offset += 32 - 23

    return
  }

  into() {
    return this.value.subarray(0, 23)
  }

}
  
export namespace AbiBytes23 {
  
  export class Packed {

    constructor(
      /**
       * 23-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: Uint8Array) {
      return new Packed(value.subarray(0, 23))
    }

    size() {
      return this.value.length
    }

    write(cursor: Cursor) {
      cursor.write(this.value)
    }

    into() {
      return this.value.subarray(0, 23)
    }

  }
  
}

export class AbiBytes24 {

  static readonly kind = "static"

  constructor(
    /**
     * 24-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: Uint8Array) {
    return new AbiBytes24(value.subarray(0, 24))
  }

  static read(cursor: Cursor) {
    const raw = new Uint8Array(cursor.read(24))

    cursor.offset += 32 - 24

    return new AbiBytes24(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
    
    cursor.offset += 32 - 24

    return
  }

  into() {
    return this.value.subarray(0, 24)
  }

}
  
export namespace AbiBytes24 {
  
  export class Packed {

    constructor(
      /**
       * 24-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: Uint8Array) {
      return new Packed(value.subarray(0, 24))
    }

    size() {
      return this.value.length
    }

    write(cursor: Cursor) {
      cursor.write(this.value)
    }

    into() {
      return this.value.subarray(0, 24)
    }

  }
  
}

export class AbiBytes25 {

  static readonly kind = "static"

  constructor(
    /**
     * 25-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: Uint8Array) {
    return new AbiBytes25(value.subarray(0, 25))
  }

  static read(cursor: Cursor) {
    const raw = new Uint8Array(cursor.read(25))

    cursor.offset += 32 - 25

    return new AbiBytes25(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
    
    cursor.offset += 32 - 25

    return
  }

  into() {
    return this.value.subarray(0, 25)
  }

}
  
export namespace AbiBytes25 {
  
  export class Packed {

    constructor(
      /**
       * 25-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: Uint8Array) {
      return new Packed(value.subarray(0, 25))
    }

    size() {
      return this.value.length
    }

    write(cursor: Cursor) {
      cursor.write(this.value)
    }

    into() {
      return this.value.subarray(0, 25)
    }

  }
  
}

export class AbiBytes26 {

  static readonly kind = "static"

  constructor(
    /**
     * 26-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: Uint8Array) {
    return new AbiBytes26(value.subarray(0, 26))
  }

  static read(cursor: Cursor) {
    const raw = new Uint8Array(cursor.read(26))

    cursor.offset += 32 - 26

    return new AbiBytes26(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
    
    cursor.offset += 32 - 26

    return
  }

  into() {
    return this.value.subarray(0, 26)
  }

}
  
export namespace AbiBytes26 {
  
  export class Packed {

    constructor(
      /**
       * 26-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: Uint8Array) {
      return new Packed(value.subarray(0, 26))
    }

    size() {
      return this.value.length
    }

    write(cursor: Cursor) {
      cursor.write(this.value)
    }

    into() {
      return this.value.subarray(0, 26)
    }

  }
  
}

export class AbiBytes27 {

  static readonly kind = "static"

  constructor(
    /**
     * 27-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: Uint8Array) {
    return new AbiBytes27(value.subarray(0, 27))
  }

  static read(cursor: Cursor) {
    const raw = new Uint8Array(cursor.read(27))

    cursor.offset += 32 - 27

    return new AbiBytes27(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
    
    cursor.offset += 32 - 27

    return
  }

  into() {
    return this.value.subarray(0, 27)
  }

}
  
export namespace AbiBytes27 {
  
  export class Packed {

    constructor(
      /**
       * 27-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: Uint8Array) {
      return new Packed(value.subarray(0, 27))
    }

    size() {
      return this.value.length
    }

    write(cursor: Cursor) {
      cursor.write(this.value)
    }

    into() {
      return this.value.subarray(0, 27)
    }

  }
  
}

export class AbiBytes28 {

  static readonly kind = "static"

  constructor(
    /**
     * 28-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: Uint8Array) {
    return new AbiBytes28(value.subarray(0, 28))
  }

  static read(cursor: Cursor) {
    const raw = new Uint8Array(cursor.read(28))

    cursor.offset += 32 - 28

    return new AbiBytes28(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
    
    cursor.offset += 32 - 28

    return
  }

  into() {
    return this.value.subarray(0, 28)
  }

}
  
export namespace AbiBytes28 {
  
  export class Packed {

    constructor(
      /**
       * 28-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: Uint8Array) {
      return new Packed(value.subarray(0, 28))
    }

    size() {
      return this.value.length
    }

    write(cursor: Cursor) {
      cursor.write(this.value)
    }

    into() {
      return this.value.subarray(0, 28)
    }

  }
  
}

export class AbiBytes29 {

  static readonly kind = "static"

  constructor(
    /**
     * 29-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: Uint8Array) {
    return new AbiBytes29(value.subarray(0, 29))
  }

  static read(cursor: Cursor) {
    const raw = new Uint8Array(cursor.read(29))

    cursor.offset += 32 - 29

    return new AbiBytes29(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
    
    cursor.offset += 32 - 29

    return
  }

  into() {
    return this.value.subarray(0, 29)
  }

}
  
export namespace AbiBytes29 {
  
  export class Packed {

    constructor(
      /**
       * 29-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: Uint8Array) {
      return new Packed(value.subarray(0, 29))
    }

    size() {
      return this.value.length
    }

    write(cursor: Cursor) {
      cursor.write(this.value)
    }

    into() {
      return this.value.subarray(0, 29)
    }

  }
  
}

export class AbiBytes30 {

  static readonly kind = "static"

  constructor(
    /**
     * 30-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: Uint8Array) {
    return new AbiBytes30(value.subarray(0, 30))
  }

  static read(cursor: Cursor) {
    const raw = new Uint8Array(cursor.read(30))

    cursor.offset += 32 - 30

    return new AbiBytes30(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
    
    cursor.offset += 32 - 30

    return
  }

  into() {
    return this.value.subarray(0, 30)
  }

}
  
export namespace AbiBytes30 {
  
  export class Packed {

    constructor(
      /**
       * 30-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: Uint8Array) {
      return new Packed(value.subarray(0, 30))
    }

    size() {
      return this.value.length
    }

    write(cursor: Cursor) {
      cursor.write(this.value)
    }

    into() {
      return this.value.subarray(0, 30)
    }

  }
  
}

export class AbiBytes31 {

  static readonly kind = "static"

  constructor(
    /**
     * 31-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: Uint8Array) {
    return new AbiBytes31(value.subarray(0, 31))
  }

  static read(cursor: Cursor) {
    const raw = new Uint8Array(cursor.read(31))

    cursor.offset += 32 - 31

    return new AbiBytes31(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
    
    cursor.offset += 32 - 31

    return
  }

  into() {
    return this.value.subarray(0, 31)
  }

}
  
export namespace AbiBytes31 {
  
  export class Packed {

    constructor(
      /**
       * 31-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: Uint8Array) {
      return new Packed(value.subarray(0, 31))
    }

    size() {
      return this.value.length
    }

    write(cursor: Cursor) {
      cursor.write(this.value)
    }

    into() {
      return this.value.subarray(0, 31)
    }

  }
  
}

export class AbiBytes32 {

  static readonly kind = "static"

  constructor(
    /**
     * 32-sized bytes
     */
    readonly value: Uint8Array
  ) {}

  static from(value: Uint8Array) {
    return new AbiBytes32(value.subarray(0, 32))
  }

  static read(cursor: Cursor) {
    const raw = new Uint8Array(cursor.read(32))

    cursor.offset += 32 - 32

    return new AbiBytes32(raw)
  }

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.write(this.value)
    
    cursor.offset += 32 - 32

    return
  }

  into() {
    return this.value.subarray(0, 32)
  }

}
  
export namespace AbiBytes32 {
  
  export class Packed {

    constructor(
      /**
       * 32-sized bytes
       */
      readonly value: Uint8Array
    ) {}

    static from(value: Uint8Array) {
      return new Packed(value.subarray(0, 32))
    }

    size() {
      return this.value.length
    }

    write(cursor: Cursor) {
      cursor.write(this.value)
    }

    into() {
      return this.value.subarray(0, 32)
    }

  }
  
}