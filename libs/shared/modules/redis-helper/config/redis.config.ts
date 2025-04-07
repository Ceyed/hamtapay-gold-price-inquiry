import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import * as dotenv from 'dotenv';
import { registerConfig } from 'libs/shared/utils';
import { getEnvFileAddress } from 'libs/shared/utils/get-env-file-address.utils';
import * as path from 'path';

export enum REDIS_CONFIG_ENUM {
    REDIS_HOST = 'REDIS_HOST',
    REDIS_PORT = 'REDIS_PORT',
}

export class RedisConfig {
    @IsString()
    @IsNotEmpty()
    host: string;

    @IsNumber()
    @IsNotEmpty()
    port: number;

    constructor(obj: Partial<RedisConfig>) {
        Object.assign(this, obj);
    }
}

dotenv.config({ path: path.resolve(process.cwd(), getEnvFileAddress()) });

export const redisConfig = registerConfig(RedisConfig, () => {
    return new RedisConfig({
        host: process.env[REDIS_CONFIG_ENUM.REDIS_HOST],
        port: +process.env[REDIS_CONFIG_ENUM.REDIS_PORT],
    });
});
