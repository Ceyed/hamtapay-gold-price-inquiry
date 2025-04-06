import { auth } from '@libs/shared';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyAccountDto implements auth.VerifyAccountInterface {
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    code: string;
}
