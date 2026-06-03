import { Writable } from "@hazae41/binary";
import { Cursor } from "@hazae41/cursor";
import { RlpType } from "../type/mod.ts";

export class RlpList55 {

  constructor(
    readonly value: Writable[],
    readonly length: number
  ) { }

  size(): number {
    return 1 + this.length
  }

  write(cursor: Cursor) {
    cursor.writeUint8(0xc0 + this.length)

    for (const element of this.value)
      element.write(cursor)

    return
  }

  static read(cursor: Cursor) {
    const length = cursor.readUint8() - 0xc0

    const start = cursor.offset
    const value = new Array<RlpType>()

    while (cursor.offset - start < length)
      value.push(RlpType.read(cursor))

    return new RlpList55(value, length)
  }

}

export class RlpListUint8 {

  constructor(
    readonly value: Writable[],
    readonly length: number
  ) { }

  size(): number {
    return 1 + 1 + this.length
  }

  write(cursor: Cursor) {
    cursor.writeUint8(0xf7 + 1)
    cursor.writeUint8(this.length)

    for (const element of this.value)
      element.write(cursor)

    return
  }

  static read(cursor: Cursor) {
    cursor.offset++

    const length = cursor.readUint8()

    const start = cursor.offset
    const value = new Array<RlpType>()

    while (cursor.offset - start < length)
      value.push(RlpType.read(cursor))

    return new RlpListUint8(value, length)
  }

}

export class RlpListUint16 {

  constructor(
    readonly value: Writable[],
    readonly length: number
  ) { }

  size(): number {
    return 1 + 2 + this.length
  }

  write(cursor: Cursor) {
    cursor.writeUint8(0xf7 + 2)
    cursor.writeUint16(this.length)

    for (const element of this.value)
      element.write(cursor)

    return
  }

  static read(cursor: Cursor) {
    cursor.offset++

    const length = cursor.readUint16()

    const start = cursor.offset
    const value = new Array<RlpType>()

    while (cursor.offset - start < length)
      value.push(RlpType.read(cursor))

    return new RlpListUint16(value, length)
  }

}

export class RlpListUint24 {

  constructor(
    readonly value: Writable[],
    readonly length: number
  ) { }

  size(): number {
    return 1 + 3 + this.length
  }

  write(cursor: Cursor) {
    cursor.writeUint8(0xf7 + 3)
    cursor.writeUint24(this.length)

    for (const element of this.value)
      element.write(cursor)

    return
  }

  static read(cursor: Cursor) {
    cursor.offset++

    const length = cursor.readUint24()

    const start = cursor.offset
    const value = new Array<RlpType>()

    while (cursor.offset - start < length)
      value.push(RlpType.read(cursor))

    return new RlpListUint24(value, length)
  }

}

export class RlpListUint32 {

  constructor(
    readonly value: Writable[],
    readonly length: number
  ) { }

  size(): number {
    return 1 + 4 + this.length
  }

  write(cursor: Cursor) {
    cursor.writeUint8(0xf7 + 4)
    cursor.writeUint32(this.length)

    for (const element of this.value)
      element.write(cursor)

    return
  }

  static read(cursor: Cursor) {
    cursor.offset++

    const length = cursor.readUint32()

    const start = cursor.offset
    const value = new Array<RlpType>()

    while (cursor.offset - start < length)
      value.push(RlpType.read(cursor))

    return new RlpListUint32(value, length)
  }

}

export type RlpList =
  | RlpList55
  | RlpListUint8
  | RlpListUint16
  | RlpListUint24
  | RlpListUint32

export namespace RlpList {

  export type From = Writable[]

  export function from(value: From): RlpList {
    const size = value.reduce((a, b) => a + b.size(), 0)

    if (size < 56)
      return new RlpList55(value, size)
    if (size < 256)
      return new RlpListUint8(value, size)
    if (size < 65_536)
      return new RlpListUint16(value, size)
    if (size < 16_777_216)
      return new RlpListUint24(value, size)

    return new RlpListUint32(value, size)
  }

}

export namespace RlpList {

  export function read(cursor: Cursor) {
    const first = cursor.getUint8()

    if (first < 192)
      throw new Error()
    if (first < 248)
      return RlpList55.read(cursor)
    if (first === 248)
      return RlpListUint8.read(cursor)
    if (first === 249)
      return RlpListUint16.read(cursor)
    if (first === 250)
      return RlpListUint24.read(cursor)
    if (first === 251)
      return RlpListUint32.read(cursor)
    if (first < 256)
      throw new Error()

    throw new Error()
  }

}

export namespace RlpList {

  export function as(value: unknown) {
    if (value instanceof RlpList55)
      return value
    if (value instanceof RlpListUint8)
      return value
    if (value instanceof RlpListUint16)
      return value
    if (value instanceof RlpListUint24)
      return value
    if (value instanceof RlpListUint32)
      return value
    throw new Error()
  }

}