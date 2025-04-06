import { GetValidationPipeConfig, notification, ServicesConfig } from '@libs/shared';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app/app.module';

async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
        transport: Transport.GRPC,
        options: {
            url: ServicesConfig.notification.url,
            protoPath: join(__dirname, 'proto', 'notification.proto'),
            package: notification.NOTIFICATION_PACKAGE_NAME,
        },
    });
    app.useGlobalPipes(GetValidationPipeConfig());
    await app.listen();
    Logger.log(`🐼 Notification service is running on: ${ServicesConfig.notification.url}`);
}
bootstrap();
