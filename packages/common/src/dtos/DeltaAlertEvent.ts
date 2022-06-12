export interface DeltaAlertEvent {
  deltaId: string,
  previousPrice: string,
  newPrice: string,
  priceDelta: number
}