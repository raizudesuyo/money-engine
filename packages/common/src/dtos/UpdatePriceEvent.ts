export interface UpdatePriceEvent {
  crypto: {
    symbol: string,
    address?: string,
    chain: string
  }
  priceSourceData: {
    priceSourceType: 'API' | 'ChainLink' | 'OTHER'
    price: string // BigNumber
    decimals: number
  } 
  _meta: any
}