import { CreateOrderDto } from '@libs/order';
import { order } from '@libs/shared';
import { Controller } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller()
@order.OrderServiceControllerMethods()
export class OrderController implements order.OrderServiceController {
    constructor(private readonly _orderService: OrderService) {}

    async createOrder(createOrderDto: CreateOrderDto): Promise<order.CreateOrderResponse> {
        return this._orderService.createOrder(createOrderDto);
    }

    async getOrderList(): Promise<order.GetOrderListResponse> {
        return this._orderService.getOrderList();
    }
}
