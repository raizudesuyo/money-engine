import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialMigration1645352826961 implements MigrationInterface {
    name = 'InitialMigration1645352826961'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "qi_vault_data" ("id" SERIAL NOT NULL, "vaultId" integer NOT NULL, "collateralRatio" integer NOT NULL, "collateralAmount" character varying NOT NULL, "totalCollateralValue" character varying NOT NULL, "maiDebt" character varying NOT NULL, "predictedCollateralRatio" integer NOT NULL, "predictedCollateralAmount" character varying NOT NULL, "predictedTotalCollateralValue" character varying NOT NULL, "owner" character varying NOT NULL, "otherData" character varying NOT NULL, "updateTime" TIMESTAMP NOT NULL, "predictionUpdateTime" TIMESTAMP NOT NULL, CONSTRAINT "PK_8602992c27bfc0dd4f824e8d184" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3d404e92eb3c2f8be7c380e21b" ON "qi_vault_data" ("collateralRatio") `);
        await queryRunner.query(`CREATE INDEX "IDX_40ec3da01dc96eee226e25d7ab" ON "qi_vault_data" ("maiDebt") `);
        await queryRunner.query(`CREATE INDEX "IDX_42b80e1eacd9f0baea5adb7ac7" ON "qi_vault_data" ("updateTime") `);
        await queryRunner.query(`CREATE INDEX "IDX_7e69b3f544fe5ef19767015d92" ON "qi_vault_data" ("predictionUpdateTime") `);
        await queryRunner.query(`CREATE TABLE "qi_vault" ("id" SERIAL NOT NULL, "vaultName" character varying NOT NULL, "vaultChain" character varying NOT NULL, "tokenAddress" character varying NOT NULL, "tokenSymbol" character varying NOT NULL, "vaultAddress" character varying NOT NULL, "dollarValue" character varying NOT NULL, "priceOracleAddress" character varying NOT NULL, "minimumRatio" integer NOT NULL, "gainRatio" integer NOT NULL, "canPublicLiquidate" boolean NOT NULL, "updateTime" TIMESTAMP NOT NULL, CONSTRAINT "PK_2d33fc7161faed40760e6c579b3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "qi_vault_data" ADD CONSTRAINT "FK_1ca82d09cfe28fa8fa880ae39a5" FOREIGN KEY ("vaultId") REFERENCES "qi_vault"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "qi_vault_data" DROP CONSTRAINT "FK_1ca82d09cfe28fa8fa880ae39a5"`);
        await queryRunner.query(`DROP TABLE "qi_vault"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7e69b3f544fe5ef19767015d92"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_42b80e1eacd9f0baea5adb7ac7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_40ec3da01dc96eee226e25d7ab"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3d404e92eb3c2f8be7c380e21b"`);
        await queryRunner.query(`DROP TABLE "qi_vault_data"`);
    }

}
