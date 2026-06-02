import { Cursor } from "@hazae41/cursor";

export class RlpItem1 {

  constructor(
    readonly value: Uint8Array
  ) { }

  sizeOrThrow(): number {
    return this.value.length
  }

  writeOrThrow(cursor: Cursor): void {
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(1)
    const bytes = new Uint8Array(content)

    return new RlpItem1(bytes)
  }

}

export class RlpItem55 {

  constructor(
    readonly value: Uint8Array
  ) { }

  isItem(): this is RlpItem55 {
    return true
  }

  isList(): false {
    return false
  }

  sizeOrThrow(): number {
    return 1 + this.value.length
  }

  writeOrThrow(cursor: Cursor): void {
    cursor.writeUint8OrThrow(0x80 + this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    const length = cursor.readUint8OrThrow() - 0x80
    const value = cursor.readOrThrow(length)
    const bytes = new Uint8Array(value)

    return new RlpItem55(bytes)
  }

}

export class RlpItemUint8 {

  constructor(
    readonly value: Uint8Array
  ) { }

  sizeOrThrow(): number {
    return 1 + 1 + this.value.length
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeUint8OrThrow(0xb7 + 1)
    cursor.writeUint8OrThrow(this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset++

    const length = cursor.readUint8OrThrow()
    const value = cursor.readOrThrow(length)
    const bytes = new Uint8Array(value)

    return new RlpItemUint8(bytes)
  }

}

export class RlpItemUint16 {

  constructor(
    readonly value: Uint8Array
  ) { }

  sizeOrThrow() {
    return 1 + 2 + this.value.length
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeUint8OrThrow(0xb7 + 2)
    cursor.writeUint16OrThrow(this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset++

    const length = cursor.readUint16OrThrow()
    const value = cursor.readOrThrow(length)
    const bytes = new Uint8Array(value)

    return new RlpItemUint16(bytes)
  }

}

export class RlpItemUint24 {

  constructor(
    readonly value: Uint8Array
  ) { }

  sizeOrThrow() {
    return 1 + 3 + this.value.length
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeUint8OrThrow(0xb7 + 3)
    cursor.writeUint24OrThrow(this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset++

    const length = cursor.readUint24OrThrow()
    const value = cursor.readOrThrow(length)
    const bytes = new Uint8Array(value)

    return new RlpItemUint24(bytes)
  }

}

export class RlpItemUint32 {

  constructor(
    readonly value: Uint8Array
  ) { }

  sizeOrThrow() {
    return 1 + 4 + this.value.length
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeUint8OrThrow(0xb7 + 4)
    cursor.writeUint32OrThrow(this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset++

    const length = cursor.readUint32OrThrow()
    const value = cursor.readOrThrow(length)
    const bytes = new Uint8Array(value)

    return new RlpItemUint32(bytes)
  }

}

export type RlpItem =
  | RlpItem1
  | RlpItem55
  | RlpItemUint8
  | RlpItemUint16
  | RlpItemUint24
  | RlpItemUint32

export namespace RlpItem {

  export type From = Uint8Array

  export function fromOrThrow(value: From): RlpItem {
    if (value.length === 1 && value[0] < 0x80)
      return new RlpItem1(value)
    if (value.length < 56)
      return new RlpItem55(value)
    if (value.length < 256)
      return new RlpItemUint8(value)
    if (value.length < 65_536)
      return new RlpItemUint16(value)
    if (value.length < 16_777_216)
      return new RlpItemUint24(value)
    return new RlpItemUint32(value)
  }

}

export namespace RlpItem {

  export function readOrThrow(cursor: Cursor) {
    const first = cursor.getUint8OrThrow()

    if (first < 0x80)
      return RlpItem1.readOrThrow(cursor)
    if (first < 184)
      return RlpItem55.readOrThrow(cursor)
    if (first === 184)
      return RlpItemUint8.readOrThrow(cursor)
    if (first === 185)
      return RlpItemUint16.readOrThrow(cursor)
    if (first === 186)
      return RlpItemUint24.readOrThrow(cursor)
    if (first === 187)
      return RlpItemUint32.readOrThrow(cursor)

    throw new Error()
  }

}

export namespace RlpItem {

  export function asOrThrow(value: unknown) {
    if (value instanceof RlpItem1)
      return value
    if (value instanceof RlpItem55)
      return value
    if (value instanceof RlpItemUint8)
      return value
    if (value instanceof RlpItemUint16)
      return value
    if (value instanceof RlpItemUint24)
      return value
    if (value instanceof RlpItemUint32)
      return value
    throw new Error()
  }

}