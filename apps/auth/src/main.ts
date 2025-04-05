import { GetValidationPipeConfig, USER_PACKAGE_NAME } from '@lib/shared';
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
    app.useGlobalPipes(GetValidationPipeConfig());

    await app.listen();
}
bootstrap();
