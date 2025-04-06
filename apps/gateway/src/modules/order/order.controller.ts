import { CreateOrderGatewayDto } from '@libs/order';
import { order, UserRoleEnum } from '@libs/shared';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Roles } from '../common/decorators';
import { JwtAuthGuard, RolesGuard } from '../common/guards';
import { RequestWithUser } from '../common/types';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
    constructor(private readonly _orderService: OrderService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    createOrder(
        @Body() createOrderGatewayDto: CreateOrderGatewayDto,
        @Req() request: RequestWithUser,
    ): Observable<order.CreateOrderResponse> {
        return this._orderService.createOrder({
            ...createOrderGatewayDto,
            customerId: request.user.sub,
        });
    }

    @Get('all/admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRoleEnum.Admin)
    getOrderList(): Observable<order.GetOrderListResponse> {
        return this._orderService.getOrderList();
    }
}
