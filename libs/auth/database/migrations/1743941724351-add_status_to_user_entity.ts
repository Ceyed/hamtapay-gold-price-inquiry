import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStatusToUserEntity1743941724351 implements MigrationInterface {
    name = 'AddStatusToUserEntity1743941724351';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "public"."user_status_enum" AS ENUM('NotVerified', 'Verified')`,
        );
        await queryRunner.query(
            `ALTER TABLE "user" ADD "status" "public"."user_status_enum" NOT NULL DEFAULT 'NotVerified'`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."user_status_enum"`);
    }
}
