import { Cursor } from "@hazae41/cursor";

export interface AbiWritable<T = unknown> {

  size(): number

  write(cursor: Cursor): void

  into(): T

}