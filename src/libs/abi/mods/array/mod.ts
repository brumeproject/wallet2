import { AbiReadable } from "@/libs/abi/mods/readable/mod.ts";
import { AbiUint32 } from "@/libs/abi/mods/uint/mod.ts";
import { AbiWritable } from "@/libs/abi/mods/writable/mod.ts";
import { Cursor } from "@hazae41/cursor";

export class AbiReadableArray<T, N extends number> {

  constructor(
    readonly type: AbiReadable<T>,
    readonly size: N
  ) { }

  get kind() {
    return this.type.kind
  }

  from(froms: T[] & { length: N }) {
    const intos = new Array<T>()
    const heads = new Array<AbiWritable>()
    const tails = new Array<AbiWritable>()

    let offset = this.size * 32

    for (let i = 0; i < this.size; i++) {
      const from = froms[i]
      const type = this.type
      const data = type.from(from)

      if (type.kind === "dynamic") {
        const pointer = AbiUint32.from(BigInt(offset))

        intos.push(from)
        heads.push(pointer)
        tails.push(data)

        offset += data.size()

        continue
      }

      intos.push(from)
      heads.push(data)

      continue
    }

    return new AbiWritableArray<T, N>(intos as T[] & { length: N }, heads, tails, offset)
  }

  read(cursor: Cursor) {
    const start = cursor.offset

    const intos = new Array<T>()
    const heads = new Array<AbiWritable>()
    const tails = new Array<AbiWritable>()

    let offset = this.size * 32

    for (let i = 0; i < this.size; i++) {
      const type = this.type

      if (type.kind === "dynamic") {
        const pointer = AbiUint32.read(cursor)
        const pointed = Number(pointer.into())

        const subcursor = new Cursor(cursor.bytes)

        subcursor.offset = start + pointed // = offset

        const data = type.read(subcursor)

        offset = subcursor.offset

        intos.push(data.into())
        heads.push(pointer)
        tails.push(data)

        continue
      } else {
        const data = type.read(cursor)

        intos.push(data.into())
        heads.push(data)

        continue
      }
    }

    cursor.offset = offset

    return new AbiWritableArray<T, N>(intos as T[] & { length: N }, heads, tails, cursor.offset - start)
  }

}

export class AbiWritableArray<T, N extends number> {

  constructor(
    readonly intos: T[] & { length: N },
    readonly heads: AbiWritable[],
    readonly tails: AbiWritable[],
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
    return this.intos
  }

}