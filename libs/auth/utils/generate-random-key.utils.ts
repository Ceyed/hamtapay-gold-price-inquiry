import { TEST_EMAIL_VERIFICATION_CODE } from '../constants/test-email-verification-code.constant';
import { AppNodeEnv } from './../../shared/enums/app-node-env.enum';

export function generateRandomKey(): string {
    if (process.env.NODE_ENV === AppNodeEnv.Test) {
        return TEST_EMAIL_VERIFICATION_CODE;
    }

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }

    return result;
}
