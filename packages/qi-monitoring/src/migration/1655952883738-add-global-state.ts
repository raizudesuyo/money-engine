import { MigrationInterface, QueryRunner } from "typeorm";

export class addGlobalState1655952883738 implements MigrationInterface {
    name = 'addGlobalState1655952883738'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "global_state" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "configName" character varying NOT NULL, "value" character varying NOT NULL, CONSTRAINT "PK_07d32c3afe31caa13b87ff26088" PRIMARY KEY ("uuid"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "global_state"`);
    }

}
