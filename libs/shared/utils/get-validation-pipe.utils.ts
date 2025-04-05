import { ValidationPipe } from '@nestjs/common';

export function GetValidationPipeConfig(): ValidationPipe {
    return new ValidationPipe({
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
    });
}
