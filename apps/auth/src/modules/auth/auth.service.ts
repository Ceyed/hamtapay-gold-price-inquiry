import { UserRepository } from '@lib/auth';
import { RedisHelperService } from '@lib/shared';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
    constructor(
        private readonly _userRepository: UserRepository,
        private readonly _redisHelperService: RedisHelperService,
    ) {}
}
