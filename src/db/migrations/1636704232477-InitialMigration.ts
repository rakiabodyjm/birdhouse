import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialMigration1636704232477 implements MigrationInterface {
    name = 'InitialMigration1636704232477'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dito_db"."dbo"."user" DROP CONSTRAINT "DF_d091f1d36f18bbece2a9eabc6e0"`);
        await queryRunner.query(`ALTER TABLE "dito_db"."dbo"."user" ADD CONSTRAINT "DF_d091f1d36f18bbece2a9eabc6e0" DEFAULT '2021-11-12 16:03:54' FOR "created_at"`);
        await queryRunner.query(`ALTER TABLE "dito_db"."dbo"."user" DROP CONSTRAINT "DF_9cdce43fa0043c794281aa09051"`);
        await queryRunner.query(`ALTER TABLE "dito_db"."dbo"."user" ADD CONSTRAINT "DF_9cdce43fa0043c794281aa09051" DEFAULT '2021-11-12 16:03:54' FOR "updated_at"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dito_db"."dbo"."user" DROP CONSTRAINT "DF_9cdce43fa0043c794281aa09051"`);
        await queryRunner.query(`ALTER TABLE "dito_db"."dbo"."user" ADD CONSTRAINT "DF_9cdce43fa0043c794281aa09051" DEFAULT '2021-11-12 13:01:14' FOR "updated_at"`);
        await queryRunner.query(`ALTER TABLE "dito_db"."dbo"."user" DROP CONSTRAINT "DF_d091f1d36f18bbece2a9eabc6e0"`);
        await queryRunner.query(`ALTER TABLE "dito_db"."dbo"."user" ADD CONSTRAINT "DF_d091f1d36f18bbece2a9eabc6e0" DEFAULT '2021-11-12 13:01:14' FOR "created_at"`);
    }

}
