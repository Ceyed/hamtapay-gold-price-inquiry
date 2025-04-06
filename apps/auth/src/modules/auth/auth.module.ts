import { jwtConfig, UserEntity, UserRepository } from '@libs/auth';
import { NOTIFICATION_SERVICE } from '@libs/notification';
import { notification, RedisHelperModule } from '@libs/shared';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        JwtModule.registerAsync(jwtConfig.asProvider()),
        ConfigModule.forFeature(jwtConfig),
        RedisHelperModule,
        ClientsModule.register([
            {
                name: NOTIFICATION_SERVICE,
                transport: Transport.GRPC,
                options: {
                    url: '0.0.0.0:5005',
                    package: notification.NOTIFICATION_PACKAGE_NAME,
                    protoPath: join(__dirname, 'proto', 'notification.proto'),
                },
            },
        ]),
    ],
    controllers: [AuthController],
    providers: [AuthService, UserRepository],
})
export class AuthModule {}
