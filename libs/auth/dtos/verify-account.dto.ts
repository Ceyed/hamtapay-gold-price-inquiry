import { IsNotEmpty, IsString } from 'class-validator';
import { auth } from 'libs/shared/types/proto-types';

export class VerifyAccountDto implements auth.VerifyAccountInterface {
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    code: string;
}
