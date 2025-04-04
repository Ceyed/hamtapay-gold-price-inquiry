import { UserEntity, UserRepository } from '@lib/auth';
import { RedisHelperModule } from '@lib/shared';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]), RedisHelperModule],
    controllers: [AuthController],
    providers: [AuthService, UserRepository],
})
export class AuthModule {}
