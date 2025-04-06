import { Injectable } from '@nestjs/common';
import { LogModuleEnum, LogTypeEnum } from '../../enums/log-types.enum';
import { RedisPrefixesEnum } from '../../enums/redis-prefixes.enum';
import { RedisProjectEnum } from '../../enums/redis-project.enum';
import { RedisSubPrefixesEnum } from '../../enums/redis-sub-prefixes.enum';
import { RedisHelperService } from '../redis-helper';

@Injectable()
export class LoggerService {
    private readonly _ttl = {
        [LogTypeEnum.Info]: 7 * 24 * 60 * 60, // * 7 days
        [LogTypeEnum.Debug]: 10 * 24 * 60 * 60, // *     10 days
        [LogTypeEnum.Error]: null, // * no TTL
    };

    private readonly _colors = {
        [LogTypeEnum.Info]: '\x1b[32m', // * Green
        [LogTypeEnum.Debug]: '\x1b[36m', // * Cyan
        [LogTypeEnum.Error]: '\x1b[31m', // * Red
        RESET: '\x1b[0m',
    };

    constructor(private readonly _redisHelperService: RedisHelperService) {}

    info(moduleName: LogModuleEnum, message: string): void {
        this._log(LogTypeEnum.Info, message, moduleName);
    }

    debug(moduleName: LogModuleEnum, message: string): void {
        this._log(LogTypeEnum.Debug, message, moduleName);
    }

    error(moduleName: LogModuleEnum, message: string | Error): void {
        const errorMessage = message instanceof Error ? message.stack || message.message : message;
        this._log(LogTypeEnum.Error, errorMessage, moduleName);
    }

    private _log(type: LogTypeEnum, message: string, moduleName: LogModuleEnum): void {
        const timestamp: string = this._getFormattedTimestamp();
        const logText = `[${timestamp}] [${type}] [${moduleName}] ${message}`;
        console.log(`${this._colors[type]}${logText}${this._colors.RESET}`);
        this._saveToRedis(type, timestamp, message, moduleName);
    }

    private _getFormattedTimestamp(): string {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }

    private _saveToRedis(
        type: LogTypeEnum,
        timestamp: string,
        message: string,
        moduleName: LogModuleEnum,
    ): void {
        const logData = {
            timestamp,
            type,
            message,
            moduleName,
        };

        const key = this._getRedisKey(type, timestamp, moduleName);
        const ttl = this._ttl[type];

        this._redisHelperService.setCache(key, logData, ttl);
    }

    private _getRedisKey(type: LogTypeEnum, timestamp: string, moduleName: LogModuleEnum): string {
        const normalizedTimestamp = timestamp.replace(/[: ]/g, '-');
        const moduleSuffix = moduleName ? `-${moduleName}` : '';

        let subPrefix: RedisSubPrefixesEnum;

        switch (type) {
            case LogTypeEnum.Info:
                subPrefix = RedisSubPrefixesEnum.Info;
                break;
            case LogTypeEnum.Error:
                subPrefix = RedisSubPrefixesEnum.Error;
                break;
            case LogTypeEnum.Debug:
                subPrefix = RedisSubPrefixesEnum.Debug;
                break;
        }

        return this._redisHelperService.getStandardKey(
            RedisProjectEnum.Main,
            RedisPrefixesEnum.Logs,
            subPrefix,
            `${normalizedTimestamp}${moduleSuffix}`,
        );
    }
}
