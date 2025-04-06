import { GetValidationPipeConfig, pricing } from '@libs/shared';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import 'reflect-metadata';
import { AppModule } from './app/app.module';

async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
        transport: Transport.GRPC,
        options: {
            // TODO: Move to .env
            url: '127.0.0.1:5002',
            protoPath: join(__dirname, 'proto', 'pricing.proto'),
            package: pricing.PRICING_PACKAGE_NAME,
        },
    });
    app.useGlobalPipes(GetValidationPipeConfig());
    await app.listen();
}

bootstrap();
