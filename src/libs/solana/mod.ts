import { Cursor } from "@hazae41/cursor";

export class CompactUint16 {

  constructor(
    readonly value: number
  ) { }

  static read(cursor: Cursor) {
    let value = 0
    let shift = 0

    while (true) {
      const byte = cursor.readUint8()

      value |= (byte & 0x7f) << shift

      if ((byte & 0x80) === 0)
        break

      shift += 7
    }

    return new CompactUint16(value)
  }

  size() {
    if (this.value < 128)
      return 1
    if (this.value < 16384)
      return 2
    if (this.value < 65536)
      return 3
    throw new Error()
  }

  write(cursor: Cursor) {
    let value = this.value

    while (value >= 0x80) {
      cursor.writeUint8((value & 0x7f) | 0x80)

      value >>= 7

      continue
    }

    cursor.writeUint8(value)
  }

}