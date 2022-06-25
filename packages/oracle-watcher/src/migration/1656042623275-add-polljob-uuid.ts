import { MigrationInterface, QueryRunner } from "typeorm";

export class addPolljobUuid1656042623275 implements MigrationInterface {
    name = 'addPolljobUuid1656042623275'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "asset_price_source" ADD "pollJobUuid" uuid`);
        await queryRunner.query(`ALTER TABLE "asset_price_source" ADD CONSTRAINT "UQ_03410e34c42923ff6a44c6486ea" UNIQUE ("pollJobUuid")`);
        await queryRunner.query(`ALTER TABLE "asset_price_source" ADD CONSTRAINT "FK_03410e34c42923ff6a44c6486ea" FOREIGN KEY ("pollJobUuid") REFERENCES "asset_price_source_poll_job"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "asset_price_source" DROP CONSTRAINT "FK_03410e34c42923ff6a44c6486ea"`);
        await queryRunner.query(`ALTER TABLE "asset_price_source" DROP CONSTRAINT "UQ_03410e34c42923ff6a44c6486ea"`);
        await queryRunner.query(`ALTER TABLE "asset_price_source" DROP COLUMN "pollJobUuid"`);
    }

}
