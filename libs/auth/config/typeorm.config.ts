import { getEnvFileAddress, TypeormConfig } from '@libs/shared';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { registerConfig } from '../../shared/utils/register.config';

dotenv.config({ path: path.resolve(process.cwd(), getEnvFileAddress()) });

enum TYPEORM_CONFIG {
    AUTH_DATABASE_HOST = 'AUTH_DATABASE_HOST',
    AUTH_DATABASE_PORT = 'AUTH_DATABASE_PORT',
    AUTH_DATABASE_DB_NAME = 'AUTH_DATABASE_DB_NAME',
    AUTH_DATABASE_USERNAME = 'AUTH_DATABASE_USERNAME',
    AUTH_DATABASE_PASSWORD = 'AUTH_DATABASE_PASSWORD',
}

export const authTypeormConfig = registerConfig(TypeormConfig, () => {
    const port = process.env[TYPEORM_CONFIG.AUTH_DATABASE_PORT];
    return new TypeormConfig({
        host: process.env[TYPEORM_CONFIG.AUTH_DATABASE_HOST],
        database: process.env[TYPEORM_CONFIG.AUTH_DATABASE_DB_NAME],
        username: process.env[TYPEORM_CONFIG.AUTH_DATABASE_USERNAME],
        password: process.env[TYPEORM_CONFIG.AUTH_DATABASE_PASSWORD],
        synchronize: false,
        port: port ? +port : undefined,
    });
});
