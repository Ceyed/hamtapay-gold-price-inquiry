import { MigrationInterface, QueryRunner } from 'typeorm';

export class InventoryAndStockHistory1743923564509 implements MigrationInterface {
    name = 'InventoryAndStockHistory1743923564509';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "public"."inventory_goldgrams_enum" AS ENUM('24k', '22k', '21k', '20k', '18k', '16k', '14k', '10k')`,
        );
        await queryRunner.query(
            `CREATE TABLE "inventory" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "goldGrams" "public"."inventory_goldgrams_enum" NOT NULL, "currentStock" integer NOT NULL DEFAULT '0', "totalStock" integer NOT NULL DEFAULT '0', CONSTRAINT "UQ_0766bdeeb9949358bfc98925050" UNIQUE ("goldGrams"), CONSTRAINT "PK_82aa5da437c5bbfb80703b08309" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TYPE "public"."stock_history_type_enum" AS ENUM('StockIn', 'StockOut')`,
        );
        await queryRunner.query(
            `CREATE TABLE "stock_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "type" "public"."stock_history_type_enum" NOT NULL, "amount" integer NOT NULL DEFAULT '0', "inventoryId" uuid NOT NULL, CONSTRAINT "PK_16924caa54ac1fa49162ea3afca" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `ALTER TABLE "stock_history" ADD CONSTRAINT "FK_584cac212b93079015248997cd0" FOREIGN KEY ("inventoryId") REFERENCES "inventory"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "stock_history" DROP CONSTRAINT "FK_584cac212b93079015248997cd0"`,
        );
        await queryRunner.query(`DROP TABLE "stock_history"`);
        await queryRunner.query(`DROP TYPE "public"."stock_history_type_enum"`);
        await queryRunner.query(`DROP TABLE "inventory"`);
        await queryRunner.query(`DROP TYPE "public"."inventory_goldgrams_enum"`);
    }
}
