import { UserSignupDto } from '@lib/auth';
import {
    UserSignupResponse,
    UsersServiceController,
    UsersServiceControllerMethods,
} from '@lib/shared';
import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller()
@UsersServiceControllerMethods()
export class AuthController implements UsersServiceController {
    constructor(private readonly _authService: AuthService) {}

    async signup(userSignupDto: UserSignupDto): Promise<UserSignupResponse> {
        return this._authService.signup(userSignupDto);
    }
}
