import { USER_PACKAGE_NAME } from '@lib/shared';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app/app.module';

async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
        transport: Transport.GRPC,
        options: {
            protoPath: join(__dirname, 'proto', 'auth.proto'),
            package: USER_PACKAGE_NAME,
        },
    });
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            stopAtFirstError: true,
            forbidNonWhitelisted: true,
            forbidUnknownValues: true,
            disableErrorMessages: false,
            transformOptions: {
                enableImplicitConversion: true,
                exposeDefaultValues: true,
            },
        }),
    );

    await app.listen();
}
bootstrap();
