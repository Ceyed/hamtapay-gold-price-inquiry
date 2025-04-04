import { UserSignupDto } from '@lib/auth';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('users')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post()
    signup(@Body() userSignupDto: UserSignupDto) {
        console.log('GW Auth controller');
        return this.authService.signup(userSignupDto);
    }
}
