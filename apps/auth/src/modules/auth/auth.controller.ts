import { UserSigninDto, UserSignupDto } from '@lib/auth';
import {
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

    async signup(userSignupDto: UserSignupDto): Promise<SignupResponse> {
        return this._authService.signup(userSignupDto);
    }

    async signin(userSigninDto: UserSigninDto): Promise<SigninResponse> {
        return this._authService.signin(userSigninDto);
    }
}
