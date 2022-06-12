import { MigrationInterface, QueryRunner } from "typeorm";

export class initialMigration1655039296904 implements MigrationInterface {
    name = 'initialMigration1655039296904'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "asset_price_data" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "price" character varying NOT NULL, "deleteFlag" boolean NOT NULL DEFAULT false, "assetUuid" uuid, "oracleUuid" uuid, "referencedDeltaAlertsUuid" uuid, "timestampCreatedat" TIMESTAMP NOT NULL DEFAULT now(), "timestampUpdatedat" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4245c13f691f8d0f1d86bdb823a" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e1a30227409ad13e331327eaba" ON "asset_price_data" ("timestampCreatedat") `);
        await queryRunner.query(`CREATE INDEX "IDX_080f0ec01bd6cbde5406766c3f" ON "asset_price_data" ("timestampUpdatedat") `);
        await queryRunner.query(`CREATE TABLE "asset" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "chain" character varying NOT NULL, "address" character varying NOT NULL, "deleteFlag" boolean NOT NULL DEFAULT false, "timestampCreatedat" TIMESTAMP NOT NULL DEFAULT now(), "timestampUpdatedat" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_413c32936ca3aa38cd4f966715c" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d2f051bc6d10f74dd6b882a267" ON "asset" ("timestampCreatedat") `);
        await queryRunner.query(`CREATE INDEX "IDX_446c32985a7bb70850734d146d" ON "asset" ("timestampUpdatedat") `);
        await queryRunner.query(`CREATE TABLE "asset_price_source_poll_job" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "deleteFlag" boolean NOT NULL DEFAULT false, "timestampCreatedat" TIMESTAMP NOT NULL DEFAULT now(), "timestampUpdatedat" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c5acafaf0f67dd7f06749187eb1" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f0b299611bbb9ca466eaced996" ON "asset_price_source_poll_job" ("timestampCreatedat") `);
        await queryRunner.query(`CREATE INDEX "IDX_f274b49003ffcb784136244491" ON "asset_price_source_poll_job" ("timestampUpdatedat") `);
        await queryRunner.query(`CREATE TABLE "asset_price_source" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "oracleType" character varying NOT NULL, "oracleAddress" character varying NOT NULL, "deleteFlag" boolean NOT NULL DEFAULT false, "assetUuid" uuid, "timestampCreatedat" TIMESTAMP NOT NULL DEFAULT now(), "timestampUpdatedat" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0f95d2679a2f0b077e25dab00ce" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a738470d3c1db86d126c678300" ON "asset_price_source" ("timestampCreatedat") `);
        await queryRunner.query(`CREATE INDEX "IDX_f88edab6e5201bc9513ea04280" ON "asset_price_source" ("timestampUpdatedat") `);
        await queryRunner.query(`CREATE TABLE "asset_delta_alert" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "delta" numeric NOT NULL, "deleteFlag" boolean NOT NULL DEFAULT false, "assetUuid" uuid, "referencePriceUuid" uuid, "priceSourceUuid" uuid, "timestampCreatedat" TIMESTAMP NOT NULL DEFAULT now(), "timestampUpdatedat" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bec6bb51090051530919276f554" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9b22a8d57dfe98927b21c3887b" ON "asset_delta_alert" ("timestampCreatedat") `);
        await queryRunner.query(`CREATE INDEX "IDX_51eb7bc55366af1c59a0e024c7" ON "asset_delta_alert" ("timestampUpdatedat") `);
        await queryRunner.query(`ALTER TABLE "asset_price_data" ADD CONSTRAINT "FK_f40efd1b93a02a457ca82218d45" FOREIGN KEY ("assetUuid") REFERENCES "asset"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "asset_price_data" ADD CONSTRAINT "FK_ccebc740a9ad72b90fa78c3bd50" FOREIGN KEY ("oracleUuid") REFERENCES "asset_price_source"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "asset_price_data" ADD CONSTRAINT "FK_8b30cb0bc398eee66370f55d6ec" FOREIGN KEY ("referencedDeltaAlertsUuid") REFERENCES "asset_delta_alert"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "asset_price_source" ADD CONSTRAINT "FK_336f0e8998aecd7948cc12c542e" FOREIGN KEY ("assetUuid") REFERENCES "asset"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "asset_delta_alert" ADD CONSTRAINT "FK_b515598c3b41d5cfed27a746fb0" FOREIGN KEY ("assetUuid") REFERENCES "asset"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "asset_delta_alert" ADD CONSTRAINT "FK_11184826bc61291422ec55cc989" FOREIGN KEY ("referencePriceUuid") REFERENCES "asset_price_data"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "asset_delta_alert" ADD CONSTRAINT "FK_83cd7de2c9b95ee306642fe45ae" FOREIGN KEY ("priceSourceUuid") REFERENCES "asset_price_source"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "asset_delta_alert" DROP CONSTRAINT "FK_83cd7de2c9b95ee306642fe45ae"`);
        await queryRunner.query(`ALTER TABLE "asset_delta_alert" DROP CONSTRAINT "FK_11184826bc61291422ec55cc989"`);
        await queryRunner.query(`ALTER TABLE "asset_delta_alert" DROP CONSTRAINT "FK_b515598c3b41d5cfed27a746fb0"`);
        await queryRunner.query(`ALTER TABLE "asset_price_source" DROP CONSTRAINT "FK_336f0e8998aecd7948cc12c542e"`);
        await queryRunner.query(`ALTER TABLE "asset_price_data" DROP CONSTRAINT "FK_8b30cb0bc398eee66370f55d6ec"`);
        await queryRunner.query(`ALTER TABLE "asset_price_data" DROP CONSTRAINT "FK_ccebc740a9ad72b90fa78c3bd50"`);
        await queryRunner.query(`ALTER TABLE "asset_price_data" DROP CONSTRAINT "FK_f40efd1b93a02a457ca82218d45"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_51eb7bc55366af1c59a0e024c7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9b22a8d57dfe98927b21c3887b"`);
        await queryRunner.query(`DROP TABLE "asset_delta_alert"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f88edab6e5201bc9513ea04280"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a738470d3c1db86d126c678300"`);
        await queryRunner.query(`DROP TABLE "asset_price_source"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f274b49003ffcb784136244491"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f0b299611bbb9ca466eaced996"`);
        await queryRunner.query(`DROP TABLE "asset_price_source_poll_job"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_446c32985a7bb70850734d146d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d2f051bc6d10f74dd6b882a267"`);
        await queryRunner.query(`DROP TABLE "asset"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_080f0ec01bd6cbde5406766c3f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e1a30227409ad13e331327eaba"`);
        await queryRunner.query(`DROP TABLE "asset_price_data"`);
    }

}
