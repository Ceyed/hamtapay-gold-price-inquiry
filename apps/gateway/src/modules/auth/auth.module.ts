import { AUTH_SERVICE } from '@libs/auth';
import { auth } from '@libs/shared';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { CommonModule } from '../common/common.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: AUTH_SERVICE,
                transport: Transport.GRPC,
                options: {
                    package: auth.AUTH_PACKAGE_NAME,
                    url: '0.0.0.0:5004',
                    protoPath: join(__dirname, 'proto', 'auth.proto'),
                },
            },
        ]),
        CommonModule,
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
