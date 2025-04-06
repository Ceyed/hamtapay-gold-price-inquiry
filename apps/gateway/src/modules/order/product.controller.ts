import { order } from '@libs/shared';
import { Controller, Get } from '@nestjs/common';
import { Observable } from 'rxjs';
import { OrderService } from './order.service';

@Controller('products')
export class ProductsController {
    constructor(private readonly _orderService: OrderService) {}

    @Get('all/admin')
    getProductListByAdmin(): Observable<order.GetProductListResponse> {
        return this._orderService.getProductListByAdmin();
    }

    @Get('all')
    getProductList(): Observable<order.GetProductListResponse> {
        return this._orderService.getProductList();
    }
}
