import { AppNodeEnv, GetValidationPipeConfig, ServicesConfig } from '@libs/shared';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import 'reflect-metadata';
import { AppModule } from './app/app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix);

    app.useGlobalPipes(GetValidationPipeConfig());

    const port = ServicesConfig.gateway.port;
    await app.listen(port);
    const testEnvMessage: string = process.env.NODE_ENV === AppNodeEnv.Test ? ' [TEST]' : '';
    Logger.log(`🐼${testEnvMessage} Gateway service is running on: ${ServicesConfig.gateway.url}`);
}

bootstrap();
