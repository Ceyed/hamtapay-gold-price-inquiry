import { AssignRoleDto, RefreshTokenDto, SigninDto, SignupDto } from '@lib/auth';
import {
    AssignRoleResponse,
    GetUserListResponse,
    SigninResponse,
    SignupResponse,
    UsersServiceController,
    UsersServiceControllerMethods,
} from '@lib/shared';
import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller()
@UsersServiceControllerMethods()
export class AuthController implements UsersServiceController {
    constructor(private readonly _authService: AuthService) {}

    async signup(userSignupDto: SignupDto): Promise<SignupResponse> {
        return this._authService.signup(userSignupDto);
    }

    async signin(userSigninDto: SigninDto): Promise<SigninResponse> {
        return this._authService.signin(userSigninDto);
    }

    async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<SigninResponse> {
        return this._authService.refreshTokens(refreshTokenDto);
    }

    async assignRole(assignRoleDto: AssignRoleDto): Promise<AssignRoleResponse> {
        // TODO: Only admin can assign role
        return this._authService.assignRole(assignRoleDto);
    }

    async getUserList(): Promise<GetUserListResponse> {
        return this._authService.getUserList();
    }
}
