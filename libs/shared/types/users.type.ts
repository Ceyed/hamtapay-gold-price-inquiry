import { UserRoleEnum } from '../enums/user-role.enum';

export type UserType = {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    role: UserRoleEnum;
    createdAt: string;
    updatedAt: string;
};
