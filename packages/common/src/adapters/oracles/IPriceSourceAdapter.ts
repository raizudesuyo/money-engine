export interface IPriceSourceAdapter {
  latestRoundData: () => Promise<LatestRoundDataResponse>
}

export type IPriceSourceOrdinaryLatestRoundDataResponse = {
  roundId: bigint;
  answer: bigint;
  startedAt: bigint;
  updatedAt: bigint;
  answeredInRound: bigint;
}

export type IPriceSourceCurveLatestRoundDataResponse = bigint

export type LatestRoundDataResponse = IPriceSourceOrdinaryLatestRoundDataResponse | IPriceSourceCurveLatestRoundDataResponse