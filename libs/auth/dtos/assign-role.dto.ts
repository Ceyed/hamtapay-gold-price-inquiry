import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { auth } from 'libs/shared/types/proto-types';
import { UserRoleEnum } from './../../shared/enums/user-role.enum';

export class AssignRoleDto implements auth.AssignRoleInterface {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsNotEmpty()
    @IsEnum(UserRoleEnum)
    role: UserRoleEnum;
}
