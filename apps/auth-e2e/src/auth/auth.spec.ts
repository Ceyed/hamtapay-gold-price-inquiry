import { TEST_EMAIL_VERIFICATION_CODE } from '@libs/auth';
import axios from 'axios';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../../.env.test') });

describe('Auth Service E2E Tests', () => {
    const testUser = {
        username: `test${Date.now()}`,
        email: `test${Date.now()}@example.com`,
        password: 'Test@123456',
        firstName: 'Test',
        lastName: 'User',
    };

    const gatewayHost = process.env.GATEWAY_HOST;
    const gatewayPort = process.env.GATEWAY_PORT;
    const gatewayUrl = `http://${gatewayHost}:${gatewayPort}/api`;

    beforeAll(async () => {
        try {
            await axios.get(gatewayUrl);
        } catch (error) {
            console.error(
                'Gateway service is not running. Please start it with: npx nx serve gateway --configuration=test',
            );
            throw error;
        }
    });

    describe('User Registration and Authentication', () => {
        it('should register a new user', async () => {
            const response = await axios.post(`${gatewayUrl}/users/signup`, testUser);

            expect(response.status).toBe(201);
            expect(response.data).toHaveProperty('data');
            expect(response.data).toHaveProperty('success');
            expect(response.data.success).toBe(true);
            expect(response.data.data).toBe(
                'You registered successfully. Please verify your account',
            );
        });

        it('should verify user account', async () => {
            // * Just for testing purposes, we'll use a fixed verification code
            const verificationCode = TEST_EMAIL_VERIFICATION_CODE;

            const response = await axios.post(`${gatewayUrl}/users/verify-account`, {
                email: testUser.email,
                code: verificationCode,
            });

            expect(response.status).toBe(201);
            expect(response.data).toHaveProperty('data');
            expect(response.data).toHaveProperty('success');
            expect(response.data.success).toBe(true);
            expect(response.data.data).toBe('Account verified successfully. You can login now');
        });

        it('should authenticate user and return tokens', async () => {
            const response = await axios.post(`${gatewayUrl}/users/signin`, {
                username: testUser.username,
                password: testUser.password,
            });

            expect(response.status).toBe(201);
            expect(response.data).toHaveProperty('data');
            expect(response.data).toHaveProperty('success');
            expect(response.data.success).toBe(true);
            expect(response.data.data).toHaveProperty('accessToken');
            expect(response.data.data).toHaveProperty('refreshToken');
        });
    });
});
