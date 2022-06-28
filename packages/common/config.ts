export const config = {
  web3ProviderUrls: {
    MATIC_RPC: "wss://matic-mainnet-full-ws.bwarelabs.com",
    FANTOM_RPC: "wss://wsapi.fantom.network/"
  },
  jsonRpcProviderUrls: {
    MATIC_RPC: "https://polygon-rpc.com/",
    FANTOM_RPC: "https://rpc.ankr.com/fantom",
    AVALANCHE_RPC: "https://rpc.ankr.com/avalanche"
  },
  explorers : {
    polygon: {
      url: "https://api.polygonscan.com/api",
      apikey: "VURQ96RUYDCGFFFHGNZQQ7IRG53GSD13ZU"
    },
    fantom: {
      url: "https://api.ftmscan.com/api",
      apikey: "96XKC13HTPU7SBFPNU99Q2TJPFSHJAYVCY"
    },
    avalanche: {
      url: "https://api.snowtrace.io/api",
      apikey: "96XKC13HTPU7SBFPNU99Q2TJPFSHJAYVCY"
    }
  }
}