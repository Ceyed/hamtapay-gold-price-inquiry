import { UserSigninInterface, UserSignupInterface } from '@lib/shared';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UserSignupDto implements UserSignupInterface {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(20)
    username: string;
}

export class UserSigninDto implements UserSigninInterface {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
