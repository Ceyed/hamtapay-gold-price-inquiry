import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { registerConfig } from 'libs/shared/utils';

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

export const redisConfig = registerConfig(RedisConfig, () => {
    return new RedisConfig({
        host: process.env[REDIS_CONFIG_ENUM.REDIS_HOST],
        port: +process.env[REDIS_CONFIG_ENUM.REDIS_PORT],
    });
});
