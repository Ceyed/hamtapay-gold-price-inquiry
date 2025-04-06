import { order } from '@libs/shared';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class StockInProductDto implements order.StockInProductInterface {
    @IsString()
    @IsNotEmpty()
    productId: string;

    @IsNumber()
    @IsNotEmpty()
    amount: number;
}
