import { MARKET_DATA_SERVICE } from '@libs/market-data';
import { CalculatePriceDto, GoldGramsEnum } from '@libs/pricing';
import {
    GetGoldPricesRedisKey,
    GoldPriceDataType,
    LoggerService,
    LogModuleEnum,
    marketData,
    pricing,
    RedisHelperService,
} from '@libs/shared';
import { HttpStatus, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, Observable, of } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable()
export class CalculatePriceService implements OnModuleInit {
    private _marketDataService: marketData.MarketDataServiceClient;
    private readonly _waitTime: number = 2000;

    constructor(
        private readonly _redisHelperService: RedisHelperService,
        @Inject(MARKET_DATA_SERVICE) private readonly _grpcClient: ClientGrpc,
        private readonly _loggerService: LoggerService,
    ) {}

    onModuleInit() {
        this._marketDataService = this._grpcClient.getService<marketData.MarketDataServiceClient>(
            marketData.MARKET_DATA_SERVICE_NAME,
        );
    }

    async calculatePrice({
        currentStock,
        totalStock,
        grams,
    }: CalculatePriceDto): Promise<pricing.CalculatePriceResponse> {
        this._loggerService.info(LogModuleEnum.Pricing, `Calculating price for ${grams}`);

        const redisKey: string = GetGoldPricesRedisKey(this._redisHelperService);
        let prices: GoldPriceDataType = await this._redisHelperService.getCache(redisKey);

        if (prices === undefined) {
            // * Wait for market data with 2 seconds timeout
            this._loggerService.debug(LogModuleEnum.Pricing, 'Waiting for market data');
            try {
                const response: Observable<marketData.GoldPriceResponse> = this._marketDataService
                    .getGoldPrice({})
                    .pipe(
                        timeout(this._waitTime),
                        catchError(() => of(undefined)),
                    );
                const res: marketData.GoldPriceResponse = await firstValueFrom(response);
                this._loggerService.debug(
                    LogModuleEnum.Pricing,
                    `Market data received, ${JSON.stringify(res.data)}`,
                );
                prices = res.data as unknown as GoldPriceDataType;
            } catch {
                prices = undefined;
            }
            if (!prices) {
                this._loggerService.error(
                    LogModuleEnum.Pricing,
                    'Gold price data unavailable after timeout',
                );
                return {
                    data: null,
                    success: false,
                    error: {
                        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
                        message: 'Gold price data unavailable after timeout',
                    },
                };
            }
        }

        const requestedGoldGram: number = this._getRequestedGoldGram(prices, grams);
        if (requestedGoldGram === -1) {
            return {
                data: 0,
                success: false,
                error: {
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: 'Invalid gold gram',
                },
            };
        }

        const price: number = this._calculatePriceBasedOnStock(
            currentStock,
            totalStock,
            requestedGoldGram,
        );
        this._loggerService.debug(LogModuleEnum.Pricing, `Calculated price for ${grams}: ${price}`);
        return {
            data: price,
            success: true,
            error: null,
        };
    }

    private _getRequestedGoldGram(prices: GoldPriceDataType, grams: GoldGramsEnum): number {
        switch (grams) {
            case GoldGramsEnum.Gram24K:
                return prices.price_gram_24k;
            case GoldGramsEnum.Gram22K:
                return prices.price_gram_22k;
            case GoldGramsEnum.Gram21K:
                return prices.price_gram_21k;
            case GoldGramsEnum.Gram20K:
                return prices.price_gram_20k;
            case GoldGramsEnum.Gram18K:
                return prices.price_gram_18k;
            case GoldGramsEnum.Gram16K:
                return prices.price_gram_16k;
            case GoldGramsEnum.Gram14K:
                return prices.price_gram_14k;
            case GoldGramsEnum.Gram10K:
                return prices.price_gram_10k;
            default:
                return -1;
        }
    }

    private _calculatePriceBasedOnStock(
        currentStock: number,
        totalStock: number,
        price: number,
    ): number {
        // * stock > 50% -> no price increment
        if (currentStock > totalStock * 0.5) {
            this._loggerService.debug(LogModuleEnum.Pricing, 'stock > 50% -> no price increment');
            return price;
        }

        // * 50% > stock > 20% -> 5% increment
        if (currentStock > totalStock * 0.2) {
            this._loggerService.debug(LogModuleEnum.Pricing, '50% > stock > 20% -> 5% increment');
            return price * 1.05;
        }

        // * 20% > stock -> 10% increment
        this._loggerService.debug(LogModuleEnum.Pricing, '20% > stock -> 10% increment');
        return price * 1.1;
    }
}
