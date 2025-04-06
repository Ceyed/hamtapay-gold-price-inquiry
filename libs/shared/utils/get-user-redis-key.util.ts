import { RedisPrefixesEnum } from '../enums/redis-prefixes.enum';
import { RedisProjectEnum } from '../enums/redis-project.enum';
import { RedisSubPrefixesEnum } from '../enums/redis-sub-prefixes.enum';
import { RedisHelperService } from '../modules/redis-helper/redis-helper.service';
import { uuid } from '../types';

export function GetUserRedisKey(
    redisHelperService: RedisHelperService,
    userId: uuid,
    userRole: RedisSubPrefixesEnum.User | RedisSubPrefixesEnum.Admin,
): string {
    return redisHelperService.getStandardKey(
        RedisProjectEnum.Auth,
        RedisPrefixesEnum.User,
        userRole,
        userId,
    );
}
