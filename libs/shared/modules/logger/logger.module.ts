import { Module } from '@nestjs/common';
import { RedisHelperModule } from '../redis-helper';
import { LoggerService } from './logger.service';

@Module({
    imports: [RedisHelperModule],
    providers: [LoggerService],
    exports: [LoggerService],
})
export class LoggerModule {}
