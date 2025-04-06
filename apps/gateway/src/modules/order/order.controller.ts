import { CreateOrderDto } from '@libs/order';
import { order } from '@libs/shared';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { Observable } from 'rxjs';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
    constructor(private readonly _orderService: OrderService) {}

    @Post('')
    createOrder(@Body() createOrderDto: CreateOrderDto): Observable<order.CreateOrderResponse> {
        return this._orderService.createOrder(createOrderDto);
    }

    @Get('all')
    getOrderList(): Observable<order.GetOrderListResponse> {
        return this._orderService.getOrderList();
    }
}
