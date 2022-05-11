import { MigrationInterface, QueryRunner } from "typeorm";

export class updateDataTypes1652244953580 implements MigrationInterface {
    name = 'updateDataTypes1652244953580'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_3d404e92eb3c2f8be7c380e21b"`);
        await queryRunner.query(`ALTER TABLE "qi_vault_data" DROP COLUMN "collateralRatio"`);
        await queryRunner.query(`ALTER TABLE "qi_vault_data" ADD "collateralRatio" numeric NOT NULL`);
        await queryRunner.query(`ALTER TABLE "qi_vault_data" DROP COLUMN "predictedCollateralRatio"`);
        await queryRunner.query(`ALTER TABLE "qi_vault_data" ADD "predictedCollateralRatio" numeric NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_3d404e92eb3c2f8be7c380e21b" ON "qi_vault_data" ("collateralRatio") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_3d404e92eb3c2f8be7c380e21b"`);
        await queryRunner.query(`ALTER TABLE "qi_vault_data" DROP COLUMN "predictedCollateralRatio"`);
        await queryRunner.query(`ALTER TABLE "qi_vault_data" ADD "predictedCollateralRatio" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "qi_vault_data" DROP COLUMN "collateralRatio"`);
        await queryRunner.query(`ALTER TABLE "qi_vault_data" ADD "collateralRatio" integer NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_3d404e92eb3c2f8be7c380e21b" ON "qi_vault_data" ("collateralRatio") `);
    }

}
