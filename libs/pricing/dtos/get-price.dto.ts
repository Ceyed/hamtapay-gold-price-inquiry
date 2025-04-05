import { pricing } from '@libs/shared';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { GoldGramsEnum } from '../enums/gold-grams.enum';

export class GetPriceDto implements pricing.GetPriceInterface {
    @IsEnum(GoldGramsEnum)
    @IsNotEmpty()
    grams: GoldGramsEnum;

    @IsNumber()
    @IsNotEmpty()
    currentStock: number;

    @IsNumber()
    @IsNotEmpty()
    totalStock: number;
}
