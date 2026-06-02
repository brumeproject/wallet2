import { Unknown, Writable } from "@hazae41/binary";
import { Cursor } from "@hazae41/cursor";

export class TypedTransactionEnvelope<T extends Writable> {

  constructor(
    readonly type: number,
    readonly data: T,
  ) { }

  static readOrThrow(cursor: Cursor) {
    const type = cursor.readUint8OrThrow()
    const data = cursor.readOrThrow(type)

    return new TypedTransactionEnvelope(type, new Unknown(data))
  }

  sizeOrThrow(): number {
    return 1 + this.data.sizeOrThrow()
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeUint8OrThrow(this.type)
    this.data.writeOrThrow(cursor)
  }

}