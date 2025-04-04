import { SigninResponse, SignupResponse } from '@lib/shared';
import { Body, Controller, Post } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { RefreshTokenDto, SigninDto } from '@lib/auth';
import { SignupDto } from '@lib/auth';

@Controller('users')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    signup(@Body() userSignupDto: SignupDto): Observable<SignupResponse> {
        return this.authService.signup(userSignupDto);
    }

    @Post('signin')
    signin(@Body() userSigninDto: SigninDto): Observable<SigninResponse> {
        return this.authService.signin(userSigninDto);
    }

    @Post('refresh-token')
    refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Observable<SigninResponse> {
        return this.authService.refreshToken(refreshTokenDto);
    }
}
