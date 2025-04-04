import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import 'reflect-metadata';
import { AppModule } from './app/app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix);

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

    const port = process.env.PORT || 3000;
    await app.listen(port);
    Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
