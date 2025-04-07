import { UserRoleEnum } from '../enums';
import { UserStatusEnum } from './../../auth/enums/user-status.enum';

export const DEFAULT_USERS = [
    {
        id: '34f1aa47-5275-4e9b-8db4-4a1339fabedd',
        email: 'admin@admin.com',
        password: '$2b$10$EtDqMrr3buqpXAo2jIjhbuI5N7dQDDIhdmmDr58o9aGYvuKFtxwCK', // * 123
        rawPassword: '123',
        firstName: 'Admin',
        lastName: 'Admin',
        username: 'admin',
        role: UserRoleEnum.Admin,
        status: UserStatusEnum.Verified,
    },
    {
        id: 'ef41444f-3451-45b4-b1bb-77ce0217ccd1',
        email: 'user@user.com',
        password: '$2b$10$N4Fl9asIL509IhkyZB2J5OPhrRREZY/5PiF/aVw.B.RJqNU/YqmcS', // * 123
        rawPassword: '123',
        firstName: 'User',
        lastName: 'User',
        username: 'user',
        role: UserRoleEnum.User,
        status: UserStatusEnum.Verified,
    },
];
