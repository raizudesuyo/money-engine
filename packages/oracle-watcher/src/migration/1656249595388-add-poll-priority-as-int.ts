import { MigrationInterface, QueryRunner } from "typeorm";

export class addPollPriorityAsInt1656249595388 implements MigrationInterface {
    name = 'addPollPriorityAsInt1656249595388'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "asset_price_source_poll_job" DROP COLUMN "pollPriority"`);
        await queryRunner.query(`ALTER TABLE "asset_price_source_poll_job" ADD "pollPriority" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "asset_price_source_poll_job" DROP COLUMN "pollPriority"`);
        await queryRunner.query(`ALTER TABLE "asset_price_source_poll_job" ADD "pollPriority" bigint NOT NULL DEFAULT '0'`);
    }

}
