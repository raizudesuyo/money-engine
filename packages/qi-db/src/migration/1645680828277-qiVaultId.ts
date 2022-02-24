import {MigrationInterface, QueryRunner} from "typeorm";

export class qiVaultId1645680828277 implements MigrationInterface {
    name = 'qiVaultId1645680828277'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "qi_vault_data" DROP CONSTRAINT "FK_1ca82d09cfe28fa8fa880ae39a5"`);
        await queryRunner.query(`ALTER TABLE "qi_vault_data" ADD "qiVaultId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "qi_vault_data" ADD CONSTRAINT "FK_e7e7f98852aa104f48ceb49df8b" FOREIGN KEY ("qiVaultId") REFERENCES "qi_vault"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "qi_vault_data" DROP CONSTRAINT "FK_e7e7f98852aa104f48ceb49df8b"`);
        await queryRunner.query(`ALTER TABLE "qi_vault_data" DROP COLUMN "qiVaultId"`);
        await queryRunner.query(`ALTER TABLE "qi_vault_data" ADD CONSTRAINT "FK_1ca82d09cfe28fa8fa880ae39a5" FOREIGN KEY ("vaultId") REFERENCES "qi_vault"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
