import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { registerConfig } from '../../shared/utils/register.config';

enum TYPEORM_CONFIG {
    AUTH_DATABASE_HOST = 'AUTH_DATABASE_HOST',
    AUTH_DATABASE_PORT = 'AUTH_DATABASE_PORT',
    AUTH_DATABASE_DB_NAME = 'AUTH_DATABASE_DB_NAME',
    AUTH_DATABASE_USERNAME = 'AUTH_DATABASE_USERNAME',
    AUTH_DATABASE_PASSWORD = 'AUTH_DATABASE_PASSWORD',
}

export class TypeormConfig {
    @IsString()
    connection = 'postgres' as const;

    @IsNumber()
    port = 5432;

    @IsString()
    @IsNotEmpty()
    host: string;

    @IsString()
    @IsNotEmpty()
    database: string;

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsBoolean()
    synchronize = false;

    @IsString()
    logging = 'all';

    constructor(obj: Partial<TypeormConfig>) {
        Object.assign(this, obj);
    }
}

export const typeormConfig = registerConfig(TypeormConfig, () => {
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
