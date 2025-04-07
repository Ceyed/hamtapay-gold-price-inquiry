import { MigrationInterface, QueryRunner } from 'typeorm';
import { DEFAULT_USERS } from './../../../shared/constants/default-users.constant';

export class DefaultUsers1744051006177 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        for (const user of DEFAULT_USERS) {
            await queryRunner.query(
                `INSERT INTO "user" (id, email, password, "firstName", "lastName", username, role, status) VALUES ('${user.id}', '${user.email}', '${user.password}', '${user.firstName}', '${user.lastName}', '${user.username}', '${user.role}', '${user.status}')`,
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        for (const user of DEFAULT_USERS) {
            await queryRunner.query(`DELETE FROM "user" WHERE id = '${user.id}'`);
        }
    }
}
