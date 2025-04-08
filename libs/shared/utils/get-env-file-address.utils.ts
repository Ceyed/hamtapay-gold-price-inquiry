import { AppNodeEnv } from '../enums/app-node-env.enum';

export function getEnvFileAddress(): string {
    // Check multiple ways the test environment might be indicated
    const isTestEnv =
        process.env.NODE_ENV === AppNodeEnv.Test ||
        process.env.NODE_ENV === 'test' ||
        process.env.TEST_ENV === 'true';

    console.log('Environment detection:', {
        NODE_ENV: process.env.NODE_ENV,
        TEST_ENV: process.env.TEST_ENV,
        isTestEnv,
    });

    return isTestEnv ? '.env.test' : '.env';
}
