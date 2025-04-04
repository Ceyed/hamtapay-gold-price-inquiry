import { UserSignupInterface } from '@lib/shared';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserSignupDto implements UserSignupInterface {
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    username: string;
}
