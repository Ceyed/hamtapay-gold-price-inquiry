import { AssignRoleInterface, UserRoleEnum } from '@lib/shared';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class AssignRoleDto implements AssignRoleInterface {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsNotEmpty()
    @IsEnum(UserRoleEnum)
    role: UserRoleEnum;
}
