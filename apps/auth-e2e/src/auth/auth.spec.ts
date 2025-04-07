import { TEST_EMAIL_VERIFICATION_CODE } from '@libs/auth';
import { HttpStatus } from '@nestjs/common';
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
        // * Check gateway health before running tests
        try {
            const healthResponse = await axios.get(`${gatewayUrl}/health`);
            console.log('Gateway health check:', healthResponse.data);

            if (healthResponse.status !== HttpStatus.OK || healthResponse.data.status !== 'ok') {
                throw new Error('Gateway is not healthy');
            }
        } catch (error) {
            console.error('Gateway health check failed:', error.message);
            throw new Error('Gateway service is not available. Please ensure it is running.');
        }
    });

    describe('User Registration and Authentication', () => {
        let accessToken: string;
        let refreshToken: string;

        describe('Signup', () => {
            it('should register a new user', async () => {
                const response = await axios.post(`${gatewayUrl}/users/signup`, testUser);
                const expectedResult = {
                    success: true,
                    data: 'You registered successfully. Please verify your account',
                };

                expect(response.status).toBe(HttpStatus.CREATED);
                expect(response.data).toEqual(expectedResult);
            });

            it('should fail to register a new user with existing username', async () => {
                const response = await axios.post(`${gatewayUrl}/users/signup`, testUser);
                const expectedResult = {
                    success: false,
                    error: {
                        statusCode: HttpStatus.CONFLICT,
                        message: 'Email or Username is used already',
                    },
                };

                expect(response.status).toBe(HttpStatus.CREATED);
                expect(response.data).toEqual(expectedResult);
            });

            it('should fail to register a new user with short password', async () => {
                const response = await axios.post(`${gatewayUrl}/users/signup`, {
                    ...testUser,
                    password: 'Test@12',
                });
                const expectedResult = {
                    message: ['password must be longer than or equal to 8 characters'],
                    error: 'Bad Request',
                    statusCode: HttpStatus.BAD_REQUEST,
                };

                expect(response.status).toBe(HttpStatus.BAD_REQUEST);
                expect(response.data).toEqual(expectedResult);
            });

            it('should fail to register a new user with short username', async () => {
                const response = await axios.post(`${gatewayUrl}/users/signup`, {
                    ...testUser,
                    username: 'ab',
                });
                const expectedResult = {
                    message: ['username must be longer than or equal to 3 characters'],
                    error: 'Bad Request',
                    statusCode: HttpStatus.BAD_REQUEST,
                };

                expect(response.status).toBe(HttpStatus.BAD_REQUEST);
                expect(response.data).toEqual(expectedResult);
            });

            it('should fail to register a new user with long username', async () => {
                const response = await axios.post(`${gatewayUrl}/users/signup`, {
                    ...testUser,
                    username: 'a'.repeat(21),
                });
                const expectedResult = {
                    message: ['username must be shorter than or equal to 20 characters'],
                    error: 'Bad Request',
                    statusCode: HttpStatus.BAD_REQUEST,
                };

                expect(response.status).toBe(HttpStatus.BAD_REQUEST);
                expect(response.data).toEqual(expectedResult);
            });
        });

        describe('Verify Account', () => {
            it('should fail to verify user account with invalid email', async () => {
                const response = await axios.post(`${gatewayUrl}/users/verify-account`, {
                    email: 'invalid-email',
                    code: TEST_EMAIL_VERIFICATION_CODE,
                });
                const expectedResult = {
                    success: false,
                    error: {
                        statusCode: HttpStatus.NOT_FOUND,
                        message: 'User not found',
                    },
                };

                expect(response.status).toBe(HttpStatus.CREATED);
                expect(response.data).toEqual(expectedResult);
            });

            it('should fail to verify user account with invalid code', async () => {
                const response = await axios.post(`${gatewayUrl}/users/verify-account`, {
                    email: testUser.email,
                    code: 'invalid-code',
                });
                const expectedResult = {
                    success: false,
                    error: {
                        statusCode: HttpStatus.UNAUTHORIZED,
                        message: 'Invalid confirmation code',
                    },
                };

                expect(response.status).toBe(HttpStatus.CREATED);
                expect(response.data).toEqual(expectedResult);
            });

            it('should verify user account', async () => {
                // * Just for testing purposes, we'll use a fixed verification code
                const verificationCode = TEST_EMAIL_VERIFICATION_CODE;

                const response = await axios.post(`${gatewayUrl}/users/verify-account`, {
                    email: testUser.email,
                    code: verificationCode,
                });
                const expectedResult = {
                    success: true,
                    data: 'Account verified successfully. You can login now',
                };

                expect(response.status).toBe(HttpStatus.CREATED);
                expect(response.data).toEqual(expectedResult);
            });

            it('should fail to verify user account with already verified user', async () => {
                const response = await axios.post(`${gatewayUrl}/users/verify-account`, {
                    email: testUser.email,
                    code: TEST_EMAIL_VERIFICATION_CODE,
                });
                const expectedResult = {
                    success: false,
                    error: {
                        statusCode: HttpStatus.CONFLICT,
                        message: 'User is already verified',
                    },
                };

                expect(response.status).toBe(HttpStatus.CREATED);
                expect(response.data).toEqual(expectedResult);
            });
        });

        describe('Signin', () => {
            it('should fail to signin with invalid username', async () => {
                const response = await axios.post(`${gatewayUrl}/users/signin`, {
                    username: 'invalid-username',
                    password: testUser.password,
                });
                const expectedResult = {
                    success: false,
                    error: {
                        statusCode: HttpStatus.NOT_FOUND,
                        message: 'User not found',
                    },
                };

                expect(response.status).toBe(HttpStatus.CREATED);
                expect(response.data).toEqual(expectedResult);
            });

            it('should fail to signin with wrong password', async () => {
                const response = await axios.post(`${gatewayUrl}/users/signin`, {
                    username: testUser.username,
                    password: 'wrong-password',
                });
                const expectedResult = {
                    success: false,
                    error: {
                        statusCode: HttpStatus.UNAUTHORIZED,
                        message: 'Password is incorrect',
                    },
                };

                expect(response.status).toBe(HttpStatus.CREATED);
                expect(response.data).toEqual(expectedResult);
            });

            it('should authenticate user and return tokens', async () => {
                const response = await axios.post(`${gatewayUrl}/users/signin`, {
                    username: testUser.username,
                    password: testUser.password,
                });
                const expectedResult = {
                    data: {
                        accessToken: expect.any(String),
                        refreshToken: expect.any(String),
                    },
                    success: true,
                };
                expect(response.status).toBe(HttpStatus.CREATED);
                expect(response.data).toEqual(expectedResult);

                accessToken = response.data.data.accessToken;
                refreshToken = response.data.data.refreshToken;
            });
        });

        describe('Refresh Token', () => {
            it('should fail to refresh token with invalid refresh token', async () => {
                const response = await axios.post(`${gatewayUrl}/users/refresh-token`, {
                    refreshToken: refreshToken.replace('e', 'E'),
                });
                const expectedResult = {
                    success: false,
                    error: {
                        statusCode: HttpStatus.UNAUTHORIZED,
                        message: 'Invalid refresh token',
                    },
                };

                expect(response.status).toBe(HttpStatus.CREATED);
                expect(response.data).toEqual(expectedResult);
            });

            it('should fail to refresh token with invalid token', async () => {
                const response = await axios.post(`${gatewayUrl}/users/refresh-token`, {
                    refreshToken: 'invalid-token',
                });
                const expectedResult = {
                    success: false,
                    error: {
                        statusCode: HttpStatus.UNAUTHORIZED,
                        message: 'Invalid refresh token',
                    },
                };

                expect(response.status).toBe(HttpStatus.CREATED);
                expect(response.data).toEqual(expectedResult);
            });

            it('update tokens successfully', async () => {
                const response = await axios.post(`${gatewayUrl}/users/refresh-token`, {
                    refreshToken,
                });
                const expectedResult = {
                    data: {
                        accessToken: expect.any(String),
                        refreshToken: expect.any(String),
                    },
                    success: true,
                };
                expect(response.status).toBe(HttpStatus.CREATED);
                expect(response.data).toEqual(expectedResult);
            });
        });

        describe('Get User List', () => {
            it('should fail to get user list with invalid token', async () => {
                const response = await axios.get(`${gatewayUrl}/users/all/admin`, {
                    headers: {
                        Authorization: `Bearer-${accessToken.replace('e', 'E')}`,
                    },
                });
                const expectedResult = {
                    message: 'JWT token is missing',
                    error: 'Unauthorized',
                    statusCode: 401,
                };

                expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
                expect(response.data).toEqual(expectedResult);
            });

            it('invalid role', async () => {
                const response = await axios.get(`${gatewayUrl}/users/all/admin`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                const expectedResult = {
                    message: 'Forbidden resource',
                    error: 'Forbidden',
                    statusCode: 403,
                };

                expect(response.status).toBe(HttpStatus.FORBIDDEN);
                expect(response.data).toEqual(expectedResult);
            });
        });
    });
});
