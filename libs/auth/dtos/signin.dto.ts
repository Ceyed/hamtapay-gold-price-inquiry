import { IsNotEmpty, IsString } from 'class-validator';
import { auth } from 'libs/shared/types/proto-types';

export class SigninDto implements auth.SigninInterface {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
