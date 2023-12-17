import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateFk1700820568729 implements MigrationInterface {
    name = 'UpdateFk1700820568729'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todo" DROP COLUMN "project_id"`);
        await queryRunner.query(`ALTER TABLE "todo" ADD "project_id" uuid`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "client_id"`);
        await queryRunner.query(`ALTER TABLE "project" ADD "client_id" uuid`);
        await queryRunner.query(`ALTER TABLE "todo" ADD CONSTRAINT "FK_7f8cdb1c5d2d2068dd89a0d4ea2" FOREIGN KEY ("project_id") REFERENCES "project"("project_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_c72d76e480d7334858782543610" FOREIGN KEY ("client_id") REFERENCES "client"("client_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_c72d76e480d7334858782543610"`);
        await queryRunner.query(`ALTER TABLE "todo" DROP CONSTRAINT "FK_7f8cdb1c5d2d2068dd89a0d4ea2"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "client_id"`);
        await queryRunner.query(`ALTER TABLE "project" ADD "client_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "todo" DROP COLUMN "project_id"`);
        await queryRunner.query(`ALTER TABLE "todo" ADD "project_id" character varying NOT NULL`);
    }

}
