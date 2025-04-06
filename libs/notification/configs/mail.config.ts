import { registerConfig } from '@libs/shared';
import { IsNotEmpty, IsString } from 'class-validator';
import 'dotenv/config';

enum MAIL_CONFIG {
    MAIL_HOST = 'MAIL_HOST',
    MAIL_USER = 'MAIL_USER',
    MAIL_PASS = 'MAIL_PASS',
}

export class MailConfig {
    @IsString()
    @IsNotEmpty()
    host: string;

    @IsString()
    @IsNotEmpty()
    user: string;

    @IsString()
    @IsNotEmpty()
    pass: string;

    constructor(obj: Partial<MailConfig>) {
        Object.assign(this, obj);
    }
}

export const mailConfig = registerConfig(MailConfig, () => {
    return new MailConfig({
        host: process.env[MAIL_CONFIG.MAIL_HOST],
        user: process.env[MAIL_CONFIG.MAIL_USER],
        pass: process.env[MAIL_CONFIG.MAIL_PASS],
    });
});
