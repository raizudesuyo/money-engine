import { MigrationInterface, QueryRunner } from "typeorm";

export class addPriceSourceDecimal1656376817655 implements MigrationInterface {
    name = 'addPriceSourceDecimal1656376817655'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "asset_price_source" ADD "decimal" smallint NOT NULL DEFAULT '8'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "asset_price_source" DROP COLUMN "decimal"`);
    }

}
