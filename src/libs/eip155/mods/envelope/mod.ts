import { Unknown, Writable } from "@hazae41/binary";
import { Cursor } from "@hazae41/cursor";

export class TypedTransactionEnvelope<T extends Writable> {

  constructor(
    readonly type: number,
    readonly data: T,
  ) { }

  static read(cursor: Cursor) {
    const type = cursor.readUint8()
    const data = cursor.read(type)

    return new TypedTransactionEnvelope(type, new Unknown(data))
  }

  size(): number {
    return 1 + this.data.size()
  }

  write(cursor: Cursor) {
    cursor.writeUint8(this.type)
    this.data.write(cursor)
  }

}