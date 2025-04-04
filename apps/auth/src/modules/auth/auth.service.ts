import {
    jwtConfig,
    JwtConfig,
    RefreshTokenDto,
    SigninDto,
    SignupDto,
    TokenPayload,
    TokensInterface,
    UserEntity,
    UserRepository,
} from '@lib/auth';
import {
    ErrorInterface,
    RedisHelperService,
    SigninResponse,
    SignupResponse,
    uuid,
} from '@lib/shared';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly _userRepository: UserRepository,
        private readonly _redisHelperService: RedisHelperService,
        private readonly _jwtService: JwtService,
        @Inject(jwtConfig.KEY) private readonly _jwtConfig: JwtConfig,
    ) {}

    async signup(userSignupDto: SignupDto): Promise<SignupResponse> {
        // TODO: Two steps validation
        const validationResult = await this._signupValidation(userSignupDto);
        if (validationResult) {
            return {
                data: null,
                success: false,
                error: validationResult,
            };
        }

        const hashedPassword: string = await this._hashPassword(userSignupDto.password);
        const user: UserEntity = await this._userRepository.add({
            ...userSignupDto,
            password: hashedPassword,
        });
        if (user) {
            return {
                // data: this._mapUserEntityToUserModel(user),
                data: 'You registered successfully. you can login now',
                success: true,
                error: null,
            };
        }
        return {
            data: null,
            success: false,
            error: {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Something went wrong',
            },
        };
    }

    async signin(userSigninDto: SigninDto): Promise<SigninResponse> {
        const user: UserEntity = await this._userRepository.findByUsername(userSigninDto.username);
        if (!user) {
            return {
                data: null,
                success: false,
                error: {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'User not found',
                },
            };
        }

        const isEqual: boolean = await this._comparePassword(userSigninDto.password, user.password);
        if (!isEqual) {
            return {
                data: null,
                success: false,
                error: {
                    statusCode: HttpStatus.UNAUTHORIZED,
                    message: 'Password is incorrect',
                },
            };
        }
        return {
            data: await this._generateTokens(user),
            success: true,
            error: null,
        };
    }

    async refreshTokens(refreshTokenDto: RefreshTokenDto): Promise<SigninResponse> {
        try {
            const { sub } = await this._jwtService.verifyAsync<Pick<TokenPayload, 'sub'>>(
                refreshTokenDto.refreshToken,
                {
                    secret: this._jwtConfig.secret,
                    audience: this._jwtConfig.audience,
                    issuer: this._jwtConfig.issuer,
                },
            );
            const user: UserEntity = await this._userRepository.findById(sub);
            if (!user) {
                return {
                    data: null,
                    success: false,
                    error: {
                        statusCode: HttpStatus.NOT_FOUND,
                        message: 'User not found',
                    },
                };
            }
            return {
                data: await this._generateTokens(user),
                success: true,
                error: null,
            };
        } catch (_) {
            return {
                data: null,
                success: false,
                error: {
                    statusCode: HttpStatus.UNAUTHORIZED,
                    message: 'Invalid refresh token',
                },
            };
        }
    }

    private async _hashPassword(password: string): Promise<string> {
        // TODO: Move 10 to env
        return bcrypt.hash(password, 10);
    }

    private async _comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }

    private async _signupValidation(userSignupDto: SignupDto): Promise<ErrorInterface | void> {
        // * Check if username or email is used before
        const existingRecords: number = await this._userRepository.duplicateData(
            userSignupDto.username,
            userSignupDto.email,
        );
        if (existingRecords) {
            return {
                statusCode: HttpStatus.CONFLICT,
                message: 'Email or Username is used already',
            };
        }
    }

    async _generateTokens(user: UserEntity): Promise<TokensInterface> {
        const [accessToken, refreshToken] = await Promise.all([
            this._signToken<Partial<TokenPayload>>(user.id, this._jwtConfig.accessTokenTtl, {
                sub: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
            }),
            this._signToken(user.id, this._jwtConfig.refreshTokenTtl, {
                id: user.id,
            }),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }

    private async _signToken<T>(userId: uuid, expiresIn: number, payload?: T) {
        return this._jwtService.signAsync(
            {
                sub: userId,
                ...payload,
            },
            {
                audience: this._jwtConfig.audience,
                issuer: this._jwtConfig.issuer,
                secret: this._jwtConfig.secret,
                expiresIn,
            },
        );
    }
}
