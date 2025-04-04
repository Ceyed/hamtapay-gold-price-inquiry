import { UserSignupDto } from '@lib/auth';
import { UserSignupResponse } from '@lib/shared';
import { Body, Controller, Post } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Controller('users')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    signup(@Body() userSignupDto: UserSignupDto): Observable<UserSignupResponse> {
        return this.authService.signup(userSignupDto);
    }
}
