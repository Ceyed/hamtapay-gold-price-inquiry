import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

const orderDataSource = new DataSource({
    type: 'postgres',
    host: process.env.ORDER_DATABASE_HOST,
    port: Number(process.env.ORDER_DATABASE_PORT),
    username: process.env.ORDER_DATABASE_USERNAME,
    password: process.env.ORDER_DATABASE_PASSWORD,
    database: process.env.ORDER_DATABASE_DB_NAME,
    entities: ['libs/order/database/entities/**/*.entity{.ts,.js}'],
    migrations: ['libs/order/database/migrations/*{.ts,.js}'],
    migrationsTableName: 'migrations',
});

export default orderDataSource;
