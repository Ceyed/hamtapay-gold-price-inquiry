import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { notification } from 'libs/shared/types/proto-types';

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
