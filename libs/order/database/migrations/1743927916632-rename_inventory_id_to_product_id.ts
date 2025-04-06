import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameInventoryIdToProductId1743927916632 implements MigrationInterface {
    name = 'RenameInventoryIdToProductId1743927916632';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stock_history" DROP COLUMN "inventoryId"`);
        await queryRunner.query(
            `ALTER TABLE "stock_history" DROP CONSTRAINT "FK_245fa798752893dd5046f1de46c"`,
        );
        await queryRunner.query(
            `ALTER TABLE "stock_history" ALTER COLUMN "productId" SET NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "stock_history" ADD CONSTRAINT "FK_245fa798752893dd5046f1de46c" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "stock_history" DROP CONSTRAINT "FK_245fa798752893dd5046f1de46c"`,
        );
        await queryRunner.query(
            `ALTER TABLE "stock_history" ALTER COLUMN "productId" DROP NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "stock_history" ADD CONSTRAINT "FK_245fa798752893dd5046f1de46c" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(`ALTER TABLE "stock_history" ADD "inventoryId" uuid NOT NULL`);
    }
}
