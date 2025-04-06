import {
    AssignRoleDto,
    RefreshTokenDto,
    SendVerificationCodeDto,
    SigninDto,
    SignupDto,
    VerifyAccountDto,
} from '@libs/auth';
import { auth, UserRoleEnum } from '@libs/shared';
import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Roles } from '../common/decorators';
import { JwtAuthGuard, RolesGuard } from '../common/guards';
import { AuthService } from './auth.service';

@Controller('users')
export class AuthController {
    constructor(private readonly _authService: AuthService) {}

    @Post('signup')
    signup(@Body() userSignupDto: SignupDto): Observable<auth.SignupResponse> {
        return this._authService.signup(userSignupDto);
    }

    @Post('verify-account')
    verifyAccount(
        @Body() verifyAccountDto: VerifyAccountDto,
    ): Observable<auth.VerifyAccountResponse> {
        return this._authService.verifyAccount(verifyAccountDto);
    }

    @Post('send-verification-code')
    sendVerificationCode(
        @Body() sendVerificationCodeDto: SendVerificationCodeDto,
    ): Observable<auth.SendVerificationCodeResponse> {
        return this._authService.sendVerificationCode(sendVerificationCodeDto);
    }
    TODO;

    @Post('signin')
    signin(@Body() userSigninDto: SigninDto): Observable<auth.SigninResponse> {
        return this._authService.signin(userSigninDto);
    }

    @Post('refresh-token')
    refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Observable<auth.SigninResponse> {
        return this._authService.refreshToken(refreshTokenDto);
    }

    @Put('assign-role')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRoleEnum.Admin)
    assignRole(@Body() assignRoleDto: AssignRoleDto): Observable<auth.AssignRoleResponse> {
        return this._authService.assignRole(assignRoleDto);
    }

    @Get('all')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRoleEnum.Admin)
    getUserList(): Observable<auth.GetUserListResponse> {
        return this._authService.getUserList();
    }
}
