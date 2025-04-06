import { UserRoleEnum } from '@libs/shared';
import { Request } from 'express';

export interface JwtPayload {
    sub: string;
    username: string;
    email: string;
    role: UserRoleEnum;
    iat?: number;
    exp?: number;
}

export interface RequestWithUser extends Request {
    user: JwtPayload;
}
