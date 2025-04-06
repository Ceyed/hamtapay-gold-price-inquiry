import { RedisPrefixesEnum } from '../enums/redis-prefixes.enum';
import { RedisProjectEnum } from '../enums/redis-project.enum';
import { RedisSubPrefixesEnum } from '../enums/redis-sub-prefixes.enum';
import { RedisHelperService } from '../modules/redis-helper/redis-helper.service';
import { uuid } from '../types';

export function GetInvoiceRedisKey(
    redisHelperService: RedisHelperService,
    invoiceID: uuid,
): string {
    return redisHelperService.getStandardKey(
        RedisProjectEnum.Order,
        RedisPrefixesEnum.Invoice,
        RedisSubPrefixesEnum.Single,
        invoiceID,
    );
}
