import { AbiPackable } from "@/libs/abi/mods/readable/mod.ts";
import { AbiWritable } from "@/libs/abi/mods/writable/mod.ts";
import { Cursor } from "@hazae41/cursor";

export class AbiReadablePack<T extends readonly unknown[]> {

  constructor(
    readonly types: { [K in keyof T]: AbiPackable<T[K]> }
  ) { }

  from(froms: T) {
    const intos = new Array<unknown>()
    const packs = new Array<AbiWritable>()

    let offset = 0

    for (let i = 0; i < this.types.length; i++) {
      const from = froms[i]
      const type = this.types[i]
      const data = type.pack(from)

      intos.push(from)
      packs.push(data)

      offset += data.size()

      continue
    }

    return new AbiWritablePack<T>(intos as unknown as T, packs, offset)
  }

}

export class AbiWritablePack<T extends readonly unknown[]> {

  constructor(
    readonly intos: T,
    readonly packs: AbiWritable[],
    readonly sized: number
  ) { }

  size() {
    return this.sized
  }

  write(cursor: Cursor) {
    for (const pack of this.packs)
      pack.write(cursor)
    return
  }

  into() {
    return this.intos
  }

}