import { UserSigninDto, UserSignupDto } from '@lib/auth';
import { SigninResponse, SignupResponse } from '@lib/shared';
import { Body, Controller, Post } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Controller('users')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    signup(@Body() userSignupDto: UserSignupDto): Observable<SignupResponse> {
        return this.authService.signup(userSignupDto);
    }

    @Post('signin')
    signin(@Body() userSigninDto: UserSigninDto): Observable<SigninResponse> {
        return this.authService.signin(userSigninDto);
    }
}
