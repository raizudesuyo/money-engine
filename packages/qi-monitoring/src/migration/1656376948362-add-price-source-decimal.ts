import { MigrationInterface, QueryRunner } from "typeorm";

export class addPriceSourceDecimal1656376948362 implements MigrationInterface {
    name = 'addPriceSourceDecimal1656376948362'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "qi_vault" ADD "decimal" smallint NOT NULL DEFAULT '8'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "qi_vault" DROP COLUMN "decimal"`);
    }

}
