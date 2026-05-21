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

// await fetch("https://chainlist.org/rpcs.json").then(r => r.json()).then((data: ChainData[]) => data.map(chain => {
//   const { chainId } = chain

//   const rpc = chain.rpc.find(rpc => {
//     try {
//       const url = new URL(rpc.url)

//       if (url.protocol !== "https:")
//         return false

//       if (!url.origin.endsWith(".publicnode.com"))
//         return false

//       return true
//     } catch {
//       return false
//     }
//   })?.url

//   if (rpc == null)
//     return null

//   return { chainId, rpc }
// }).filter(Boolean))

export const chainlist = [
  {
    "chainId": 1,
    "rpc": "https://ethereum-rpc.publicnode.com"
  },
  {
    "chainId": 56,
    "rpc": "https://bsc-rpc.publicnode.com"
  },
  {
    "chainId": 8453,
    "rpc": "https://base-rpc.publicnode.com"
  },
  {
    "chainId": 42161,
    "rpc": "https://arbitrum-one-rpc.publicnode.com"
  },
  {
    "chainId": 43114,
    "rpc": "https://avalanche-c-chain-rpc.publicnode.com"
  },
  {
    "chainId": 137,
    "rpc": "https://polygon-bor-rpc.publicnode.com"
  },
  {
    "chainId": 10,
    "rpc": "https://optimism-rpc.publicnode.com"
  },
  {
    "chainId": 5000,
    "rpc": "https://mantle-rpc.publicnode.com"
  },
  {
    "chainId": 25,
    "rpc": "https://cronos-evm-rpc.publicnode.com"
  },
  {
    "chainId": 80094,
    "rpc": "https://berachain-rpc.publicnode.com"
  },
  {
    "chainId": 100,
    "rpc": "https://gnosis-rpc.publicnode.com"
  },
  {
    "chainId": 2222,
    "rpc": "https://kava-evm-rpc.publicnode.com"
  },
  {
    "chainId": 59144,
    "rpc": "https://linea-rpc.publicnode.com"
  },
  {
    "chainId": 130,
    "rpc": "https://unichain-rpc.publicnode.com"
  },
  {
    "chainId": 369,
    "rpc": "https://pulsechain-rpc.publicnode.com"
  },
  {
    "chainId": 146,
    "rpc": "https://sonic-rpc.publicnode.com"
  },
  {
    "chainId": 252,
    "rpc": "https://fraxtal-rpc.publicnode.com"
  },
  {
    "chainId": 81457,
    "rpc": "https://blast-rpc.publicnode.com"
  },
  {
    "chainId": 534352,
    "rpc": "https://scroll-rpc.publicnode.com"
  },
  {
    "chainId": 250,
    "rpc": "https://fantom-rpc.publicnode.com"
  },
  {
    "chainId": 1088,
    "rpc": "https://metis-rpc.publicnode.com"
  },
  {
    "chainId": 167000,
    "rpc": "https://taiko-rpc.publicnode.com"
  },
  {
    "chainId": 88888,
    "rpc": "https://chiliz.publicnode.com"
  },
  {
    "chainId": 1285,
    "rpc": "https://moonriver-rpc.publicnode.com"
  },
  {
    "chainId": 204,
    "rpc": "https://opbnb-rpc.publicnode.com"
  },
  {
    "chainId": 1284,
    "rpc": "https://moonbeam-rpc.publicnode.com"
  },
  {
    "chainId": 5031,
    "rpc": "https://somnia-rpc.publicnode.com"
  },
  {
    "chainId": 42170,
    "rpc": "https://arbitrum-nova-rpc.publicnode.com"
  },
  {
    "chainId": 9001,
    "rpc": "https://evmos-evm-rpc.publicnode.com"
  },
  {
    "chainId": 1100,
    "rpc": "https://dymension-evm-rpc.publicnode.com"
  },
  {
    "chainId": 57,
    "rpc": "https://syscoin-evm.publicnode.com"
  },
  {
    "chainId": 1559,
    "rpc": "https://tenet-evm.publicnode.com"
  },
  {
    "chainId": 5165,
    "rpc": "https://bahamut-rpc.publicnode.com"
  },
  {
    "chainId": 6688,
    "rpc": "https://iris-evm-rpc.publicnode.com"
  },
  {
    "chainId": 11235,
    "rpc": "https://haqq-evm.publicnode.com"
  },
  {
    "chainId": 11155111,
    "rpc": "https://ethereum-sepolia-rpc.publicnode.com"
  },
  {
    "chainId": 97,
    "rpc": "https://bsc-testnet-rpc.publicnode.com"
  },
  {
    "chainId": 84531,
    "rpc": "https://base-goerli-rpc.publicnode.com"
  },
  {
    "chainId": 84532,
    "rpc": "https://base-sepolia-rpc.publicnode.com"
  },
  {
    "chainId": 421613,
    "rpc": "https://arbitrum-goerli-rpc.publicnode.com"
  },
  {
    "chainId": 421614,
    "rpc": "https://arbitrum-sepolia-rpc.publicnode.com"
  },
  {
    "chainId": 43113,
    "rpc": "https://avalanche-fuji-c-chain-rpc.publicnode.com"
  },
  {
    "chainId": 59141,
    "rpc": "https://linea-sepolia-rpc.publicnode.com"
  },
  {
    "chainId": 1301,
    "rpc": "https://unichain-sepolia-rpc.publicnode.com"
  },
  {
    "chainId": 943,
    "rpc": "https://pulsechain-testnet-rpc.publicnode.com"
  },
  {
    "chainId": 534351,
    "rpc": "https://scroll-sepolia-rpc.publicnode.com"
  },
  {
    "chainId": 5611,
    "rpc": "https://opbnb-testnet-rpc.publicnode.com"
  },
  {
    "chainId": 9000,
    "rpc": "https://evmos-testnet-evm-rpc.publicnode.com"
  },
  {
    "chainId": 5,
    "rpc": "https://ethereum-goerli-rpc.publicnode.com"
  },
  {
    "chainId": 420,
    "rpc": "https://optimism-goerli-rpc.publicnode.com"
  },
  {
    "chainId": 4002,
    "rpc": "https://fantom-testnet-rpc.publicnode.com"
  },
  {
    "chainId": 5700,
    "rpc": "https://syscoin-tanenbaum-evm.publicnode.com"
  },
  {
    "chainId": 10200,
    "rpc": "https://gnosis-chiado-rpc.publicnode.com"
  },
  {
    "chainId": 17000,
    "rpc": "https://ethereum-holesky-rpc.publicnode.com"
  },
  {
    "chainId": 57054,
    "rpc": "https://sonic-blaze-rpc.publicnode.com"
  },
  {
    "chainId": 59902,
    "rpc": "https://metis-sepolia-rpc.publicnode.com"
  },
  {
    "chainId": 80001,
    "rpc": "https://polygon-mumbai-bor-rpc.publicnode.com"
  },
  {
    "chainId": 80002,
    "rpc": "https://polygon-bor-amoy-rpc.publicnode.com"
  }
]