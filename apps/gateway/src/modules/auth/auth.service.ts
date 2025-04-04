import { AUTH_SERVICE, UserSignupDto } from '@lib/auth';
import { USERS_SERVICE_NAME, UserSignupResponse, UsersServiceClient } from '@lib/shared';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService implements OnModuleInit {
    private usersService: UsersServiceClient;

    constructor(@Inject(AUTH_SERVICE) private client: ClientGrpc) {}

    onModuleInit() {
        this.usersService = this.client.getService<UsersServiceClient>(USERS_SERVICE_NAME);
    }

    signup(userSignupDto: UserSignupDto): Observable<UserSignupResponse> {
        return this.usersService.signup(userSignupDto);
    }
}
