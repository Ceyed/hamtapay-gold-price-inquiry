import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserTableIndex1744054011152 implements MigrationInterface {
    name = 'UserTableIndex1744054011152';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE UNIQUE INDEX "user_username_index" ON "user" ("username") `,
        );
        await queryRunner.query(`CREATE UNIQUE INDEX "user_email_index" ON "user" ("email") `);
        await queryRunner.query(
            `ALTER TABLE "user" ADD CONSTRAINT "UQ_f4ca2c1e7c96ae6e8a7cca9df80" UNIQUE ("email", "username")`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "user" DROP CONSTRAINT "UQ_f4ca2c1e7c96ae6e8a7cca9df80"`,
        );
        await queryRunner.query(`DROP INDEX "public"."user_email_index"`);
        await queryRunner.query(`DROP INDEX "public"."user_username_index"`);
    }
}
