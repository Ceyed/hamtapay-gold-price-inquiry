import { RedisPrefixesEnum } from '../enums/redis-prefixes.enum';
import { RedisProjectEnum } from '../enums/redis-project.enum';
import { RedisSubPrefixesEnum } from '../enums/redis-sub-prefixes.enum';
import { RedisHelperService } from '../modules/redis-helper/redis-helper.service';

export function GetGoldPricesRedisKey(redisHelperService: RedisHelperService): string {
    return redisHelperService.getStandardKeyWithoutId(
        RedisProjectEnum.MarketData,
        RedisPrefixesEnum.GoldPrice,
        RedisSubPrefixesEnum.Single,
    );
}
