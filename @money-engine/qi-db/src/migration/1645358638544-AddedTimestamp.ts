import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedTimestamp1645358638544 implements MigrationInterface {
    name = 'AddedTimestamp1645358638544'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_42b80e1eacd9f0baea5adb7ac7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7e69b3f544fe5ef19767015d92"`);
        await queryRunner.query(`ALTER TABLE "qi_vault_data" DROP COLUMN "updateTime"`);
        await queryRunner.query(`ALTER TABLE "qi_vault_data" DROP COLUMN "predictionUpdateTime"`);
        await queryRunner.query(`ALTER TABLE "qi_vault" DROP COLUMN "updateTime"`);
        await queryRunner.query(`ALTER TABLE "qi_vault_data" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "qi_vault_data" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "qi_vault" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "qi_vault" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`CREATE INDEX "IDX_2a9822b2bdacead6b049d21a53" ON "qi_vault_data" ("createdAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_8f51e487b027cdf5345911bf02" ON "qi_vault_data" ("updatedAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_bdbac4b3d04b41bd937b014feb" ON "qi_vault" ("createdAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_b60d95bfd5c134318668723d9c" ON "qi_vault" ("updatedAt") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_b60d95bfd5c134318668723d9c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bdbac4b3d04b41bd937b014feb"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8f51e487b027cdf5345911bf02"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2a9822b2bdacead6b049d21a53"`);
        await queryRunner.query(`ALTER TABLE "qi_vault" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "qi_vault" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "qi_vault_data" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "qi_vault_data" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "qi_vault" ADD "updateTime" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "qi_vault_data" ADD "predictionUpdateTime" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "qi_vault_data" ADD "updateTime" TIMESTAMP NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_7e69b3f544fe5ef19767015d92" ON "qi_vault_data" ("predictionUpdateTime") `);
        await queryRunner.query(`CREATE INDEX "IDX_42b80e1eacd9f0baea5adb7ac7" ON "qi_vault_data" ("updateTime") `);
    }

}
