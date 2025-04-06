import { RedisProjectEnum } from '../enums';

import { RedisPrefixesEnum } from '../enums';
import { RedisHelperService } from '../modules';
import { UserType, uuid } from '../types';

export async function findUserById(
    redisHelperService: RedisHelperService,
    userId: uuid,
): Promise<UserType> {
    const redis = redisHelperService.redisClient;
    let pattern: string = redisHelperService.getPatternKey(
        RedisProjectEnum.Auth,
        RedisPrefixesEnum.User,
    );
    pattern += `:${userId}`;

    let cursor = '0';
    do {
        const [nextCursor, keys] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
        cursor = nextCursor;

        if (keys.length > 0) {
            const userJson = await redis.get(keys[0]);
            return userJson ? JSON.parse(userJson) : null;
        }
    } while (cursor !== '0');

    return null;
}
