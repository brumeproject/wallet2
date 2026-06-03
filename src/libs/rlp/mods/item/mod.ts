import { Cursor } from "@hazae41/cursor";

export class RlpItem1 {

  constructor(
    readonly value: Uint8Array
  ) { }

  size(): number {
    return this.value.length
  }

  write(cursor: Cursor): void {
    cursor.write(this.value)
  }

  static read(cursor: Cursor) {
    const content = cursor.read(1)
    const bytes = new Uint8Array(content)

    return new RlpItem1(bytes)
  }

}

export class RlpItem55 {

  constructor(
    readonly value: Uint8Array
  ) { }

  size(): number {
    return 1 + this.value.length
  }

  write(cursor: Cursor): void {
    cursor.writeUint8(0x80 + this.value.length)
    cursor.write(this.value)
  }

  static read(cursor: Cursor) {
    const length = cursor.readUint8() - 0x80
    const value = cursor.read(length)
    const bytes = new Uint8Array(value)

    return new RlpItem55(bytes)
  }

}

export class RlpItemUint8 {

  constructor(
    readonly value: Uint8Array
  ) { }

  size(): number {
    return 1 + 1 + this.value.length
  }

  write(cursor: Cursor) {
    cursor.writeUint8(0xb7 + 1)
    cursor.writeUint8(this.value.length)
    cursor.write(this.value)
  }

  static read(cursor: Cursor) {
    cursor.offset++

    const length = cursor.readUint8()
    const value = cursor.read(length)
    const bytes = new Uint8Array(value)

    return new RlpItemUint8(bytes)
  }

}

export class RlpItemUint16 {

  constructor(
    readonly value: Uint8Array
  ) { }

  size() {
    return 1 + 2 + this.value.length
  }

  write(cursor: Cursor) {
    cursor.writeUint8(0xb7 + 2)
    cursor.writeUint16(this.value.length)
    cursor.write(this.value)
  }

  static read(cursor: Cursor) {
    cursor.offset++

    const length = cursor.readUint16()
    const value = cursor.read(length)
    const bytes = new Uint8Array(value)

    return new RlpItemUint16(bytes)
  }

}

export class RlpItemUint24 {

  constructor(
    readonly value: Uint8Array
  ) { }

  size() {
    return 1 + 3 + this.value.length
  }

  write(cursor: Cursor) {
    cursor.writeUint8(0xb7 + 3)
    cursor.writeUint24(this.value.length)
    cursor.write(this.value)
  }

  static read(cursor: Cursor) {
    cursor.offset++

    const length = cursor.readUint24()
    const value = cursor.read(length)
    const bytes = new Uint8Array(value)

    return new RlpItemUint24(bytes)
  }

}

export class RlpItemUint32 {

  constructor(
    readonly value: Uint8Array
  ) { }

  size() {
    return 1 + 4 + this.value.length
  }

  write(cursor: Cursor) {
    cursor.writeUint8(0xb7 + 4)
    cursor.writeUint32(this.value.length)
    cursor.write(this.value)
  }

  static read(cursor: Cursor) {
    cursor.offset++

    const length = cursor.readUint32()
    const value = cursor.read(length)
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

  export function from(value: From): RlpItem {
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

  export function read(cursor: Cursor) {
    const first = cursor.getUint8()

    if (first < 0x80)
      return RlpItem1.read(cursor)
    if (first < 184)
      return RlpItem55.read(cursor)
    if (first === 184)
      return RlpItemUint8.read(cursor)
    if (first === 185)
      return RlpItemUint16.read(cursor)
    if (first === 186)
      return RlpItemUint24.read(cursor)
    if (first === 187)
      return RlpItemUint32.read(cursor)

    throw new Error()
  }

}

export namespace RlpItem {

  export function as(value: unknown) {
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