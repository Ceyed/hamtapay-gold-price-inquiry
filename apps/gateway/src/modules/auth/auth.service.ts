import {
    AssignRoleDto,
    AUTH_SERVICE,
    RefreshTokenDto,
    SendVerificationCodeDto,
    SigninDto,
    SignupDto,
    VerifyAccountDto,
} from '@libs/auth';
import { auth } from '@libs/shared';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService implements OnModuleInit {
    private _usersService: auth.UsersServiceClient;

    constructor(@Inject(AUTH_SERVICE) private readonly _grpcClient: ClientGrpc) {}

    onModuleInit() {
        this._usersService = this._grpcClient.getService<auth.UsersServiceClient>(
            auth.USERS_SERVICE_NAME,
        );
    }

    signup(userSignupDto: SignupDto): Observable<auth.SignupResponse> {
        return this._usersService.signup(userSignupDto);
    }

    verifyAccount(verifyAccountDto: VerifyAccountDto): Observable<auth.VerifyAccountResponse> {
        return this._usersService.verifyAccount(verifyAccountDto);
    }

    sendVerificationCode(
        sendVerificationCodeDto: SendVerificationCodeDto,
    ): Observable<auth.SendVerificationCodeResponse> {
        return this._usersService.sendVerificationCode(sendVerificationCodeDto);
    }
    signin(userSigninDto: SigninDto): Observable<auth.SigninResponse> {
        return this._usersService.signin(userSigninDto);
    }

    refreshToken(refreshTokenDto: RefreshTokenDto): Observable<auth.SigninResponse> {
        return this._usersService.refreshToken(refreshTokenDto);
    }

    assignRole(assignRoleDto: AssignRoleDto): Observable<auth.AssignRoleResponse> {
        return this._usersService.assignRole(assignRoleDto);
    }

    getUserList(): Observable<auth.GetUserListResponse> {
        return this._usersService.getUserList({});
    }
}
