import { MigrationInterface, QueryRunner } from 'typeorm';

export class StockHistory1743924515154 implements MigrationInterface {
    name = 'StockHistory1743924515154';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "stock_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "type" "public"."stock_history_type_enum" NOT NULL, "amount" integer NOT NULL DEFAULT '0', "inventoryId" uuid NOT NULL, "productId" uuid, CONSTRAINT "PK_16924caa54ac1fa49162ea3afca" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `ALTER TABLE "stock_history" ADD CONSTRAINT "FK_245fa798752893dd5046f1de46c" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "stock_history" DROP CONSTRAINT "FK_245fa798752893dd5046f1de46c"`,
        );
        await queryRunner.query(`DROP TABLE "stock_history"`);
    }
}
