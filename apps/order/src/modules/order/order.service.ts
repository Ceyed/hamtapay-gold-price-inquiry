import { NOTIFICATION_SERVICE } from '@libs/notification';
import {
    CreateOrderDto,
    OrderEntity,
    OrderRepository,
    ProductEntity,
    ProductRepository,
    StockHistoryEntity,
    StockHistoryRepository,
} from '@libs/order';
import { GoldGramsEnum, PRICING_SERVICE } from '@libs/pricing';
import {
    findUserById,
    GetInvoiceRedisKey,
    notification,
    order,
    pricing,
    RedisHelperService,
    RedisPrefixesEnum,
    RedisProjectEnum,
    UserType,
} from '@libs/shared';
import { Inject, Injectable } from '@nestjs/common';
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
    ) {}

    onModuleInit() {
        this._pricingService = this._pricingGrpcClient.getService<pricing.PricingServiceClient>(
            pricing.PRICING_SERVICE_NAME,
        );
        this._notificationService =
            this._notificationGrpcClient.getService<notification.NotificationServiceClient>(
                notification.NOTIFICATION_SERVICE_NAME,
            );
    }

    async createOrder(createOrderDto: CreateOrderDto): Promise<order.CreateOrderResponse> {
        const validationResult: order.CreateOrderResponse | undefined =
            await this._createOrderValidation(createOrderDto);
        if (validationResult) {
            return validationResult;
        }

        const { customerId, goldGrams, amount } = createOrderDto;
        const gramPrice: number = await this._getGramGoldPrice(goldGrams);
        if (!gramPrice) {
            return {
                data: null,
                success: false,
                error: {
                    statusCode: 404,
                    message: 'Gold price not found',
                },
            };
        }
        const price: number = gramPrice * amount;
        const order: OrderEntity = await this._orderRepository.registerOrderTransaction(
            customerId,
            goldGrams,
            amount,
            price,
        );
        if (!order) {
            return {
                data: null,
                success: false,
                error: {
                    statusCode: 500,
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
        const products: ProductEntity[] = await this._productRepository.findAll();
        return {
            data: products.map(this._mapProductToProductType),
            success: true,
            error: null,
        };
    }

    async getProductListByAdmin(): Promise<order.GetProductListResponse> {
        const products: ProductEntity[] = await this._productRepository.findAll(true);
        return {
            data: products.map((product) => this._mapProductToProductTypeByAdmin(product)),
            success: true,
            error: null,
        };
    }

    private _mapProductToProductType(product: ProductEntity): order.ProductProtoType {
        return {
            id: product.id,
            createdAt: product.createdAt.toISOString(),
            updatedAt: product.updatedAt.toISOString(),
            goldGrams: product.goldGrams,
            currentStock: product.currentStock,
            totalStock: product.totalStock,
            orders: [],
            stockHistories: [],
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
    ): order.StockHistoryProtoType {
        return {
            id: stockHistory.id,
            createdAt: stockHistory.createdAt.toISOString(),
            updatedAt: stockHistory.updatedAt.toISOString(),
            type: stockHistory.type,
            amount: stockHistory.amount,
            productId: stockHistory.productId,
            product: null,
        };
    }

    private async _createOrderValidation({
        customerId,
        goldGrams,
        amount,
    }: CreateOrderDto): Promise<order.CreateOrderResponse | undefined> {
        const customer: UserType = await findUserById(this._redisHelperService, customerId);
        if (!customer) {
            return {
                data: null,
                success: false,
                error: {
                    statusCode: 404,
                    message: 'Customer not found',
                },
            };
        }

        // TODO: Read from redis
        const product: ProductEntity = await this._productRepository.findByGoldGrams(goldGrams);
        if (!product) {
            return {
                data: null,
                success: false,
                error: {
                    statusCode: 404,
                    message: 'Product not found',
                },
            };
        }
        if (amount > product.currentStock) {
            return {
                data: null,
                success: false,
                error: {
                    statusCode: 404,
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
            return res?.data as number;
        } catch {
            return undefined;
        }
    }
}
