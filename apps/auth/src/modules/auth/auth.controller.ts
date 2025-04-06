import {
    AssignRoleDto,
    RefreshTokenDto,
    SendVerificationCodeDto,
    SigninDto,
    SignupDto,
    VerifyAccountDto,
} from '@libs/auth';
import { auth } from '@libs/shared';
import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller()
@auth.UsersServiceControllerMethods()
export class AuthController implements auth.UsersServiceController {
    constructor(private readonly _authService: AuthService) {}

    async signup(userSignupDto: SignupDto): Promise<auth.SignupResponse> {
        return this._authService.signup(userSignupDto);
    }

    async verifyAccount(verifyAccountDto: VerifyAccountDto): Promise<auth.VerifyAccountResponse> {
        return this._authService.verifyAccount(verifyAccountDto);
    }

    async sendVerificationCode(
        sendVerificationCodeDto: SendVerificationCodeDto,
    ): Promise<auth.SendVerificationCodeResponse> {
        return this._authService.sendVerificationCode(sendVerificationCodeDto);
    }

    async signin(userSigninDto: SigninDto): Promise<auth.SigninResponse> {
        return this._authService.signin(userSigninDto);
    }

    async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<auth.SigninResponse> {
        return this._authService.refreshTokens(refreshTokenDto);
    }

    async assignRole(assignRoleDto: AssignRoleDto): Promise<auth.AssignRoleResponse> {
        return this._authService.assignRole(assignRoleDto);
    }

    async getUserList(): Promise<auth.GetUserListResponse> {
        return this._authService.getUserList();
    }
}
