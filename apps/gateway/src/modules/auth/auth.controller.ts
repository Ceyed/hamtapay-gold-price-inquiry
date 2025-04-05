import { AssignRoleDto, RefreshTokenDto, SigninDto, SignupDto } from '@libs/auth';
import { auth } from '@libs/shared';
import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Controller('users')
export class AuthController {
    constructor(private readonly _authService: AuthService) {}

    @Post('signup')
    signup(@Body() userSignupDto: SignupDto): Observable<auth.SignupResponse> {
        return this._authService.signup(userSignupDto);
    }

    @Post('signin')
    signin(@Body() userSigninDto: SigninDto): Observable<auth.SigninResponse> {
        return this._authService.signin(userSigninDto);
    }

    @Post('refresh-token')
    refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Observable<auth.SigninResponse> {
        return this._authService.refreshToken(refreshTokenDto);
    }

    @Put('assign-role')
    assignRole(@Body() assignRoleDto: AssignRoleDto): Observable<auth.AssignRoleResponse> {
        return this._authService.assignRole(assignRoleDto);
    }

    @Get('all')
    getUserList(): Observable<auth.GetUserListResponse> {
        // TODO: Only admin can get user list
        // TODO: Pagination
        return this._authService.getUserList();
    }
}
