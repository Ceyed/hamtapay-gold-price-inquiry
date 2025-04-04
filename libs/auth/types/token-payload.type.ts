import { UserRoleEnum } from '@lib/shared';

export interface TokenPayload {
    id: string;
    username: string;
    email: string;
    role: UserRoleEnum;
}
