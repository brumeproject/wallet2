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

// await fetch("https://chainlist.org/rpcs.json").then(r => r.json()).then((data: ChainData[]) => data.map(data => {
//   const { name, title, chain, chainId } = data

//   const rpc = data.rpc.find(rpc => {
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

//   return { name, title, chain, chainId, rpc }
// }).filter(Boolean))

export const chainlist = [
  {
    "name": "Ethereum Mainnet",
    "chain": "ETH",
    "chainId": 1,
    "rpc": "https://ethereum-rpc.publicnode.com"
  },
  {
    "name": "BNB Smart Chain Mainnet",
    "chain": "BSC",
    "chainId": 56,
    "rpc": "https://bsc-rpc.publicnode.com"
  },
  {
    "name": "Base",
    "chain": "ETH",
    "chainId": 8453,
    "rpc": "https://base-rpc.publicnode.com"
  },
  {
    "name": "Arbitrum One",
    "chain": "ETH",
    "chainId": 42161,
    "rpc": "https://arbitrum-one-rpc.publicnode.com"
  },
  {
    "name": "Avalanche C-Chain",
    "chain": "AVAX",
    "chainId": 43114,
    "rpc": "https://avalanche-c-chain-rpc.publicnode.com"
  },
  {
    "name": "Polygon Mainnet",
    "chain": "Polygon",
    "chainId": 137,
    "rpc": "https://polygon-bor-rpc.publicnode.com"
  },
  {
    "name": "OP Mainnet",
    "chain": "ETH",
    "chainId": 10,
    "rpc": "https://optimism-rpc.publicnode.com"
  },
  {
    "name": "Mantle",
    "chain": "ETH",
    "chainId": 5000,
    "rpc": "https://mantle-rpc.publicnode.com"
  },
  {
    "name": "Cronos Mainnet",
    "chain": "CRO",
    "chainId": 25,
    "rpc": "https://cronos-evm-rpc.publicnode.com"
  },
  {
    "name": "Berachain",
    "chain": "Berachain",
    "chainId": 80094,
    "rpc": "https://berachain-rpc.publicnode.com"
  },
  {
    "name": "Gnosis",
    "chain": "GNO",
    "chainId": 100,
    "rpc": "https://gnosis-rpc.publicnode.com"
  },
  {
    "name": "PulseChain",
    "chain": "PLS",
    "chainId": 369,
    "rpc": "https://pulsechain-rpc.publicnode.com"
  },
  {
    "name": "Unichain",
    "chain": "ETH",
    "chainId": 130,
    "rpc": "https://unichain-rpc.publicnode.com"
  },
  {
    "name": "Linea",
    "title": "Linea Mainnet",
    "chain": "ETH",
    "chainId": 59144,
    "rpc": "https://linea-rpc.publicnode.com"
  },
  {
    "name": "Sonic Mainnet",
    "chain": "sonic",
    "chainId": 146,
    "rpc": "https://sonic-rpc.publicnode.com"
  },
  {
    "name": "Fraxtal",
    "chain": "FRAX",
    "chainId": 252,
    "rpc": "https://fraxtal-rpc.publicnode.com"
  },
  {
    "name": "Kava",
    "chain": "KAVA",
    "chainId": 2222,
    "rpc": "https://kava-evm-rpc.publicnode.com"
  },
  {
    "name": "Blast",
    "chain": "ETH",
    "chainId": 81457,
    "rpc": "https://blast-rpc.publicnode.com"
  },
  {
    "name": "Scroll",
    "chain": "ETH",
    "chainId": 534352,
    "rpc": "https://scroll-rpc.publicnode.com"
  },
  {
    "name": "Fantom Opera",
    "chain": "FTM",
    "chainId": 250,
    "rpc": "https://fantom-rpc.publicnode.com"
  },
  {
    "name": "Taiko",
    "chain": "ETH",
    "chainId": 167000,
    "rpc": "https://taiko-rpc.publicnode.com"
  },
  {
    "name": "Chiliz Chain",
    "chain": "CHZ",
    "chainId": 88888,
    "rpc": "https://chiliz.publicnode.com"
  },
  {
    "name": "Metis Andromeda Mainnet",
    "chain": "ETH",
    "chainId": 1088,
    "rpc": "https://metis-rpc.publicnode.com"
  },
  {
    "name": "Moonriver",
    "chain": "MOON",
    "chainId": 1285,
    "rpc": "https://moonriver-rpc.publicnode.com"
  },
  {
    "name": "Moonbeam",
    "chain": "MOON",
    "chainId": 1284,
    "rpc": "https://moonbeam-rpc.publicnode.com"
  },
  {
    "name": "opBNB Mainnet",
    "chain": "opBNB",
    "chainId": 204,
    "rpc": "https://opbnb-rpc.publicnode.com"
  },
  {
    "name": "Somnia Mainnet",
    "chain": "SOMNIA",
    "chainId": 5031,
    "rpc": "https://somnia-rpc.publicnode.com"
  },
  {
    "name": "Arbitrum Nova",
    "chain": "ETH",
    "chainId": 42170,
    "rpc": "https://arbitrum-nova-rpc.publicnode.com"
  },
  {
    "name": "Dymension",
    "chain": "Dymension",
    "chainId": 1100,
    "rpc": "https://dymension-evm-rpc.publicnode.com"
  },
  {
    "name": "Syscoin Mainnet",
    "chain": "SYS",
    "chainId": 57,
    "rpc": "https://syscoin-evm.publicnode.com"
  },
  {
    "name": "Tenet",
    "title": "Tenet Mainnet",
    "chain": "TENET",
    "chainId": 1559,
    "rpc": "https://tenet-evm.publicnode.com"
  },
  {
    "name": "Bahamut",
    "title": "Bahamut mainnet",
    "chain": "Bahamut",
    "chainId": 5165,
    "rpc": "https://bahamut-rpc.publicnode.com"
  },
  {
    "name": "IRIShub",
    "chain": "IRIShub",
    "chainId": 6688,
    "rpc": "https://iris-evm-rpc.publicnode.com"
  },
  {
    "name": "Evmos",
    "chain": "Evmos",
    "chainId": 9001,
    "rpc": "https://evmos-evm-rpc.publicnode.com"
  },
  {
    "name": "Haqq Network",
    "chain": "Haqq",
    "chainId": 11235,
    "rpc": "https://haqq-evm.publicnode.com"
  },
  {
    "name": "Ethereum Sepolia",
    "title": "Ethereum Testnet Sepolia",
    "chain": "ETH",
    "chainId": 11155111,
    "rpc": "https://ethereum-sepolia-rpc.publicnode.com"
  },
  {
    "name": "BNB Smart Chain Testnet",
    "chain": "BSC",
    "chainId": 97,
    "rpc": "https://bsc-testnet-rpc.publicnode.com"
  },
  {
    "name": "Base Goerli Testnet",
    "chain": "ETH",
    "chainId": 84531,
    "rpc": "https://base-goerli-rpc.publicnode.com"
  },
  {
    "name": "Base Sepolia Testnet",
    "chain": "ETH",
    "chainId": 84532,
    "rpc": "https://base-sepolia-rpc.publicnode.com"
  },
  {
    "name": "Arbitrum Goerli",
    "title": "Arbitrum Goerli Rollup Testnet",
    "chain": "ETH",
    "chainId": 421613,
    "rpc": "https://arbitrum-goerli-rpc.publicnode.com"
  },
  {
    "name": "Arbitrum Sepolia",
    "title": "Arbitrum Sepolia Rollup Testnet",
    "chain": "ETH",
    "chainId": 421614,
    "rpc": "https://arbitrum-sepolia-rpc.publicnode.com"
  },
  {
    "name": "Avalanche Fuji Testnet",
    "chain": "AVAX",
    "chainId": 43113,
    "rpc": "https://avalanche-fuji-c-chain-rpc.publicnode.com"
  },
  {
    "name": "PulseChain Testnet v4",
    "chain": "t4PLS",
    "chainId": 943,
    "rpc": "https://pulsechain-testnet-rpc.publicnode.com"
  },
  {
    "name": "Unichain Sepolia Testnet",
    "chain": "ETH",
    "chainId": 1301,
    "rpc": "https://unichain-sepolia-rpc.publicnode.com"
  },
  {
    "name": "Linea Sepolia",
    "title": "Linea Sepolia Testnet",
    "chain": "ETH",
    "chainId": 59141,
    "rpc": "https://linea-sepolia-rpc.publicnode.com"
  },
  {
    "name": "Scroll Sepolia Testnet",
    "chain": "ETH",
    "chainId": 534351,
    "rpc": "https://scroll-sepolia-rpc.publicnode.com"
  },
  {
    "name": "opBNB Testnet",
    "chain": "opBNB",
    "chainId": 5611,
    "rpc": "https://opbnb-testnet-rpc.publicnode.com"
  },
  {
    "name": "Goerli",
    "title": "Ethereum Testnet Goerli",
    "chain": "ETH",
    "chainId": 5,
    "rpc": "https://ethereum-goerli-rpc.publicnode.com"
  },
  {
    "name": "Optimism Goerli Testnet",
    "chain": "ETH",
    "chainId": 420,
    "rpc": "https://optimism-goerli-rpc.publicnode.com"
  },
  {
    "name": "Fantom Testnet",
    "chain": "FTM",
    "chainId": 4002,
    "rpc": "https://fantom-testnet-rpc.publicnode.com"
  },
  {
    "name": "Syscoin Tanenbaum Testnet",
    "chain": "SYS",
    "chainId": 5700,
    "rpc": "https://syscoin-tanenbaum-evm.publicnode.com"
  },
  {
    "name": "Evmos Testnet",
    "chain": "Evmos",
    "chainId": 9000,
    "rpc": "https://evmos-testnet-evm-rpc.publicnode.com"
  },
  {
    "name": "Gnosis Chiado Testnet",
    "chain": "GNO",
    "chainId": 10200,
    "rpc": "https://gnosis-chiado-rpc.publicnode.com"
  },
  {
    "name": "Holesky",
    "title": "Ethereum Testnet Holesky",
    "chain": "ETH",
    "chainId": 17000,
    "rpc": "https://ethereum-holesky-rpc.publicnode.com"
  },
  {
    "name": "Sonic Blaze Testnet",
    "chain": "blaze-testnet",
    "chainId": 57054,
    "rpc": "https://sonic-blaze-rpc.publicnode.com"
  },
  {
    "name": "Metis Sepolia Testnet",
    "chain": "ETH",
    "chainId": 59902,
    "rpc": "https://metis-sepolia-rpc.publicnode.com"
  },
  {
    "name": "Mumbai",
    "title": "Polygon Testnet Mumbai",
    "chain": "Polygon",
    "chainId": 80001,
    "rpc": "https://polygon-mumbai-bor-rpc.publicnode.com"
  },
  {
    "name": "Amoy",
    "title": "Polygon Amoy Testnet",
    "chain": "Polygon",
    "chainId": 80002,
    "rpc": "https://polygon-bor-amoy-rpc.publicnode.com"
  }
]