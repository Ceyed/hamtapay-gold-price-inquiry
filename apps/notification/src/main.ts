import { GetValidationPipeConfig, notification } from '@libs/shared';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app/app.module';

async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
        transport: Transport.GRPC,
        options: {
            // TODO: Move to .env
            url: '0.0.0.0:5005',
            protoPath: join(__dirname, 'proto', 'notification.proto'),
            package: notification.NOTIFICATION_PACKAGE_NAME,
        },
    });
    app.useGlobalPipes(GetValidationPipeConfig());
    await app.listen();
}
bootstrap();
