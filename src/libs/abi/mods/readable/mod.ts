import { AbiWritable } from "@/libs/abi/mods/writable/mod.ts";
import { Cursor } from "@hazae41/cursor";

export interface AbiReadable<T = unknown> {

  readonly kind: "static" | "dynamic"

  from(value: T): AbiWritable<T>

  read(cursor: Cursor): AbiWritable<T>

}