import { MigrationInterface, QueryRunner } from "typeorm";

export class addedOracleWatcherIntegrations1656035038366 implements MigrationInterface {
    name = 'addedOracleWatcherIntegrations1656035038366'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "qi_vault" ADD "oracleWatcherIntegrationAssetuuid" character varying`);
        await queryRunner.query(`ALTER TABLE "qi_vault" ADD "oracleWatcherIntegrationPricesourceuuid" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "qi_vault" DROP COLUMN "oracleWatcherIntegrationPricesourceuuid"`);
        await queryRunner.query(`ALTER TABLE "qi_vault" DROP COLUMN "oracleWatcherIntegrationAssetuuid"`);
    }

}
