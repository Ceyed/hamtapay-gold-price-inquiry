import { IsNotEmpty, IsString } from 'class-validator';
import { auth } from 'libs/shared/types/proto-types';

export class SendVerificationCodeDto implements auth.SendVerificationCodeInterface {
    @IsString()
    @IsNotEmpty()
    email: string;
}
