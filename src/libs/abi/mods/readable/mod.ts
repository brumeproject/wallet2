import { AbiWritable } from "@/libs/abi/mods/writable/mod.ts";
import { Cursor } from "@hazae41/cursor";

export interface AbiReadable<T> {

  readonly kind: "static" | "dynamic"

  from(value: T): AbiWritable<T>

  read(cursor: Cursor): AbiWritable<T>

}

export namespace AbiReadable {

  export type All<T extends unknown[]> = { [K in keyof T]: AbiReadable<T[K]> }

}