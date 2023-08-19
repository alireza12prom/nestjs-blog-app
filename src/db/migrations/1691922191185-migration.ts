import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1691922191185 implements MigrationInterface {
  name = 'Migration1691922191185';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "isActive"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "password" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
    await queryRunner.query(
      `ALTER TABLE "sessions" ADD "isActive" boolean NOT NULL`,
    );
  }
}
