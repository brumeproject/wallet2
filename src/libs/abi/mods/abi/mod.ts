import { AbiReadablePack } from "@/libs/abi/mods/pack/mod.ts";
import { AbiPackable, AbiReadable } from "@/libs/abi/mods/readable/mod.ts";
import { AbiReadableTuple } from "@/libs/abi/mods/tuple/mod.ts";
import { Readable, Writable } from "@hazae41/binary";

export namespace Abi {

  export function decode<T extends readonly unknown[]>(types: { [K in keyof T]: AbiReadable<T[K]> }, raw: Uint8Array): T {
    return Readable.readFromBytes(new AbiReadableTuple(types), raw).into()
  }

  export function encode<T extends readonly unknown[]>(types: { [K in keyof T]: AbiReadable<T[K]> }, froms: NoInfer<T>): Uint8Array {
    return Writable.writeToBytes(new AbiReadableTuple(types).from(froms))
  }

  export function encodePacked<T extends readonly unknown[]>(types: { [K in keyof T]: AbiPackable<T[K]> }, froms: NoInfer<T>): Uint8Array {
    return Writable.writeToBytes(new AbiReadablePack(types).from(froms))
  }
}