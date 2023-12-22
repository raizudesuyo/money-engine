export interface DeltaAlertEvent {
  deltaId: string,
  previousPrice: BigInt,
  newPrice: BigInt,
  priceDelta: number
}