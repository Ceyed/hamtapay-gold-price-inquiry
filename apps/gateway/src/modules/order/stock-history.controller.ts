import { order, UserRoleEnum } from '@libs/shared';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Roles } from '../common/decorators';
import { JwtAuthGuard, RolesGuard } from '../common/guards';
import { OrderService } from './order.service';

@Controller('stock')
export class StockHistoryController {
    constructor(private readonly _orderService: OrderService) {}

    @Get('history/admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRoleEnum.Admin)
    getStockHistory(): Observable<order.GetStockHistoryResponse> {
        return this._orderService.getStockHistory();
    }
}
