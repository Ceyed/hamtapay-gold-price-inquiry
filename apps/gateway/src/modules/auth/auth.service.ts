import {
    AssignRoleDto,
    AUTH_SERVICE,
    RefreshTokenDto,
    SendVerificationCodeDto,
    SigninDto,
    SignupDto,
    VerifyAccountDto,
} from '@libs/auth';
import { auth, LoggerService, LogModuleEnum } from '@libs/shared';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService implements OnModuleInit {
    private _usersService: auth.UsersServiceClient;

    constructor(
        @Inject(AUTH_SERVICE) private readonly _grpcClient: ClientGrpc,
        private readonly _loggerService: LoggerService,
    ) {}

    onModuleInit() {
        this._usersService = this._grpcClient.getService<auth.UsersServiceClient>(
            auth.USERS_SERVICE_NAME,
        );
    }

    signup(userSignupDto: SignupDto): Observable<auth.SignupResponse> {
        this._loggerService.info(
            LogModuleEnum.Auth,
            `Signing up user: ${JSON.stringify(userSignupDto)}`,
        );
        return this._usersService.signup(userSignupDto);
    }

    verifyAccount(verifyAccountDto: VerifyAccountDto): Observable<auth.VerifyAccountResponse> {
        this._loggerService.info(
            LogModuleEnum.Auth,
            `Verifying account: ${JSON.stringify(verifyAccountDto)}`,
        );
        return this._usersService.verifyAccount(verifyAccountDto);
    }

    sendVerificationCode(
        sendVerificationCodeDto: SendVerificationCodeDto,
    ): Observable<auth.SendVerificationCodeResponse> {
        this._loggerService.info(
            LogModuleEnum.Auth,
            `Sending verification code: ${JSON.stringify(sendVerificationCodeDto)}`,
        );
        return this._usersService.sendVerificationCode(sendVerificationCodeDto);
    }

    signin(userSigninDto: SigninDto): Observable<auth.SigninResponse> {
        this._loggerService.info(
            LogModuleEnum.Auth,
            `Signing in user: ${JSON.stringify(userSigninDto)}`,
        );
        return this._usersService.signin(userSigninDto);
    }

    refreshToken(refreshTokenDto: RefreshTokenDto): Observable<auth.SigninResponse> {
        this._loggerService.info(
            LogModuleEnum.Auth,
            `Refreshing token: ${JSON.stringify(refreshTokenDto)}`,
        );
        return this._usersService.refreshToken(refreshTokenDto);
    }

    assignRole(assignRoleDto: AssignRoleDto): Observable<auth.AssignRoleResponse> {
        this._loggerService.info(
            LogModuleEnum.Auth,
            `Assigning role: ${JSON.stringify(assignRoleDto)}`,
        );
        return this._usersService.assignRole(assignRoleDto);
    }

    getUserList(): Observable<auth.GetUserListResponse> {
        this._loggerService.info(LogModuleEnum.Auth, `Getting user list`);
        return this._usersService.getUserList({});
    }
}
