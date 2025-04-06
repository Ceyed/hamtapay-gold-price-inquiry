import { auth } from '@libs/shared';
import { IsNotEmpty, IsString } from 'class-validator';

export class SendVerificationCodeDto implements auth.SendVerificationCodeInterface {
    @IsString()
    @IsNotEmpty()
    email: string;
}
