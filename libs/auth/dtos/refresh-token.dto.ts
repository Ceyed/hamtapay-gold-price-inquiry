import { IsNotEmpty, IsString } from 'class-validator';
import { auth } from 'libs/shared/types/proto-types';

export class RefreshTokenDto implements auth.RefreshTokenInterface {
    @IsString()
    @IsNotEmpty()
    refreshToken: string;
}
