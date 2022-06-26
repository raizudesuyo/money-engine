import { MigrationInterface, QueryRunner } from "typeorm";

export class addIsEmptyToVaultData1656223901399 implements MigrationInterface {
    name = 'addIsEmptyToVaultData1656223901399'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "qi_vault_data" ADD "isEmpty" boolean NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "qi_vault_data" DROP COLUMN "isEmpty"`);
    }

}
