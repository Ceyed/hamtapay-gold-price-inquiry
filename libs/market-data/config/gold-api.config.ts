import { registerConfig } from '@lib/shared';
import { IsNotEmpty, IsString } from 'class-validator';
import 'dotenv/config';

enum GOLD_API_CONFIG {
    GOLD_API_KEY = 'GOLD_API_KEY',
}

export class GoldApiConfig {
    @IsString()
    @IsNotEmpty()
    accessToken: string;

    constructor(obj: Partial<GoldApiConfig>) {
        Object.assign(this, obj);
    }
}

export const goldApiConfig = registerConfig(GoldApiConfig, () => {
    return new GoldApiConfig({
        accessToken: process.env[GOLD_API_CONFIG.GOLD_API_KEY],
    });
});
