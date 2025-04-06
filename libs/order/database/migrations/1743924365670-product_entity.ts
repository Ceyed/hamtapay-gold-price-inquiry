import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProductEntity1743924365670 implements MigrationInterface {
    name = 'ProductEntity1743924365670';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "public"."product_goldgrams_enum" AS ENUM('24k', '22k', '21k', '20k', '18k', '16k', '14k', '10k')`,
        );
        await queryRunner.query(
            `CREATE TABLE "product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "goldGrams" "public"."product_goldgrams_enum" NOT NULL, "currentStock" integer NOT NULL DEFAULT '0', "totalStock" integer NOT NULL DEFAULT '0', CONSTRAINT "UQ_e0a78a8b64fba60fa7a56eb97f7" UNIQUE ("goldGrams"), CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TYPE "public"."product_goldgrams_enum"`);
    }
}
