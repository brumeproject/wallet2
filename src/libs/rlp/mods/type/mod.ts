import { Cursor } from "@hazae41/cursor";
import { RlpItem, RlpItem1, RlpItem55, RlpItemUint16, RlpItemUint24, RlpItemUint32, RlpItemUint8 } from "../item/mod.ts";
import { RlpList, RlpList55, RlpListUint16, RlpListUint24, RlpListUint32, RlpListUint8 } from "../list/mod.ts";

export type RlpType =
  | RlpItem
  | RlpList

export namespace RlpType {

  export function read(cursor: Cursor) {
    const first = cursor.getUint8()

    if (first < 0x80)
      return RlpItem1.read(cursor)
    if (first < 184)
      return RlpItem55.read(cursor)
    if (first === 184)
      return RlpItemUint8.read(cursor)
    if (first === 185)
      return RlpItemUint16.read(cursor)
    if (first === 186)
      return RlpItemUint24.read(cursor)
    if (first === 187)
      return RlpItemUint32.read(cursor)

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