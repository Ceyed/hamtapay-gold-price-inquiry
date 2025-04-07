import { UserRoleEnum } from './../../shared/enums/user-role.enum';

export interface TokenPayload {
    sub: string;
    username: string;
    email: string;
    role: UserRoleEnum;
}
