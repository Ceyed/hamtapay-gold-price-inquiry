import { RedisModule, RedisModuleOptions } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { redisConfig, RedisConfig } from './config/redis.config';
import { RedisHelperService } from './redis-helper.service';

@Module({
    imports: [
        RedisModule.forRootAsync({
            useFactory: (redisConfigService: RedisConfig): RedisModuleOptions => ({
                config: { host: redisConfigService.host, port: redisConfigService.port },
            }),
            inject: [redisConfig.KEY],
            imports: [ConfigModule.forFeature(redisConfig)],
        }),
    ],
    providers: [RedisHelperService],
    exports: [RedisHelperService],
})
export class RedisHelperModule {}
