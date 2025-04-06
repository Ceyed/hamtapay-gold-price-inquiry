import { GoldGramsEnum } from '@libs/pricing';
import { order, uuid } from '@libs/shared';
import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateOrderDto implements order.CreateOrderInterface {
    @IsString()
    @IsNotEmpty()
    customerId: uuid;

    @IsEnum(GoldGramsEnum)
    @IsNotEmpty()
    goldGrams: GoldGramsEnum;

    @IsNumber()
    @Min(1)
    amount: number;
}
