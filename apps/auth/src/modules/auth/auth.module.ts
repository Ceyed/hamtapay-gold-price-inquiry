import { jwtConfig, UserEntity, UserRepository } from '@libs/auth';
import { RedisHelperModule } from '@libs/shared';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        JwtModule.registerAsync(jwtConfig.asProvider()),
        ConfigModule.forFeature(jwtConfig),
        RedisHelperModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, UserRepository],
})
export class AuthModule {}
