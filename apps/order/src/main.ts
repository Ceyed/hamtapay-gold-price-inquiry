import { GetValidationPipeConfig, order } from '@libs/shared';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app/app.module';

async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
        transport: Transport.GRPC,
        options: {
            // TODO: Move to .env
            // TODO: Do it for all apps
            url: '127.0.0.1:5001',
            protoPath: join(__dirname, 'proto', 'order.proto'),
            package: order.ORDER_PACKAGE_NAME,
        },
    });
    app.useGlobalPipes(GetValidationPipeConfig());
    await app.listen();
}
bootstrap();
