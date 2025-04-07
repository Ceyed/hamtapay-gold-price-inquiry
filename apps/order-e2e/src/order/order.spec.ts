import { HttpStatus } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../../.env.test') });

describe('Order Service E2E Tests', () => {
    // TODO: default admin user on migration
    const adminUsername = 'test1744025128580';
    const adminPassword = 'Test@123456';
    let accessToken: string;

    const gatewayHost = process.env.GATEWAY_HOST;
    const gatewayPort = process.env.GATEWAY_PORT;
    const gatewayUrl = `http://${gatewayHost}:${gatewayPort}/api`;

    beforeAll(async () => {
        // TODO: Add health check for gateway
        // try {
        //     await axios.get(gatewayUrl);
        // } catch (error) {
        //     console.error(
        //         'Gateway service is not running. Please start it with: npx nx serve gateway --configuration=test',
        //     );
        //     throw error;
        // }

        try {
            const loginResponse = await axios.post(`${gatewayUrl}/users/signin`, {
                username: adminUsername,
                password: adminPassword,
            });
            accessToken = loginResponse.data.data.accessToken;
            console.log('Successfully authenticated with gateway');
        } catch (error) {
            console.error('Failed to authenticate with gateway. Please check:', error);
            throw error;
        }
    });

    describe('Order Management', () => {
        // describe('Create Order', () => {
        //     it('should create a new order', async () => {
        //         const createOrderDto = {
        //             products: [
        //                 {
        //                     productId: '1',
        //                     quantity: 2,
        //                 },
        //             ],
        //         };
        //         const response = await axios.post(`${gatewayUrl}/orders`, createOrderDto, {
        //             headers: {
        //                 Authorization: `Bearer ${accessToken}`,
        //             },
        //         });
        //         expect(response.status).toBe(HttpStatus.CREATED);
        //         expect(response.data.success).toBe(true);
        //         expect(response.data.data).toHaveProperty('orderId');
        //     });

        //     it('should fail to create order with invalid product', async () => {
        //         const createOrderDto = {
        //             products: [
        //                 {
        //                     productId: 'invalid-id',
        //                     quantity: 2,
        //                 },
        //             ],
        //         };
        //         const response = await axios.post(`${gatewayUrl}/orders`, createOrderDto, {
        //             headers: {
        //                 Authorization: `Bearer ${accessToken}`,
        //             },
        //         });
        //         expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        //         expect(response.data.success).toBe(false);
        //     });
        // });

        describe('Product Management', () => {
            describe('Get Product List', () => {
                it('should get list of products', async () => {
                    const response = await axios.get(`${gatewayUrl}/products/all`, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    });
                    const expectedResult = {
                        data: expect.any(Array),
                        success: true,
                    };

                    expect(response.status).toBe(HttpStatus.OK);
                    expect(response.data).toEqual(expectedResult);
                });
            });
            //     describe('Get Product List By Admin', () => {
            //         it('should get list of products with admin details', async () => {
            //             const response = await axios.get(`${gatewayUrl}/products/admin`, {
            //                 headers: {
            //                     Authorization: `Bearer ${accessToken}`,
            //                 },
            //             });
            //             expect(response.status).toBe(HttpStatus.OK);
            //             expect(response.data.success).toBe(true);
            //             expect(Array.isArray(response.data.data)).toBe(true);
            //         });
            //     });
            //     describe('Stock Management', () => {
            //         it('should add stock to product', async () => {
            //             const stockInProductDto = {
            //                 productId: '1',
            //                 quantity: 10,
            //             };
            //             const response = await axios.post(
            //                 `${gatewayUrl}/products/stock-in`,
            //                 stockInProductDto,
            //                 {
            //                     headers: {
            //                         Authorization: `Bearer ${accessToken}`,
            //                     },
            //                 },
            //             );
            //             expect(response.status).toBe(HttpStatus.CREATED);
            //             expect(response.data.success).toBe(true);
            //         });
            //         it('should get stock history', async () => {
            //             const response = await axios.get(`${gatewayUrl}/products/stock-history`, {
            //                 headers: {
            //                     Authorization: `Bearer ${accessToken}`,
            //                 },
            //             });
            //             expect(response.status).toBe(HttpStatus.OK);
            //             expect(response.data.success).toBe(true);
            //             expect(Array.isArray(response.data.data)).toBe(true);
            //         });
            //     });
        });

        describe('Get Order List', () => {
            it('should get list of orders', async () => {
                try {
                    const response = await axios.get(`${gatewayUrl}/orders/all/admin`, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    });

                    expect(response.status).toBe(HttpStatus.OK);
                    expect(response.data).toBeDefined();
                    expect(response.data.success).toBeDefined();
                    expect(response.data.success).toBe(true);

                    // TODO
                    // const r = {
                    //     success: true,
                    // };
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
        });
    });
});
