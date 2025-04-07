import { AppNodeEnv, GetValidationPipeConfig, pricing, ServicesConfig } from '@libs/shared';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import 'reflect-metadata';
import { AppModule } from './app/app.module';

async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
        transport: Transport.GRPC,
        options: {
            url: ServicesConfig.pricing.url,
            protoPath: join(__dirname, 'proto', 'pricing.proto'),
            package: pricing.PRICING_PACKAGE_NAME,
        },
    });
    app.useGlobalPipes(GetValidationPipeConfig());
    await app.listen();
    const testEnvMessage: string = process.env.NODE_ENV === AppNodeEnv.Test ? ' [TEST]' : '';
    Logger.log(`🐼${testEnvMessage} Pricing service is running on: ${ServicesConfig.pricing.url}`);
}

bootstrap();
