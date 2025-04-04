import { UserRepository, UserSignupDto } from '@lib/auth';
import { RedisHelperService, User } from '@lib/shared';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
    constructor(
        private readonly _userRepository: UserRepository,
        private readonly _redisHelperService: RedisHelperService,
    ) {}

    async signup(userSignupDto: UserSignupDto): Promise<User> {
        console.log(2);
        return {
            id: randomUUID(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            email: userSignupDto.email,
            username: userSignupDto.username,
            password: userSignupDto.password,
        };
    }
}
