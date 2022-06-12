import { BigNumber } from "ethers";

export interface IPriceSourceAdapter {
  latestRoundData: () => Promise<LatestRoundDataResponse>
}

export interface LatestRoundDataResponse {
  roundId: BigNumber;
  answer: BigNumber;
  startedAt: BigNumber;
  updatedAt: BigNumber;
  answeredInRound: BigNumber;
}