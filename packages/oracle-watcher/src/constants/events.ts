export const PRICE_UPDATED = 'price.updated';

export interface AssetPriceDataUpdatedEvent {
  priceSourceUuid: string,
  assetUuid: string,
  oldPrice: bigint,
  newPrice: bigint,
  delta: number
}
