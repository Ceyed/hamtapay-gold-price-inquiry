import { GoldGramsEnum } from '@libs/pricing';
import { order, uuid } from '@libs/shared';
import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateInvoiceDto implements order.CreateInvoiceInterface {
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
