import { CreateOrderDto, ORDER_SERVICE } from '@libs/order';
import { order } from '@libs/shared';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class OrderService implements OnModuleInit {
    private _orderService: order.OrderServiceClient;

    constructor(@Inject(ORDER_SERVICE) private readonly _grpcClient: ClientGrpc) {}

    onModuleInit() {
        this._orderService = this._grpcClient.getService<order.OrderServiceClient>(
            order.ORDER_SERVICE_NAME,
        );
    }

    createOrder(createOrderDto: CreateOrderDto): Observable<order.CreateOrderResponse> {
        return this._orderService.createOrder(createOrderDto);
    }

    getOrderList(): Observable<order.GetOrderListResponse> {
        return this._orderService.getOrderList({});
    }

    getProductList(): Observable<order.GetProductListResponse> {
        return this._orderService.getProductList({});
    }

    getProductListByAdmin(): Observable<order.GetProductListResponse> {
        return this._orderService.getProductListByAdmin({});
    }
}
