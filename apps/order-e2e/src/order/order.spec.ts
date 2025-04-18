import { DEFAULT_USERS, ServicesConfig } from '@libs/shared';
import { HttpStatus } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../../.env.test') });

describe('Order Service E2E Tests', () => {
    const adminUsername = DEFAULT_USERS.at(0).username;
    const adminPassword = DEFAULT_USERS.at(0).rawPassword;
    let adminAccessToken: string;

    const userUsername = DEFAULT_USERS.at(1).username;
    const userPassword = DEFAULT_USERS.at(1).rawPassword;
    let userAccessToken: string;

    let products;

    const gatewayUrl = `http://${ServicesConfig.gateway.url}/api`;

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

        try {
            const loginResponse = await axios.post(`${gatewayUrl}/users/signin`, {
                username: adminUsername,
                password: adminPassword,
            });
            adminAccessToken = loginResponse.data.data.accessToken;
        } catch (error) {
            console.error('Failed to authenticate with gateway. Please check:', error);
            throw error;
        }

        try {
            const loginResponse = await axios.post(`${gatewayUrl}/users/signin`, {
                username: userUsername,
                password: userPassword,
            });
            userAccessToken = loginResponse.data.data.accessToken;
        } catch (error) {
            console.error('Failed to authenticate with gateway. Please check:', error);
            throw error;
        }
    });

    describe('Product Management', () => {
        describe('Get Product List', () => {
            it('should get list of products', async () => {
                const response = await axios.get(`${gatewayUrl}/products/all`, {
                    headers: {
                        Authorization: `Bearer ${adminAccessToken}`,
                    },
                });
                const expectedResult = {
                    data: expect.any(Array),
                    success: true,
                };

                expect(response.status).toBe(HttpStatus.OK);
                expect(response.data).toEqual(expectedResult);
                expect(Array.isArray(response.data.data)).toBe(true);

                response.data.data.forEach((product) => {
                    expect(product).toHaveProperty('id');
                    expect(product).toHaveProperty('createdAt');
                    expect(product).toHaveProperty('updatedAt');
                    expect(product).toHaveProperty('goldGrams');
                    expect(product).toHaveProperty('currentStock');
                    expect(product).toHaveProperty('totalStock');
                    expect(product).toHaveProperty('rawPrice');

                    expect(typeof product.id).toBe('string');
                    expect(typeof product.createdAt).toBe('string');
                    expect(typeof product.updatedAt).toBe('string');
                    expect(typeof product.goldGrams).toBe('string');
                    expect(typeof product.currentStock).toBe('number');
                    expect(typeof product.totalStock).toBe('number');
                    expect(typeof product.rawPrice).toBe('number');

                    expect(product.currentStock).toBeGreaterThanOrEqual(0);
                    expect(product.totalStock).toBeGreaterThanOrEqual(0);
                    expect(product.rawPrice).toBeGreaterThan(0);
                });

                products = response.data.data;
            });
        });
        describe('Get Product List By Admin', () => {
            it('should get list of products with more details', async () => {
                const response = await axios.get(`${gatewayUrl}/products/all/admin`, {
                    headers: {
                        Authorization: `Bearer ${adminAccessToken}`,
                    },
                });
                const expectedResult = {
                    data: expect.any(Array),
                    success: true,
                };

                expect(response.status).toBe(HttpStatus.OK);
                expect(response.data).toEqual(expectedResult);
                expect(Array.isArray(response.data.data)).toBe(true);

                response.data.data.forEach((product) => {
                    expect(product).toHaveProperty('id');
                    expect(product).toHaveProperty('createdAt');
                    expect(product).toHaveProperty('updatedAt');
                    expect(product).toHaveProperty('goldGrams');
                    expect(product).toHaveProperty('currentStock');
                    expect(product).toHaveProperty('totalStock');

                    expect(typeof product.id).toBe('string');
                    expect(typeof product.createdAt).toBe('string');
                    expect(typeof product.updatedAt).toBe('string');
                    expect(typeof product.goldGrams).toBe('string');
                    expect(typeof product.currentStock).toBe('number');
                    expect(typeof product.totalStock).toBe('number');

                    expect(product.currentStock).toBeGreaterThanOrEqual(0);
                    expect(product.totalStock).toBeGreaterThanOrEqual(0);
                });
            });
        });
        describe('Get Admin Product List By User', () => {
            it('should not get list of products with more details', async () => {
                try {
                    await axios.get(`${gatewayUrl}/products/all/admin`, {
                        headers: {
                            Authorization: `Bearer ${userAccessToken}`,
                        },
                    });
                    fail('Expected request to fail with 403 Forbidden');
                } catch (error) {
                    expect(error.response).toBeDefined();
                    expect(error.response.status).toBe(HttpStatus.FORBIDDEN);

                    const expectedResult = {
                        message: 'Forbidden resource',
                        error: 'Forbidden',
                        statusCode: 403,
                    };

                    expect(error.response.data).toEqual(expectedResult);
                }
            });
        });
    });
    describe('Stock Management', () => {
        it('should add stock to product', async () => {
            try {
                const stockInProductDto = {
                    productId: products[0].id,
                    amount: 20,
                };
                const response = await axios.post(
                    `${gatewayUrl}/products/stock-in`,
                    stockInProductDto,
                    {
                        headers: {
                            Authorization: `Bearer ${adminAccessToken}`,
                        },
                    },
                );

                expect(response.status).toBe(HttpStatus.CREATED);
                expect(response.data.success).toBe(true);
            } catch (error) {
                console.error('Error adding stock:', error.response?.data || error.message);
                throw error;
            }
        });
        it('should not add stock to product by user', async () => {
            try {
                const stockInProductDto = {
                    productId: products[0].id,
                    amount: 20,
                };
                await axios.post(`${gatewayUrl}/products/stock-in`, stockInProductDto, {
                    headers: {
                        Authorization: `Bearer ${userAccessToken}`,
                    },
                });
                fail('Expected request to fail with 403 Forbidden');
            } catch (error) {
                expect(error.response).toBeDefined();
                expect(error.response.status).toBe(HttpStatus.FORBIDDEN);

                const expectedResult = {
                    message: 'Forbidden resource',
                    error: 'Forbidden',
                    statusCode: 403,
                };

                expect(error.response.data).toEqual(expectedResult);
            }
        });
        it('should get stock history', async () => {
            try {
                const response = await axios.get(`${gatewayUrl}/stock/history/admin`, {
                    headers: {
                        Authorization: `Bearer ${adminAccessToken}`,
                    },
                });

                expect(response.status).toBe(HttpStatus.OK);
                expect(response.data.success).toBe(true);

                if (response.data.data !== undefined) {
                    expect(Array.isArray(response.data.data)).toBe(true);
                }
            } catch (error) {
                console.error(
                    'Error getting stock history:',
                    error.response?.data || error.message,
                );
                throw error;
            }
        });
        it('should not get stock history by user', async () => {
            try {
                await axios.get(`${gatewayUrl}/stock/history/admin`, {
                    headers: {
                        Authorization: `Bearer ${userAccessToken}`,
                    },
                });
                fail('Expected request to fail with 403 Forbidden');
            } catch (error) {
                expect(error.response).toBeDefined();
                expect(error.response.status).toBe(HttpStatus.FORBIDDEN);

                const expectedResult = {
                    message: 'Forbidden resource',
                    error: 'Forbidden',
                    statusCode: 403,
                };

                expect(error.response.data).toEqual(expectedResult);
            }
        });
    });

    describe('Get Order List', () => {
        it('should get list of orders', async () => {
            try {
                const response = await axios.get(`${gatewayUrl}/orders/all/admin`, {
                    headers: {
                        Authorization: `Bearer ${adminAccessToken}`,
                    },
                });

                expect(response.status).toBe(HttpStatus.OK);
                expect(response.data).toBeDefined();
                expect(response.data.success).toBeDefined();
                expect(response.data.success).toBe(true);

                // * If there are orders, verify the structure
                if (response.data.data && Array.isArray(response.data.data)) {
                    response.data.data.forEach((order) => {
                        expect(order).toHaveProperty('id');
                        expect(order).toHaveProperty('createdAt');
                        expect(order).toHaveProperty('updatedAt');
                        expect(order).toHaveProperty('customerId');
                        expect(order).toHaveProperty('goldGrams');
                        expect(order).toHaveProperty('amount');
                        expect(order).toHaveProperty('gramPrice');
                        expect(order).toHaveProperty('totalPrice');
                    });
                }
            } catch (error) {
                if (error.response) {
                    console.error('Error response:', {
                        status: error.response.status,
                        data: error.response.data,
                        headers: error.response.headers,
                    });
                } else if (error.request) {
                    console.error('No response received:', error.request);
                } else {
                    console.error('Error setting up request:', error.message);
                }
                throw error;
            }
        });
        it('should not get list of orders by user', async () => {
            const response = await axios
                .get(`${gatewayUrl}/orders/all/admin`, {
                    headers: {
                        Authorization: `Bearer ${userAccessToken}`,
                    },
                })
                .catch((error) => error.response);

            const expectedResult = {
                message: 'Forbidden resource',
                error: 'Forbidden',
                statusCode: 403,
            };

            expect(response.status).toBe(HttpStatus.FORBIDDEN);
            expect(response.data).toEqual(expectedResult);
        });
    });

    describe('Create Order', () => {
        it('should not create a new order on invalid product id', async () => {
            const createOrderDto = {
                productId: '00000000-0000-0000-0000-000000000000',
                amount: 1,
            };
            const response = await axios.post(`${gatewayUrl}/orders`, createOrderDto, {
                headers: {
                    Authorization: `Bearer ${adminAccessToken}`,
                },
            });

            const expectedResult = {
                success: false,
                error: {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Product not found',
                },
            };

            expect(response.status).toBe(HttpStatus.CREATED);
            expect(response.data).toEqual(expectedResult);
        });

        it('should not create a new order on insufficient stock', async () => {
            const createOrderDto = {
                productId: products.at(0).id,
                amount: 1000000,
            };
            const response = await axios.post(`${gatewayUrl}/orders`, createOrderDto, {
                headers: {
                    Authorization: `Bearer ${adminAccessToken}`,
                },
            });

            const expectedResult = {
                success: false,
                error: {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Insufficient stock',
                },
            };

            expect(response.status).toBe(HttpStatus.CREATED);
            expect(response.data).toEqual(expectedResult);
        });

        it('should create a new order', async () => {
            const createOrderDto = {
                productId: products.at(0).id,
                amount: 1,
            };
            const response = await axios.post(`${gatewayUrl}/orders`, createOrderDto, {
                headers: {
                    Authorization: `Bearer ${adminAccessToken}`,
                },
            });

            const expectedResult = {
                data: expect.any(Object),
                success: true,
            };

            expect(response.status).toBe(HttpStatus.CREATED);
            expect(response.data).toEqual(expectedResult);
        });
    });
});
