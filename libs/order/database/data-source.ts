import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

const orderDataSource = new DataSource({
    type: 'postgres',
    host: process.env.ORDER_POSTGRES_HOST,
    port: Number(process.env.ORDER_POSTGRES_PORT),
    username: process.env.ORDER_POSTGRES_USER,
    password: process.env.ORDER_POSTGRES_PASSWORD,
    database: process.env.ORDER_POSTGRES_DB,
    entities: ['libs/order/database/entities/**/*.entity{.ts,.js}'],
    migrations: ['libs/order/database/migrations/*{.ts,.js}'],
    migrationsTableName: 'migrations',
});

export default orderDataSource;
