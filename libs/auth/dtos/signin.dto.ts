import { SigninInterface } from '@lib/shared';
import { IsNotEmpty, IsString } from 'class-validator';

export class SigninDto implements SigninInterface {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
