import { $$ } from "@hazae41/saumon"

export interface ChainData {
  readonly name: string,
  readonly title: string,
  readonly chain: string,
  readonly icon: string
  readonly rpc: Array<ChainRpcData>
  readonly features: Array<ChainFeaturesData>
  readonly faucets: Array<unknown>
  readonly nativeCurrency: ChainNativeCurrencyData
  readonly infoURL: string,
  readonly shortName: string,
  readonly chainId: number,
  readonly networkId: number,
  readonly slip44: number,
  readonly ens: ChaiEnsData
  readonly explorers: Array<ChainExplorerData>
  readonly tvl: number
  readonly chainSlug: string
  readonly isTestnet: boolean
}

export interface ChainNativeCurrencyData {
  readonly name: string,
  readonly symbol: string,
  readonly decimals: number
}

export interface ChainRpcData {
  readonly url: string,
  readonly tracking: string
  readonly isOpenSource: boolean
}

export interface ChainExplorerData {
  readonly name: string,
  readonly url: string,
  readonly icon: string,
  readonly standard: string
}

export interface ChainFeaturesData {
  readonly name: string
}

export interface ChaiEnsData {
  readonly registry: string
}

export interface SmallChainData {
  readonly chainId: number,
  readonly name: string,
  readonly rpc: ChainRpcData
  readonly nativeCurrency: ChainNativeCurrencyData
}

export const chainlist = $$(async () => {
  const fetched: ChainData[] = await fetch("https://chainlist.org/rpcs.json").then(r => r.json())

  const filtered = fetched.map(chain => {
    const { chainId, name, nativeCurrency } = chain

    const rpc = chain.rpc.find(rpc => {
      try {
        const url = new URL(rpc.url)

        if (url.protocol !== "https:")
          return false

        if (!url.origin.endsWith(".publicnode.com"))
          return false

        return true
      } catch {
        return false
      }
    })?.url

    if (rpc == null)
      return

    return { chainId, name, rpc, nativeCurrency }
  }).filter(Boolean)

  return JSON.stringify(filtered, null, 2)
})
