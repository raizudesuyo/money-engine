import { OracleType, PollPriority } from "@money-engine/common";

export interface RegisterPricesourceRequest {
  oracleType: OracleType;
  oracleAddress: string;
  assetId: string;
  pollPriority: PollPriority,
  decimal: number
}
