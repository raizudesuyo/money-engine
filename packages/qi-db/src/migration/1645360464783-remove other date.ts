import {MigrationInterface, QueryRunner} from "typeorm";

export class removeOtherDate1645360464783 implements MigrationInterface {
    name = 'removeOtherDate1645360464783'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "qi_vault_data" DROP COLUMN "otherData"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "qi_vault_data" ADD "otherData" character varying NOT NULL`);
    }

}
