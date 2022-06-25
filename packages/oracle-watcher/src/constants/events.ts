import { BigNumber } from "ethers";

export const PRICE_UPDATED = 'price.updated';

export interface AssetPriceDataUpdatedEvent {
  priceSourceUuid: string,
  assetUuid: string,
  oldPrice: BigNumber,
  newPrice: BigNumber,
  delta: number
}
