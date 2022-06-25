import { BigNumber } from 'ethers';
export interface DeltaAlertEvent {
  deltaId: string,
  previousPrice: BigNumber,
  newPrice: BigNumber,
  priceDelta: number
}