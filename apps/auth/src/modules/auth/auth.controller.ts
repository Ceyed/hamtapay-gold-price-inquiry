import { AssignRoleDto, RefreshTokenDto, SigninDto, SignupDto } from '@libs/auth';
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

    async signin(userSigninDto: SigninDto): Promise<auth.SigninResponse> {
        return this._authService.signin(userSigninDto);
    }

    async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<auth.SigninResponse> {
        return this._authService.refreshTokens(refreshTokenDto);
    }

    async assignRole(assignRoleDto: AssignRoleDto): Promise<auth.AssignRoleResponse> {
        // TODO: Only admin can assign role
        return this._authService.assignRole(assignRoleDto);
    }

    async getUserList(): Promise<auth.GetUserListResponse> {
        return this._authService.getUserList();
    }
}
