import { RlpDataLike, RlpUintLike } from "@/libs/eip155/libs/rlp/mod.ts";
import { TypedTransactionEnvelope } from "@/libs/eip155/mods/envelope/mod.ts";
import { RlpItem } from "@/libs/rlp/mods/item/mod.ts";
import { RlpList } from "@/libs/rlp/mods/list/mod.ts";
import { Readable, Writable } from "@hazae41/binary";

export interface UnsignedTransactionInit2 {
  readonly chainId: RlpUintLike
  readonly nonce: RlpUintLike

  readonly maxFeePerGas: RlpUintLike
  readonly maxPriorityFeePerGas: RlpUintLike
  readonly gasLimit: RlpUintLike

  readonly to?: RlpDataLike
  readonly value: RlpUintLike
  readonly data?: RlpDataLike

  readonly accessList?: RlpList
}

export class UnsignedTransaction2 {

  constructor(
    readonly chainId: RlpUintLike,
    readonly nonce: RlpUintLike,
    readonly maxPriorityFeePerGas: RlpUintLike,
    readonly maxFeePerGas: RlpUintLike,
    readonly gasLimit: RlpUintLike,
    readonly to: RlpDataLike = new Uint8Array(),
    readonly value: RlpUintLike,
    readonly data: RlpDataLike = new Uint8Array(),
    readonly accessList: RlpList = RlpList.fromOrThrow([]),
  ) { }

  static from(init: UnsignedTransactionInit2): UnsignedTransaction2 {
    const { chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data, accessList } = init
    return new UnsignedTransaction2(chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data, accessList)
  }

  static decode(bytes: Uint8Array): UnsignedTransaction2 {
    const envelope = Readable.readFromBytesOrThrow(TypedTransactionEnvelope, bytes)

    if (envelope.type !== 0x02)
      throw new Error()

    const list = Readable.readFromBytesOrThrow(RlpList, envelope.data.bytes)

    const chainId = RlpUintLike.from(RlpItem.asOrThrow(list.value[0]))
    const nonce = RlpUintLike.from(RlpItem.asOrThrow(list.value[1]))

    const maxPriorityFeePerGas = RlpUintLike.from(RlpItem.asOrThrow(list.value[2]))
    const maxFeePerGas = RlpUintLike.from(RlpItem.asOrThrow(list.value[3]))
    const gasLimit = RlpUintLike.from(RlpItem.asOrThrow(list.value[4]))

    const to = RlpDataLike.from(RlpItem.asOrThrow(list.value[5]))
    const value = RlpUintLike.from(RlpItem.asOrThrow(list.value[6]))
    const data = RlpDataLike.from(RlpItem.asOrThrow(list.value[7]))

    const accessList = RlpList.asOrThrow(list.value[8])

    return new UnsignedTransaction2(chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data, accessList)
  }

  encode(): Uint8Array {
    const chainId = RlpUintLike.into(this.chainId)
    const nonce = RlpUintLike.into(this.nonce)

    const maxPriorityFeePerGas = RlpUintLike.into(this.maxPriorityFeePerGas)
    const maxFeePerGas = RlpUintLike.into(this.maxFeePerGas)
    const gasLimit = RlpUintLike.into(this.gasLimit)

    const to = RlpDataLike.into(this.to)
    const value = RlpUintLike.into(this.value)
    const data = RlpDataLike.into(this.data)

    const accessList = this.accessList

    const list = RlpList.fromOrThrow([chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data, accessList])

    return Writable.writeToBytesOrThrow(new TypedTransactionEnvelope(0x02, list))
  }

  sign(signature: Uint8Array): SignedTransactionInit2 {
    const { chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data, accessList } = this

    const r = signature.slice(0, 32)
    const s = signature.slice(32, 64)

    const yParity = signature[64]

    return new SignedTransactionInit2(chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data, accessList, yParity, r, s)
  }

}

export interface SignedTransaction2 {
  readonly chainId: RlpUintLike
  readonly nonce: RlpUintLike

  readonly maxFeePerGas: RlpUintLike
  readonly maxPriorityFeePerGas: RlpUintLike
  readonly gasLimit: RlpUintLike

  readonly to?: RlpDataLike
  readonly value: RlpUintLike
  readonly data?: RlpDataLike

  readonly accessList?: RlpList

  readonly yParity: RlpUintLike

  readonly r: RlpDataLike
  readonly s: RlpDataLike
}

export class SignedTransactionInit2 {

  constructor(
    readonly chainId: RlpUintLike,
    readonly nonce: RlpUintLike,
    readonly maxPriorityFeePerGas: RlpUintLike,
    readonly maxFeePerGas: RlpUintLike,
    readonly gasLimit: RlpUintLike,
    readonly to: RlpDataLike = new Uint8Array(),
    readonly value: RlpUintLike,
    readonly data: RlpDataLike = new Uint8Array(),
    readonly accessList: RlpList = RlpList.fromOrThrow([]),
    readonly yParity: RlpUintLike,
    readonly r: RlpDataLike,
    readonly s: RlpDataLike,
  ) { }

  static from(init: SignedTransactionInit2): SignedTransactionInit2 {
    const { chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data, accessList, yParity, r, s } = init
    return new SignedTransactionInit2(chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data, accessList, yParity, r, s)
  }

  static decode(bytes: Uint8Array): SignedTransactionInit2 {
    const envelope = Readable.readFromBytesOrThrow(TypedTransactionEnvelope, bytes)

    if (envelope.type !== 0x02)
      throw new Error()

    const list = Readable.readFromBytesOrThrow(RlpList, envelope.data.bytes)

    const chainId = RlpUintLike.from(RlpItem.asOrThrow(list.value[0]))
    const nonce = RlpUintLike.from(RlpItem.asOrThrow(list.value[1]))

    const maxPriorityFeePerGas = RlpUintLike.from(RlpItem.asOrThrow(list.value[2]))
    const maxFeePerGas = RlpUintLike.from(RlpItem.asOrThrow(list.value[3]))
    const gasLimit = RlpUintLike.from(RlpItem.asOrThrow(list.value[4]))

    const to = RlpDataLike.from(RlpItem.asOrThrow(list.value[5]))
    const value = RlpUintLike.from(RlpItem.asOrThrow(list.value[6]))
    const data = RlpDataLike.from(RlpItem.asOrThrow(list.value[7]))

    const accessList = RlpList.asOrThrow(list.value[8])

    const yParity = RlpUintLike.from(RlpItem.asOrThrow(list.value[9]))

    const r = RlpDataLike.from(RlpItem.asOrThrow(list.value[10]))
    const s = RlpDataLike.from(RlpItem.asOrThrow(list.value[11]))

    return new SignedTransactionInit2(chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data, accessList, yParity, r, s)
  }

  encode(): Uint8Array {
    const chainId = RlpUintLike.into(this.chainId)
    const nonce = RlpUintLike.into(this.nonce)

    const maxPriorityFeePerGas = RlpUintLike.into(this.maxPriorityFeePerGas)
    const maxFeePerGas = RlpUintLike.into(this.maxFeePerGas)
    const gasLimit = RlpUintLike.into(this.gasLimit)

    const to = RlpDataLike.into(this.to)
    const value = RlpUintLike.into(this.value)
    const data = RlpDataLike.into(this.data)

    const accessList = this.accessList

    const yParity = RlpUintLike.into(this.yParity)

    const r = RlpDataLike.into(this.r)
    const s = RlpDataLike.into(this.s)

    const list = RlpList.fromOrThrow([chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data, accessList, yParity, r, s])

    return Writable.writeToBytesOrThrow(new TypedTransactionEnvelope(0x02, list))
  }

  unsign(): UnsignedTransaction2 {
    const { chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data, accessList } = this
    return new UnsignedTransaction2(chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data, accessList)
  }

}