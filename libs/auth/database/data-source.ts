import { getEnvFileAddress } from '@libs/shared';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { DataSource } from 'typeorm';

dotenv.config({ path: path.resolve(process.cwd(), getEnvFileAddress()) });

const authDataSource = new DataSource({
    type: 'postgres',
    host: process.env.AUTH_DATABASE_HOST,
    port: Number(process.env.AUTH_DATABASE_PORT),
    username: process.env.AUTH_DATABASE_USERNAME,
    password: process.env.AUTH_DATABASE_PASSWORD,
    database: process.env.AUTH_DATABASE_DB_NAME,
    entities: ['libs/auth/database/entities/**/*.entity{.ts,.js}'],
    migrations: ['libs/auth/database/migrations/*{.ts,.js}'],
    migrationsTableName: 'migrations',
});

export default authDataSource;
