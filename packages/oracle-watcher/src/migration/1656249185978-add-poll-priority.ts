import { MigrationInterface, QueryRunner } from "typeorm";

export class addPollPriority1656249185978 implements MigrationInterface {
    name = 'addPollPriority1656249185978'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "asset_price_source_poll_job" ADD "pollPriority" bigint NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "asset_price_source_poll_job" DROP COLUMN "pollPriority"`);
    }

}
