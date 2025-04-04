import { AssignRoleDto, AUTH_SERVICE, RefreshTokenDto, SigninDto, SignupDto } from '@lib/auth';
import {
    AssignRoleResponse,
    GetUserListResponse,
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
    private _usersService: UsersServiceClient;

    constructor(@Inject(AUTH_SERVICE) private readonly _grpcClient: ClientGrpc) {}

    onModuleInit() {
        this._usersService = this._grpcClient.getService<UsersServiceClient>(USERS_SERVICE_NAME);
    }

    signup(userSignupDto: SignupDto): Observable<SignupResponse> {
        return this._usersService.signup(userSignupDto);
    }

    signin(userSigninDto: SigninDto): Observable<SigninResponse> {
        return this._usersService.signin(userSigninDto);
    }

    refreshToken(refreshTokenDto: RefreshTokenDto): Observable<SigninResponse> {
        return this._usersService.refreshToken(refreshTokenDto);
    }

    assignRole(assignRoleDto: AssignRoleDto): Observable<AssignRoleResponse> {
        return this._usersService.assignRole(assignRoleDto);
    }

    getUserList(): Observable<GetUserListResponse> {
        return this._usersService.getUserList({});
    }
}
