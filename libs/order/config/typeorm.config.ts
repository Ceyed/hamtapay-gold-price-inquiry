import { TypeormConfig } from 'libs/shared/config/typeorm.config';
import { registerConfig } from '../../shared/utils/register.config';

enum TYPEORM_CONFIG {
    ORDER_DATABASE_HOST = 'ORDER_DATABASE_HOST',
    ORDER_DATABASE_PORT = 'ORDER_DATABASE_PORT',
    ORDER_DATABASE_DB_NAME = 'ORDER_DATABASE_DB_NAME',
    ORDER_DATABASE_USERNAME = 'ORDER_DATABASE_USERNAME',
    ORDER_DATABASE_PASSWORD = 'ORDER_DATABASE_PASSWORD',
}

export const orderTypeormConfig = registerConfig(TypeormConfig, () => {
    const port = process.env[TYPEORM_CONFIG.ORDER_DATABASE_PORT];
    return new TypeormConfig({
        host: process.env[TYPEORM_CONFIG.ORDER_DATABASE_HOST],
        database: process.env[TYPEORM_CONFIG.ORDER_DATABASE_DB_NAME],
        username: process.env[TYPEORM_CONFIG.ORDER_DATABASE_USERNAME],
        password: process.env[TYPEORM_CONFIG.ORDER_DATABASE_PASSWORD],
        synchronize: false,
        port: port ? +port : undefined,
    });
});
