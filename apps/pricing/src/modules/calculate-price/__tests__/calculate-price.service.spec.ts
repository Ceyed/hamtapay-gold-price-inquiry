import '@jest/globals';
import { MARKET_DATA_SERVICE } from '@libs/market-data';
import { CalculatePriceDto, GoldGramsEnum } from '@libs/pricing';
import { GoldPriceDataType, LoggerService, RedisHelperService } from '@libs/shared';
import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { delay, of } from 'rxjs';
import { CalculatePriceService } from '../calculate-price.service';

describe('CalculatePriceService', () => {
    let service: CalculatePriceService;
    let redisHelperService: any;
    let grpcClient: any;
    let loggerService: any;
    let marketDataService: any;

    const mockGoldPrices: GoldPriceDataType = {
        timestamp: Date.now(),
        metal: 'XAU',
        currency: 'USD',
        exchange: 'TEST',
        symbol: 'XAUUSD',
        prev_close_price: 95,
        open_price: 96,
        low_price: 94,
        high_price: 98,
        open_time: Date.now() - 3600000,
        price: 97,
        ch: 2,
        chp: 2.1,
        ask: 98,
        bid: 96,
        price_gram_24k: 100,
        price_gram_22k: 90,
        price_gram_21k: 85,
        price_gram_20k: 80,
        price_gram_18k: 70,
        price_gram_16k: 60,
        price_gram_14k: 50,
        price_gram_10k: 40,
    };

    beforeEach(async () => {
        marketDataService = { getGoldPrice: jest.fn() };

        grpcClient = { getService: jest.fn().mockReturnValue(marketDataService) };

        redisHelperService = {
            getCache: jest.fn(),
            getStandardKeyWithoutId: jest.fn().mockReturnValue('test:key'),
        };

        loggerService = {
            info: jest.fn(),
            debug: jest.fn(),
            error: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CalculatePriceService,
                {
                    provide: RedisHelperService,
                    useValue: redisHelperService,
                },
                {
                    provide: MARKET_DATA_SERVICE,
                    useValue: grpcClient,
                },
                {
                    provide: LoggerService,
                    useValue: loggerService,
                },
            ],
        }).compile();

        service = module.get<CalculatePriceService>(CalculatePriceService);
    });

    describe('calculatePrice', () => {
        const calculatePriceDto: CalculatePriceDto = {
            currentStock: 100,
            totalStock: 200,
            grams: GoldGramsEnum.Gram24K,
        };

        it('should calculate price correctly when stock is above 50%', async () => {
            redisHelperService.getCache.mockResolvedValue(mockGoldPrices);

            const result = await service.calculatePrice(calculatePriceDto);

            expect(result.success).toBe(true);
            expect(result.data).toBeCloseTo(105, 2);
            expect(result.error).toBeNull();
        });

        it('should calculate price with 5% increment when stock is between 20% and 50%', async () => {
            redisHelperService.getCache.mockResolvedValue(mockGoldPrices);
            const lowStockDto = { ...calculatePriceDto, currentStock: 30, totalStock: 200 };

            const result = await service.calculatePrice(lowStockDto);

            expect(result.success).toBe(true);
            expect(result.data).toBeCloseTo(110, 2);
            expect(result.error).toBeNull();
        });

        it('should calculate price with 10% increment when stock is below 20%', async () => {
            redisHelperService.getCache.mockResolvedValue(mockGoldPrices);
            const veryLowStockDto = { ...calculatePriceDto, currentStock: 10, totalStock: 200 };

            const result = await service.calculatePrice(veryLowStockDto);

            expect(result.success).toBe(true);
            expect(result.data).toBeCloseTo(110, 2);
            expect(result.error).toBeNull();
        });

        it('should handle invalid gold gram type', async () => {
            redisHelperService.getCache.mockResolvedValue(mockGoldPrices);
            const invalidGramDto = { ...calculatePriceDto, grams: 'INVALID' as GoldGramsEnum };

            const result = await service.calculatePrice(invalidGramDto);

            expect(result.success).toBe(false);
            expect(result.data).toBe(0);
            expect(result.error).toEqual({
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'Invalid gold gram',
            });
        });

        it('should handle unavailable market data', async () => {
            redisHelperService.getCache.mockResolvedValue(undefined);
            marketDataService.getGoldPrice.mockReturnValue(of(undefined));

            const result = await service.calculatePrice(calculatePriceDto);

            expect(result.success).toBe(false);
            expect(result.data).toBeNull();
            expect(result.error).toEqual({
                statusCode: HttpStatus.SERVICE_UNAVAILABLE,
                message: 'Gold price data unavailable after timeout',
            });
        });
    });

    describe('getRawPrices', () => {
        it('should return raw prices from cache', async () => {
            redisHelperService.getCache.mockResolvedValue(mockGoldPrices);

            const result = await service.getRawPrices();

            expect(result.success).toBe(true);
            expect(result.data).toEqual({
                ...mockGoldPrices,
                priceGram24k: mockGoldPrices.price_gram_24k,
                priceGram22k: mockGoldPrices.price_gram_22k,
                priceGram21k: mockGoldPrices.price_gram_21k,
                priceGram20k: mockGoldPrices.price_gram_20k,
                priceGram18k: mockGoldPrices.price_gram_18k,
                priceGram16k: mockGoldPrices.price_gram_16k,
                priceGram14k: mockGoldPrices.price_gram_14k,
                priceGram10k: mockGoldPrices.price_gram_10k,
            });
            expect(result.error).toBeNull();
        });

        it('should handle unavailable market data', async () => {
            redisHelperService.getCache.mockResolvedValue(undefined);
            marketDataService.getGoldPrice.mockReturnValue(of(undefined));

            const result = await service.getRawPrices();

            expect(result.success).toBe(false);
            expect(result.data).toBeNull();
            expect(result.error).toEqual({
                statusCode: HttpStatus.SERVICE_UNAVAILABLE,
                message: 'Gold price data unavailable after timeout',
            });
        });

        it('should handle market data service timeout', async () => {
            redisHelperService.getCache.mockResolvedValue(undefined);

            marketDataService.getGoldPrice.mockReturnValue(
                of({
                    data: mockGoldPrices,
                    success: true,
                    error: null,
                }).pipe(delay(3000)),
            );

            const result = await service.getRawPrices();

            expect(result.success).toBe(false);
            expect(result.data).toBeNull();
            expect(result.error).toEqual({
                statusCode: HttpStatus.SERVICE_UNAVAILABLE,
                message: 'Gold price data unavailable after timeout',
            });
        });
    });
});
