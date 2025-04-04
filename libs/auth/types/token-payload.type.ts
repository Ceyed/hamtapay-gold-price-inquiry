import { UserRoleEnum } from '@lib/shared';

export interface TokenPayload {
    sub: string;
    username: string;
    email: string;
    role: UserRoleEnum;
}
