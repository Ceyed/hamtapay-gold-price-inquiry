import { goldApiConfig, GoldApiConfig } from '@libs/market-data';
import {
    GetGoldPricesRedisKey,
    LoggerService,
    LogModuleEnum,
    marketData,
    RedisHelperService,
} from '@libs/shared';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class InquiryService {
    constructor(
        private readonly _redisHelperService: RedisHelperService,
        @Inject(goldApiConfig.KEY) private readonly _goldApiConfig: GoldApiConfig,
        private readonly _loggerService: LoggerService,
    ) {
        this._fetchGoldPrice();
    }

    // ? Runs every 5 minutes, Monday–Friday, from 9:00 to 16:55
    @Cron('*/5 9-16 * * 1-5')
    handleBusinessHoursCron() {
        this._loggerService.info(
            LogModuleEnum.MarketData,
            '[Cron in Business Hours] Fetching gold price..',
        );
        this._fetchGoldPrice();
    }

    // ? Runs once every hour on weekends
    @Cron('0 * * * 0,6')
    handleOffHoursCron() {
        this._loggerService.info(
            LogModuleEnum.MarketData,
            '[Cron in Off Hours] Fetching gold price..',
        );
        this._fetchGoldPrice();
    }

    async getGoldPrice(): Promise<marketData.GoldPriceResponse> {
        return this._fetchGoldPrice();
    }

    private async _fetchGoldPrice(): Promise<marketData.GoldPriceResponse> {
        try {
            // * Get gold price from GoldAPI
            const response = await fetch('https://www.goldapi.io/api/XAU/USD', {
                headers: {
                    'x-access-token': this._goldApiConfig.accessToken,
                },
            });
            const prices: marketData.GoldPriceDataProtoType = await response.json();
            if (!prices) {
                this._loggerService.error(
                    LogModuleEnum.MarketData,
                    'No gold price data found in GoldAPI',
                );
                return {
                    data: null,
                    success: false,
                    error: {
                        statusCode: HttpStatus.NOT_FOUND,
                        message: 'No gold price data found in GoldAPI',
                    },
                };
            }

            // * Store in DB/cache
            const redisKey: string = GetGoldPricesRedisKey(this._redisHelperService);
            this._redisHelperService.setCache(redisKey, prices);

            return {
                data: prices,
                success: true,
                error: null,
            };
        } catch (error) {
            this._loggerService.error(
                LogModuleEnum.MarketData,
                `Error fetching gold price: ${error}`,
            );
            return {
                data: null,
                success: false,
                error: {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Error fetching gold price',
                },
            };
        }
    }
}
