import { base16 } from "@/libs/base16/mod.ts";
import { WideContrastButton, WideOppositeButton } from "@/libs/button/mod.tsx";
import { FlipCard } from "@/libs/card/mod.tsx";
import { chainlist } from "@/libs/chainlist/mod.ts";
import { useCopy } from "@/libs/copy/mod.ts";
import { Ed25519 } from "@/libs/ed25519/mod.ts";
import { Events } from "@/libs/events/mod.ts";
import { Outline } from "@/libs/heroicons/mod.ts";
import { Lang } from "@/libs/lang/mod.ts";
import { Nullable } from "@/libs/nullable/mod.ts";
import { Spinner } from "@/libs/spinner/mod.tsx";
import { useSubmit } from "@/libs/submit/mod.ts";
import { abi, AbiString, AbiUint256 } from "@hazae41/abi";
import { base58 } from "@hazae41/base58";
import { BitcoinSeedPhrase } from "@hazae41/broca";
import { SubpathProvider, useAnchorWithCoords, useHashSubpath, usePathContext } from "@hazae41/chemin";
import { BitcoinSeedKey, Ed25519SeedKey } from "@hazae41/clade";
import { Cursor } from "@hazae41/cursor";
import { EIP155UnsignedTransaction } from "@hazae41/eip155";
import { EIP1559UnsignedTransaction } from "@hazae41/eip1559";
import { eip712, EIP712Data } from "@hazae41/eip712";
import { Fixed } from "@hazae41/fixed";
import { RpcCounter, RpcRequestPreinit, RpcResponse } from "@hazae41/jsonrpc";
import * as KDBX from "@hazae41/kdbx";
import { keccak256 } from "@hazae41/keccak256";
import { WcSessionRequestParams, WcUnsupportedAccountsError, WcUnsupportedChainsError, WcUnsupportedMethodsError, WcUserRejectedError } from "@hazae41/latrine";
import { PathBoard } from "@hazae41/modal";
import { useCloseContext } from "@hazae41/react-close-context";
import { Err, Ok, Result } from "@hazae41/result-and-option";
import { secp256k1 } from "@hazae41/secp256k1";
import React, { Fragment, useCallback, useEffect, useMemo, useState } from "react";

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

export interface EIP1193TransactionRequest {
  readonly data?: `0x${string}`
  readonly from: `0x${string}`
  readonly gas?: `0x${string}`
  readonly gasPrice?: `0x${string}`
  readonly maxFeePerGas?: `0x${string}`
  readonly maxPriorityFeePerGas?: `0x${string}`
  readonly to?: `0x${string}`
  readonly value?: `0x${string}`
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
    return $entry.getStringByKeyOrNull("SeedPhrase")?.getValueOrNull()?.get()
  }, [$entry])

  const getEthereumOrThrow = useCallback(async () => {
    if (seedphrase == null)
      return

    const seed = new BitcoinSeedKey(await BitcoinSeedPhrase.derive(seedphrase))

    const xsig = await seed.derive(`m/44'/60'/0'/0/${subaccount}`)
    const upub = secp256k1.SecretKey.import(xsig.key).publish().export(false)

    return `0x${keccak256.digest(upub.slice(1)).slice(-20).toHex()}`
  }, [seedphrase, subaccount])

  const getSolanaOrThrow = useCallback(async () => {
    if (seedphrase == null)
      return

    const seed = new Ed25519SeedKey(await BitcoinSeedPhrase.derive(seedphrase))

    const xsig = await seed.derive(`m/44'/501'/${subaccount}'/0'`)
    const upub = await Ed25519.publish(xsig.key)

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

    if (seedphrase == null)
      throw new WcUnsupportedAccountsError()

    if (request.method === "eth_sendTransaction") {
      const [{ data, from, gas, gasPrice, maxFeePerGas, maxPriorityFeePerGas, to, value }] = request.params as [EIP1193TransactionRequest]

      const chainId = Number(params.chainId.split(":")[1])
      const chain = chainlist.find(chain => chain.chainId === Number(params.chainId.split(":")[1]))

      if (chain == null)
        throw new WcUnsupportedChainsError()

      const current = await getEthereumOrThrow()

      if (current == null)
        throw new WcUnsupportedAccountsError()
      if (from.toLowerCase() !== current.toLowerCase())
        throw new WcUnsupportedAccountsError()

      const nonce = await requestOrThrow<`0x${string}`>(chain.rpc, {
        method: "eth_getTransactionCount",
        params: [current, "latest"]
      }).then(r => r.getOrThrow())

      const transaction = await (async () => {
        const sentValue = value || 0n

        const sentGas: `0x${string}` = gas || await requestOrThrow<`0x${string}`>(chain.rpc, {
          method: "eth_estimateGas",
          params: [{ to, data, value }]
        }).then(r => r.getOrThrow())

        if (gasPrice != null)
          return EIP155UnsignedTransaction.from({ chainId, nonce, gasPrice, startGas: sentGas, to, value: sentValue, data })
        if (maxFeePerGas != null && maxPriorityFeePerGas != null)
          return EIP1559UnsignedTransaction.from({ chainId, nonce, maxFeePerGas, maxPriorityFeePerGas, gasLimit: sentGas, destination: to, amount: sentValue, data })

        const liveBlockData = await requestOrThrow<{ baseFeePerGas?: `0x${string}` }>(chain.rpc, {
          method: "eth_getBlockByNumber",
          params: ["latest", false]
        }).then(r => r.getOrThrow())

        if (liveBlockData.baseFeePerGas != null) {
          const liveMaxPriorityFeePerGas = await requestOrThrow<`0x${string}`>(chain.rpc, {
            method: "eth_maxPriorityFeePerGas",
            params: []
          }).then(r => r.getOrThrow())

          const baseFeePerGas = BigInt(liveBlockData.baseFeePerGas)

          const maxPriorityFeePerGas = BigInt(liveMaxPriorityFeePerGas)
          const maxFeePerGas = (baseFeePerGas * 2n) + maxPriorityFeePerGas

          return EIP1559UnsignedTransaction.from({ chainId, nonce, gasLimit: sentGas, maxFeePerGas, maxPriorityFeePerGas, destination: to, amount: sentValue, data })
        }

        const sentGasPrice = await requestOrThrow<`0x${string}`>(chain.rpc, {
          method: "eth_gasPrice",
          params: []
        }).then(r => r.getOrThrow())

        return EIP155UnsignedTransaction.from({ chainId, nonce, gasPrice: sentGasPrice, startGas: sentGas, to, value: sentValue, data })
      })()

      const seed = new BitcoinSeedKey(await BitcoinSeedPhrase.derive(seedphrase))
      const xsig = await seed.derive(`m/44'/60'/0'/0/${subaccount}`)

      const digest = keccak256.digest(transaction.encode())
      const signed = secp256k1.SecretKey.import(xsig.key).sign(digest).export()

      return await requestOrThrow<`0x${string}`>(chain.rpc, {
        method: "eth_sendRawTransaction",
        params: [`0x${transaction.sign(signed).encode().toHex()}`]
      }).then(r => r.getOrThrow())
    }

    if (request.method === "personal_sign") {
      const [message, account] = request.params as [string, string]

      const current = await getEthereumOrThrow()

      if (current == null)
        throw new WcUnsupportedAccountsError()
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

      const current = await getEthereumOrThrow()

      if (current == null)
        throw new WcUnsupportedAccountsError()
      if (account.toLowerCase() !== current.toLowerCase())
        throw new WcUnsupportedAccountsError()

      const seed = new BitcoinSeedKey(await BitcoinSeedPhrase.derive(seedphrase))
      const xsig = await seed.derive(`m/44'/60'/0'/0/${subaccount}`)

      const digest = eip712.hash(JSON.parse(data))
      const signed = secp256k1.SecretKey.import(xsig.key).sign(digest).export()

      signed[64] += 27

      return `0x${signed.toHex()}`
    }

    if (request.method === "solana_signMessage") {
      const { message, pubkey } = request.params as { message: string, pubkey: string }

      const current = await getSolanaOrThrow()

      if (current == null)
        throw new WcUnsupportedAccountsError()
      if (pubkey !== current)
        throw new WcUnsupportedAccountsError()

      const seed = new Ed25519SeedKey(await BitcoinSeedPhrase.derive(seedphrase))
      const xsig = await seed.derive(`m/44'/501'/${subaccount}'/0'`)

      const msgraw = new Uint8Array(base58.decode(message))
      const sigraw = new Uint8Array(await Ed25519.sign(xsig.key, msgraw))

      return { signature: base58.encode(sigraw) }
    }

    throw new WcUnsupportedMethodsError()
  }, [seedphrase, getEthereumOrThrow, getSolanaOrThrow, requestOrThrow])

  const approve = useSubmit(async () => {
    await respondOrThrow(request.params).then(request.resolve).catch(request.reject).finally(() => close(true))
  }, [request, respondOrThrow, close])

  const decline = useSubmit(async () => {
    await Promise.reject(new WcUserRejectedError()).catch(request.reject).finally(() => close(true))
  }, [request, close])

  const getChainOrThrow = useCallback((params: WcSessionRequestParams) => {
    const { request, chainId } = params

    if (request.method === "eth_sendTransaction")
      return chainlist.find(chain => chain.chainId === Number(chainId.split(":")[1]))?.name

    if (request.method === "solana_signTransaction")
      return "Solana"

    if (request.method === "eth_signTypedData_v4") {
      const [account, data] = request.params as [string, string]

      const { domain } = JSON.parse(data) as EIP712Data

      return chainlist.find(chain => chain.chainId === Number(domain.chainId))?.name
    }

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

    if (request.method === "eth_signTypedData_v4") {
      const [account, data] = request.params as [string, string]

      const { message } = JSON.parse(data) as EIP712Data

      return JSON.stringify(message, null, 2)
    }

    if (request.method === "solana_signMessage") {
      const { message } = request.params as { message: string }

      const msgraw = base58.decode(message)
      const msgtxt = new TextDecoder().decode(msgraw)

      return msgtxt
    }

    throw new WcUnsupportedMethodsError()
  }, [])

  const getSimulationOrThrow = useCallback(async (params: WcSessionRequestParams) => {
    const { request } = params

    if (request.method === "eth_sendTransaction") {
      const [{ data, from, to, value }] = request.params as [EIP1193TransactionRequest]

      const chain = chainlist.find(chain => chain.chainId === Number(params.chainId.split(":")[1]))

      if (chain == null)
        throw new WcUnsupportedChainsError()

      const current = await getEthereumOrThrow()

      if (current == null)
        throw new WcUnsupportedAccountsError()
      if (from.toLowerCase() !== current.toLowerCase())
        throw new WcUnsupportedAccountsError()

      const calls = [{ from, to, data, value }]

      const payload = {
        blockStateCalls: [{ calls }],
        validation: false,
        traceTransfers: true
      }

      interface CallResultLog {
        readonly address: `0x${string}`
        readonly topics: `0x${string}`[]
        readonly data: `0x${string}`
      }

      interface CallResult {
        readonly status: `0x${string}`,
        readonly logs: CallResultLog[]
      }

      const [{ calls: [result] }] = await requestOrThrow<[{ calls: [CallResult] }]>(chain.rpc, {
        method: "eth_simulateV1",
        params: [payload, "latest"]
      }).then(r => r.getOrThrow())

      if (result.status !== "0x1")
        return Err.void()

      const events = new Array<unknown>()

      for (const log of result.logs) {
        const { address, topics } = log

        const [event] = topics

        if (event === "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef") {
          let from = `0x${topics[1].slice(-40)}`
          let to = `0x${topics[2].slice(-40)}`

          if (from.toLowerCase() === current.toLowerCase())
            from = "(you)"
          if (to.toLowerCase() === current.toLowerCase())
            to = "(you)"

          if (address !== "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee") {
            const [symbol] = await requestOrThrow<`0x${string}`>(chain.rpc, {
              method: "eth_call",
              params: [{ to: address, data: "0x95d89b41" }, "latest"]
            }).then(r => abi.decode([AbiString], Uint8Array.fromHex(base16.padStart(r.getOrThrow().slice(2)))))

            const [decimals] = await requestOrThrow<`0x${string}`>(chain.rpc, {
              method: "eth_call",
              params: [{ to: address, data: "0x313ce567" }, "latest"]
            }).then(r => abi.decode([AbiUint256], Uint8Array.fromHex(base16.padStart(r.getOrThrow().slice(2)))))

            const value = new Fixed(BigInt(log.data), Number(decimals)).toString()

            events.push({ event: "Transfer", contract: address, from, to, value, symbol })

            continue
          }

          const { symbol, decimals } = chain.nativeCurrency

          const value = new Fixed(BigInt(log.data), decimals).toString()

          events.push({ event: "Transfer", contract: "(native)", from, to, value, symbol })

          continue
        }

        if (event === "0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0") {
          let previousOwner = `0x${topics[1].slice(-40)}`
          let newOwner = `0x${topics[2].slice(-40)}`

          if (previousOwner.toLowerCase() === current.toLowerCase())
            previousOwner = "(you)"
          if (newOwner.toLowerCase() === current.toLowerCase())
            newOwner = "(you)"

          events.push({ event: "OwnershipTransferred", contract: address, previousOwner, newOwner })
        }

        continue
      }

      return new Ok(events)
    }

    throw new WcUnsupportedMethodsError()
  }, [getEthereumOrThrow, getSolanaOrThrow, requestOrThrow])

  const type = useMemo(() => {
    return Result.runAndWrapSync(() => getTypeOrThrow(request.params)).getOrNull()
  }, [request])

  const chain = useMemo(() => {
    return Result.runAndWrapSync(() => getChainOrThrow(request.params)).getOrNull()
  }, [request])

  const message = useMemo(() => {
    return Result.runAndWrapSync(() => getMessageOrThrow(request.params)).getOrNull()
  }, [request])

  const [simulation, setSimulation] = useState<Nullable<Result<unknown[]>>>()

  useEffect(() => {
    getSimulationOrThrow(request.params).then(setSimulation).catch((console.warn))
  }, [request])

  const getPromptOrThrow = useCallback((params: WcSessionRequestParams, simulation: Result<unknown[]>) => {
    const { request, chainId } = params

    if (request.method === "eth_sendTransaction") {
      const [params] = request.params as [EIP1193TransactionRequest]

      const chain = chainlist.find(chain => chain.chainId === Number(chainId.split(":")[1]))

      if (chain == null)
        throw new WcUnsupportedChainsError()

      const gas = params.gas ? BigInt(params.gas).toString() : undefined
      const value = params.value ? new Fixed(BigInt(params.value), Number(chain.nativeCurrency.decimals)).toString() : undefined

      const transaction = { chain: chain.name, chainId: chain.chainId, gas, to: params.to, value, symbol: chain.nativeCurrency.symbol, reverts: simulation.isErr(), events: simulation.getOrNull() }

      const prompt = Lang.match({ en: "I am about to sign a crypto transaction. Help me understand it. Do not go into details. Reply in one sentence if nothing feels off. Prefer well-known names over addresses. Here is the transaction and its simulation:", zh: "我即将签署一笔加密交易。帮我理解它。如果没有什么不对劲的地方，请用一句话回复。请优先使用知名名称而不是地址。以下是交易及其模拟：", hi: "मैं एक क्रिप्टो लेनदेन पर हस्ताक्षर करने वाला हूं। मेरी मदद करें इसे समझने में। यदि कुछ भी गलत नहीं लगता है तो एक वाक्य में जवाब दें। पतों के बजाय प्रसिद्ध नामों को प्राथमिकता दें। यहां लेनदेन और इसका सिमुलेशन है:", es: "Estoy a punto de firmar una transacción criptográfica. Ayúdame a entenderlo. Responde en una oración si no parece haber nada mal. Prefiere nombres conocidos sobre direcciones. Aquí está la transacción y su simulación:", ar: "أنا على وشك توقيع معاملة مشفرة. ساعدني في فهمها. لا تذهب إلى التفاصيل. رد بجملة واحدة إذا لم يكن هناك شيء مريب. فضل الأسماء المعروفة على العناوين. إليك المعاملة ومحاكاتها:", fr: "Je suis sur le point de signer une transaction cryptographique. Aidez-moi à la comprendre. Ne pas entrer dans les détails. Répondez en une phrase si rien ne semble anormal. Préférez les noms connus aux adresses. Voici la transaction et sa simulation:", de: "Ich bin dabei, eine Krypto-Transaktion zu signieren. Hilf mir, sie zu verstehen. Gehe nicht ins Detail. Antworte in einem Satz, wenn nichts verdächtig erscheint. Bevorzuge bekannte Namen gegenüber Adressen. Hier ist die Transaktion und ihre Simulation:", ru: "Я собираюсь подписать криптографическую транзакцию. Помогите мне понять ее. Не вдавайтесь в подробности. Ответьте одним предложением, если ничего не кажется подозрительным. Предпочитайте известные имена адресам. Вот транзакция и ее симуляция:", pt: "Estou prestes a assinar uma transação criptográfica. Ajude-me a entendê-la. Não entre em detalhes. Responda em uma frase se nada parecer errado. Prefira nomes conhecidos a endereços. Aqui está a transação e sua simulação:", ja: "暗号化されたトランザクションに署名しようとしています。理解するのを手伝ってください。詳細には立ち入らないでください。何もおかしいと感じない場合は、一文で返信してください。アドレスよりもよく知られた名前を優先してください。以下はトランザクションとそのシミュレーションです:", pa: "ਮੈਂ ਇੱਕ ਕ੍ਰਿਪਟੋ ਲੈਣ-ਦੇਣ 'ਤੇ ਦਸਤਖਤ ਕਰਨ ਵਾਲਾ ਹਾਂ। ਮੈਨੂੰ ਇਸਨੂੰ ਸਮਝਣ ਵਿੱਚ ਮਦਦ ਕਰੋ। ਵਿਸਥਾਰ ਵਿੱਚ ਨਾ ਜਾਓ। ਜੇ ਕੁਝ ਵੀ ਗਲਤ ਨਹੀਂ ਲੱਗਦਾ ਹੈ ਤਾਂ ਇੱਕ ਵਾਕ ਵਿੱਚ ਜਵਾਬ ਦਿਓ। ਪਤੇ ਦੀ ਬਜਾਏ ਜਾਣੇ-ਮाने ਨਾਮਾਂ ਨੂੰ ਤਰਜੀਹ ਦਿਓ। ਇੱਥੇ ਲੈਣ-ਦੇਣ ਅਤੇ ਇਸ ਦੀ ਸਿਮੂਲੇਸ਼ਨ ਹੈ:", bn: "আমি একটি ক্রিপ্টো লেনদেনে স্বাক্ষর করতে যাচ্ছি। আমাকে এটি বুঝতে সাহায্য করুন। বিস্তারিতভাবে না যান। যদি কিছুই অদ্ভুত না লাগে তবে একটি বাক্যে উত্তর দিন। ঠিকানার উপর পরিচিত নামগুলিকে অগ্রাধিকার দিন। এখানে লেনদেন এবং এর সিমুলেশন রয়েছে:", id: "Saya akan menandatangani transaksi kripto. Bantu saya memahaminya. Jangan masuk ke detail. Balas dalam satu kalimat jika tidak ada yang terasa aneh. Utamakan nama yang dikenal daripada alamat. Berikut adalah transaksi dan simulasinya:", ur: "میں ایک کرپٹو ٹرانزیکشن پر دستخط کرنے والا ہوں۔ مجھے اسے سمجھنے میں مدد کریں۔ تفصیلات میں نہ جائیں۔ اگر کچھ بھی عجیب نہیں لگتا ہے تو ایک جملے میں جواب دیں۔ پتوں کے بجائے معروف ناموں کو ترجیح دیں۔ یہاں ٹرانزیکشن اور اس کی سیمولیشن ہے:", ms: "Saya akan menandatangani transaksi kripto. Bantu saya memahaminya. Jangan masuk ke detail. Balas dalam satu kalimat jika tidak ada yang terasa aneh. Utamakan nama yang dikenal daripada alamat. Berikut adalah transaksi dan simulasinya:", it: "Sto per firmare una transazione crittografica. Aiutami a capirla. Non entrare nei dettagli. Rispondi in una frase se non sembra esserci nulla di strano. Preferisci nomi noti agli indirizzi. Ecco la transazione e la sua simulazione:", tr: "Kripto işlemi imzalamak üzereyim. Anlamama yardım et. Detaylara girmeyin. Hiçbir şey garip gelmiyorsa bir cümleyle cevap verin. Adresler yerine bilinen isimleri tercih edin. İşte işlem ve simülasyonu:", ta: "நான் ஒரு கிரிப்டோ பரிவர்த்தனையில் கையொப்பமிடப்போகிறேன். அதை புரிந்துகொள்ள எனக்கு உதவுங்கள். விவரங்களுக்கு செல்ல வேண்டாம். எதுவும் சந்தேகமாகத் தெரியவில்லை என்றால் ஒரு வாக்கியத்தில் பதிலளிக்கவும். முகவரிகளுக்கு பதிலாக பரிச்சயமான பெயர்களை முன்னுரிமை அளிக்கவும். இங்கே பரிவர்த்தனை மற்றும் அதன் சிமுலேஷன் உள்ளது:", te: "నేను ఒక క్రిప్టో లావాదేవిపై సంతకం చేయబోతున్నాను. దాన్ని అర్థం చేసుకోవడంలో నాకు సహాయం చేయండి. వివరాలకు వెళ్లవద్దు. ఏదైనా అనుమానాస్పదంగా కనిపించకపోతే ఒక వాక్యంలో జవాబు ఇవ్వండి. చిరునామాల కంటే బాగా తెలిసిన పేర్లను ప్రాధాన్యత ఇవ్వండి. ఇక్కడ లావాదేవీ మరియు దాని సిమ్యులేషన్ ఉంది:", ko: "암호화된 트랜잭션에 서명하려고 합니다. 이해하는 데 도움을 주세요. 세부 사항으로 들어가지 마세요. 이상한 점이 없으면 한 문장으로 답하세요. 주소보다 잘 알려진 이름을 선호하세요. 다음은 트랜잭션과 시뮬레이션입니다:", vi: "Tôi sắp ký một giao dịch tiền điện tử. Hãy giúp tôi hiểu nó. Đừng đi vào chi tiết. Trả lời trong một câu nếu không có gì cảm thấy sai. Ưu tiên tên nổi tiếng hơn địa chỉ. Đây là giao dịch và mô phỏng của nó:", pl: "Zaraz podpiszę transakcję kryptograficzną. Pomóż mi ją zrozumieć. Nie wchodź w szczegóły. Odpowiedz jednym zdaniem, jeśli nic nie wydaje się podejrzane. Preferuj znane nazwy nad adresami. Oto transakcja i jej symulacja:", ro: "Sunt pe cale să semnez o tranzacție criptografică. Ajută-mă să o înțeleg. Nu intra în detalii. Răspunde într-o propoziție dacă nu pare nimic suspect. Preferă numele cunoscute în locul adreselor. Iată tranzacția și simularea sa:", nl: "Ik sta op het punt een cryptotransactie te ondertekenen. Help me het te begrijpen. Ga niet in op details. Antwoord in één zin als er niets verdachts lijkt te zijn. Geef de voorkeur aan bekende namen boven adressen. Hier is de transactie en de simulatie ervan:", el: "Είμαι έτοιμος να υπογράψω μια κρυπτογραφική συναλλαγή. Βοηθήστε με να την καταλάβω. Μην μπείτε σε λεπτομέρειες. Απαντήστε σε μία πρόταση αν δεν φαίνεται τίποτα ύποπτο. Προτιμήστε γνωστά ονόματα αντί για διευθύνσεις. Εδώ είναι η συναλλαγή και η προσομοίωσή της:", th: "ฉันกำลังจะเซ็นชื่อธุรกรรมเข้ารหัส ช่วยฉันเข้าใจมัน อย่าเจาะลึกไปในรายละเอียด ตอบกลับในประโยคเดียวถ้าไม่มีอะไรน่าสงสัย โปรดใช้ชื่อที่รู้จักกันดีแทนที่อยู่ นี่คือธุรกรรมและการจำลองของมัน:", cs: "Chystám se podepsat kryptografickou transakci. Pomozte mi ji pochopit. Nechoďte do detailů. Odpovězte jednou větou, pokud se nezdá být nic podezřelého. Upřednostňujte známé názvy před adresami. Zde je transakce a její simulace:", hu: "Kripto tranzakció aláírása előtt állok. Segíts megérteni. Ne menj bele a részletekbe. Válaszolj egy mondatban, ha semmi sem tűnik gyanúsnak. Előnyben részesítendők a jól ismert nevek a címekkel szemben. Itt van a tranzakció és a szimulációja:", sv: "Jag är på väg att signera en kryptotransaktion. Hjälp mig att förstå den. Gå inte in på detaljer. Svara i en mening om inget verkar misstänkt. Föredra välkända namn framför adresser. Här är transaktionen och dess simulering:", da: "Jeg er ved at underskrive en kryptotransaktion. Hjælp mig med at forstå den. Gå ikke i detaljer. Svar i en sætning, hvis der ikke virker noget mistænkeligt. Foretræk velkendte navne frem for adresser. Her er transaktionen og dens simulering:" })

      return prompt + "\n\n" + JSON.stringify(transaction, null, 2)
    }

    throw new WcUnsupportedMethodsError()
  }, [])

  const prompt = useMemo(() => {
    if (simulation == null)
      return
    return Result.runAndWrapSync(() => getPromptOrThrow(request.params, simulation)).getOrNull()
  }, [simulation])

  const copyThePrompt = useCopy(prompt)

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
        {type === "transaction" && <Fragment>
          <div className="h-6" />
          <div className="font-medium">
            {Lang.match({ en: "Summary", zh: "摘要", hi: "सारांश", es: "Resumen", ar: "ملخص", fr: "Résumé", de: "Zusammenfassung", ru: "Резюме", pt: "Resumo", ja: "概要", pa: "ਸਾਰ", bn: "সারাংশ", id: "Ringkasan", ur: "خلاصہ", ms: "Ringkasan", it: "Sommario", tr: "Özet", ta: "சுருக்கம்", te: "సారాంశం", ko: "요약", vi: "Tóm tắt", pl: "Podsumowanie", ro: "Rezumat", nl: "Samenvatting", el: "Σύνοψη ", th: "สรุป ", cs: "Souhrn ", hu: "Összefoglaló ", sv: "Sammanfattning ", da: "Resumé" })}
          </div>
          <div className="text-default-contrast">
            {Lang.match({ en: "Request summary prompt for AI. Copy this prompt to your AI to help understand what you sign.", zh: "AI 的请求摘要提示。将此提示复制到您的 AI 中以帮助理解您签署的内容。", hi: "एआई के लिए अनुरोध सारांश संकेत। इस संकेत को अपनी एआई में कॉपी करें ताकि यह समझने में मदद मिल सके कि आप क्या साइन कर रहे हैं।", es: "Solicitud de resumen para IA. Copie este mensaje a su IA para ayudar a entender lo que firma.", ar: "ملخص الطلب للذكاء الاصطناعي. انسخ هذا الموجه إلى الذكاء الاصطناعي الخاص بك للمساعدة في فهم ما تقوم بتوقيعه.", fr: "Résumé de la demande pour l'IA. Copiez cette invite dans votre IA pour aider à comprendre ce que vous signez.", de: "Anforderungszusammenfassung für KI. Kopieren Sie diese Eingabeaufforderung in Ihre KI, um zu verstehen, was Sie unterschreiben.", ru: "Сводка запроса для ИИ. Скопируйте этот запрос в свой ИИ, чтобы помочь понять, что вы подписываете.", pt: "Resumo da solicitação para IA. Copie este prompt para sua IA para ajudar a entender o que você assina.", ja: "AI のリクエスト要約プロンプト。これを AI にコピーして、署名する内容を理解するのに役立ててください。", pa: "ਏਆਈ ਲਈ ਬੇਨਤੀ ਸਾਰ ਸੰਕੇਤ। ਇਸ संकेत को अपनी एआई में कॉपी करें ताकि यह समझने में मदद मिल सके कि आप क्या साइन कर रहे हैं।", bn: "এআই এর জন্য অনুরোধ সারাংশ প্রম্পট। আপনি যা সাইন করছেন তা বুঝতে সাহায্য করার জন্য এই প্রম্পটটি আপনার AI-তে কপি করুন।", id: "Ringkasan permintaan untuk AI. Salin prompt ini ke AI Anda untuk membantu memahami apa yang Anda tanda tangani.", ur: "AI کے لیے درخواست کا خلاصہ پرامپٹ۔ اس پرامپٹ کو اپنے AI میں کاپی کریں تاکہ یہ سمجھنے میں مدد مل سکے کہ آپ کیا سائن کر رہے ہیں۔", ms: "Ringkasan permintaan untuk AI. Salin prompt ini ke AI Anda untuk membantu memahami apa yang Anda tanda tangani.", it: "Riepilogo della richiesta per l'IA. Copia questo prompt nella tua IA per aiutarti a capire cosa stai firmando.", tr: "AI için istek özeti istemi. Ne imzaladığınızı anlamanıza yardımcı olmak için bu istemi AI'nize kopyalayın.", ta: "AI க்கான கோரிக்கை சுருக்கம். நீங்கள் என்ன கையெழுத்திடுகிறீர்கள் என்பதை புரிந்துகொள்ள உதவ இந்த ப்ராம்ப்டை உங்கள் AI க்கு நகலெடுக்கவும்.", te: "AI కోసం అభ్యర్థన సారాంశ ప్రాంప్ట్. మీరు ఏమి సంతకం చేస్తున్నారో అర్థం చేసుకోవడంలో సహాయపడటానికి ఈ ప్రాంప్ట్‌ను మీ AIకి కాపీ చేయండి.", ko: "AI를 위한 요청 요약 프롬프트입니다. 서명하는 내용을 이해하는 데 도움이 되도록 이 프롬프트를 AI에 복사하세요.", vi: "Yêu cầu tóm tắt cho AI. Sao chép lời nhắc này vào AI của bạn để giúp hiểu những gì bạn đang ký.", pl: "Podsumowanie żądania dla AI. Skopiuj ten prompt do swojego AI, aby pomóc zrozumieć, co podpisujesz.", ro: "Rezumatul cererii pentru AI. Copiați acest prompt în AI-ul dvs. pentru a vă ajuta să înțelegeți ce semnați.", nl: "Samenvatting van het verzoek voor AI. Kopieer deze prompt naar uw AI om te helpen begrijpen wat u ondertekent.", el: "Σύνοψη αιτήματος για AI. Αντιγράψτε αυτήν την προτροπή στο AI σας για να βοηθήσετε να καταλάβετε τι υπογράφετε ", th: "สรุปคำขอสำหรับ AI คัดลอกพรอมต์นี้ไปยัง AI ของคุณเพื่อช่วยให้เข้าใจว่าคุณกำลังเซ็นอะไร ", cs: "Souhrn požadavku pro AI. Zkopírujte tento prompt do svého AI, abyste pomohli pochopit, co podepisujete. ", hu: "Kérés összefoglaló az AI számára. Másolja ezt a promptot az AI-jába, hogy segítsen megérteni, mit ír alá. ", sv: "Förfrågningssammanfattning för AI. Kopiera denna prompt till din AI för att hjälpa dig förstå vad du undertecknar. ", da: "Anmodningsresumé for AI. Kopier denne prompt til din AI for at hjælpe med at forstå, hvad du underskriver." })}
          </div>
          <div className="h-4" />
          <div className="bg-default-contrast po-2 rounded-xl flex flex-col gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
            <textarea className="w-full resize-none focus-visible:outline-none"
              readOnly
              rows={9}
              dir={prompt ? "ltr" : "auto"}
              value={prompt || Lang.match({ en: "Loading...", zh: "加载中...", hi: "लोड हो रहा है...", es: "Cargando...", ar: "جار التحميل...", fr: "Chargement...", de: "Wird geladen...", ru: "Загрузка...", pt: "Carregando...", ja: "読み込み中...", pa: "ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...", bn: "লোড হচ্ছে...", id: "Memuat...", ur: "لوڈ ہو رہا ہے...", ms: "Memuat...", it: "Caricamento...", tr: "Yükleniyor...", ta: "ஏற்றுகிறது...", te: "లోడ్ అవుతోంది...", ko: "로딩 중...", vi: "Đang tải...", pl: "Ładowanie...", ro: "Se încarcă...", nl: "Laden...", el: "Φόρτωση...", th: "กำลังโหลด...", cs: "Načítání...", hu: "Betöltés...", sv: "Laddar...", da: "Indlæser..." })} />
          </div>
          <div className="h-2" />
          <div className="flex items-center flex-wrap-reverse gap-2">
            <WideContrastButton
              onClick={copyThePrompt.copyOrDisplay}>
              {copyThePrompt.copied ? <Outline.CheckIcon className="size-5" /> : <Outline.DocumentDuplicateIcon className="size-5" />}
              {copyThePrompt.copied ? Lang.match({ en: "Copied", zh: "已复制", hi: "कॉपी किया गया", es: "Copiado", ar: "تم النسخ", fr: "Copié", de: "Kopiert", ru: "Скопировано", pt: "Copiado", ja: "コピーしました", pa: "ਨਕਲ ਕੀਤਾ", bn: "কপি করা হয়েছে", id: "Disalin", ur: "کاپی کیا گیا", ms: "Disalin", it: "Copiato", tr: "Kopyalandı", ta: "நகலெடுக்கப்பட்டது", te: "నకలించబడింది", ko: "복사됨", vi: "Đã sao chép", pl: "Skopiowano", ro: "Copiat", nl: "Gekopieerd", el: "Αντιγράφηκε ", th: "คัดลอกแล้ว ", cs: "Zkopírováno ", hu: "Másolva ", sv: "Kopierat ", da: "Kopieret" }) : Lang.match({ en: "Copy", zh: "复制", hi: "कॉपी करें", es: "Copiar", ar: "نسخ", fr: "Copier", de: "Kopieren", ru: "Копировать", pt: "Copiar", ja: "コピー", pa: "ਨਕਲ ਕਰੋ", bn: "কপি করুন", id: "Salin", ur: "کاپی کریں", ms: "Salin", it: "Copia", tr: "Kopyala", ta: "நகலெடுக்கவும்", te: "నకలించు", ko: "복사", vi: "Sao chép", pl: "Kopiuj", ro: "Copiați", nl: "Kopiëren", el: "Αντιγραφή ", th: "คัดลอก ", cs: "Kopírovat ", hu: "Másolás ", sv: "Kopiera ", da: "Kopier" })}
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