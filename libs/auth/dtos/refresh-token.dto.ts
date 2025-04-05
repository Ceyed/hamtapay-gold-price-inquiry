import { auth } from '@libs/shared';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto implements auth.RefreshTokenInterface {
    @IsString()
    @IsNotEmpty()
    refreshToken: string;
}
