import { OracleType } from "@money-engine/common";

export interface RegisterPricesourceRequest {
  oracleType: OracleType;
  oracleAddress: string;
  assetId: string;
}
