import { AbiUint32 } from "@/libs/abi/mods/uint/mod.ts";
import { Cursor } from "@hazae41/cursor";

export interface AbiReadable {

  readonly kind: "static" | "dynamic"

  read(cursor: Cursor): AbiWritable

}

export interface AbiWritable {

  readonly kind: "static" | "dynamic"

  size(): number

  write(cursor: Cursor): void

}

export class AbiReadableTuple {

  constructor(
    readonly types: AbiReadable[]
  ) { }

  read(cursor: Cursor) {
    const start = cursor.offset

    const array = new Array<AbiWritable>()
    const heads = new Array<AbiWritable>()
    const tails = new Array<AbiWritable>()

    let limit = start

    for (const type of this.types) {
      if (type.kind === "dynamic") {
        const pointer = AbiUint32.read(cursor)
        const pointed = Number(pointer.into())

        const subcursor = new Cursor(cursor.bytes)

        subcursor.offset = start + pointed

        const value = type.read(subcursor)

        limit = subcursor.offset

        array.push(value)
        heads.push(pointer)
        tails.push(value)

        continue
      } else {
        const value = type.read(cursor)

        array.push(value)
        heads.push(value)

        continue
      }
    }

    cursor.offset = Math.max(cursor.offset, limit)

    return new AbiWritableTuple(array, heads, tails, cursor.offset - start)
  }

}

export class AbiWritableTuple {

  constructor(
    readonly array: AbiWritable[],
    readonly heads: AbiWritable[],
    readonly tails: AbiWritable[],
    readonly sized: number,
  ) { }

  static from(values: AbiWritable[]) {
    let offset = values.length * 32

    const array = new Array<AbiWritable>()
    const heads = new Array<AbiWritable>()
    const tails = new Array<AbiWritable>()

    for (const value of values) {
      const size = value.size()

      if (value.kind === "dynamic") {
        const pointer = AbiUint32.from(offset)

        array.push(value)
        heads.push(pointer)
        tails.push(value)

        offset += size

        continue
      }

      array.push(value)
      heads.push(value)

      continue
    }

    return new AbiWritableTuple(array, heads, tails, offset)
  }

  size() {
    return this.sized
  }

  write(cursor: Cursor) {
    for (const head of this.heads)
      head.write(cursor)

    for (const tail of this.tails)
      tail.write(cursor)

    return
  }

  into() {
    return this.array
  }

}