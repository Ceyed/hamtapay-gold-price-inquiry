import { order, uuid } from '@libs/shared';
import { OmitType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateOrderDto implements order.CreateOrderInterface {
    @IsString()
    @IsNotEmpty()
    customerId: uuid;

    @IsString()
    @IsNotEmpty()
    productId: uuid;

    @IsNumber()
    @Min(1)
    amount: number;
}

export class CreateOrderGatewayDto extends OmitType(CreateOrderDto, ['customerId']) {}
