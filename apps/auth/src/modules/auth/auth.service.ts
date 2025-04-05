import {
    AssignRoleDto,
    jwtConfig,
    JwtConfig,
    RefreshTokenDto,
    SigninDto,
    SignupDto,
    TokenPayload,
    TokensInterface,
    UserEntity,
    UserRepository,
} from '@libs/auth';
import {
    auth,
    common,
    RedisHelperService,
    RedisPrefixesEnum,
    RedisProjectEnum,
    RedisSubPrefixesEnum,
    uuid,
} from '@libs/shared';
import { HttpStatus, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService implements OnModuleInit {
    constructor(
        private readonly _userRepository: UserRepository,
        private readonly _redisHelperService: RedisHelperService,
        private readonly _jwtService: JwtService,
        @Inject(jwtConfig.KEY) private readonly _jwtConfig: JwtConfig,
    ) {}

    async onModuleInit() {
        // * Add all users to redis
        await this._saveAllUsersToRedis();
    }

    async signup(userSignupDto: SignupDto): Promise<auth.SignupResponse> {
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
            // * Add user to redis
            const redisKey: string = this._getCacheKeyForOneUser(user.id);
            await this._redisHelperService.setCache(redisKey, {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
            });
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

    async signin(userSigninDto: SigninDto): Promise<auth.SigninResponse> {
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

    async refreshTokens(refreshTokenDto: RefreshTokenDto): Promise<auth.SigninResponse> {
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

    async assignRole(assignRoleDto: AssignRoleDto): Promise<auth.AssignRoleResponse> {
        const user: UserEntity = await this._userRepository.findById(assignRoleDto.userId);
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

        // * Check if the user is already the role
        if (user.role === assignRoleDto.role) {
            return {
                data: null,
                success: false,
                error: {
                    statusCode: HttpStatus.CONFLICT,
                    message: 'User already has this role',
                },
            };
        }

        const isUpdated: boolean = await this._userRepository.updateRole(
            user.id,
            assignRoleDto.role,
        );
        if (!isUpdated) {
            return {
                data: null,
                success: false,
                error: {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Something went wrong',
                },
            };
        }
        // * Update user in redis
        const redisKey: string = this._getCacheKeyForOneUser(user.id);
        await this._redisHelperService.setCache(redisKey, {
            id: user.id,
            username: user.username,
            email: user.email,
            role: assignRoleDto.role,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
        });
        return {
            data: 'Role assigned successfully',
            success: true,
            error: null,
        };
    }

    async getUserList(): Promise<auth.GetUserListResponse> {
        const pattern = this._getCacheKeyForAllUsers();
        const keys = await this._redisHelperService.getKeysByPattern(pattern);

        if (keys?.length) {
            const users: auth.UserModel[] = await Promise.all(
                keys.map(async (key) => {
                    const userData = await this._redisHelperService.getCache(key);
                    return this._mapUserEntityToUserModel(userData as UserEntity);
                }),
            );

            return {
                data: users,
                success: true,
                error: null,
            };
        }

        // * If no users in Redis, get from DB and cache them (if exists)
        const users: UserEntity[] = await this._userRepository.findAll();
        if (users?.length) {
            await this._saveAllUsersToRedis();
        }
        return {
            data: users.map(this._mapUserEntityToUserModel),
            success: true,
            error: null,
        };
    }

    private _mapUserEntityToUserModel(user: UserEntity): auth.UserModel {
        return {
            id: user.id,
            createdAt:
                typeof user.createdAt === 'string' ? user.createdAt : user.createdAt?.toISOString(),
            updatedAt:
                typeof user.updatedAt === 'string' ? user.updatedAt : user.updatedAt?.toISOString(),
            username: user.username,
            email: user.email,
            role: user.role,
            password: null,
        };
    }

    private async _hashPassword(password: string): Promise<string> {
        // TODO: Move 10 to env
        return bcrypt.hash(password, 10);
    }

    private async _comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }

    private async _signupValidation(
        userSignupDto: SignupDto,
    ): Promise<common.ErrorInterface | void> {
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

    private async _saveAllUsersToRedis(): Promise<void> {
        const users: UserEntity[] = await this._userRepository.findAll();
        for (const user of users) {
            const redisKey: string = this._getCacheKeyForOneUser(user.id);
            await this._redisHelperService.setCache(redisKey, {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt.toISOString(),
                updatedAt: user.updatedAt.toISOString(),
            });
        }
    }

    private _getCacheKeyForOneUser(userId: uuid): string {
        return this._redisHelperService.getStandardKey(
            RedisProjectEnum.Auth,
            RedisPrefixesEnum.User,
            RedisSubPrefixesEnum.Single,
            userId,
        );
    }

    private _getCacheKeyForAllUsers(): string {
        return this._redisHelperService.getPatternKey(
            RedisProjectEnum.Auth,
            RedisPrefixesEnum.User,
        );
    }
}
