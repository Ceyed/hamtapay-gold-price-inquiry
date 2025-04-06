import { order, UserRoleEnum } from '@libs/shared';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Roles } from '../common/decorators';
import { JwtAuthGuard, RolesGuard } from '../common/guards';
import { OrderService } from './order.service';

@Controller('products')
export class ProductsController {
    constructor(private readonly _orderService: OrderService) {}

    @Get('all/admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRoleEnum.Admin)
    getProductListByAdmin(): Observable<order.GetProductListResponse> {
        return this._orderService.getProductListByAdmin();
    }

    @Get('all')
    getProductList(): Observable<order.GetProductListResponse> {
        return this._orderService.getProductList();
    }
}
