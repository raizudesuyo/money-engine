import { Column } from "typeorm";

export class AssetOracleWatcherIntegration {
  @Column({ nullable: true })
  assetUuid?: string

  @Column({ nullable: true })
  priceSourceUuid?: string
}