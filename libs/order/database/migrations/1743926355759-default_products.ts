import { GoldGramsEnum } from '@libs/pricing';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class DefaultProducts1743926355759 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        for (const goldGrams of Object.values(GoldGramsEnum)) {
            await queryRunner.query(
                `INSERT INTO "product" ("goldGrams", "currentStock", "totalStock") VALUES ('${goldGrams}', 10, 10)`,
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        for (const goldGrams of Object.values(GoldGramsEnum)) {
            await queryRunner.query(`DELETE FROM "product" WHERE "goldGrams" = '${goldGrams}'`);
        }
    }
}
