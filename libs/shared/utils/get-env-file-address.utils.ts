import { AppNodeEnv } from '../enums/app-node-env.enum';

export function getEnvFileAddress(): string {
    return process.env.NODE_ENV === AppNodeEnv.Test ? '.env.test' : '.env';
}
