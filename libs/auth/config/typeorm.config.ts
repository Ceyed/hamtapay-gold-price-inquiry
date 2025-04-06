import { TypeormConfig } from 'libs/shared/config/typeorm.config';
import { registerConfig } from '../../shared/utils/register.config';

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
