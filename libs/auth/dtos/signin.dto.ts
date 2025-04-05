import { auth } from '@libs/shared';
import { IsNotEmpty, IsString } from 'class-validator';

export class SigninDto implements auth.SigninInterface {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
