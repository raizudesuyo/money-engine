import { BigNumber } from "ethers";

export interface IPriceSourceAdapter {
  latestRoundData: () => Promise<LatestRoundDataResponse>
}

export type IPriceSourceOrdinaryLatestRoundDataResponse = {
  roundId: BigNumber;
  answer: BigNumber;
  startedAt: BigNumber;
  updatedAt: BigNumber;
  answeredInRound: BigNumber;
}

export type IPriceSourceCurveLatestRoundDataResponse = {
} & BigNumber

export type LatestRoundDataResponse = IPriceSourceOrdinaryLatestRoundDataResponse | IPriceSourceCurveLatestRoundDataResponse