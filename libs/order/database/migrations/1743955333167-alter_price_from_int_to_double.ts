import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterPriceFromIntToDouble1743955333167 implements MigrationInterface {
    name = 'AlterPriceFromIntToDouble1743955333167';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "price" TYPE double precision`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "price" TYPE integer`);
    }
}
