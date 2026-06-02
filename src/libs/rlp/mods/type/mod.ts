import { Cursor } from "@hazae41/cursor";
import { RlpItem, RlpItem1, RlpItem55, RlpItemUint16, RlpItemUint24, RlpItemUint32, RlpItemUint8 } from "../item/mod.ts";
import { RlpList, RlpList55, RlpListUint16, RlpListUint24, RlpListUint32, RlpListUint8 } from "../list/mod.ts";

export type RlpType =
  | RlpItem
  | RlpList

export namespace RlpType {

  export function readOrThrow(cursor: Cursor) {
    const first = cursor.getUint8OrThrow()

    if (first < 0x80)
      return RlpItem1.readOrThrow(cursor)
    if (first < 184)
      return RlpItem55.readOrThrow(cursor)
    if (first === 184)
      return RlpItemUint8.readOrThrow(cursor)
    if (first === 185)
      return RlpItemUint16.readOrThrow(cursor)
    if (first === 186)
      return RlpItemUint24.readOrThrow(cursor)
    if (first === 187)
      return RlpItemUint32.readOrThrow(cursor)

    if (first < 192)
      throw new Error()
    if (first < 248)
      return RlpList55.readOrThrow(cursor)
    if (first === 248)
      return RlpListUint8.readOrThrow(cursor)
    if (first === 249)
      return RlpListUint16.readOrThrow(cursor)
    if (first === 250)
      return RlpListUint24.readOrThrow(cursor)
    if (first === 251)
      return RlpListUint32.readOrThrow(cursor)
    if (first < 256)
      throw new Error()

    throw new Error()
  }

}