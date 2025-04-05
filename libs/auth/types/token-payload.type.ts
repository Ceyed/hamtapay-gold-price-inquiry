import { UserRoleEnum } from '@libs/shared';

export interface TokenPayload {
    sub: string;
    username: string;
    email: string;
    role: UserRoleEnum;
}
