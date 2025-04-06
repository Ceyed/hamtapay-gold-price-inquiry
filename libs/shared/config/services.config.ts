export const ServicesConfig = {
    gateway: {
        port: process.env.GATEWAY_PORT || 3000,
        host: process.env.GATEWAY_HOST || 'localhost',
        get url() {
            return `${this.host}:${this.port}`;
        },
    },
    auth: {
        port: process.env.AUTH_PORT || 5001,
        host: process.env.AUTH_HOST || 'localhost',
        get url() {
            return `${this.host}:${this.port}`;
        },
    },
    order: {
        port: process.env.ORDER_PORT || 5002,
        host: process.env.ORDER_HOST || 'localhost',
        get url() {
            return `${this.host}:${this.port}`;
        },
    },
    pricing: {
        port: process.env.PRICING_PORT || 5003,
        host: process.env.PRICING_HOST || 'localhost',
        get url() {
            return `${this.host}:${this.port}`;
        },
    },
    marketData: {
        port: process.env.MARKET_DATA_PORT || 5004,
        host: process.env.MARKET_DATA_HOST || 'localhost',
        get url() {
            return `${this.host}:${this.port}`;
        },
    },
    notification: {
        port: process.env.NOTIFICATION_PORT || 5005,
        host: process.env.NOTIFICATION_HOST || 'localhost',
        get url() {
            return `${this.host}:${this.port}`;
        },
    },
};
