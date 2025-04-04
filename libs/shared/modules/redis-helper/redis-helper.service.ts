import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { uuid } from '@lib/shared';
import { Injectable } from '@nestjs/common';
import Redis, { ChainableCommander } from 'ioredis';
import { RedisPrefixesEnum } from 'libs/shared/enums/redis-prefixes.enum';
import { RedisProjectEnum } from 'libs/shared/enums/redis-project.enum';
import { RedisSubPrefixesEnum } from 'libs/shared/enums/redis-sub-prefixes.enum';

@Injectable()
export class RedisHelperService {
    constructor(@InjectRedis() private readonly _redisClient: Redis) {}

    get pipeLine(): ChainableCommander {
        return this._redisClient.multi();
    }

    async getCache<T>(key: string): Promise<T> {
        const cachedKey = await this._redisClient.get(key);
        if (cachedKey) {
            return JSON.parse(cachedKey) as T;
        }
    }

    async setCache<T>(key: string, value: T, ttl?: number): Promise<void> {
        const stringFormat = JSON.stringify(value);
        await this._redisClient.set(key, stringFormat);
        if (ttl) {
            await this._redisClient.expire(key, ttl);
        }
    }

    async removeCache(key: string) {
        await this._redisClient.del(key);
    }

    async deleteByPattern(pattern: string) {
        const keys = await this._redisClient.keys(pattern);
        if (keys?.length) {
            await this._redisClient.del(keys);
        }
    }

    getTtl(key: string): Promise<number> {
        return this._redisClient.ttl(key);
    }

    cacheMultipleHashListKeys(hashKey: string, keys: Record<string, string>) {
        this._redisClient.hset(hashKey, keys);
    }

    getStandardKey(
        project: RedisProjectEnum,
        keyPrefix: RedisPrefixesEnum,
        subPrefix: RedisSubPrefixesEnum,
        id: uuid,
    ): string {
        return project + ':' + keyPrefix + ':' + subPrefix + ':' + id;
    }

    getStandardKeyWithoutId(
        project: RedisProjectEnum,
        keyPrefix: RedisPrefixesEnum,
        subPrefix: RedisSubPrefixesEnum,
    ): string {
        return project + ':' + keyPrefix + ':' + subPrefix;
    }

    getPatternKey(
        project: RedisProjectEnum,
        keyPrefix: RedisPrefixesEnum,
        subPrefix?: RedisSubPrefixesEnum,
    ): string {
        let pattern = project + ':' + keyPrefix + ':';
        if (subPrefix) pattern += subPrefix + ':';
        return pattern + '*';
    }
}
