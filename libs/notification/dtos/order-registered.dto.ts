import { notification } from '@libs/shared';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class OrderRegisteredDto implements notification.OrderRegisteredInterface {
    @IsString()
    @IsNotEmpty()
    orderId: string;

    @IsNumber()
    @IsNotEmpty()
    newStock: number;

    @IsNumber()
    @IsNotEmpty()
    totalStock: number;
}
