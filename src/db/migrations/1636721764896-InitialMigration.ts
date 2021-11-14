import { MigrationInterface, QueryRunner } from 'typeorm'

export class InitialMigration1636721764896 implements MigrationInterface {
  name = 'InitialMigration1636721764896'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "dito_db"."dbo"."user" DROP CONSTRAINT "DF_d091f1d36f18bbece2a9eabc6e0"`,
    )
    await queryRunner.query(
      `ALTER TABLE "dito_db"."dbo"."user" ADD CONSTRAINT "DF_d091f1d36f18bbece2a9eabc6e0" DEFAULT '2021-11-12 20:56:7' FOR "created_at"`,
    )
    await queryRunner.query(
      `ALTER TABLE "dito_db"."dbo"."user" DROP CONSTRAINT "DF_9cdce43fa0043c794281aa09051"`,
    )
    await queryRunner.query(
      `ALTER TABLE "dito_db"."dbo"."user" ADD CONSTRAINT "DF_9cdce43fa0043c794281aa09051" DEFAULT '2021-11-12 20:56:7' FOR "updated_at"`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "dito_db"."dbo"."user" DROP CONSTRAINT "DF_9cdce43fa0043c794281aa09051"`,
    )
    await queryRunner.query(
      `ALTER TABLE "dito_db"."dbo"."user" ADD CONSTRAINT "DF_9cdce43fa0043c794281aa09051" DEFAULT '2021-11-12 17:29:4' FOR "updated_at"`,
    )
    await queryRunner.query(
      `ALTER TABLE "dito_db"."dbo"."user" DROP CONSTRAINT "DF_d091f1d36f18bbece2a9eabc6e0"`,
    )
    await queryRunner.query(
      `ALTER TABLE "dito_db"."dbo"."user" ADD CONSTRAINT "DF_d091f1d36f18bbece2a9eabc6e0" DEFAULT '2021-11-12 17:29:4' FOR "created_at"`,
    )
  }
}
