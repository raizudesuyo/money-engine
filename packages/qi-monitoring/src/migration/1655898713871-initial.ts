import { MigrationInterface, QueryRunner } from "typeorm";

export class initial1655898713871 implements MigrationInterface {
    name = 'initial1655898713871'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "qi_vault_data" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "vaultNumber" integer NOT NULL, "collateralRatio" numeric NOT NULL, "collateralAmount" character varying NOT NULL, "totalCollateralValue" character varying NOT NULL, "maiDebt" character varying NOT NULL, "predictedCollateralRatio" numeric NOT NULL, "predictedCollateralAmount" character varying NOT NULL, "predictedTotalCollateralValue" character varying NOT NULL, "owner" character varying NOT NULL, "vaultUuid" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5206190dcc8a73927636c0dd55c" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3d404e92eb3c2f8be7c380e21b" ON "qi_vault_data" ("collateralRatio") `);
        await queryRunner.query(`CREATE INDEX "IDX_40ec3da01dc96eee226e25d7ab" ON "qi_vault_data" ("maiDebt") `);
        await queryRunner.query(`CREATE INDEX "IDX_2a9822b2bdacead6b049d21a53" ON "qi_vault_data" ("createdAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_8f51e487b027cdf5345911bf02" ON "qi_vault_data" ("updatedAt") `);
        await queryRunner.query(`CREATE TABLE "qi_vault" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "vaultName" character varying NOT NULL, "vaultChain" character varying NOT NULL, "tokenAddress" character varying NOT NULL, "tokenSymbol" character varying NOT NULL, "vaultAddress" character varying NOT NULL, "dollarValue" character varying NOT NULL, "priceOracleAddress" character varying NOT NULL, "minimumRatio" integer NOT NULL, "gainRatio" integer NOT NULL, "canPublicLiquidate" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bb1272aad12694842a3e9ff3e10" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE INDEX "IDX_bdbac4b3d04b41bd937b014feb" ON "qi_vault" ("createdAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_b60d95bfd5c134318668723d9c" ON "qi_vault" ("updatedAt") `);
        await queryRunner.query(`ALTER TABLE "qi_vault_data" ADD CONSTRAINT "FK_9dfc1ea70c5572d203200b6f21f" FOREIGN KEY ("vaultUuid") REFERENCES "qi_vault"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "qi_vault_data" DROP CONSTRAINT "FK_9dfc1ea70c5572d203200b6f21f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b60d95bfd5c134318668723d9c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bdbac4b3d04b41bd937b014feb"`);
        await queryRunner.query(`DROP TABLE "qi_vault"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8f51e487b027cdf5345911bf02"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2a9822b2bdacead6b049d21a53"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_40ec3da01dc96eee226e25d7ab"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3d404e92eb3c2f8be7c380e21b"`);
        await queryRunner.query(`DROP TABLE "qi_vault_data"`);
    }

}
