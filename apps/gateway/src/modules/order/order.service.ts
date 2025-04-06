import { CreateOrderDto, ORDER_SERVICE, StockInProductDto } from '@libs/order';
import { LoggerService, LogModuleEnum, order } from '@libs/shared';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class OrderService implements OnModuleInit {
    private _orderService: order.OrderServiceClient;

    constructor(
        @Inject(ORDER_SERVICE) private readonly _grpcClient: ClientGrpc,
        private readonly _loggerService: LoggerService,
    ) {}

    onModuleInit() {
        this._orderService = this._grpcClient.getService<order.OrderServiceClient>(
            order.ORDER_SERVICE_NAME,
        );
    }

    createOrder(createOrderDto: CreateOrderDto): Observable<order.CreateOrderResponse> {
        this._loggerService.info(
            LogModuleEnum.Order,
            `Creating order ${JSON.stringify(createOrderDto)}`,
        );
        return this._orderService.createOrder(createOrderDto);
    }

    getOrderList(): Observable<order.GetOrderListResponse> {
        this._loggerService.info(LogModuleEnum.Order, `Getting order list`);
        return this._orderService.getOrderList({});
    }

    getProductList(): Observable<order.GetProductListResponse> {
        this._loggerService.info(LogModuleEnum.Order, `Getting product list`);
        return this._orderService.getProductList({});
    }

    stockInProduct(stockInProductDto: StockInProductDto): Observable<order.StockInProductResponse> {
        this._loggerService.info(
            LogModuleEnum.Order,
            `Stocking in product ${JSON.stringify(stockInProductDto)}`,
        );
        return this._orderService.stockInProduct(stockInProductDto);
    }

    getProductListByAdmin(): Observable<order.GetProductListResponse> {
        this._loggerService.info(LogModuleEnum.Order, `Getting product list by admin`);
        return this._orderService.getProductListByAdmin({});
    }

    getStockHistory(): Observable<order.GetStockHistoryResponse> {
        this._loggerService.info(LogModuleEnum.Order, `Getting stock history`);
        return this._orderService.getStockHistory({});
    }
}
