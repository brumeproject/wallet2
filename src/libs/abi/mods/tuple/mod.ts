import { AbiReadable } from "@/libs/abi/mods/readable/mod.ts";
import { AbiUint32 } from "@/libs/abi/mods/uint/mod.ts";
import { AbiWritable } from "@/libs/abi/mods/writable/mod.ts";
import { Cursor } from "@hazae41/cursor";

export class AbiReadableTuple<T extends readonly unknown[]> {

  constructor(
    readonly types: { [K in keyof T]: AbiReadable<T[K]> }
  ) { }

  get kind() {
    return this.types.find(type => type.kind === "dynamic") ? "dynamic" : "static"
  }

  from(froms: T) {
    const intos = new Array<unknown>()
    const heads = new Array<AbiWritable>()
    const tails = new Array<AbiWritable>()

    let offset = this.types.length * 32

    for (let i = 0; i < this.types.length; i++) {
      const from = froms[i]
      const type = this.types[i]
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

    return new AbiWritableTuple<T>(intos as unknown as T, heads, tails, offset)
  }

  read(cursor: Cursor) {
    const start = cursor.offset

    const intos = new Array<unknown>()
    const heads = new Array<AbiWritable>()
    const tails = new Array<AbiWritable>()

    let offset = this.types.length * 32

    for (let i = 0; i < this.types.length; i++) {
      const type = this.types[i]

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
      }

      const data = type.read(cursor)

      intos.push(data.into())
      heads.push(data)

      continue
    }

    cursor.offset = offset

    return new AbiWritableTuple<T>(intos as unknown as T, heads, tails, offset)
  }

}

export class AbiWritableTuple<T extends readonly unknown[]> {

  constructor(
    readonly intos: T,
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