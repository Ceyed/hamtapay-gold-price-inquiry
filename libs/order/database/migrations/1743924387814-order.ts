import { MigrationInterface, QueryRunner } from 'typeorm';

export class Order1743924387814 implements MigrationInterface {
    name = 'Order1743924387814';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "order" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "customerId" uuid NOT NULL, "productId" uuid NOT NULL, "amount" integer NOT NULL, "price" integer NOT NULL, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `ALTER TABLE "order" ADD CONSTRAINT "FK_88991860e839c6153a7ec878d39" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "order" DROP CONSTRAINT "FK_88991860e839c6153a7ec878d39"`,
        );
        await queryRunner.query(`DROP TABLE "order"`);
    }
}
