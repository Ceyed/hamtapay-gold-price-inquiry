import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { auth } from 'libs/shared/types/proto-types';

export class SignupDto implements auth.SignupInterface {
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

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
