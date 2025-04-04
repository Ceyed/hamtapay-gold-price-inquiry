import { AssignRoleDto, AUTH_SERVICE, RefreshTokenDto, SigninDto, SignupDto } from '@lib/auth';
import {
    AssignRoleResponse,
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

    signup(userSignupDto: SignupDto): Observable<SignupResponse> {
        return this.usersService.signup(userSignupDto);
    }

    signin(userSigninDto: SigninDto): Observable<SigninResponse> {
        return this.usersService.signin(userSigninDto);
    }

    refreshToken(refreshTokenDto: RefreshTokenDto): Observable<SigninResponse> {
        return this.usersService.refreshToken(refreshTokenDto);
    }

    assignRole(assignRoleDto: AssignRoleDto): Observable<AssignRoleResponse> {
        return this.usersService.assignRole(assignRoleDto);
    }
}
