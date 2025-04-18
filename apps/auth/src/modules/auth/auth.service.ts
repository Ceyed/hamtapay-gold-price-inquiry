import {
    AssignRoleDto,
    generateRandomKey,
    jwtConfig,
    JwtConfig,
    RefreshTokenDto,
    SendVerificationCodeDto,
    SigninDto,
    SignupDto,
    TokenPayload,
    TokensInterface,
    UserEntity,
    UserRepository,
    UserStatusEnum,
    VerifyAccountDto,
} from '@libs/auth';
import { NOTIFICATION_SERVICE } from '@libs/notification';
import {
    auth,
    common,
    DEFAULT_USERS,
    GetUserRedisKey,
    LoggerService,
    LogModuleEnum,
    notification,
    RedisHelperService,
    RedisPrefixesEnum,
    RedisProjectEnum,
    RedisSubPrefixesEnum,
    UserRoleEnum,
    UserType,
    uuid,
} from '@libs/shared';
import { HttpStatus, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientGrpc } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { catchError, firstValueFrom, of } from 'rxjs';
import { timeout } from 'rxjs/operators';

@Injectable()
export class AuthService implements OnModuleInit {
    private _notificationService: notification.NotificationServiceClient;
    private readonly _timeout: number = 2000;

    constructor(
        private readonly _loggerService: LoggerService,
        private readonly _userRepository: UserRepository,
        private readonly _redisHelperService: RedisHelperService,
        private readonly _jwtService: JwtService,
        @Inject(jwtConfig.KEY) private readonly _jwtConfig: JwtConfig,
        @Inject(NOTIFICATION_SERVICE) private readonly _notificationGrpcClient: ClientGrpc,
    ) {}

    async onModuleInit() {
        this._notificationService =
            this._notificationGrpcClient.getService<notification.NotificationServiceClient>(
                notification.NOTIFICATION_SERVICE_NAME,
            );

        // * Add all users to redis
        await this._saveAllUsersToRedis();
    }

    async signup(userSignupDto: SignupDto): Promise<auth.SignupResponse> {
        this._loggerService.info(
            LogModuleEnum.Auth,
            `Signing up user: ${JSON.stringify(userSignupDto)}`,
        );

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
            const redisKey: string = GetUserRedisKey(
                this._redisHelperService,
                user.id,
                this._mapUserRoleToRedisSubPrefix(user.role),
            );
            await this._redisHelperService.setCache<UserType>(redisKey, {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                role: user.role,
                status: user.status,
                createdAt: user.createdAt.toISOString(),
                updatedAt: user.updatedAt.toISOString(),
            });
            this.sendVerificationCode({ email: user.email });
            return {
                data: 'You registered successfully. Please verify your account',
                success: true,
                error: null,
            };
        }
        this._loggerService.error(
            LogModuleEnum.Auth,
            `Something went wrong while signing up user: ${JSON.stringify(userSignupDto)}`,
        );
        return {
            data: null,
            success: false,
            error: {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Something went wrong',
            },
        };
    }

    async sendVerificationCode({
        email,
    }: SendVerificationCodeDto): Promise<auth.SendVerificationCodeResponse> {
        this._loggerService.info(
            LogModuleEnum.Auth,
            `Sending verification code to email: ${email}`,
        );

        const user: UserEntity = await this._userRepository.findByEmail(email);
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
        if (user.status === UserStatusEnum.Verified) {
            return {
                data: null,
                success: false,
                error: {
                    statusCode: HttpStatus.CONFLICT,
                    message: 'User is already verified',
                },
            };
        }

        // TODO: Do not generate new key IF it already generated and exists in redis
        const code: string = generateRandomKey();
        try {
            const notificationResponse = this._notificationService
                .sendEmailConfirmationCode({
                    customerId: user.id,
                    confirmationCode: code,
                })
                .pipe(
                    timeout(this._timeout),
                    catchError((error) => {
                        console.error('Failed to send verification code:', error);
                        return of(undefined);
                    }),
                );
            await firstValueFrom(notificationResponse);
        } catch (error) {
            this._loggerService.error(
                LogModuleEnum.Auth,
                `Something went wrong while sending verification code to email: ${email}. Error: ${error}`,
            );
            return {
                data: null,
                success: false,
                error: {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Something went wrong',
                },
            };
        }

        const redisKey: string = this._getRedisKeyForVerificationCode(email);
        await this._redisHelperService.setCache(
            redisKey,
            code,
            this._jwtConfig.verificationCodeTtl,
        );

        return {
            data: 'Verification code sent successfully',
            success: true,
            error: null,
        };
    }

    async verifyAccount(verifyAccountDto: VerifyAccountDto): Promise<auth.VerifyAccountResponse> {
        this._loggerService.info(
            LogModuleEnum.Auth,
            `Verifying account: ${JSON.stringify(verifyAccountDto)}`,
        );

        const user: UserEntity = await this._userRepository.findByEmail(verifyAccountDto.email);
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
        if (user.status === UserStatusEnum.Verified) {
            return {
                data: null,
                success: false,
                error: {
                    statusCode: HttpStatus.CONFLICT,
                    message: 'User is already verified',
                },
            };
        }
        const verificationCodeRedisKey: string = this._getRedisKeyForVerificationCode(
            verifyAccountDto.email,
        );
        const code: string = await this._redisHelperService.getCache(verificationCodeRedisKey);
        this._loggerService.debug(
            LogModuleEnum.Auth,
            `Verification code: ${code} - User entity: ${JSON.stringify(user)}`,
        );
        if (!code) {
            return {
                data: null,
                success: false,
                error: {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Verification code not found. Request new code',
                },
            };
        }
        if (code !== verifyAccountDto.code) {
            return {
                data: null,
                success: false,
                error: {
                    statusCode: HttpStatus.UNAUTHORIZED,
                    message: 'Invalid confirmation code',
                },
            };
        }
        const isUpdated: boolean = await this._userRepository.verifyUser(verifyAccountDto.email);
        if (!isUpdated) {
            this._loggerService.error(
                LogModuleEnum.Auth,
                `Something went wrong while verifying account: ${JSON.stringify(verifyAccountDto)}`,
            );
            return {
                data: null,
                success: false,
                error: {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Something went wrong',
                },
            };
        }
        const userRedisKey: string = GetUserRedisKey(
            this._redisHelperService,
            user.id,
            this._mapUserRoleToRedisSubPrefix(user.role),
        );
        await this._redisHelperService.setCache<UserType>(userRedisKey, {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            email: user.email,
            role: user.role,
            status: UserStatusEnum.Verified,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
        });
        await this._redisHelperService.removeCache(verificationCodeRedisKey);
        return {
            data: 'Account verified successfully. You can login now',
            success: true,
            error: null,
        };
    }

    async signin(userSigninDto: SigninDto): Promise<auth.SigninResponse> {
        this._loggerService.info(
            LogModuleEnum.Auth,
            `Signing in user: ${JSON.stringify(userSigninDto)}`,
        );

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
        if (user.status === UserStatusEnum.NotVerified) {
            return {
                data: null,
                success: false,
                error: {
                    statusCode: HttpStatus.UNAUTHORIZED,
                    message: 'Please verify your account',
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
            this._loggerService.info(
                LogModuleEnum.Auth,
                `Refreshing tokens: ${JSON.stringify(refreshTokenDto)}`,
            );

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
        this._loggerService.info(
            LogModuleEnum.Auth,
            `Assigning role: ${JSON.stringify(assignRoleDto)}`,
        );

        // * Default admin and user can not change
        if ([DEFAULT_USERS.at(0)?.id, DEFAULT_USERS.at(1)?.id].includes(assignRoleDto.userId)) {
            return {
                data: null,
                success: false,
                error: {
                    statusCode: HttpStatus.FORBIDDEN,
                    message: 'YOU.. SHALL NOT.. PASS!! (Default admin and user can not change)',
                },
            };
        }

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
            this._loggerService.error(
                LogModuleEnum.Auth,
                `Something went wrong while assigning role: ${JSON.stringify(assignRoleDto)}`,
            );
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
        const redisKey: string = GetUserRedisKey(
            this._redisHelperService,
            user.id,
            this._mapUserRoleToRedisSubPrefix(user.role),
        );
        await this._redisHelperService.setCache<UserType>(redisKey, {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            email: user.email,
            role: assignRoleDto.role,
            status: user.status,
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
        this._loggerService.info(LogModuleEnum.Auth, 'Getting user list');

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
        return bcrypt.hash(password, this._jwtConfig.bcryptSalt);
    }

    private async _comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }

    private _getRedisKeyForVerificationCode(email: string): string {
        return this._redisHelperService.getStandardKey(
            RedisProjectEnum.Auth,
            RedisPrefixesEnum.VerificationCode,
            RedisSubPrefixesEnum.Single,
            email,
        );
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
                role: user.role,
            }),
            this._signToken(user.id, this._jwtConfig.refreshTokenTtl),
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
            const redisKey: string = GetUserRedisKey(
                this._redisHelperService,
                user.id,
                this._mapUserRoleToRedisSubPrefix(user.role),
            );
            await this._redisHelperService.setCache<UserType>(redisKey, {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                role: user.role,
                status: user.status,
                createdAt: user.createdAt.toISOString(),
                updatedAt: user.updatedAt.toISOString(),
            });
        }
    }

    private _mapUserRoleToRedisSubPrefix(
        userRole: UserRoleEnum,
    ): RedisSubPrefixesEnum.User | RedisSubPrefixesEnum.Admin {
        return userRole === UserRoleEnum.Admin
            ? RedisSubPrefixesEnum.Admin
            : RedisSubPrefixesEnum.User;
    }

    private _getCacheKeyForAllUsers(): string {
        return this._redisHelperService.getPatternKey(
            RedisProjectEnum.Auth,
            RedisPrefixesEnum.User,
        );
    }
}
