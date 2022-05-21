export const config = {
  web3ProviderUrls: {
    MATIC_RPC: "wss://matic-mainnet-full-ws.bwarelabs.com",
    FANTOM_RPC: "wss://wsapi.fantom.network/"
  },
  jsonRpcProviderUrls: {
    MATIC_RPC: "https://polygon-rpc.com/",
    FANTOM_RPC: "https://rpc.ftm.tools/",
    AVALANCHE_RPC: "https://avalanche.public-rpc.com/"
  },
  explorers : {
    polygon: {
      url: "https://api.polygonscan.com/api",
      apikey: ""
    },
    fantom: {
      url: "https://api.ftmscan.com/api",
      apikey: ""
    },
    avalanche: {
      url: "https://api.snowtrace.io/api",
      apikey: ""
    }
  }
}