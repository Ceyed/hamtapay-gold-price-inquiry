import { GetPriceDto, GoldGramsEnum } from '@libs/pricing';
import {
    GetGoldPricesRedisKey,
    GoldPriceDataType,
    pricing,
    RedisHelperService,
} from '@libs/shared';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CalculatePriceService {
    constructor(private readonly _redisHelperService: RedisHelperService) {
        // this.getPrice({ currentStock: 1, totalStock: 9, grams: GoldGramsEnum.Gram24K });
    }

    async getPrice({
        currentStock,
        totalStock,
        grams,
    }: GetPriceDto): Promise<pricing.GetPriceResponse> {
        const redisKey: string = GetGoldPricesRedisKey(this._redisHelperService);
        const prices: GoldPriceDataType = await this._redisHelperService.getCache(redisKey);
        console.log(prices);

        if (prices === undefined) {
            // TODO: CAll market-data and force it to update, then get prices from it
        }

        const requestedGoldGram: number = this._getRequestedGoldGram(prices, grams);
        console.log(requestedGoldGram);
        if (requestedGoldGram === -1) {
            return {
                data: 0,
                success: false,
                error: {
                    statusCode: 400,
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
