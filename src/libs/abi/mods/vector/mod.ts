import { AbiReadable } from "@/libs/abi/mods/readable/mod.ts";
import { AbiUint32 } from "@/libs/abi/mods/uint/mod.ts";
import { AbiWritable } from "@/libs/abi/mods/writable/mod.ts";
import { Cursor } from "@hazae41/cursor";

export class AbiReadableVector<T> {

  readonly kind = "dynamic"

  constructor(
    readonly type: AbiReadable<T>
  ) { }

  from(froms: T[]) {
    const length = froms.length

    const intos = new Array<T>()
    const heads = new Array<AbiWritable>()
    const tails = new Array<AbiWritable>()

    let offset = length * 32

    for (let i = 0; i < length; i++) {
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

    return new AbiWritableVector<T>(intos, heads, tails, offset)
  }

  read(cursor: Cursor) {
    const length = Number(AbiUint32.read(cursor).into())

    const start = cursor.offset

    const intos = new Array<T>()
    const heads = new Array<AbiWritable>()
    const tails = new Array<AbiWritable>()

    let offset = length * 32

    for (let i = 0; i < length; i++) {
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

    return new AbiWritableVector<T>(intos, heads, tails, cursor.offset - start)
  }

}

export class AbiWritableVector<T> {

  constructor(
    readonly intos: T[],
    readonly heads: AbiWritable[],
    readonly tails: AbiWritable[],
    readonly sized: number,
  ) { }

  size() {
    return 32 + this.sized
  }

  write(cursor: Cursor) {
    AbiUint32.from(BigInt(this.intos.length)).write(cursor)

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