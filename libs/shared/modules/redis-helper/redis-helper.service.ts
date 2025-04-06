import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { uuid } from '@libs/shared';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisPrefixesEnum } from 'libs/shared/enums/redis-prefixes.enum';
import { RedisProjectEnum } from 'libs/shared/enums/redis-project.enum';
import { RedisSubPrefixesEnum } from 'libs/shared/enums/redis-sub-prefixes.enum';

@Injectable()
export class RedisHelperService {
    constructor(@InjectRedis() private readonly _redisClient: Redis) {}

    get redisClient(): Redis {
        return this._redisClient;
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

    /**
     * This function checks to see if there is data with your key in redis, else will
     * fetch it from db and store it as cache if it does not exists it will return null
     * @param key: Your redis key
     * @param getDataCallback: The function and repo query to get your data
     */
    async getFromCacheOrDb<T>(
        key: string,
        getDataCallback: () => Promise<T>,
        ttl?: number,
        saveToRedis = true,
    ): Promise<T> {
        const valueFromRedis: T = await this.getCache<T>(key);
        if (valueFromRedis) return valueFromRedis;

        const valueFromDb: T = await getDataCallback();
        if (!valueFromDb) return;

        if (saveToRedis) {
            this.setCache<T>(key, valueFromDb, ttl);
        }

        return valueFromDb;
    }

    async getKeysByPattern(pattern: string): Promise<string[]> {
        return this._redisClient.keys(pattern);
    }
}
