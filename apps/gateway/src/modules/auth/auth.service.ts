import { AUTH_SERVICE, UserSigninDto, UserSignupDto } from '@lib/auth';
import {
    SigninResponse,
    SignupResponse,
    USERS_SERVICE_NAME,
    UsersServiceClient,
} from '@lib/shared';
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

    signup(userSignupDto: UserSignupDto): Observable<SignupResponse> {
        return this.usersService.signup(userSignupDto);
    }

    signin(userSigninDto: UserSigninDto): Observable<SigninResponse> {
        return this.usersService.signin(userSigninDto);
    }
}
