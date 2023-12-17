import { MigrationInterface, QueryRunner } from 'typeorm';

export class Update1702622096692 implements MigrationInterface {
  name = 'Update1702622096692';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "timesheet" ADD "emp_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "timesheet" ADD "t_date" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "timesheet" DROP COLUMN "t_date"`);
    await queryRunner.query(`ALTER TABLE "timesheet" DROP COLUMN "emp_id"`);
  }
}
