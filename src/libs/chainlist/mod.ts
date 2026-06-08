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

export const chainlist = [
  {
    "chainId": 1,
    "name": "Ethereum Mainnet",
    "rpc": "https://ethereum-rpc.publicnode.com",
    "nativeCurrency": {
      "name": "Ether",
      "symbol": "ETH",
      "decimals": 18
    }
  },
  {
    "chainId": 56,
    "name": "BNB Smart Chain Mainnet",
    "rpc": "https://bsc-rpc.publicnode.com",
    "nativeCurrency": {
      "name": "BNB Chain Native Token",
      "symbol": "BNB",
      "decimals": 18
    }
  },
  {
    "chainId": 8453,
    "name": "Base",
    "rpc": "https://base-rpc.publicnode.com",
    "nativeCurrency": {
      "name": "Ether",
      "symbol": "ETH",
      "decimals": 18
    }
  },
  {
    "chainId": 42161,
    "name": "Arbitrum One",
    "rpc": "https://arbitrum-one-rpc.publicnode.com",
    "nativeCurrency": {
      "name": "Ether",
      "symbol": "ETH",
      "decimals": 18
    }
  },
  {
    "chainId": 43114,
    "name": "Avalanche C-Chain",
    "rpc": "https://avalanche-c-chain-rpc.publicnode.com",
    "nativeCurrency": {
      "name": "Avalanche",
      "symbol": "AVAX",
      "decimals": 18
    }
  },
  {
    "chainId": 137,
    "name": "Polygon Mainnet",
    "rpc": "https://polygon-bor-rpc.publicnode.com",
    "nativeCurrency": {
      "name": "POL",
      "symbol": "POL",
      "decimals": 18
    }
  },
  {
    "chainId": 10,
    "name": "OP Mainnet",
    "rpc": "https://optimism-rpc.publicnode.com",
    "nativeCurrency": {
      "name": "Ether",
      "symbol": "ETH",
      "decimals": 18
    }
  },
  {
    "chainId": 5000,
    "name": "Mantle",
    "rpc": "https://mantle-rpc.publicnode.com",
    "nativeCurrency": {
      "name": "Mantle",
      "symbol": "MNT",
      "decimals": 18
    }
  },
  {
    "chainId": 25,
    "name": "Cronos Mainnet",
    "rpc": "https://cronos-evm-rpc.publicnode.com",
    "nativeCurrency": {
      "name": "Cronos",
      "symbol": "CRO",
      "decimals": 18
    }
  },
  {
    "chainId": 80094,
    "name": "Berachain",
    "rpc": "https://berachain-rpc.publicnode.com",
    "nativeCurrency": {
      "name": "BERA Token",
      "symbol": "BERA",
      "decimals": 18
    }
  },
  {
    "chainId": 100,
    "name": "Gnosis",
    "rpc": "https://gnosis-rpc.publicnode.com",
    "nativeCurrency": {
      "name": "xDAI",
      "symbol": "XDAI",
      "decimals": 18
    }
  },
  {
    "chainId": 369,
    "name": "PulseChain",
    "rpc": "https://pulsechain-rpc.publicnode.com",
    "nativeCurrency": {
      "name": "Pulse",
      "symbol": "PLS",
      "decimals": 18
    }
  },
  {
    "chainId": 130,
    "name": "Unichain",
    "rpc": "https://unichain-rpc.publicnode.com",
    "nativeCurrency": {
      "name": "Ether",
      "symbol": "ETH",
      "decimals": 18
    }
  },
  {
    "chainId": 59144,
    "name": "Linea",
    "rpc": "https://linea-rpc.publicnode.com",
    "nativeCurrency": {
      "name": "Linea Ether",
      "symbol": "ETH",
      "decimals": 18
    }
  },
  {
    "chainId": 252,
    "name": "Fraxtal",
    "rpc": "https://fraxtal-rpc.publicnode.com",
    "nativeCurrency": {
      "name": "Frax",
      "symbol": "FRAX",
      "decimals": 18
    }
  },
  {
    "chainId": 146,
    "name": "Sonic Mainnet",
    "rpc": "https://sonic-rpc.publicnode.com",
    "nativeCurrency": {
      "name": "Sonic",
      "symbol": "S",
      "decimals": 18
    }
  },
  {
    "chainId": 2222,
    "name": "Kava",
    "rpc": "https://kava-evm-rpc.publicnode.com",
    "nativeCurrency": {
      "name": "Kava",
      "symbol": "KAVA",
      "decimals": 18
    }
  },
  {
    "chainId": 81457,
    "name": "Blast",
    "rpc": "https://blast-rpc.publicnode.com",
    "nativeCurrency": {
      "name": "Ether",
      "symbol": "ETH",
      "decimals": 18
    }
  },
  {
    "chainId": 534352,
    "name": "Scroll",
    "rpc": "https://scroll-rpc.publicnode.com",
    "nativeCurrency": {
      "name": "Ether",
      "symbol": "ETH",
      "decimals": 18
    }
  },
  {
    "chainId": 250,
    "name": "Fantom Opera",
    "rpc": "https://fantom-rpc.publicnode.com",
    "nativeCurrency": {
      "name": "Fantom",
      "symbol": "FTM",
      "decimals": 18
    }
  },
  {
    "chainId": 167000,
    "name": "Taiko",
    "rpc": "https://taiko-rpc.publicnode.com",
    "nativeCurrency": {
      "name": "Ether",
      "symbol": "ETH",
      "decimals": 18
    }
  },
  {
    "chainId": 1088,
    "name": "Metis Andromeda Mainnet",
    "rpc": "https://metis-rpc.publicnode.com",
    "nativeCurrency": {
      "name": "Metis",
      "symbol": "METIS",
      "decimals": 18
    }
  },
  {
    "chainId": 88888,
    "name": "Chiliz Chain",
    "rpc": "https://chiliz.publicnode.com",
    "nativeCurrency": {
      "name": "Chiliz",
      "symbol": "CHZ",
      "decimals": 18
    }
  },
  {
    "chainId": 1285,
    "name": "Moonriver",
    "rpc": "https://moonriver-rpc.publicnode.com",
    "nativeCurrency": {
      "name": "Moonriver",
      "symbol": "MOVR",
      "decimals": 18
    }
  },
  {
    "chainId": 1284,
    "name": "Moonbeam",
    "rpc": "https://moonbeam-rpc.publicnode.com",
    "nativeCurrency": {
      "name": "Glimmer",
      "symbol": "GLMR",
      "decimals": 18
    }
  },
  {
    "chainId": 204,
    "name": "opBNB Mainnet",
    "rpc": "https://opbnb-rpc.publicnode.com",
    "nativeCurrency": {
      "name": "BNB Chain Native Token",
      "symbol": "BNB",
      "decimals": 18
    }
  },
  {
    "chainId": 5031,
    "name": "Somnia Mainnet",
    "rpc": "https://somnia-rpc.publicnode.com",
    "nativeCurrency": {
      "name": "SOMI",
      "symbol": "SOMI",
      "decimals": 18
    }
  },
  {
    "chainId": 42170,
    "name": "Arbitrum Nova",
    "rpc": "https://arbitrum-nova-rpc.publicnode.com",
    "nativeCurrency": {
      "name": "Ether",
      "symbol": "ETH",
      "decimals": 18
    }
  },
  {
    "chainId": 1100,
    "name": "Dymension",
    "rpc": "https://dymension-evm-rpc.publicnode.com",
    "nativeCurrency": {
      "name": "DYM",
      "symbol": "DYM",
      "decimals": 18
    }
  },
  {
    "chainId": 57,
    "name": "Syscoin Mainnet",
    "rpc": "https://syscoin-evm.publicnode.com",
    "nativeCurrency": {
      "name": "Syscoin",
      "symbol": "SYS",
      "decimals": 18
    }
  },
  {
    "chainId": 1559,
    "name": "Tenet",
    "rpc": "https://tenet-evm.publicnode.com",
    "nativeCurrency": {
      "name": "TENET",
      "symbol": "TENET",
      "decimals": 18
    }
  },
  {
    "chainId": 5165,
    "name": "Bahamut",
    "rpc": "https://bahamut-rpc.publicnode.com",
    "nativeCurrency": {
      "name": "FTN",
      "symbol": "FTN",
      "decimals": 18
    }
  },
  {
    "chainId": 6688,
    "name": "IRIShub",
    "rpc": "https://iris-evm-rpc.publicnode.com",
    "nativeCurrency": {
      "name": "Eris",
      "symbol": "ERIS",
      "decimals": 18
    }
  },
  {
    "chainId": 9001,
    "name": "Evmos",
    "rpc": "https://evmos-evm-rpc.publicnode.com",
    "nativeCurrency": {
      "name": "Evmos",
      "symbol": "EVMOS",
      "decimals": 18
    }
  },
  {
    "chainId": 11235,
    "name": "Haqq Network",
    "rpc": "https://haqq-evm.publicnode.com",
    "nativeCurrency": {
      "name": "Islamic Coin",
      "symbol": "ISLM",
      "decimals": 18
    }
  },
  {
    "chainId": 11155111,
    "name": "Ethereum Sepolia",
    "rpc": "https://ethereum-sepolia-rpc.publicnode.com",
    "nativeCurrency": {
      "name": "Sepolia Ether",
      "symbol": "ETH",
      "decimals": 18
    }
  },
  {
    "chainId": 97,
    "name": "BNB Smart Chain Testnet",
    "rpc": "https://bsc-testnet-rpc.publicnode.com",
    "nativeCurrency": {
      "name": "BNB Chain Native Token",
      "symbol": "tBNB",
      "decimals": 18
    }
  },
  {
    "chainId": 84531,
    "name": "Base Goerli Testnet",
    "rpc": "https://base-goerli-rpc.publicnode.com",
    "nativeCurrency": {
      "name": "Goerli Ether",
      "symbol": "ETH",
      "decimals": 18
    }
  },
  {
    "chainId": 84532,
    "name": "Base Sepolia Testnet",
    "rpc": "https://base-sepolia-rpc.publicnode.com",
    "nativeCurrency": {
      "name": "Sepolia Ether",
      "symbol": "ETH",
      "decimals": 18
    }
  },
  {
    "chainId": 421613,
    "name": "Arbitrum Goerli",
    "rpc": "https://arbitrum-goerli-rpc.publicnode.com",
    "nativeCurrency": {
      "name": "Arbitrum Goerli Ether",
      "symbol": "AGOR",
      "decimals": 18
    }
  },
  {
    "chainId": 421614,
    "name": "Arbitrum Sepolia",
    "rpc": "https://arbitrum-sepolia-rpc.publicnode.com",
    "nativeCurrency": {
      "name": "Sepolia Ether",
      "symbol": "ETH",
      "decimals": 18
    }
  },
  {
    "chainId": 43113,
    "name": "Avalanche Fuji Testnet",
    "rpc": "https://avalanche-fuji-c-chain-rpc.publicnode.com",
    "nativeCurrency": {
      "name": "Avalanche",
      "symbol": "AVAX",
      "decimals": 18
    }
  },
  {
    "chainId": 943,
    "name": "PulseChain Testnet v4",
    "rpc": "https://pulsechain-testnet-rpc.publicnode.com",
    "nativeCurrency": {
      "name": "Test Pulse",
      "symbol": "tPLS",
      "decimals": 18
    }
  },
  {
    "chainId": 1301,
    "name": "Unichain Sepolia Testnet",
    "rpc": "https://unichain-sepolia-rpc.publicnode.com",
    "nativeCurrency": {
      "name": "Sepolia Ether",
      "symbol": "ETH",
      "decimals": 18
    }
  },
  {
    "chainId": 59141,
    "name": "Linea Sepolia",
    "rpc": "https://linea-sepolia-rpc.publicnode.com",
    "nativeCurrency": {
      "name": "Linea Ether",
      "symbol": "ETH",
      "decimals": 18
    }
  },
  {
    "chainId": 534351,
    "name": "Scroll Sepolia Testnet",
    "rpc": "https://scroll-sepolia-rpc.publicnode.com",
    "nativeCurrency": {
      "name": "Ether",
      "symbol": "ETH",
      "decimals": 18
    }
  },
  {
    "chainId": 5611,
    "name": "opBNB Testnet",
    "rpc": "https://opbnb-testnet-rpc.publicnode.com",
    "nativeCurrency": {
      "name": "BNB Chain Native Token",
      "symbol": "tBNB",
      "decimals": 18
    }
  },
  {
    "chainId": 5,
    "name": "Goerli",
    "rpc": "https://ethereum-goerli-rpc.publicnode.com",
    "nativeCurrency": {
      "name": "Goerli Ether",
      "symbol": "ETH",
      "decimals": 18
    }
  },
  {
    "chainId": 420,
    "name": "Optimism Goerli Testnet",
    "rpc": "https://optimism-goerli-rpc.publicnode.com",
    "nativeCurrency": {
      "name": "Goerli Ether",
      "symbol": "ETH",
      "decimals": 18
    }
  },
  {
    "chainId": 4002,
    "name": "Fantom Testnet",
    "rpc": "https://fantom-testnet-rpc.publicnode.com",
    "nativeCurrency": {
      "name": "Fantom",
      "symbol": "FTM",
      "decimals": 18
    }
  },
  {
    "chainId": 5700,
    "name": "Syscoin Tanenbaum Testnet",
    "rpc": "https://syscoin-tanenbaum-evm.publicnode.com",
    "nativeCurrency": {
      "name": "Testnet Syscoin",
      "symbol": "tSYS",
      "decimals": 18
    }
  },
  {
    "chainId": 9000,
    "name": "Evmos Testnet",
    "rpc": "https://evmos-testnet-evm-rpc.publicnode.com",
    "nativeCurrency": {
      "name": "test-Evmos",
      "symbol": "tEVMOS",
      "decimals": 18
    }
  },
  {
    "chainId": 10200,
    "name": "Gnosis Chiado Testnet",
    "rpc": "https://gnosis-chiado-rpc.publicnode.com",
    "nativeCurrency": {
      "name": "Chiado xDAI",
      "symbol": "XDAI",
      "decimals": 18
    }
  },
  {
    "chainId": 17000,
    "name": "Holesky",
    "rpc": "https://ethereum-holesky-rpc.publicnode.com",
    "nativeCurrency": {
      "name": "Testnet ETH",
      "symbol": "ETH",
      "decimals": 18
    }
  },
  {
    "chainId": 57054,
    "name": "Sonic Blaze Testnet",
    "rpc": "https://sonic-blaze-rpc.publicnode.com",
    "nativeCurrency": {
      "name": "Sonic",
      "symbol": "S",
      "decimals": 18
    }
  },
  {
    "chainId": 59902,
    "name": "Metis Sepolia Testnet",
    "rpc": "https://metis-sepolia-rpc.publicnode.com",
    "nativeCurrency": {
      "name": "tMetis",
      "symbol": "tMETIS",
      "decimals": 18
    }
  },
  {
    "chainId": 80001,
    "name": "Mumbai",
    "rpc": "https://polygon-mumbai-bor-rpc.publicnode.com",
    "nativeCurrency": {
      "name": "MATIC",
      "symbol": "MATIC",
      "decimals": 18
    }
  },
  {
    "chainId": 80002,
    "name": "Amoy",
    "rpc": "https://polygon-bor-amoy-rpc.publicnode.com",
    "nativeCurrency": {
      "name": "POL",
      "symbol": "POL",
      "decimals": 18
    }
  }
]
