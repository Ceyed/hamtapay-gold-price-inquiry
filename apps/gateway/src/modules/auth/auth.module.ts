import { AUTH_SERVICE } from '@libs/auth';
import { auth, ServicesConfig } from '@libs/shared';
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
                    url: ServicesConfig.auth.url,
                    package: auth.AUTH_PACKAGE_NAME,
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
