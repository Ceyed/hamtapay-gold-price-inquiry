import { UserEntity, UserRepository, UserSignupDto } from '@lib/auth';
import { ErrorInterface, RedisHelperService, UserModel, UserSignupResponse } from '@lib/shared';
import { HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
    constructor(
        private readonly _userRepository: UserRepository,
        private readonly _redisHelperService: RedisHelperService,
    ) {}

    async signup(userSignupDto: UserSignupDto): Promise<UserSignupResponse> {
        // TODO: Two steps validation
        const validationResult = await this._signupValidation(userSignupDto);
        if (validationResult) {
            return {
                data: null,
                success: false,
                error: validationResult,
            };
        }
        const user: UserEntity = await this._userRepository.add(userSignupDto);
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

    private _mapUserEntityToUserModel(user: UserEntity, skipPassword = true): UserModel {
        return {
            id: user.id,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
            email: user.email,
            username: user.username,
            role: user.role,
            ...(!skipPassword && { password: user.password }),
        };
    }

    private async _signupValidation(userSignupDto: UserSignupDto): Promise<ErrorInterface | void> {
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
}
