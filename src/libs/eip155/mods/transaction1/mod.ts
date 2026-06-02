import { RlpDataLike, RlpUintLike } from "@/libs/eip155/libs/rlp/mod.ts";
import { TypedTransactionEnvelope } from "@/libs/eip155/mods/envelope/mod.ts";
import { RlpItem } from "@/libs/rlp/mods/item/mod.ts";
import { RlpList } from "@/libs/rlp/mods/list/mod.ts";
import { Readable, Writable } from "@hazae41/binary";

export interface UnsignedTransactionInit1 {
  readonly chainId: RlpUintLike
  readonly nonce: RlpUintLike

  readonly gasPrice: RlpUintLike
  readonly gasLimit: RlpUintLike

  readonly to?: RlpDataLike
  readonly value: RlpUintLike
  readonly data?: RlpDataLike

  readonly accessList?: RlpList
}

export class UnsignedTransaction1 {

  constructor(
    readonly chainId: RlpUintLike,
    readonly nonce: RlpUintLike,
    readonly gasPrice: RlpUintLike,
    readonly gasLimit: RlpUintLike,
    readonly to: RlpDataLike = new Uint8Array(),
    readonly value: RlpUintLike,
    readonly data: RlpDataLike = new Uint8Array(),
    readonly accessList: RlpList = RlpList.fromOrThrow([]),
  ) { }

  static from(init: UnsignedTransactionInit1): UnsignedTransaction1 {
    const { chainId, nonce, gasPrice, gasLimit, to, value, data, accessList } = init
    return new UnsignedTransaction1(chainId, nonce, gasPrice, gasLimit, to, value, data, accessList)
  }

  static decode(bytes: Uint8Array): UnsignedTransaction1 {
    const envelope = Readable.readFromBytesOrThrow(TypedTransactionEnvelope, bytes)

    if (envelope.type !== 0x01)
      throw new Error()

    const list = Readable.readFromBytesOrThrow(RlpList, envelope.data.bytes)

    const chainId = RlpUintLike.from(RlpItem.asOrThrow(list.value[0]))
    const nonce = RlpUintLike.from(RlpItem.asOrThrow(list.value[1]))
    const gasPrice = RlpUintLike.from(RlpItem.asOrThrow(list.value[2]))
    const gasLimit = RlpUintLike.from(RlpItem.asOrThrow(list.value[3]))

    const to = RlpDataLike.from(RlpItem.asOrThrow(list.value[4]))
    const value = RlpUintLike.from(RlpItem.asOrThrow(list.value[5]))
    const data = RlpDataLike.from(RlpItem.asOrThrow(list.value[6]))

    const accessList = RlpList.asOrThrow(list.value[7])

    return new UnsignedTransaction1(chainId, nonce, gasPrice, gasLimit, to, value, data, accessList)
  }

  encode(): Uint8Array {
    const chainId = RlpUintLike.into(this.chainId)
    const nonce = RlpUintLike.into(this.nonce)
    const gasPrice = RlpUintLike.into(this.gasPrice)
    const gasLimit = RlpUintLike.into(this.gasLimit)

    const to = RlpDataLike.into(this.to)
    const value = RlpUintLike.into(this.value)
    const data = RlpDataLike.into(this.data)

    const accessList = this.accessList

    const list = RlpList.fromOrThrow([chainId, nonce, gasPrice, gasLimit, to, value, data, accessList])

    return Writable.writeToBytesOrThrow(new TypedTransactionEnvelope(0x01, list))
  }

  sign(signature: Uint8Array): SignedTransaction1 {
    const { chainId, nonce, gasPrice, gasLimit, to, value, data, accessList } = this

    const r = signature.slice(0, 32)
    const s = signature.slice(32, 64)

    const yParity = signature[64]

    return new SignedTransaction1(chainId, nonce, gasPrice, gasLimit, to, value, data, accessList, yParity, r, s)
  }

}

export interface SignedTransactionInit1 {
  readonly chainId: RlpUintLike
  readonly nonce: RlpUintLike

  readonly gasPrice: RlpUintLike
  readonly gasLimit: RlpUintLike

  readonly to?: RlpDataLike
  readonly value: RlpUintLike
  readonly data?: RlpDataLike

  readonly accessList?: RlpList

  readonly yParity: RlpUintLike

  readonly r: RlpDataLike
  readonly s: RlpDataLike
}

export class SignedTransaction1 {

  constructor(
    readonly chainId: RlpUintLike,
    readonly nonce: RlpUintLike,
    readonly gasPrice: RlpUintLike,
    readonly gasLimit: RlpUintLike,
    readonly to: RlpDataLike = new Uint8Array(),
    readonly value: RlpUintLike,
    readonly data: RlpDataLike = new Uint8Array(),
    readonly accessList: RlpList = RlpList.fromOrThrow([]),
    readonly yParity: RlpUintLike,
    readonly r: RlpDataLike,
    readonly s: RlpDataLike,
  ) { }

  static from(init: SignedTransactionInit1): SignedTransaction1 {
    const { chainId, nonce, gasPrice, gasLimit, to, value, data, accessList, yParity, r, s } = init
    return new SignedTransaction1(chainId, nonce, gasPrice, gasLimit, to, value, data, accessList, yParity, r, s)
  }

  static decode(bytes: Uint8Array): SignedTransaction1 {
    const envelope = Readable.readFromBytesOrThrow(TypedTransactionEnvelope, bytes)

    if (envelope.type !== 0x01)
      throw new Error()

    const list = Readable.readFromBytesOrThrow(RlpList, envelope.data.bytes)

    const chainId = RlpUintLike.from(RlpItem.asOrThrow(list.value[0]))
    const nonce = RlpUintLike.from(RlpItem.asOrThrow(list.value[1]))
    const gasPrice = RlpUintLike.from(RlpItem.asOrThrow(list.value[2]))
    const gasLimit = RlpUintLike.from(RlpItem.asOrThrow(list.value[3]))

    const to = RlpDataLike.from(RlpItem.asOrThrow(list.value[4]))
    const value = RlpUintLike.from(RlpItem.asOrThrow(list.value[5]))
    const data = RlpDataLike.from(RlpItem.asOrThrow(list.value[6]))

    const accessList = RlpList.asOrThrow(list.value[7])

    const yParity = RlpUintLike.from(RlpItem.asOrThrow(list.value[8]))

    const r = RlpDataLike.from(RlpItem.asOrThrow(list.value[9]))
    const s = RlpDataLike.from(RlpItem.asOrThrow(list.value[10]))

    return new SignedTransaction1(chainId, nonce, gasPrice, gasLimit, to, value, data, accessList, yParity, r, s)
  }

  encode(): Uint8Array {
    const chainId = RlpUintLike.into(this.chainId)
    const nonce = RlpUintLike.into(this.nonce)

    const gasPrice = RlpUintLike.into(this.gasPrice)
    const gasLimit = RlpUintLike.into(this.gasLimit)

    const to = RlpDataLike.into(this.to)
    const value = RlpUintLike.into(this.value)
    const data = RlpDataLike.into(this.data)

    const accessList = this.accessList

    const yParity = RlpUintLike.into(this.yParity)

    const r = RlpDataLike.into(this.r)
    const s = RlpDataLike.into(this.s)

    const list = RlpList.fromOrThrow([chainId, nonce, gasPrice, gasLimit, to, value, data, accessList, yParity, r, s])

    return Writable.writeToBytesOrThrow(new TypedTransactionEnvelope(0x01, list))
  }

  unsign(): UnsignedTransaction1 {
    const { chainId, nonce, gasPrice, gasLimit, to, value, data, accessList } = this
    return new UnsignedTransaction1(chainId, nonce, gasPrice, gasLimit, to, value, data, accessList)
  }

}