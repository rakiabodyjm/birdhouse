import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialMigration1639189403215 implements MigrationInterface {
    name = 'InitialMigration1639189403215'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "asset" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_1209d107fe21482beaea51b745e" DEFAULT NEWSEQUENTIALID(), "code" nvarchar(255) NOT NULL, "name" nvarchar(255) NOT NULL, "description" nvarchar(255) NOT NULL, "unit_price" decimal(18,4) NOT NULL, "srp_for_subd" decimal(18,4) NOT NULL, "srp_for_dsp" decimal(18,4) NOT NULL, "srp_for_retailer" decimal(18,4) NOT NULL, "srp_for_user" decimal(18,4) NOT NULL, "active" bit NOT NULL, "updated_at" datetime NOT NULL CONSTRAINT "DF_6076155aa58909ea60e1992c4cc" DEFAULT getdate(), "deleted_at" datetime, CONSTRAINT "PK_1209d107fe21482beaea51b745e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_498c977232a1763c6f329b387f" ON "asset" ("id", "code", "description", "active") `);
        await queryRunner.query(`CREATE TABLE "inventory" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_82aa5da437c5bbfb80703b08309" DEFAULT NEWSEQUENTIALID(), "quantity" int NOT NULL, "active" bit NOT NULL, "asset_id" uniqueidentifier, "ceasar_id" uniqueidentifier, CONSTRAINT "PK_82aa5da437c5bbfb80703b08309" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "transaction" ("id" int NOT NULL IDENTITY(1,1), "quantity" decimal(18,4) NOT NULL, "unit_price" decimal(18,4) NOT NULL, "srp" decimal(18,4) NOT NULL, "cost_price" decimal(18,4) NOT NULL, "sales_price" decimal(18,4) NOT NULL, "profit" decimal(18,4) NOT NULL, "buyer_ceasar_id" uniqueidentifier, "seller_ceasar_id" uniqueidentifier, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_cace4a159ff9f2512dd42373760" DEFAULT NEWSEQUENTIALID(), "first_name" nvarchar(255) NOT NULL, "last_name" nvarchar(255) NOT NULL, "phone_number" nvarchar(255) NOT NULL, "address1" nvarchar(255) NOT NULL, "address2" nvarchar(255), "active" bit NOT NULL CONSTRAINT "DF_843f46779f60b45032874be95b3" DEFAULT 1, "email" nvarchar(255) NOT NULL, "username" nvarchar(255) NOT NULL, "password" nvarchar(255) NOT NULL, "created_at" datetime NOT NULL CONSTRAINT "DF_d091f1d36f18bbece2a9eabc6e0" DEFAULT '2021-12-10 18:23:25', "updated_at" datetime NOT NULL CONSTRAINT "DF_9cdce43fa0043c794281aa09051" DEFAULT '2021-12-10 18:23:25', CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7d25261324aaf603cea3d1d3f8" ON "user" ("first_name", "last_name", "phone_number", "email", "username") `);
        await queryRunner.query(`CREATE TABLE "retailer" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_47bbf48e11e51cc7366f88a8add" DEFAULT NEWSEQUENTIALID(), "e_bind_number" nvarchar(255) NOT NULL, "store_name" nvarchar(255) NOT NULL CONSTRAINT "DF_48a78e4ff2d3d59763409cd6dab" DEFAULT '', "id_type" nvarchar(255) NOT NULL, "id_number" nvarchar(255) NOT NULL, "subdistributor_id" uniqueidentifier, "dsp_id" uniqueidentifier, "user_id" uniqueidentifier NOT NULL, CONSTRAINT "PK_47bbf48e11e51cc7366f88a8add" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_fc25a50cdf18be5371f18ffe37" ON "retailer" ("id", "store_name", "e_bind_number", "id_number") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "REL_26e02d6d4615e9e4be004ef12f" ON "retailer" ("user_id") WHERE "user_id" IS NOT NULL`);
        await queryRunner.query(`CREATE TABLE "subdistributor" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_d0e5180c4dcea8ed4ef3c7fcae2" DEFAULT NEWSEQUENTIALID(), "name" nvarchar(255) NOT NULL, "e_bind_number" nvarchar(255) NOT NULL, "id_number" nvarchar(255) NOT NULL, "id_type" nvarchar(255) NOT NULL, "zip_code" nvarchar(255) NOT NULL, "user_id" uniqueidentifier NOT NULL, "area_id" nvarchar(255) NOT NULL, CONSTRAINT "PK_d0e5180c4dcea8ed4ef3c7fcae2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "REL_ea93cea1a3f933392299cdf3ae" ON "subdistributor" ("user_id") WHERE "user_id" IS NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "REL_94b5b23493c52cb38f1093648a" ON "subdistributor" ("area_id") WHERE "area_id" IS NOT NULL`);
        await queryRunner.query(`CREATE TABLE "map_id" ("area_id" nvarchar(255) NOT NULL, "area_name" nvarchar(255) NOT NULL, "parent_name" nvarchar(255) NOT NULL, "parent_parent_name" nvarchar(255) NOT NULL, "area_parent_pp_name" nvarchar(255) NOT NULL, CONSTRAINT "PK_3cd0869a4d34060bfd3b29776bd" PRIMARY KEY ("area_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8b3c155ba2d36a2ab9c8e88d1a" ON "map_id" ("area_name", "area_id", "area_parent_pp_name", "parent_name", "parent_parent_name") `);
        await queryRunner.query(`CREATE TABLE "dsp" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_877a3e097f31913b03fff2eb591" DEFAULT NEWSEQUENTIALID(), "dsp_code" nvarchar(255) NOT NULL, "e_bind_number" nvarchar(255) NOT NULL, "user_id" uniqueidentifier NOT NULL, "subdistributor_id" uniqueidentifier NOT NULL, CONSTRAINT "PK_877a3e097f31913b03fff2eb591" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a09deccc29fc4c61ea43028347" ON "dsp" ("dsp_code", "e_bind_number") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "REL_f6e08f2ebbc19b21c80d7bc3fa" ON "dsp" ("user_id") WHERE "user_id" IS NOT NULL`);
        await queryRunner.query(`CREATE TABLE "ceasar" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_ff69c892e8a0b0ae7e76effdaa4" DEFAULT NEWSEQUENTIALID(), "account_type" nvarchar(255) NOT NULL, "account_id" nvarchar(255) NOT NULL, "ceasar_id" nvarchar(255) NOT NULL, "created_at" datetime NOT NULL CONSTRAINT "DF_78a503a8f546b370f5a9b3ed1a6" DEFAULT getdate(), "updated_at" datetime NOT NULL CONSTRAINT "DF_cdd88b840b92e3ce05eb939fe5c" DEFAULT getdate(), CONSTRAINT "PK_ff69c892e8a0b0ae7e76effdaa4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a823971231d7715029c77a014c" ON "ceasar" ("id", "account_id", "ceasar_id") `);
        await queryRunner.query(`CREATE TABLE "admin" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_e032310bcef831fb83101899b10" DEFAULT NEWSEQUENTIALID(), "name" nvarchar(255) NOT NULL, "user_id" uniqueidentifier NOT NULL, CONSTRAINT "PK_e032310bcef831fb83101899b10" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "REL_a28028ba709cd7e5053a86857b" ON "admin" ("user_id") WHERE "user_id" IS NOT NULL`);
        await queryRunner.query(`CREATE TABLE "external_ceasar" ("wallet_id" int NOT NULL IDENTITY(1,1), "last_name" nvarchar(255) NOT NULL, "first_name" nvarchar(255) NOT NULL, "cp_number" nvarchar(255) NOT NULL, "email" nvarchar(255) NOT NULL, "role" nvarchar(255) NOT NULL, "ceasar_coin" decimal(18,2) NOT NULL, "dollar" decimal(18,2), "peso" decimal(18,2), CONSTRAINT "PK_1c11d88a2ccd572caf66061fe1b" PRIMARY KEY ("wallet_id"))`);
        await queryRunner.query(`CREATE TABLE "inventory_log" ("id" int NOT NULL IDENTITY(1,1), "method" int NOT NULL, "data" nvarchar(255) NOT NULL, "remarks" nvarchar(255) NOT NULL, "craeted_at" datetime2 NOT NULL CONSTRAINT "DF_492ced8e220308ae805fc5b9db6" DEFAULT getdate(), CONSTRAINT "PK_92195bfa4eaa5c9e798021900f7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "dsp_area_id" ("dsp_id" uniqueidentifier NOT NULL, "area_id" nvarchar(255) NOT NULL, CONSTRAINT "PK_66325e1b4738f6814a6c073b974" PRIMARY KEY ("dsp_id", "area_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5d85ef05825f7d0008d3a9093f" ON "dsp_area_id" ("dsp_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_5149d20734dc255966ee6c64a3" ON "dsp_area_id" ("area_id") `);
        await queryRunner.query(`ALTER TABLE "inventory" ADD CONSTRAINT "FK_fc248c50aa7d6ea2859143f9c90" FOREIGN KEY ("asset_id") REFERENCES "asset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventory" ADD CONSTRAINT "FK_3b9188cb5ec2f114d752b67269a" FOREIGN KEY ("ceasar_id") REFERENCES "ceasar"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_ea5b113e3478103ff5637acf48e" FOREIGN KEY ("buyer_ceasar_id") REFERENCES "ceasar"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_827ce2f883730c6d9b9048ca98b" FOREIGN KEY ("seller_ceasar_id") REFERENCES "ceasar"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "retailer" ADD CONSTRAINT "FK_e915ae65cbd47b33e12bcf03c0a" FOREIGN KEY ("subdistributor_id") REFERENCES "subdistributor"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "retailer" ADD CONSTRAINT "FK_90dc051090e7fc2e4134378ecbf" FOREIGN KEY ("dsp_id") REFERENCES "dsp"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "retailer" ADD CONSTRAINT "FK_26e02d6d4615e9e4be004ef12f6" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subdistributor" ADD CONSTRAINT "FK_ea93cea1a3f933392299cdf3ae7" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subdistributor" ADD CONSTRAINT "FK_94b5b23493c52cb38f1093648a5" FOREIGN KEY ("area_id") REFERENCES "map_id"("area_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dsp" ADD CONSTRAINT "FK_f6e08f2ebbc19b21c80d7bc3fa5" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dsp" ADD CONSTRAINT "FK_0ea706e35705a8ab8932ed741c9" FOREIGN KEY ("subdistributor_id") REFERENCES "subdistributor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "admin" ADD CONSTRAINT "FK_a28028ba709cd7e5053a86857b4" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dsp_area_id" ADD CONSTRAINT "FK_5d85ef05825f7d0008d3a9093f2" FOREIGN KEY ("dsp_id") REFERENCES "dsp"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "dsp_area_id" ADD CONSTRAINT "FK_5149d20734dc255966ee6c64a36" FOREIGN KEY ("area_id") REFERENCES "map_id"("area_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dsp_area_id" DROP CONSTRAINT "FK_5149d20734dc255966ee6c64a36"`);
        await queryRunner.query(`ALTER TABLE "dsp_area_id" DROP CONSTRAINT "FK_5d85ef05825f7d0008d3a9093f2"`);
        await queryRunner.query(`ALTER TABLE "admin" DROP CONSTRAINT "FK_a28028ba709cd7e5053a86857b4"`);
        await queryRunner.query(`ALTER TABLE "dsp" DROP CONSTRAINT "FK_0ea706e35705a8ab8932ed741c9"`);
        await queryRunner.query(`ALTER TABLE "dsp" DROP CONSTRAINT "FK_f6e08f2ebbc19b21c80d7bc3fa5"`);
        await queryRunner.query(`ALTER TABLE "subdistributor" DROP CONSTRAINT "FK_94b5b23493c52cb38f1093648a5"`);
        await queryRunner.query(`ALTER TABLE "subdistributor" DROP CONSTRAINT "FK_ea93cea1a3f933392299cdf3ae7"`);
        await queryRunner.query(`ALTER TABLE "retailer" DROP CONSTRAINT "FK_26e02d6d4615e9e4be004ef12f6"`);
        await queryRunner.query(`ALTER TABLE "retailer" DROP CONSTRAINT "FK_90dc051090e7fc2e4134378ecbf"`);
        await queryRunner.query(`ALTER TABLE "retailer" DROP CONSTRAINT "FK_e915ae65cbd47b33e12bcf03c0a"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_827ce2f883730c6d9b9048ca98b"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_ea5b113e3478103ff5637acf48e"`);
        await queryRunner.query(`ALTER TABLE "inventory" DROP CONSTRAINT "FK_3b9188cb5ec2f114d752b67269a"`);
        await queryRunner.query(`ALTER TABLE "inventory" DROP CONSTRAINT "FK_fc248c50aa7d6ea2859143f9c90"`);
        await queryRunner.query(`DROP INDEX "IDX_5149d20734dc255966ee6c64a3" ON "dsp_area_id"`);
        await queryRunner.query(`DROP INDEX "IDX_5d85ef05825f7d0008d3a9093f" ON "dsp_area_id"`);
        await queryRunner.query(`DROP TABLE "dsp_area_id"`);
        await queryRunner.query(`DROP TABLE "inventory_log"`);
        await queryRunner.query(`DROP TABLE "external_ceasar"`);
        await queryRunner.query(`DROP INDEX "REL_a28028ba709cd7e5053a86857b" ON "admin"`);
        await queryRunner.query(`DROP TABLE "admin"`);
        await queryRunner.query(`DROP INDEX "IDX_a823971231d7715029c77a014c" ON "ceasar"`);
        await queryRunner.query(`DROP TABLE "ceasar"`);
        await queryRunner.query(`DROP INDEX "REL_f6e08f2ebbc19b21c80d7bc3fa" ON "dsp"`);
        await queryRunner.query(`DROP INDEX "IDX_a09deccc29fc4c61ea43028347" ON "dsp"`);
        await queryRunner.query(`DROP TABLE "dsp"`);
        await queryRunner.query(`DROP INDEX "IDX_8b3c155ba2d36a2ab9c8e88d1a" ON "map_id"`);
        await queryRunner.query(`DROP TABLE "map_id"`);
        await queryRunner.query(`DROP INDEX "REL_94b5b23493c52cb38f1093648a" ON "subdistributor"`);
        await queryRunner.query(`DROP INDEX "REL_ea93cea1a3f933392299cdf3ae" ON "subdistributor"`);
        await queryRunner.query(`DROP TABLE "subdistributor"`);
        await queryRunner.query(`DROP INDEX "REL_26e02d6d4615e9e4be004ef12f" ON "retailer"`);
        await queryRunner.query(`DROP INDEX "IDX_fc25a50cdf18be5371f18ffe37" ON "retailer"`);
        await queryRunner.query(`DROP TABLE "retailer"`);
        await queryRunner.query(`DROP INDEX "IDX_7d25261324aaf603cea3d1d3f8" ON "user"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "transaction"`);
        await queryRunner.query(`DROP TABLE "inventory"`);
        await queryRunner.query(`DROP INDEX "IDX_498c977232a1763c6f329b387f" ON "asset"`);
        await queryRunner.query(`DROP TABLE "asset"`);
    }

}
