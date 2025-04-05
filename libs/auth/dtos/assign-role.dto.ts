import { auth, UserRoleEnum } from '@libs/shared';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class AssignRoleDto implements auth.AssignRoleInterface {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsNotEmpty()
    @IsEnum(UserRoleEnum)
    role: UserRoleEnum;
}
