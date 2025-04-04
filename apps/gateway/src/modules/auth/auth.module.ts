import { AUTH_SERVICE } from '@lib/auth';
import { USER_PACKAGE_NAME } from '@lib/shared';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: AUTH_SERVICE,
                transport: Transport.GRPC,
                options: {
                    package: USER_PACKAGE_NAME,
                    protoPath: join(__dirname, 'proto', 'auth.proto'),
                },
            },
        ]),
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
