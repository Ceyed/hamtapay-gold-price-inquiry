import { IsNotEmpty, IsString } from 'class-validator';
import { SendEmailConfirmationCodeInterface } from 'libs/shared/types/proto-types/notification';

export class SendEmailConfirmationCodeDto implements SendEmailConfirmationCodeInterface {
    @IsString()
    @IsNotEmpty()
    customerId: string;

    @IsString()
    @IsNotEmpty()
    confirmationCode: string;
}
