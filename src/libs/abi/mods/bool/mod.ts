import { Cursor } from "@hazae41/cursor";

export type AbiBool =
  | AbiTrue
  | AbiFalse

export namespace AbiBool {

  export const kind = "static"

  export type Packed =
    | AbiTrue.Packed
    | AbiFalse.Packed

  export function from(value: boolean) {
    return value ? new AbiTrue() : new AbiFalse()
  }

  export function pack(value: boolean) {
    return value ? new AbiTrue.Packed() : new AbiFalse.Packed()
  }

  export function read(cursor: Cursor) {
    cursor.offset += 31

    const value = cursor.readUint8()

    return value ? new AbiTrue() : new AbiFalse()
  }

}

export class AbiTrue {

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.offset += 31

    cursor.writeUint8(1)

    return
  }

  into() {
    return true
  }

}

export namespace AbiTrue {

  export class Packed {

    size() {
      return 1
    }

    write(cursor: Cursor) {
      cursor.writeUint8(1)
    }

    into() {
      return true
    }

  }

}

export class AbiFalse {

  size() {
    return 32
  }

  write(cursor: Cursor) {
    cursor.offset += 31

    cursor.writeUint8(0)

    return
  }

  into() {
    return false
  }

}

export namespace AbiFalse {

  export class Packed {

    size() {
      return 1
    }

    write(cursor: Cursor) {
      cursor.writeUint8(0)
    }

    into() {
      return false
    }

  }

}