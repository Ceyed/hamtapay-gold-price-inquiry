import * as dotenv from 'dotenv';
import { TypeormConfig } from 'libs/shared/config/typeorm.config';
import { getEnvFileAddress } from 'libs/shared/utils/get-env-file-address.utils';
import { registerConfig } from 'libs/shared/utils/register.config';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), getEnvFileAddress()) });

enum TYPEORM_CONFIG {
    AUTH_DATABASE_HOST = 'AUTH_DATABASE_HOST',
    AUTH_DATABASE_PORT = 'AUTH_DATABASE_PORT',
    AUTH_DATABASE_DB_NAME = 'AUTH_DATABASE_DB_NAME',
    AUTH_DATABASE_USERNAME = 'AUTH_DATABASE_USERNAME',
    AUTH_DATABASE_PASSWORD = 'AUTH_DATABASE_PASSWORD',
}

export const gatewayTypeormConfig = registerConfig(TypeormConfig, () => {
    const port = process.env[TYPEORM_CONFIG.AUTH_DATABASE_PORT];
    console.log({
        host: process.env[TYPEORM_CONFIG.AUTH_DATABASE_HOST],
        database: process.env[TYPEORM_CONFIG.AUTH_DATABASE_DB_NAME],
        username: process.env[TYPEORM_CONFIG.AUTH_DATABASE_USERNAME],
        password: process.env[TYPEORM_CONFIG.AUTH_DATABASE_PASSWORD],
        synchronize: false,
        port: port ? +port : undefined,
    });
    return new TypeormConfig({
        host: process.env[TYPEORM_CONFIG.AUTH_DATABASE_HOST],
        database: process.env[TYPEORM_CONFIG.AUTH_DATABASE_DB_NAME],
        username: process.env[TYPEORM_CONFIG.AUTH_DATABASE_USERNAME],
        password: process.env[TYPEORM_CONFIG.AUTH_DATABASE_PASSWORD],
        synchronize: false,
        port: port ? +port : undefined,
    });
});
