import { OmitType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { order } from 'libs/shared/types/proto-types';
import { uuid } from './../../shared/types/uuid.type';

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
