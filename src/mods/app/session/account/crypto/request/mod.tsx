import { WideContrastButton, WideOppositeButton } from "@/libs/button/mod.tsx";
import { FlipCard } from "@/libs/card/mod.tsx";
import { chainlist } from "@/libs/chainlist/mod.ts";
import { useCopy } from "@/libs/copy/mod.ts";
import { ed25519 } from "@/libs/ed25519/mod.ts";
import { Errors } from "@/libs/errors/mod.ts";
import { Events } from "@/libs/events/mod.ts";
import { Outline } from "@/libs/heroicons/mod.ts";
import { Lang } from "@/libs/lang/mod.ts";
import { Spinner } from "@/libs/spinner/mod.tsx";
import { useTask } from "@/libs/task/mod.ts";
import { base58 } from "@hazae41/base58";
import { BitcoinSeedPhrase } from "@hazae41/broca";
import { SubpathProvider, useAnchorWithCoords, useHashSubpath, usePathContext } from "@hazae41/chemin";
import { BitcoinSeedKey, Ed25519SeedKey } from "@hazae41/clade";
import { Cursor } from "@hazae41/cursor";
import { EIP155UnsignedTransaction } from "@hazae41/eip155";
import { EIP1559UnsignedTransaction } from "@hazae41/eip1559";
import { EIP55Address } from "@hazae41/eip55";
import { eip712, EIP712Data } from "@hazae41/eip712";
import { RpcCounter, RpcErrorInit, RpcRequestPreinit, RpcResponse } from "@hazae41/jsonrpc";
import * as KDBX from "@hazae41/kdbx";
import { keccak256 } from "@hazae41/keccak256";
import { WcSessionRequestParams, WcUnsupportedAccountsError, WcUnsupportedChainsError, WcUnsupportedMethodsError, WcUserRejectedError } from "@hazae41/latrine";
import { PathBoard } from "@hazae41/modal";
import { useCloseContext } from "@hazae41/react-close-context";
import { Result } from "@hazae41/result-and-option";
import { secp256k1 } from "@hazae41/secp256k1";
import React, { Fragment, useCallback, useMemo, useState } from "react";

React;

export interface CryptoRequest {
  readonly params: WcSessionRequestParams

  resolve(result: unknown): void

  reject(error: unknown): void
}

export function CryptoRequestAnchor(props: { index: number } & { $entry: KDBX.Inner.KeePassFile.Entry } & { subaccount: number } & { $subentry: KDBX.Inner.KeePassFile.Entry } & { request: CryptoRequest }) {
  const { index, $entry, subaccount, $subentry, request } = props

  const path = usePathContext().getOrThrow()
  const hash = useHashSubpath(path)

  const coords = useAnchorWithCoords(hash, `/request/${index}`)

  const title = useMemo(() => {
    return $subentry.getStringByKeyOrNull("Title")?.getValueOrNull()?.get()
  }, [$subentry])

  const subtitle = useMemo(() => {
    return $entry.getStringByKeyOrNull("Title")?.getValueOrNull()?.get()
  }, [$entry])

  const color = useMemo(() => {
    return $entry.getStringByKeyOrNull("Color")?.getValueOrNull()?.get()
  }, [$entry])

  const getTypeOrThrow = useCallback((params: WcSessionRequestParams) => {
    const { request } = params

    if (request.method === "eth_sendTransaction")
      return "transaction"
    if (request.method === "solana_signTransaction")
      return "transaction"

    if (request.method === "personal_sign")
      return "signature"
    if (request.method === "eth_signTypedData_v4")
      return "signature"
    if (request.method === "solana_signMessage")
      return "signature"

    throw new WcUnsupportedMethodsError()
  }, [])

  const type = useMemo(() => {
    return Result.runAndWrapSync(() => getTypeOrThrow(request.params))
  }, [request])

  return <Fragment>
    <SubpathProvider value={hash}>
      {hash.url.pathname === `/request/${index}` &&
        <PathBoard>
          <CryptoRequestPage $entry={$entry} subaccount={subaccount} $subentry={$subentry} request={request} />
        </PathBoard>}
    </SubpathProvider>
    <a className="@container relative group w-[min(20rem,100%)] aspect-video rounded-xl bg-default text-default border-2 border-default-contrast select-none hover:scale-105 focus-visible:outline-none focus-visible:scale-105 transition-transform
      data-[color=red]:bg-red-400 
      data-[color=orange]:bg-orange-400 
      data-[color=amber]:bg-amber-400 
      data-[color=yellow]:bg-yellow-400 
      data-[color=lime]:bg-lime-400 
      data-[color=green]:bg-green-400 
      data-[color=emerald]:bg-emerald-400 
      data-[color=teal]:bg-teal-400 
      data-[color=cyan]:bg-cyan-400 
      data-[color=sky]:bg-sky-400 
      data-[color=blue]:bg-blue-400 
      data-[color=indigo]:bg-indigo-400 
      data-[color=violet]:bg-violet-400 
      data-[color=purple]:bg-purple-400 
      data-[color=fuchsia]:bg-fuchsia-400 
      data-[color=pink]:bg-pink-400 
      data-[color=rose]:bg-rose-400 
      in-dark:data-[color=red]:bg-red-500
      in-dark:data-[color=orange]:bg-orange-500
      in-dark:data-[color=amber]:bg-amber-500
      in-dark:data-[color=yellow]:bg-yellow-500
      in-dark:data-[color=lime]:bg-lime-500
      in-dark:data-[color=green]:bg-green-500
      in-dark:data-[color=emerald]:bg-emerald-500
      in-dark:data-[color=teal]:bg-teal-500
      in-dark:data-[color=cyan]:bg-cyan-500
      in-dark:data-[color=sky]:bg-sky-500
      in-dark:data-[color=blue]:bg-blue-500
      in-dark:data-[color=indigo]:bg-indigo-500
      in-dark:data-[color=violet]:bg-violet-500
      in-dark:data-[color=purple]:bg-purple-500
      in-dark:data-[color=fuchsia]:bg-fuchsia-500
      in-dark:data-[color=pink]:bg-pink-500
      in-dark:data-[color=rose]:bg-rose-500"
      data-theme={color == null ? "opposite" : "dark"}
      data-color={color}
      href={coords.url.hash}
      onClick={coords.onClick}
      onKeyDown={coords.onKeyDown}>
      <div className="h-full w-full flex flex-col p-4">
        <div className="flex items-center justify-between">
          <div className="font-medium text-xl truncate">
            {title || Lang.match({ en: "Untitled", zh: "无标题", hi: "शीर्षक रहित", es: "Sin título", ar: "بدون عنوان", fr: "Sans titre", de: "Unbenannt", ru: "Без названия", pt: "Sem título", ja: "無題", pa: "ਬਿਨਾਂ ਸਿਰਲੇਖ ਦੇ", bn: "বিনা শিরোনাম", id: "Tanpa judul", ur: "بغیر عنوان کے", ms: "Tanpa judul", it: "Senza titolo", tr: "Başlıksız", ta: "தலைப்பு இல்லாமல்", te: "శీర్షిక లేని", ko: "제목 없음", vi: "Không tiêu đề", pl: "Bez tytułu", ro: "Fără titlu", nl: "Ongetiteld", el: "Χωρίς τίτλο", th: "ไม่มีชื่อเรื่อง", cs: "Nezvaný", hu: "Névtelen", sv: "Otitulerad", da: "Uden titel" })}
          </div>
          <div className="font-medium text-xl text-default-half-contrast">
            #{subaccount + 1}
          </div>
        </div>
        <div className="not-@[16rem]:hidden h-2" />
        <div className="not-@[16rem]:hidden text-default-half-contrast truncate">
          {subtitle}
        </div>
        <div className="not-@[12rem]:hidden h-4 grow" />
        <div className="not-@[12rem]:hidden flex flex-wrap items-center gap-2">
          <div className="bg-default-contrast rounded-xl po-1 flex items-center gap-2">
            {type.getOrNull() === "transaction" && <Outline.CubeIcon className="size-5" />}
            {type.getOrNull() === "signature" && <Outline.CubeTransparentIcon className="size-5" />}
            {type.isErr() && <Outline.QuestionMarkCircleIcon className="size-5" />}
            {type.getOrNull() === "transaction" && Lang.match({ en: "Transaction", zh: "交易", hi: "लेनदेन", es: "Transacción", ar: "معاملة", fr: "Transaction", de: "Transaktion", ru: "Транзакция", pt: "Transação", ja: "トランザクション", pa: "ਟ੍ਰਾਂਜ਼ੈਕਸ਼ਨ", bn: "লেনদেন", id: "Transaksi", ur: "ٹرانزیکشن", ms: "Transaksi", it: "Transazione", tr: "İşlem", ta: "பரிவர்த்தனை", te: "లావాదేవి", ko: "트랜잭션", vi: "Giao dịch", pl: "Transakcja", ro: "Tranzacție", nl: "Transactie", el: "Συναλλαγή ", th: "ธุรกรรม ", cs: "Transakce ", hu: "Tranzakció ", sv: "Transaktion ", da: "Transaktion" })}
            {type.getOrNull() === "signature" && Lang.match({ en: "Signature", zh: "签名", hi: "हस्ताक्षर", es: "Firma", ar: "توقيع", fr: "Signature", de: "Unterschrift", ru: "Подпись", pt: "Assinatura", ja: "署名", pa: "ਦਸਤਖਤ", bn: "স্বাক্ষর", id: "Tanda tangan", ur: "دستخط", ms: "Tanda tangan", it: "Firma", tr: "İmza", ta: "கையொப்பம்", te: "సంతకం", ko: "서명", vi: "Chữ ký", pl: "Podpis", ro: "Semnătură", nl: "Handtekening", el: "Υπογραφή ", th: "ลายเซ็น ", cs: "Podpis ", hu: "Aláírás ", sv: "Signatur ", da: "Signatur" })}
            {type.isErr() && Lang.match({ en: "Unknown", zh: "未知", hi: "अज्ञात", es: "Desconocido", ar: "غير معروف", fr: "Inconnu", de: "Unbekannt", ru: "Неизвестно", pt: "Desconhecido", ja: "不明", pa: "ਅਣਜਾਣ", bn: "অজানা", id: "Tidak diketahui", ur: "نامعلوم", ms: "Tidak diketahui", it: "Sconosciuto", tr: "Bilinmeyen", ta: "அறியப்படாதது", te: "తెలియని", ko: "알 수 없음", vi: "Không xác định", pl: "Nieznany", ro: "Necunoscut", nl: "Onbekend", el: "Άγνωστο ", th: "ไม่ทราบ ", cs: "Neznámý ", hu: "Ismeretlen ", sv: "Okänd ", da: "Ukendt" })}
          </div>
        </div>
      </div>
    </a>
  </Fragment>
}

export interface EthSendTransactionParams {
  readonly data?: `0x${string}`
  readonly from: `0x${string}`
  readonly gas?: `0x${string}`
  readonly gasPrice?: `0x${string}`
  readonly maxFeePerGas?: `0x${string}`
  readonly maxPriorityFeePerGas?: `0x${string}`
  readonly to?: `0x${string}`
  readonly value?: `0x${string}`
  readonly nonce?: `0x${string}`
}

export interface EthCallLog {
  readonly address: `0x${string}`
  readonly topics: `0x${string}`[]
  readonly data: `0x${string}`
}

export type EthCall =
  | EthGoodCall
  | EthFailCall

export interface EthGoodCall {
  readonly status: `0x1`,
  readonly logs: EthCallLog[]
}

export interface EthFailCall {
  readonly status: `0x0`,
  readonly error: RpcErrorInit
}


export function CryptoRequestPage(props: { $entry: KDBX.Inner.KeePassFile.Entry } & { subaccount: number } & { $subentry: KDBX.Inner.KeePassFile.Entry } & { request: CryptoRequest }) {
  const { $entry, subaccount, $subentry, request } = props

  const close = useCloseContext().getOrThrow()

  const [flipped, setFlipped] = useState(false)

  const title = useMemo(() => {
    return $subentry.getStringByKeyOrNull("Title")?.getValueOrNull()?.get()
  }, [$subentry])

  const subtitle = useMemo(() => {
    return $entry.getStringByKeyOrNull("Title")?.getValueOrNull()?.get()
  }, [$entry])

  const color = useMemo(() => {
    return $entry.getStringByKeyOrNull("Color")?.getValueOrNull()?.get()
  }, [$entry])

  const seedphrase = useMemo(() => {
    return $entry.getStringByKeyOrThrow("SeedPhrase").getValueOrThrow().get()
  }, [$entry])

  const getEthereumAddressOrThrow = useCallback(async () => {
    const seed = new BitcoinSeedKey(await BitcoinSeedPhrase.derive(seedphrase))
    const xsig = await seed.derive(`m/44'/60'/0'/0/${subaccount}`)
    const upub = secp256k1.SecretKey.import(xsig.key).publish().export(false)
    const addr = `0x${keccak256.digest(upub.slice(1)).slice(-20).toHex()}`

    return EIP55Address.from(addr)
  }, [seedphrase, subaccount])

  const getSolanaAddressOrThrow = useCallback(async () => {
    const seed = new Ed25519SeedKey(await BitcoinSeedPhrase.derive(seedphrase))
    const xsig = await seed.derive(`m/44'/501'/${subaccount}'/0'`)
    const upub = await ed25519.publish(xsig.key)

    return base58.encode(upub)
  }, [seedphrase, subaccount])

  const requestOrThrow = useCallback(async <T,>(rpc: string, req: RpcRequestPreinit<unknown>): Promise<RpcResponse<T>> => {
    const headers = { "Content-Type": "application/json" }
    const body = JSON.stringify(new RpcCounter().prepare(req))

    const response = await fetch(rpc, { method: "POST", headers, body })

    if (!response.ok)
      throw new Error("Could not fetch", { cause: response })

    return RpcResponse.from<T>(await response.json())
  }, [])

  const respondOrThrow = useCallback(async (params: WcSessionRequestParams) => {
    const { request } = params

    if (request.method === "personal_sign") {
      const [message, account] = request.params as [string, string]

      const current = await getEthereumAddressOrThrow()

      if (account.toLowerCase() !== current.toLowerCase())
        throw new WcUnsupportedAccountsError()

      const msgraw = Uint8Array.fromHex(message.slice(2))
      const prefix = new TextEncoder().encode(`\x19Ethereum Signed Message:\n${msgraw.length}`)

      const payload = new Cursor(new Uint8Array(prefix.length + msgraw.length))
      payload.write(prefix)
      payload.write(msgraw)

      const seed = new BitcoinSeedKey(await BitcoinSeedPhrase.derive(seedphrase))
      const xsig = await seed.derive(`m/44'/60'/0'/0/${subaccount}`)

      const digest = keccak256.digest(payload.bytes)
      const signed = secp256k1.SecretKey.import(xsig.key).sign(digest).export()

      signed[64] += 27

      return `0x${signed.toHex()}`
    }

    if (request.method === "eth_signTypedData_v4") {
      const [account, data] = request.params as [string, string]

      const current = await getEthereumAddressOrThrow()

      if (account.toLowerCase() !== current.toLowerCase())
        throw new WcUnsupportedAccountsError()

      const seed = new BitcoinSeedKey(await BitcoinSeedPhrase.derive(seedphrase))
      const xsig = await seed.derive(`m/44'/60'/0'/0/${subaccount}`)

      const digest = eip712.hash(JSON.parse(data))
      const signed = secp256k1.SecretKey.import(xsig.key).sign(digest).export()

      signed[64] += 27

      return `0x${signed.toHex()}`
    }

    if (request.method === "eth_sendTransaction") {
      const [transaction] = request.params as [EthSendTransactionParams]

      const { data, from, to, value = 0n } = transaction

      const chain = chainlist.find(chain => chain.chainId === Number(params.chainId.split(":")[1]))

      if (chain == null)
        throw new WcUnsupportedChainsError()

      const current = await getEthereumAddressOrThrow()

      if (from.toLowerCase() !== current.toLowerCase())
        throw new WcUnsupportedAccountsError()

      const getTransactionOrThrow = async () => {
        const { chainId } = chain

        const [nonce = await requestOrThrow<`0x${string}`>(chain.rpc, {
          method: "eth_getTransactionCount",
          params: [current, "latest"]
        }).then(r => r.getOrThrow())] = [transaction.nonce]

        const [gas = await requestOrThrow<`0x${string}`>(chain.rpc, {
          method: "eth_estimateGas",
          params: [{ to, data, value }]
        }).then(r => r.getOrThrow())] = [transaction.gas]

        if (transaction.gasPrice != null)
          return EIP155UnsignedTransaction.from({ chainId, nonce, gasPrice: transaction.gasPrice, startGas: gas, to, value, data })
        if (transaction.maxFeePerGas != null && transaction.maxPriorityFeePerGas != null)
          return EIP1559UnsignedTransaction.from({ chainId, nonce, maxFeePerGas: transaction.maxFeePerGas, maxPriorityFeePerGas: transaction.maxPriorityFeePerGas, gasLimit: gas, destination: to, amount: value, data })

        const feeHistory = await requestOrThrow<{ baseFeePerGas: `0x${string}`[], reward: `0x${string}`[][] }>(chain.rpc, {
          method: "eth_feeHistory",
          params: [1, "latest", [80]]
        }).then(r => r.getOrThrow())

        const baseFeePerGas = BigInt(feeHistory.baseFeePerGas[0])
        const maxPriorityFeePerGas = BigInt(feeHistory.reward[0][0])
        const maxFeePerGas = (baseFeePerGas * 2n) + maxPriorityFeePerGas

        return EIP1559UnsignedTransaction.from({ chainId, nonce, gasLimit: gas, maxFeePerGas, maxPriorityFeePerGas, destination: to, amount: value, data })
      }

      const utx = await getTransactionOrThrow()

      const seed = new BitcoinSeedKey(await BitcoinSeedPhrase.derive(seedphrase))
      const xsig = await seed.derive(`m/44'/60'/0'/0/${subaccount}`)

      const digest = keccak256.digest(utx.encode())
      const signed = secp256k1.SecretKey.import(xsig.key).sign(digest).export()

      return await requestOrThrow<`0x${string}`>(chain.rpc, {
        method: "eth_sendRawTransaction",
        params: [`0x${utx.sign(signed).encode().toHex()}`]
      }).then(r => r.getOrThrow())
    }

    if (request.method === "solana_signMessage") {
      const { message, pubkey } = request.params as { message: string, pubkey: string }

      const current = await getSolanaAddressOrThrow()

      if (pubkey !== current)
        throw new WcUnsupportedAccountsError()

      const seed = new Ed25519SeedKey(await BitcoinSeedPhrase.derive(seedphrase))
      const xsig = await seed.derive(`m/44'/501'/${subaccount}'/0'`)

      const msgraw = new Uint8Array(base58.decode(message))
      const sigraw = new Uint8Array(await ed25519.sign(xsig.key, msgraw))

      return { signature: base58.encode(sigraw) }
    }

    if (request.method === "solana_signTransaction") {
      const { transaction } = request.params as { transaction: string }

      const cursor = new Cursor(Uint8Array.fromBase64(transaction))

      const sigcount = cursor.readUint8()
      const sigstart = cursor.offset

      const seed = new Ed25519SeedKey(await BitcoinSeedPhrase.derive(seedphrase))
      const xsig = await seed.derive(`m/44'/501'/${subaccount}'/0'`)

      const msgraw = cursor.bytes.subarray(sigstart + (sigcount * 64))
      const sigraw = new Uint8Array(await ed25519.sign(xsig.key, msgraw))

      return { signature: base58.encode(sigraw) }
    }

    throw new WcUnsupportedMethodsError()
  }, [seedphrase, subaccount])

  const approve = useTask(() => Promise.try(async () => {
    await respondOrThrow(request.params).then(request.resolve).then(() => close(true))
  }).catch(Errors.display), [request, respondOrThrow, close])

  const decline = useTask(() => Promise.try(async () => {
    await Promise.resolve(new WcUserRejectedError()).then(request.reject).then(() => close(true))
  }).catch(Errors.display), [request, close])

  const getChainOrThrow = useCallback((params: WcSessionRequestParams) => {
    const { request, chainId } = params

    if (request.method === "personal_sign")
      return "Ethereum"

    if (request.method === "eth_signTypedData_v4") {
      const [account, data] = request.params as [string, string]

      const { domain } = JSON.parse(data) as EIP712Data

      return chainlist.find(chain => chain.chainId === Number(domain.chainId))?.name
    }

    if (request.method === "eth_sendTransaction")
      return chainlist.find(chain => chain.chainId === Number(chainId.split(":")[1]))?.name

    if (request.method === "solana_signMessage")
      return "Solana"
    if (request.method === "solana_signTransaction")
      return "Solana"

    throw new WcUnsupportedMethodsError()
  }, [])

  const getTypeOrThrow = useCallback((params: WcSessionRequestParams) => {
    const { request } = params

    if (request.method === "eth_sendTransaction")
      return "transaction"
    if (request.method === "solana_signTransaction")
      return "transaction"

    if (request.method === "personal_sign")
      return "signature"
    if (request.method === "eth_signTypedData_v4")
      return "signature"
    if (request.method === "solana_signMessage")
      return "signature"

    throw new WcUnsupportedMethodsError()
  }, [])

  const getMessageOrThrow = useCallback((params: WcSessionRequestParams) => {
    const { request } = params

    if (request.method === "personal_sign") {
      const [message] = request.params as [string]

      const msgraw = Uint8Array.fromHex(message.slice(2))
      const msgtxt = new TextDecoder().decode(msgraw)

      return msgtxt
    }

    if (request.method === "solana_signMessage") {
      const { message } = request.params as { message: string }

      const msgraw = base58.decode(message)
      const msgtxt = new TextDecoder().decode(msgraw)

      return msgtxt
    }

    throw new WcUnsupportedMethodsError()
  }, [])

  const simulateOrThrow = useCallback(async (params: WcSessionRequestParams) => {
    const { request, chainId } = params

    if (request.method === "eth_sendTransaction") {
      const [{ data, from, gas, gasPrice, maxFeePerGas, maxPriorityFeePerGas, to, value, nonce }] = request.params as [EthSendTransactionParams]

      const chain = chainlist.find(chain => chain.chainId === Number(chainId.split(":")[1]))

      if (chain == null)
        throw new WcUnsupportedChainsError()

      const current = await getEthereumAddressOrThrow()

      if (from.toLowerCase() !== current.toLowerCase())
        throw new WcUnsupportedAccountsError()

      const call = { data, from, gas, gasPrice, maxFeePerGas, maxPriorityFeePerGas, to, value, nonce }
      const body = { blockStateCalls: [{ calls: [call] }], validation: true, traceTransfers: true }

      const [{ calls: [result] }] = await requestOrThrow<[{ calls: [EthCall] }]>(chain.rpc, {
        method: "eth_simulateV1",
        params: [body, "latest"]
      }).then(r => r.getOrThrow())

      return result
    }

    if (request.method === "solana_signTransaction") {
      const { transaction } = request.params as { transaction: string }

      const result = await requestOrThrow("https://api.mainnet.solana.com", {
        method: "simulateTransaction",
        params: [transaction, { encoding: "base64", commitment: "finalized" }]
      }).then(r => r.getOrThrow())

      return result
    }

    throw new WcUnsupportedMethodsError()
  }, [getEthereumAddressOrThrow, getSolanaAddressOrThrow, requestOrThrow])

  const getDetailsOrThrow = useCallback((params: WcSessionRequestParams) => {
    const { request, chainId } = params

    if (request.method === "personal_sign") {
      const [message, account] = request.params as [string, string]

      const details = { message }

      return JSON.stringify(details, null, 2)
    }

    if (request.method === "eth_signTypedData_v4") {
      const [account, data] = request.params as [string, string]

      const { domain, message, types, primaryType } = JSON.parse(data) as EIP712Data

      const details = { chainId, domain, message, types, primaryType }

      return JSON.stringify(details, null, 2)
    }

    if (request.method === "eth_sendTransaction") {
      const [{ data, from, gas, gasPrice, maxFeePerGas, maxPriorityFeePerGas, to, value, nonce }] = request.params as [EthSendTransactionParams]

      const details = { chainId, data, from, gas, gasPrice, maxFeePerGas, maxPriorityFeePerGas, to, value, nonce }

      return JSON.stringify(details, null, 2)
    }

    if (request.method === "solana_signMessage") {
      const { message } = request.params as { message: string, pubkey: string }

      const details = { message }

      return JSON.stringify(details, null, 2)
    }

    if (request.method === "solana_signTransaction") {
      const { transaction } = request.params as { transaction: string }

      const details = { transaction }

      return JSON.stringify(details, null, 2)
    }

    throw new WcUnsupportedMethodsError()
  }, [])

  const type = useMemo(() => {
    return Result.runAndWrapSync(() => getTypeOrThrow(request.params)).getOrNull()
  }, [request])

  const chain = useMemo(() => {
    return Result.runAndWrapSync(() => getChainOrThrow(request.params)).getOrNull()
  }, [request])

  const message = useMemo(() => {
    return Result.runAndWrapSync(() => getMessageOrThrow(request.params)).getOrNull()
  }, [request])

  const details = useMemo(() => {
    return Result.runAndWrapSync(() => getDetailsOrThrow(request.params)).getOrNull()
  }, [request])

  const copyTheDetails = useCopy(details)

  return <Fragment>
    <div className="flex flex-col grow p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium">
          {Lang.match({ en: "Crypto request", zh: "加密请求", hi: "क्रिप्टो अनुरोध", es: "Solicitud de criptografía", ar: "طلب التشفير", fr: "Requête crypto", de: "Krypto-Anfrage", ru: "Криптозапрос", pt: "Solicitação de criptografia", ja: "暗号化リクエスト", pa: "ਕ੍ਰਿਪਟੋ ਬੇਨਤੀ", bn: "ক্রিপ্টো অনুরোধ", id: "Permintaan kripto", ur: "کرپٹو درخواست", ms: "Permintaan kripto", it: "Richiesta crittografica", tr: "Kripto isteği", ta: "கிரிப்டோ கோரிக்கை", te: "క్రిప్టో అభ్యర్థన", ko: "암호화 요청", vi: "Yêu cầu mã hóa", pl: "Żądanie kryptograficzne", ro: "Cerere criptografică", nl: "Crypto-verzoek", el: "Αίτημα κρυπτογράφησης ", th: "คำขอการเข้ารหัส ", cs: "Požadavek na kryptografii ", hu: "Kriptográfiai kérés ", sv: "Kryptoförfrågan ", da: "Kryptoanmodning" })}
        </h1>
      </div>
      <div className="h-6" />
      <div className="flex flex-col items-center justify-center">
        {type === "transaction" &&
          <FlipCard
            type={Lang.match({ en: "Transaction", zh: "交易", hi: "लेनदेन", es: "Transacción", ar: "معاملة", fr: "Transaction", de: "Transaktion", ru: "Транзакция", pt: "Transação", ja: "トランザクション", pa: "ਟ੍ਰਾਂਜ਼ੈਕਸ਼ਨ", bn: "লেনদেন", id: "Transaksi", ur: "ٹرانزیکشن", ms: "Transaksi", it: "Transazione", tr: "İşlem", ta: "பரிவர்த்தனை", te: "లావాదేవి", ko: "트랜잭션", vi: "Giao dịch", pl: "Transakcja", ro: "Tranzacție", nl: "Transactie", el: "Συναλλαγή ", th: "ธุรกรรม ", cs: "Transakce ", hu: "Tranzakció ", sv: "Transaktion ", da: "Transaktion" })}
            title={title}
            subtitle={subtitle}
            color={color}
            index={subaccount}
            icon={<Outline.CubeIcon className="size-5" />}
            flip={flipped}
            onFlipChange={setFlipped} />}
        {type === "signature" &&
          <FlipCard
            type={Lang.match({ en: "Signature", zh: "签名", hi: "हस्ताक्षर", es: "Firma", ar: "توقيع", fr: "Signature", de: "Unterschrift", ru: "Подпись", pt: "Assinatura", ja: "署名", pa: "ਦਸਤਖਤ", bn: "স্বাক্ষর", id: "Tanda tangan", ur: "دستخط", ms: "Tanda tangan", it: "Firma", tr: "İmza", ta: "கையொப்பம்", te: "సంతకం", ko: "서명", vi: "Chữ ký", pl: "Podpis", ro: "Semnătură", nl: "Handtekening", el: "Υπογραφή ", th: "ลายเซ็น ", cs: "Podpis ", hu: "Aláírás ", sv: "Signatur ", da: "Signatur" })}
            title={title}
            subtitle={subtitle}
            color={color}
            index={subaccount}
            icon={<Outline.CubeTransparentIcon className="size-5" />}
            flip={flipped}
            onFlipChange={setFlipped} />}
      </div>
      <form className="grow flex flex-col"
        onSubmit={Events.preventDefault}>
        <input className="hidden"
          autoComplete="off"
          name="username" />
        {chain != null && <Fragment>
          <div className="h-6" />
          <div className="font-medium">
            {Lang.match({ en: "Chain", zh: "链", hi: "चेन", es: "Cadena", ar: "سلسلة", fr: "Chaîne", de: "Kette", ru: "Цепочка", pt: "Cadeia", ja: "チェーン", pa: "ਚੇਨ", bn: "চেইন", id: "Rantai", ur: "چین", ms: "Rantai", it: "Catena", tr: "Zincir", ta: "செயின்", te: "చెయిన్", ko: "체인", vi: "Chuỗi", pl: "Łańcuch", ro: "Lanț", nl: "Ketting", el: "Αλυσίδα ", th: "เชน ", cs: "Řetěz ", hu: "Lánc ", sv: "Kedja ", da: "Kæde" })}
          </div>
          <div className="text-default-contrast">
            {Lang.match({ en: "The blockchain network of the request.", zh: "请求的区块链网络。", hi: "अनुरोध का ब्लॉकचेन नेटवर्क।", es: "La red blockchain de la solicitud.", ar: "شبكة البلوكشين للطلب.", fr: "Le réseau blockchain de la requête.", de: "Das Blockchain-Netzwerk der Anfrage.", ru: "Блокчейн-сеть запроса.", pt: "A rede blockchain da solicitação.", ja: "リクエストのブロックチェーンネットワーク。", pa: "ਬੇਨਤੀ ਦਾ ਬਲਾਕਚੇਨ ਨੈੱਟਵਰਕ।", bn: "অনুরোধের ব্লকচেইন নেটওয়ার্ক।", id: "Jaringan blockchain dari permintaan.", ur: "درخواست کا بلاکچین نیٹ ورک۔", ms: "Rantai blok dari permintaan.", it: "La rete blockchain della richiesta.", tr: "İsteğin blok zinciri ağı.", ta: "கோரிக்கையின் பிளாக்செயின் நெட்வொர்க்.", te: "అభ్యర్థన యొక్క బ్లాక్‌చైన్ నెట్‌వర్క్.", ko: "요청의 블록체인 네트워크입니다.", vi: "Mạng blockchain của yêu cầu.", pl: "Sieć blockchain żądania.", ro: "Rețeaua blockchain a cererii.", nl: "Het blockchain-netwerk van het verzoek.", el: "Το δίκτυο blockchain του αιτήματος ", th: "เครือข่ายบล็อกเชนของคำขอ ", cs: "Blockchain síť požadavku ", hu: "A kérés blokklánc hálózata ", sv: "Blockkedjanätverket för förfrågan ", da: "Blockchain-netværket for anmodningen" })}
          </div>
          <div className="h-4" />
          <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4">
            <input className="w-full focus-visible:outline-none"
              readOnly
              autoComplete="off"
              value={chain} />
          </div>
        </Fragment>}
        {message != null && <Fragment>
          <div className="h-6" />
          <div className="font-medium">
            {Lang.match({ en: "Message", zh: "消息", hi: "संदेश", es: "Mensaje", ar: "رسالة", fr: "Message", de: "Nachricht", ru: "Сообщение", pt: "Mensagem", ja: "メッセージ", pa: "ਸੰਦੇਸ਼", bn: "বার্তা", id: "Pesan", ur: "پیغام", ms: "Mesej", it: "Messaggio", tr: "Mesaj", ta: "செய்தி", te: "సందేశం", ko: "메시지", vi: "Tin nhắn", pl: "Wiadomość", ro: "Mesaj", nl: "Bericht", el: "Μήνυμα ", th: "ข้อความ ", cs: "Zpráva ", hu: "Üzenet ", sv: "Meddelande ", da: "Besked" })}
          </div>
          <div className="text-default-contrast">
            {Lang.match({ en: "The request message.", zh: "请求消息。", hi: "अनुरोध संदेश।", es: "El mensaje de la solicitud.", ar: "رسالة الطلب.", fr: "Le message de la requête.", de: "Die Nachricht der Anfrage.", ru: "Сообщение запроса.", pt: "A mensagem da solicitação.", ja: "リクエストメッセージ。", pa: "ਬੇਨਤੀ ਸੁਨੇਹਾ।", bn: "অনুরোধের বার্তা।", id: "Pesan permintaan.", ur: "درخواست کا پیغام۔", ms: "Mesej permintaan.", it: "Il messaggio della richiesta.", tr: "İstek mesajı.", ta: "கோரிக்கை செய்தி.", te: "అభ్యర్థన సందేశం.", ko: "요청 메시지입니다.", vi: "Tin nhắn yêu cầu.", pl: "Wiadomość żądania.", ro: "Mesajul cererii.", nl: "Het bericht van het verzoek.", el: "Το μήνυμα του αιτήματος ", th: "ข้อความของคำขอ ", cs: "Zpráva požadavku ", hu: "A kérés üzenete ", sv: "Förfrågningsmeddelande ", da: "Anmodningsbesked" })}
          </div>
          <div className="h-4" />
          <div className="flex flex-col items-center border border-default-contrast rounded-xl p-6">
            <pre className="whitespace-pre-wrap text-wrap wrap-anywhere">
              {message}
            </pre>
          </div>
        </Fragment>}
        {details != null && <Fragment>
          <div className="h-6" />
          <div className="font-medium">
            {Lang.match({ en: "Details", zh: "详情", hi: "विवरण", es: "Detalles", ar: "تفاصيل", fr: "Détails", de: "Einzelheiten", ru: "Подробности", pt: "Detalhes", ja: "詳細", pa: "ਵੇਰਵੇ", bn: "বিস্তারিত", id: "Detail", ur: "تفصیلات", ms: "Detail", it: "Dettagli", tr: "Detaylar", ta: "விவரங்கள்", te: "వివరాలు", ko: "세부 정보", vi: "Chi tiết", pl: "Szczegóły", ro: "Detalii", nl: "Details", el: "Λεπτομέρειες ", th: "รายละเอียด ", cs: "Podrobnosti ", hu: "Részletek ", sv: "Detaljer ", da: "Detaljer" })}
          </div>
          <div className="text-default-contrast">
            {Lang.match({ en: "The full details of the request in JSON format. You can copy and share it with an AI to get help on understanding the request.", zh: "请求的完整详情，JSON格式。您可以复制并与AI共享，以获得有关理解请求的帮助。", hi: "JSON प्रारूप में अनुरोध का पूरा विवरण। आप इसे कॉपी कर सकते हैं और एक AI के साथ साझा कर सकते हैं ताकि अनुरोध को समझने में मदद मिल सके।", es: "Los detalles completos de la solicitud en formato JSON. Puede copiarlo y compartirlo con una IA para obtener ayuda para comprender la solicitud.", ar: "التفاصيل الكاملة للطلب بتنسيق JSON. يمكنك نسخه ومشاركته مع AI للحصول على مساعدة في فهم الطلب.", fr: "Les détails complets de la requête au format JSON. Vous pouvez le copier et le partager avec une IA pour obtenir de l'aide sur la compréhension de la requête.", de: "Die vollständigen Details der Anfrage im JSON-Format. Sie können es kopieren und mit einer KI teilen, um Hilfe beim Verständnis der Anfrage zu erhalten.", ru: "Полные детали запроса в формате JSON. Вы можете скопировать и поделиться ими с ИИ, чтобы получить помощь в понимании запроса.", pt: "Os detalhes completos da solicitação em formato JSON. Você pode copiá-lo e compartilhá-lo com uma IA para obter ajuda para entender a solicitação.", ja: "JSON形式のリクエストの完全な詳細。コピーしてAIと共有することで、リクエストの理解に役立てることができます。", pa: "JSON ਫਾਰਮੈਟ ਵਿੱਚ ਬੇਨਤੀ ਦੇ ਪੂਰੇ ਵੇਰਵੇ। ਤੁਸੀਂ ਇਸਨੂੰ ਕਾਪੀ ਕਰਕੇ ਇੱਕ AI ਨਾਲ ਸਾਂਝਾ ਕਰ ਸਕਦੇ ਹੋ ਤਾਂ ਜੋ ਬੇਨਤੀ ਨੂੰ ਸਮਝਣ ਵਿੱਚ ਮਦਦ ਮਿਲ ਸਕੇ।", bn: "JSON ফরম্যাটে অনুরোধের সম্পূর্ণ বিবরণ। আপনি এটি কপি করে একটি AI এর সাথে শেয়ার করতে পারেন যাতে অনুরোধটি বুঝতে সাহায্য করতে পারে।", id: "Detail lengkap dari permintaan dalam format JSON. Anda dapat menyalinnya dan membagikannya dengan AI untuk mendapatkan bantuan dalam memahami permintaan tersebut.", ur: "درخواست کی مکمل تفصیلات JSON فارمیٹ میں۔ آپ اسے کاپی کر کے ایک AI کے ساتھ شیئر کر سکتے ہیں تاکہ درخواست کو سمجھنے میں مدد مل سکے۔", ms: "Detail lengkap dari permintaan dalam format JSON. Anda dapat menyalinnya dan membagikannya dengan AI untuk mendapatkan bantuan dalam memahami permintaan tersebut.", it: "I dettagli completi della richiesta in formato JSON. Puoi copiarlo e condividerlo con un'IA per ottenere aiuto nella comprensione della richiesta.", tr: "JSON formatında isteğin tam detayları. İsteği anlamak için yardım almak üzere kopyalayıp bir AI ile paylaşabilirsiniz.", ta: "JSON வடிவத்தில் கோரிக்கையின் முழு விவரங்கள். கோரிக்கையை புரிந்துகொள்ள உதவ AI உடன் பகிர்ந்து கொள்ள நீங்கள் அதை நகலெடுக்கலாம்.", te: "JSON ఫార్మాట్‌లో అభ్యర్థన యొక్క పూర్తి వివరాలు. మీరు కాపీ చేసి AI తో పంచుకోవచ్చు, అభ్యర్థనను అర్థం చేసుకోవడంలో సహాయం పొందవచ్చు.", ko: "요청의 전체 세부 정보는 JSON 형식입니다. 요청을 이해하는 데 도움이 되도록 AI와 복사하여 공유할 수 있습니다.", vi: "Chi tiết đầy đủ của yêu cầu ở định dạng JSON. Bạn có thể sao chép và chia sẻ nó với AI để được trợ giúp về việc hiểu yêu cầu.", pl: "Pełne szczegóły żądania w formacie JSON. Możesz go skopiować i udostępnić AI, aby uzyskać pomoc w zrozumieniu żądania.", ro: "Detaliile complete ale cererii în format JSON. Puteți să-l copiați și să-l partajați cu un AI pentru a obține ajutor în înțelegerea cererii.", nl: "De volledige details van het verzoek in JSON-formaat. U kunt het kopiëren en delen met een AI om hulp te krijgen bij het begrijpen van het verzoek.", el: "Τα πλήρη στοιχεία του αιτήματος σε μορφή JSON. Μπορείτε να το αντιγράψετε και να το μοιραστείτε με ένα AI για να λάβετε βοήθεια στην κατανόηση του αιτήματος.", th: "รายละเอียดทั้งหมดของคำขอในรูปแบบ JSON คุณสามารถคัดลอกและแชร์กับ AI เพื่อขอความช่วยเหลือในการทำความเข้าใจคำขอได้", cs: "Úplné podrobnosti o požadavku ve formátu JSON. Můžete jej zkopírovat a sdílet s AI, abyste získali pomoc s pochopením požadavku.", hu: "A kérés teljes részletei JSON formátumban. Másolhatja és megoszthatja egy AI-val, hogy segítséget kapjon a kérés megértéséhez.", sv: "Fullständiga detaljer om förfrågan i JSON-format. Du kan kopiera och dela det med en AI för att få hjälp med att förstå förfrågan.", da: "De fuldstændige detaljer om anmodningen i JSON-format. Du kan kopiere det og dele det med en AI for at få hjælp til at forstå anmodningen." })}
          </div>
          <div className="h-4" />
          <div className="bg-default-contrast p-1 rounded-xl flex flex-col gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
            <textarea className="po-2 w-full resize-none focus-visible:outline-none"
              readOnly
              rows={9}
              dir="ltr"
              value={details} />
          </div>
          <div className="h-2" />
          <div className="flex items-center flex-wrap-reverse gap-2">
            <WideContrastButton
              onClick={copyTheDetails.copyOrDisplay}>
              {copyTheDetails.copied ? <Outline.CheckIcon className="size-5" /> : <Outline.DocumentDuplicateIcon className="size-5" />}
              {copyTheDetails.copied ? Lang.match({ en: "Copied", zh: "已复制", hi: "कॉपी किया गया", es: "Copiado", ar: "تم النسخ", fr: "Copié", de: "Kopiert", ru: "Скопировано", pt: "Copiado", ja: "コピーしました", pa: "ਨਕਲ ਕੀਤਾ", bn: "কপি করা হয়েছে", id: "Disalin", ur: "کاپی کیا گیا", ms: "Disalin", it: "Copiato", tr: "Kopyalandı", ta: "நகலெடுக்கப்பட்டது", te: "నకలించబడింది", ko: "복사됨", vi: "Đã sao chép", pl: "Skopiowano", ro: "Copiat", nl: "Gekopieerd", el: "Αντιγράφηκε ", th: "คัดลอกแล้ว ", cs: "Zkopírováno ", hu: "Másolva ", sv: "Kopierat ", da: "Kopieret" }) : Lang.match({ en: "Copy", zh: "复制", hi: "कॉपी करें", es: "Copiar", ar: "نسخ", fr: "Copier", de: "Kopieren", ru: "Копировать", pt: "Copiar", ja: "コピー", pa: "ਨਕਲ ਕਰੋ", bn: "কপি করুন", id: "Salin", ur: "کاپی کریں", ms: "Salin", it: "Copia", tr: "Kopyala", ta: "நகலெடுக்கவும்", te: "నకలించు", ko: "복사", vi: "Sao chép", pl: "Kopiuj", ro: "Copiați", nl: "Kopiëren", el: "Αντιγραφή ", th: "คัดลอก ", cs: "Kopírovat ", hu: "Másolás ", sv: "Kopiera ", da: "Kopier" })}
            </WideContrastButton>
          </div>
        </Fragment>}
        <div className="h-8 grow" />
        <div className="flex items-center flex-wrap-reverse gap-2">
          <WideContrastButton
            type="button"
            disabled={decline.running}
            onClick={decline.execute}>
            {decline.running ? <Spinner className="size-5 animate-spin" /> : <Outline.NoSymbolIcon className="size-5" />}
            {Lang.match({ en: "Decline", zh: "拒绝", hi: "अस्वीकृत करें", es: "Rechazar", ar: "رفض", fr: "Refuser", de: "Ablehnen", ru: "Отклонить", pt: "Recusar", ja: "拒否", pa: "ਅਸਵੀਕਾਰ ਕਰੋ", bn: "প্রত্যাখ্যান করুন", id: "Tolak", ur: "رد کریں", ms: "Tolak", it: "Rifiuta", tr: "Reddet", ta: "நிராகரிக்கவும்", te: "తిరస్కరించండి", ko: "거부", vi: "Từ chối", pl: "Odrzuć", ro: "Respinge", nl: "Afwijzen", el: "Απορρίπτω ", th: "ปฏิเสธ ", cs: "Odmítnout ", hu: "Elutasítás ", sv: "Avvisa ", da: "Afvis" })}
          </WideContrastButton>
          <WideOppositeButton
            type="button"
            disabled={approve.running}
            onClick={approve.execute}>
            {approve.running ? <Spinner className="size-5 animate-spin" /> : <Outline.CheckCircleIcon className="size-5" />}
            {Lang.match({ en: "Approve", zh: "批准", hi: "स्वीकृत करें", es: "Aprobar", ar: "وافق", fr: "Approuver", de: "Genehmigen", ru: "Одобрить", pt: "Aprovar", ja: "承認", pa: "ਮਨਜ਼ੂਰ ਕਰੋ", bn: "অনুমোদন করুন", id: "Setujui", ur: "منظور کریں", ms: "Setujui", it: "Approva", tr: "Onayla", ta: "அனுமதிக்கவும்", te: "అనుమతించండి", ko: "승인", vi: "Phê duyệt", pl: "Zatwierdź", ro: "Aprobați", nl: "Goedkeuren", el: "Εγκρίνω ", th: "อนุมัติ ", cs: "Schválit ", hu: "Jóváhagyás ", sv: "Godkänn ", da: "Godkend" })}
          </WideOppositeButton>
        </div>
      </form>
    </div>
  </Fragment>
}