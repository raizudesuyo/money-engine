import { MigrationInterface, QueryRunner } from "typeorm";

export class addedOracleType1656161165718 implements MigrationInterface {
    name = 'addedOracleType1656161165718'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "qi_vault" ADD "oracleType" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "qi_vault" DROP COLUMN "oracleType"`);
    }

}
