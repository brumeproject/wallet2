export interface ChainData {
  readonly name: string,
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