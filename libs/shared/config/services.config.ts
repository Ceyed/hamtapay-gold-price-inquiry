import * as dotenv from 'dotenv';
import { getEnvFileAddress } from 'libs/shared/utils/get-env-file-address.utils';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), getEnvFileAddress()) });

export const ServicesConfig = {
    gateway: {
        port: process.env.GATEWAY_PORT,
        host: process.env.GATEWAY_HOST,
        get url() {
            return `${this.host}:${this.port}`;
        },
    },
    auth: {
        port: process.env.AUTH_PORT,
        host: process.env.AUTH_HOST,
        get url() {
            return `${this.host}:${this.port}`;
        },
    },
    order: {
        port: process.env.ORDER_PORT,
        host: process.env.ORDER_HOST,
        get url() {
            return `${this.host}:${this.port}`;
        },
    },
    pricing: {
        port: process.env.PRICING_PORT,
        host: process.env.PRICING_HOST,
        get url() {
            return `${this.host}:${this.port}`;
        },
    },
    marketData: {
        port: process.env.MARKET_DATA_PORT,
        host: process.env.MARKET_DATA_HOST,
        get url() {
            return `${this.host}:${this.port}`;
        },
    },
    notification: {
        port: process.env.NOTIFICATION_PORT,
        host: process.env.NOTIFICATION_HOST,
        get url() {
            return `${this.host}:${this.port}`;
        },
    },
};
