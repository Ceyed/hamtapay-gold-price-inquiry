import { MARKET_DATA_SERVICE } from '@libs/market-data';
import { GetPriceDto, GoldGramsEnum } from '@libs/pricing';
import {
    GetGoldPricesRedisKey,
    GoldPriceDataType,
    marketData,
    pricing,
    RedisHelperService,
} from '@libs/shared';
import { HttpStatus, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, of } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable()
export class CalculatePriceService implements OnModuleInit {
    private _marketDataService: marketData.MarketDataServiceClient;

    constructor(
        private readonly _redisHelperService: RedisHelperService,
        @Inject(MARKET_DATA_SERVICE) private readonly _grpcClient: ClientGrpc,
    ) {
        this.getPrice({ currentStock: 1, totalStock: 9, grams: GoldGramsEnum.Gram24K });
    }

    onModuleInit() {
        this._marketDataService = this._grpcClient.getService<marketData.MarketDataServiceClient>(
            marketData.MARKET_DATA_SERVICE_NAME,
        );
    }

    async getPrice({
        currentStock,
        totalStock,
        grams,
    }: GetPriceDto): Promise<pricing.GetPriceResponse> {
        const redisKey: string = GetGoldPricesRedisKey(this._redisHelperService);
        let prices: GoldPriceDataType = await this._redisHelperService.getCache(redisKey);

        if (prices === undefined) {
            // * Wait for market data with 2 seconds timeout
            try {
                const response = this._marketDataService.getGoldPrice({}).pipe(
                    timeout(2000),
                    catchError(() => of(undefined)),
                );
                const res: marketData.GoldPriceResponse = await firstValueFrom(response);
                prices = res.data as unknown as GoldPriceDataType;
            } catch {
                prices = undefined;
            }
            if (!prices) {
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
            console.log('stock > 50% -> no price increment');
            return price;
        }

        // * 50% > stock > 20% -> 5% increment
        if (currentStock > totalStock * 0.2) {
            console.log('50% > stock > 20% -> 5% increment');
            return price * 1.05;
        }

        // * 20% > stock -> 10% increment
        console.log('20% > stock -> 10% increment');
        return price * 1.1;
    }
}
