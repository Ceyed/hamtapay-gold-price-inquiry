import { AppNodeEnv, GetValidationPipeConfig, marketData, ServicesConfig } from '@libs/shared';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app/app.module';

async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
        transport: Transport.GRPC,
        options: {
            url: ServicesConfig.marketData.url,
            protoPath: join(__dirname, 'proto', 'market-data.proto'),
            package: marketData.MARKET_DATA_PACKAGE_NAME,
        },
    });
    app.useGlobalPipes(GetValidationPipeConfig());
    await app.listen();
    const testEnvMessage: string = process.env.NODE_ENV === AppNodeEnv.Test ? ' [TEST]' : '';
    Logger.log(
        `🐼${testEnvMessage} Market data service is running on: ${ServicesConfig.marketData.url}`,
    );
}
bootstrap();
