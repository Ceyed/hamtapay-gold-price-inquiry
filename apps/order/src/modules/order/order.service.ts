import { NOTIFICATION_SERVICE } from '@libs/notification';
import {
    CreateOrderDto,
    OrderEntity,
    OrderRepository,
    ProductEntity,
    ProductRepository,
    StockHistoryEntity,
    StockHistoryRepository,
    StockInProductDto,
} from '@libs/order';
import { GoldGramsEnum, PRICING_SERVICE } from '@libs/pricing';
import {
    findUserById,
    GetInvoiceRedisKey,
    LoggerService,
    LogModuleEnum,
    notification,
    order,
    pricing,
    RedisHelperService,
    RedisPrefixesEnum,
    RedisProjectEnum,
    UserType,
} from '@libs/shared';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { catchError, firstValueFrom, Observable, of } from 'rxjs';
import { timeout } from 'rxjs/operators';

@Injectable()
export class OrderService {
    private _pricingService: pricing.PricingServiceClient;
    private _notificationService: notification.NotificationServiceClient;
    private readonly _timeout: number = 2000;

    constructor(
        @Inject(PRICING_SERVICE) private readonly _pricingGrpcClient: ClientGrpc,
        @Inject(NOTIFICATION_SERVICE) private readonly _notificationGrpcClient: ClientGrpc,
        private readonly _redisHelperService: RedisHelperService,
        private readonly _orderRepository: OrderRepository,
        private readonly _productRepository: ProductRepository,
        private readonly _stockHistoryRepository: StockHistoryRepository,
        private readonly _loggerService: LoggerService,
    ) {}

    onModuleInit() {
        this._pricingService = this._pricingGrpcClient.getService<pricing.PricingServiceClient>(
            pricing.PRICING_SERVICE_NAME,
        );
        this._notificationService =
            this._notificationGrpcClient.getService<notification.NotificationServiceClient>(
                notification.NOTIFICATION_SERVICE_NAME,
            );

        this.getProductList().then((r) => console.log(r));
    }

    async createOrder(createOrderDto: CreateOrderDto): Promise<order.CreateOrderResponse> {
        this._loggerService.info(
            LogModuleEnum.Order,
            `Creating order ${JSON.stringify(createOrderDto)}`,
        );

        const validationResult: order.CreateOrderResponse | undefined =
            await this._createOrderValidation(createOrderDto);
        if (validationResult) {
            return validationResult;
        }

        const { customerId, productId, amount } = createOrderDto;
        const product: ProductEntity = await this._productRepository.findById(productId);
        const gramPrice: number = await this._getGramGoldPrice(product.goldGrams);
        if (!gramPrice) {
            return {
                data: null,
                success: false,
                error: {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Gold price not found',
                },
            };
        }
        const price: number = gramPrice * amount;
        const order: OrderEntity = await this._orderRepository.registerOrderTransaction(
            customerId,
            product,
            amount,
            price,
        );
        if (!order) {
            this._loggerService.error(
                LogModuleEnum.Order,
                `Something went wrong while registering order transaction: ${JSON.stringify(
                    createOrderDto,
                )}`,
            );
            return {
                data: null,
                success: false,
                error: {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Order not registered',
                },
            };
        }

        const orderType: order.OrderProtoType = this._mapOrderToOrderType(order);
        const orderRedisKey: string = GetInvoiceRedisKey(this._redisHelperService, order.id);
        await this._redisHelperService.setCache(orderRedisKey, orderType);

        // * Send notification to customer (And Admins if needed)
        try {
            const notificationResponse = this._notificationService
                .orderRegistered({
                    orderId: order.id,
                    newStock: order.product.currentStock,
                    totalStock: order.product.totalStock,
                })
                .pipe(
                    timeout(this._timeout),
                    catchError((error) => {
                        console.error('Failed to send notification:', error);
                        return of(undefined);
                    }),
                );
            await firstValueFrom(notificationResponse);
        } catch (error) {
            console.error('Error sending order notification:', error);
        }

        return {
            data: orderType,
            success: true,
            error: null,
        };
    }

    async getOrderList(): Promise<order.GetOrderListResponse> {
        this._loggerService.info(LogModuleEnum.Order, 'Getting order list');

        const pattern = this._getCacheKeyForAllOrders();
        const keys = await this._redisHelperService.getKeysByPattern(pattern);

        if (keys?.length) {
            const orders: order.OrderProtoType[] = await Promise.all(
                keys.map(async (key) => {
                    return this._redisHelperService.getCache(key);
                }),
            );
            return {
                data: orders,
                success: true,
                error: null,
            };
        }

        // * If no orders in Redis, get from DB and cache them (if exists)
        const orders: OrderEntity[] = await this._orderRepository.findAll();
        if (orders?.length) {
            await this._saveAllOrdersToRedis(orders);
        }
        return {
            data: orders.map((order) => this._mapOrderToOrderType(order)),
            success: true,
            error: null,
        };
    }

    async getProductList(): Promise<order.GetProductListResponse> {
        this._loggerService.info(LogModuleEnum.Order, 'Getting product list');

        const products: ProductEntity[] = await this._productRepository.findAll();
        let prices: pricing.PricingGoldPriceDataProtoType | undefined;

        // * Getting raw prices from pricing app
        try {
            const response: Observable<pricing.GetRawPricesResponse> = this._pricingService
                .getRawPrices({})
                .pipe(
                    timeout(this._timeout),
                    catchError(() => of(undefined)),
                );
            const res: pricing.GetRawPricesResponse = await firstValueFrom(response);
            this._loggerService.debug(
                LogModuleEnum.Pricing,
                `Market data received, ${JSON.stringify(res.data)}`,
            );
            prices = res.data;
        } catch {
            prices = undefined;
        }
        if (!prices) {
            this._loggerService.error(
                LogModuleEnum.Pricing,
                'Gold price data unavailable after timeout',
            );
            return {
                data: null,
                success: false,
                error: {
                    statusCode: HttpStatus.SERVICE_UNAVAILABLE,
                    message: 'Gold price data unavailable after timeout',
                },
            };
        }

        return {
            data: products.map((product) => this._mapProductToProductType(product, prices)),
            success: true,
            error: null,
        };
    }

    async getProductListByAdmin(): Promise<order.GetProductListResponse> {
        this._loggerService.info(LogModuleEnum.Order, 'Getting product list by admin');

        const products: ProductEntity[] = await this._productRepository.findAll(true);
        return {
            data: products.map((product) => this._mapProductToProductTypeByAdmin(product)),
            success: true,
            error: null,
        };
    }

    async stockInProduct(
        stockInProductDto: StockInProductDto,
    ): Promise<order.StockInProductResponse> {
        this._loggerService.info(
            LogModuleEnum.Order,
            `Stocking in product ${JSON.stringify(stockInProductDto)}`,
        );

        const product: ProductEntity = await this._productRepository.findById(
            stockInProductDto.productId,
        );
        if (!product) {
            return {
                data: null,
                success: false,
                error: {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Product not found',
                },
            };
        }
        product.currentStock += stockInProductDto.amount;
        product.totalStock += stockInProductDto.amount;
        await this._productRepository.save(product);
        return {
            data: this._mapProductToProductType(product),
            success: true,
            error: null,
        };
    }

    async getStockHistory(): Promise<order.GetStockHistoryResponse> {
        this._loggerService.info(LogModuleEnum.Order, 'Getting stock history');

        const stockHistories: StockHistoryEntity[] = await this._stockHistoryRepository.findAll();
        return {
            data: stockHistories.map((history) =>
                this._mapStockHistoryToStockHistoryType(history, true),
            ),
            success: true,
            error: null,
        };
    }

    private _mapProductToProductType(
        product: ProductEntity,
        prices?: pricing.PricingGoldPriceDataProtoType,
    ): order.ProductProtoType {
        return {
            id: product.id,
            createdAt: product.createdAt.toISOString(),
            updatedAt: product.updatedAt.toISOString(),
            goldGrams: product.goldGrams,
            currentStock: product.currentStock,
            totalStock: product.totalStock,
            orders: [],
            stockHistories: [],
            ...(prices && { rawPrice: prices[`priceGram${product.goldGrams}`] }),
        };
    }

    private _mapProductToProductTypeByAdmin(product: ProductEntity): order.ProductProtoType {
        const orders: order.OrderProtoType[] = product.orders?.length
            ? product.orders.map((order) => {
                  order.product = product;
                  return this._mapOrderToOrderType(order);
              })
            : [];
        const stockHistories: order.StockHistoryProtoType[] = product.stockHistories?.length
            ? product.stockHistories.map((history) =>
                  this._mapStockHistoryToStockHistoryType(history),
              )
            : [];
        return {
            id: product.id,
            createdAt: product.createdAt.toISOString(),
            updatedAt: product.updatedAt.toISOString(),
            goldGrams: product.goldGrams,
            currentStock: product.currentStock,
            totalStock: product.totalStock,
            orders,
            stockHistories,
        };
    }

    private async _saveAllOrdersToRedis(orders: OrderEntity[]): Promise<void> {
        this._loggerService.info(LogModuleEnum.Order, `Saving all orders to Redis`);

        for (const order of orders) {
            const orderType: order.OrderProtoType = this._mapOrderToOrderType(order);
            const orderRedisKey: string = GetInvoiceRedisKey(this._redisHelperService, order.id);
            await this._redisHelperService.setCache(orderRedisKey, orderType);
        }
    }

    private _getCacheKeyForAllOrders(): string {
        return this._redisHelperService.getPatternKey(
            RedisProjectEnum.Order,
            RedisPrefixesEnum.Invoice,
        );
    }

    private _mapStockHistoryToStockHistoryType(
        stockHistory: StockHistoryEntity,
        addProduct = false,
    ): order.StockHistoryProtoType {
        return {
            id: stockHistory.id,
            createdAt: stockHistory.createdAt.toISOString(),
            updatedAt: stockHistory.updatedAt.toISOString(),
            type: stockHistory.type,
            amount: stockHistory.amount,
            productId: stockHistory.productId,
            product: addProduct ? this._mapProductToProductType(stockHistory.product) : null,
        };
    }

    private async _createOrderValidation({
        customerId,
        productId,
        amount,
    }: CreateOrderDto): Promise<order.CreateOrderResponse | undefined> {
        const customer: UserType = await findUserById(this._redisHelperService, customerId);
        if (!customer) {
            return {
                data: null,
                success: false,
                error: {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Customer not found',
                },
            };
        }

        // TODO: Read from redis
        const product: ProductEntity = await this._productRepository.findById(productId);
        if (!product) {
            return {
                data: null,
                success: false,
                error: {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Product not found',
                },
            };
        }
        if (amount > product.currentStock) {
            return {
                data: null,
                success: false,
                error: {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Insufficient stock',
                },
            };
        }
    }

    private _mapOrderToOrderType(order: OrderEntity): order.OrderProtoType {
        return {
            id: order.id,
            createdAt:
                typeof order.createdAt === 'string'
                    ? order.createdAt
                    : order.createdAt.toISOString(),
            updatedAt:
                typeof order.updatedAt === 'string'
                    ? order.updatedAt
                    : order.updatedAt.toISOString(),
            customerId: order.customerId,
            goldGrams: order.product.goldGrams,
            amount: order.amount,
            gramPrice: order.price / order.amount,
            totalPrice: order.price,
        };
    }

    private async _getGramGoldPrice(goldGrams: GoldGramsEnum): Promise<number> {
        try {
            const response: Observable<pricing.CalculatePriceResponse> = this._pricingService
                .calculatePrice({ grams: goldGrams, currentStock: 0, totalStock: 0 })
                .pipe(
                    timeout(this._timeout),
                    catchError(() => of(undefined)),
                );
            const res: pricing.CalculatePriceResponse = await firstValueFrom(response);
            this._loggerService.debug(
                LogModuleEnum.Order,
                `Gram gold price ${JSON.stringify({
                    goldGrams,
                    price: res?.data,
                })}`,
            );
            return res?.data as number;
        } catch {
            return undefined;
        }
    }
}
