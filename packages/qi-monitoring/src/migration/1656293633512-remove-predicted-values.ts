import { MigrationInterface, QueryRunner } from "typeorm";

export class removePredictedValues1656293633512 implements MigrationInterface {
    name = 'removePredictedValues1656293633512'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "qi_vault_data" DROP COLUMN "predictedCollateralRatio"`);
        await queryRunner.query(`ALTER TABLE "qi_vault_data" DROP COLUMN "predictedCollateralAmount"`);
        await queryRunner.query(`ALTER TABLE "qi_vault_data" DROP COLUMN "predictedTotalCollateralValue"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "qi_vault_data" ADD "predictedTotalCollateralValue" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "qi_vault_data" ADD "predictedCollateralAmount" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "qi_vault_data" ADD "predictedCollateralRatio" numeric NOT NULL`);
    }

}
