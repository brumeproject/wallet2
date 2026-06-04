import { Cursor } from "@hazae41/cursor";

export interface AbiWritable<T> {

  size(): number

  write(cursor: Cursor): void

  into(): T

}

export namespace AbiWritable {

  export type All<T extends unknown[]> = { [K in keyof T]: AbiWritable<T[K]> }

}