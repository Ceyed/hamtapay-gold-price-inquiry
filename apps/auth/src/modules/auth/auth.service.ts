import { UserRepository } from '@lib/auth';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
    constructor(private readonly _userRepository: UserRepository) {}
}
