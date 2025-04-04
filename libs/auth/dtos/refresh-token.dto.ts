import { RefreshTokenInterface } from '@lib/shared';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto implements RefreshTokenInterface {
    @IsString()
    @IsNotEmpty()
    refreshToken: string;
}
