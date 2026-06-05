
import { base16 } from "@/libs/abi/libs/base16/mod.ts";
import { AbiAddress } from "@/libs/abi/mods/address/mod.ts";
import { AbiBool } from "@/libs/abi/mods/bool/mod.ts";
import { AbiBytes1, AbiBytes10, AbiBytes11, AbiBytes12, AbiBytes13, AbiBytes14, AbiBytes15, AbiBytes16, AbiBytes17, AbiBytes18, AbiBytes19, AbiBytes2, AbiBytes20, AbiBytes21, AbiBytes22, AbiBytes23, AbiBytes24, AbiBytes25, AbiBytes26, AbiBytes27, AbiBytes28, AbiBytes29, AbiBytes3, AbiBytes30, AbiBytes31, AbiBytes32, AbiBytes4, AbiBytes5, AbiBytes6, AbiBytes7, AbiBytes8, AbiBytes9 } from "@/libs/abi/mods/bytes/mod.ts";
import { AbiInt104, AbiInt112, AbiInt120, AbiInt128, AbiInt136, AbiInt144, AbiInt152, AbiInt16, AbiInt160, AbiInt168, AbiInt176, AbiInt184, AbiInt192, AbiInt200, AbiInt208, AbiInt216, AbiInt224, AbiInt232, AbiInt24, AbiInt240, AbiInt248, AbiInt256, AbiInt32, AbiInt40, AbiInt48, AbiInt56, AbiInt64, AbiInt72, AbiInt8, AbiInt80, AbiInt88, AbiInt96 } from "@/libs/abi/mods/int/mod.ts";
import { AbiReadable } from "@/libs/abi/mods/readable/mod.ts";
import { AbiUint104, AbiUint112, AbiUint120, AbiUint128, AbiUint136, AbiUint144, AbiUint152, AbiUint16, AbiUint160, AbiUint168, AbiUint176, AbiUint184, AbiUint192, AbiUint200, AbiUint208, AbiUint216, AbiUint224, AbiUint232, AbiUint24, AbiUint240, AbiUint248, AbiUint256, AbiUint32, AbiUint40, AbiUint48, AbiUint56, AbiUint64, AbiUint72, AbiUint8, AbiUint80, AbiUint88, AbiUint96 } from "@/libs/abi/mods/uint/mod.ts";
import { Nullable } from "@/libs/nullable/mod.ts";
import { Cursor } from "@hazae41/cursor";
import { keccak256 } from "@hazae41/keccak256";

export interface EIP712Data {
  readonly types: EIP712Types
  readonly primaryType: string
  readonly message: Record<string, unknown>
  readonly domain: EIP712Domain
}

export interface EIP712Types {
  [x: string]: Nullable<readonly EIP712Variable[]>
}

export interface EIP712Variable {
  readonly name: string
  readonly type: string
}

export interface EIP712Domain extends Record<string, unknown> {
  readonly name?: string
  readonly version?: string
  readonly chainId?: bigint | number | string
  readonly verifyingContract?: string
  readonly salt?: Uint8Array
}

export class EIP712Context {

  readonly cache = new Map<string, Uint8Array>()

  constructor(
    readonly types: EIP712Types
  ) { }

}

/**
 * a.k.a. signTypedData_v4 / EIP-712
 */
export namespace EIP712Data {

  export function encode(data: EIP712Data) {
    const { types, domain, primaryType, message } = data

    types["EIP712Domain"] ??= [
      { name: "name", type: "string" },
      { name: "version", type: "string" },
      { name: "chainId", type: "uint256" },
      { name: "verifyingContract", type: "address" },
      { name: "salt", type: "bytes32" },
    ].filter(({ name }) => domain[name] != null)

    const main = new EIP712Context(types)

    const head = new EIP712Struct(main, "EIP712Domain", domain).hash()
    const tail = new EIP712Struct(main, primaryType, message).hash()

    const cursor = new Cursor(new Uint8Array(2 + head.length + tail.length))

    cursor.writeUint16(6401)
    cursor.write(head)
    cursor.write(tail)

    return cursor.bytes
  }

  /**
   * This is the function you are probably looking for
   * @param data 
   * @returns 
   */
  export function hash(data: EIP712Data): Uint8Array {
    return keccak256.digest(encode(data))
  }

}

export class EIP712Struct {

  constructor(
    readonly main: EIP712Context,
    readonly type: string,
    readonly data: Record<string, unknown>,
  ) { }

  #size() {
    const { main, type } = this

    let length = 0

    for (const _ of main.types[type]!)
      length += 32

    return length
  }

  hash() {
    const { main, type, data } = this

    const cursor = new Cursor(new Uint8Array(32 + this.#size()))

    cursor.write(new EIP712Type(main, type).hash())

    for (const variable of main.types[type]!) {
      const { name, type } = variable

      const subdata = data[name]

      new EIP712Field(main, type, subdata).write(cursor)
    }

    return keccak256.digest(cursor.bytes)
  }

}

export class EIP712Type {

  constructor(
    readonly main: EIP712Context,
    readonly type: string,
  ) { }

  #resolve(imports = new Set<string>()) {
    const { main, type } = this

    for (const variable of main.types[type]!) {
      const { type } = variable

      const bracket = type.indexOf("[")

      const subtype = bracket !== -1
        ? type.slice(0, bracket)
        : type

      if (main.types[subtype] == null)
        continue

      const size = imports.size

      imports.add(subtype)

      if (imports.size === size)
        continue

      new EIP712Type(main, subtype).#resolve(imports)
    }

    return imports
  }

  #encode() {
    const { main, type } = this

    const imports = this.#resolve()
    const primary = `${type}(${main.types[type]!.map(({ name, type }) => `${type} ${name}`)})`

    if (imports.size === 0)
      return new TextEncoder().encode(primary)

    let encoded = primary

    for (const type of [...imports].sort())
      encoded += `${type}(${main.types[type]!.map(({ name, type }) => `${type} ${name}`)})`

    return new TextEncoder().encode(encoded)
  }

  hash() {
    const { main, type } = this

    const cached = main.cache.get(type)

    if (cached != null)
      return cached

    const hashed = keccak256.digest(this.#encode())

    main.cache.set(type, hashed)

    return hashed
  }

}

export class EIP712Array {

  constructor(
    readonly main: EIP712Context,
    readonly type: string,
    readonly data: readonly unknown[],
  ) { }

  hash() {
    const { main, type, data } = this

    const cursor = new Cursor(new Uint8Array(data.length * 32))

    for (const subdata of data)
      new EIP712Field(main, type, subdata).write(cursor)

    return keccak256.digest(cursor.bytes)
  }

}

export class EIP712Field {

  constructor(
    readonly main: EIP712Context,
    readonly type: string,
    readonly data: unknown,
  ) { }

  write(cursor: Cursor) {
    const { main, type, data } = this

    if (main.types[type] != null) {
      /**
       * EIP712 Struct
       */

      const subdata = data as Record<string, unknown>
      const subhash = new EIP712Struct(main, type, subdata).hash()

      cursor.write(subhash)

      return
    }

    if (type.endsWith("]")) {
      /**
       * EIP712 Array
       */

      const subtype = type.slice(0, type.lastIndexOf("["))
      const subdata = data as readonly unknown[]
      const subhash = new EIP712Array(main, subtype, subdata).hash()

      cursor.write(subhash)

      return
    }

    if (type === "string") {
      /**
       * EIP712 String
       */

      if (data instanceof Uint8Array) {
        const subhash = keccak256.digest(data)

        cursor.write(subhash)

        return
      }

      if (typeof data === "string") {
        const subhash = keccak256.digest(new TextEncoder().encode(data))

        cursor.write(subhash)

        return
      }

      throw new Error(`Could not encode string`)
    }

    if (type === "bytes") {
      /**
       * EIP712 Bytes
       */

      if (data instanceof Uint8Array) {
        const subhash = keccak256.digest(data)

        cursor.write(subhash)

        return
      }

      if (typeof data === "string") {
        const subhash = keccak256.digest(Uint8Array.fromHex(base16.padStart(data.slice(2))))

        cursor.write(subhash)

        return
      }

      throw new Error(`Could not encode bytes`)
    }

    if (type === "bool") {
      /**
       * ABI Bool
       */

      const subdata = Boolean(data)

      AbiBool.from(subdata).write(cursor)

      return
    }

    if (type === "address") {
      /**
       * ABI Address
       */

      const subdata = String(data)

      AbiAddress.from(subdata).write(cursor)

      return
    }

    if (type.startsWith("uint")) {
      /**
       * ABI Uint
       */

      const subdata = BigInt(data as bigint | number | string)

      EIP712Field.uints[type].from(subdata).write(cursor)

      return
    }

    if (type.startsWith("int")) {
      /**
       * ABI Int
       */

      const subdata = BigInt(data as bigint | number | string)

      EIP712Field.ints[type].from(subdata).write(cursor)

      return
    }

    if (type.startsWith("bytes")) {
      /**
       * ABI Bytes (static only)
       */

      const subdata = data as Uint8Array

      EIP712Field.bytes[type].from(subdata).write(cursor)

      return
    }

    throw new Error(`Unknown type ${type}`)
  }

}

export namespace EIP712Field {

  export const uints: Record<string, AbiReadable> = {
    uint8: AbiUint8,
    uint16: AbiUint16,
    uint24: AbiUint24,
    uint32: AbiUint32,
    uint40: AbiUint40,
    uint48: AbiUint48,
    uint56: AbiUint56,
    uint64: AbiUint64,
    uint72: AbiUint72,
    uint80: AbiUint80,
    uint88: AbiUint88,
    uint96: AbiUint96,
    uint104: AbiUint104,
    uint112: AbiUint112,
    uint120: AbiUint120,
    uint128: AbiUint128,
    uint136: AbiUint136,
    uint144: AbiUint144,
    uint152: AbiUint152,
    uint160: AbiUint160,
    uint168: AbiUint168,
    uint176: AbiUint176,
    uint184: AbiUint184,
    uint192: AbiUint192,
    uint200: AbiUint200,
    uint208: AbiUint208,
    uint216: AbiUint216,
    uint224: AbiUint224,
    uint232: AbiUint232,
    uint240: AbiUint240,
    uint248: AbiUint248,
    uint256: AbiUint256,
    uint: AbiUint256,
  }

  export const ints: Record<string, AbiReadable> = {
    int8: AbiInt8,
    int16: AbiInt16,
    int24: AbiInt24,
    int32: AbiInt32,
    int40: AbiInt40,
    int48: AbiInt48,
    int56: AbiInt56,
    int64: AbiInt64,
    int72: AbiInt72,
    int80: AbiInt80,
    int88: AbiInt88,
    int96: AbiInt96,
    int104: AbiInt104,
    int112: AbiInt112,
    int120: AbiInt120,
    int128: AbiInt128,
    int136: AbiInt136,
    int144: AbiInt144,
    int152: AbiInt152,
    int160: AbiInt160,
    int168: AbiInt168,
    int176: AbiInt176,
    int184: AbiInt184,
    int192: AbiInt192,
    int200: AbiInt200,
    int208: AbiInt208,
    int216: AbiInt216,
    int224: AbiInt224,
    int232: AbiInt232,
    int240: AbiInt240,
    int248: AbiInt248,
    int256: AbiInt256,
    int: AbiInt256,
  }

  export const bytes: Record<string, AbiReadable> = {
    bytes1: AbiBytes1,
    bytes2: AbiBytes2,
    bytes3: AbiBytes3,
    bytes4: AbiBytes4,
    bytes5: AbiBytes5,
    bytes6: AbiBytes6,
    bytes7: AbiBytes7,
    bytes8: AbiBytes8,
    bytes9: AbiBytes9,
    bytes10: AbiBytes10,
    bytes11: AbiBytes11,
    bytes12: AbiBytes12,
    bytes13: AbiBytes13,
    bytes14: AbiBytes14,
    bytes15: AbiBytes15,
    bytes16: AbiBytes16,
    bytes17: AbiBytes17,
    bytes18: AbiBytes18,
    bytes19: AbiBytes19,
    bytes20: AbiBytes20,
    bytes21: AbiBytes21,
    bytes22: AbiBytes22,
    bytes23: AbiBytes23,
    bytes24: AbiBytes24,
    bytes25: AbiBytes25,
    bytes26: AbiBytes26,
    bytes27: AbiBytes27,
    bytes28: AbiBytes28,
    bytes29: AbiBytes29,
    bytes30: AbiBytes30,
    bytes31: AbiBytes31,
    bytes32: AbiBytes32,
  }

}