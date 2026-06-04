import { AbiReadable } from "@/libs/abi/mods/readable/mod.ts";
import { AbiUint32 } from "@/libs/abi/mods/uint/mod.ts";
import { AbiWritable } from "@/libs/abi/mods/writable/mod.ts";
import { Cursor } from "@hazae41/cursor";

export class AbiReadableTuple<T extends unknown[]> {

  constructor(
    readonly types: AbiReadable.All<T>
  ) { }

  from(froms: T) {
    let offset = froms.length * 32

    const array = new Array<unknown>()
    const heads = new Array<AbiWritable<unknown>>()
    const tails = new Array<AbiWritable<unknown>>()

    for (let i = 0; i < this.types.length; i++) {
      const from = froms[i]
      const type = this.types[i]

      const value = type.from(from)

      if (type.kind === "dynamic") {
        const pointer = AbiUint32.from(BigInt(offset))

        array.push(from)
        heads.push(pointer)
        tails.push(value)

        offset += value.size()

        continue
      }

      array.push(from)
      heads.push(value)

      continue
    }

    return new AbiWritableTuple<T>(array as T, heads, tails, offset)
  }

  read(cursor: Cursor) {
    const start = cursor.offset

    const array = new Array<unknown>()
    const heads = new Array<AbiWritable<unknown>>()
    const tails = new Array<AbiWritable<unknown>>()

    let limit = start

    for (const type of this.types) {
      if (type.kind === "dynamic") {
        const pointer = AbiUint32.read(cursor)
        const pointed = Number(pointer.into())

        const subcursor = new Cursor(cursor.bytes)

        subcursor.offset = start + pointed

        const value = type.read(subcursor)

        limit = subcursor.offset

        array.push(value.into())
        heads.push(pointer)
        tails.push(value)

        continue
      } else {
        const value = type.read(cursor)

        array.push(value.into())
        heads.push(value)

        continue
      }
    }

    cursor.offset = Math.max(cursor.offset, limit)

    return new AbiWritableTuple<T>(array as T, heads, tails, cursor.offset - start)
  }

}

export class AbiWritableTuple<T extends unknown[]> {

  constructor(
    readonly value: T,
    readonly heads: AbiWritable<unknown>[],
    readonly tails: AbiWritable<unknown>[],
    readonly sized: number,
  ) { }

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
    return this.value
  }

}