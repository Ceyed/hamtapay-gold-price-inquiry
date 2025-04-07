import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { order } from 'libs/shared/types/proto-types';

export class StockInProductDto implements order.StockInProductInterface {
    @IsString()
    @IsNotEmpty()
    productId: string;

    @IsNumber()
    @IsNotEmpty()
    amount: number;
}
