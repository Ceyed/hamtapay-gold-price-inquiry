import '@jest/globals';
import { goldApiConfig } from '@libs/market-data';
import { LoggerService, LogModuleEnum, marketData, RedisHelperService } from '@libs/shared';
import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { InquiryService } from '../inquiry.service';

global.fetch = jest.fn();

jest.mock('@libs/market-data', () => ({
    goldApiConfig: {
        KEY: 'GOLD_API_CONFIG',
    },
}));

describe('InquiryService', () => {
    let service: InquiryService;
    let redisHelperService: any;
    let goldApiConfigValue: any;
    let loggerService: any;

    const mockGoldPrices: marketData.GoldPriceDataProtoType = {
        timestamp: Date.now(),
        metal: 'XAU',
        currency: 'USD',
        exchange: 'TEST',
        symbol: 'XAUUSD',
        prevClosePrice: 95,
        openPrice: 96,
        lowPrice: 94,
        highPrice: 98,
        openTime: Date.now() - 3600000,
        price: 97,
        ch: 2,
        chp: 2.1,
        ask: 98,
        bid: 96,
        priceGram24k: 100,
        priceGram22k: 90,
        priceGram21k: 85,
        priceGram20k: 80,
        priceGram18k: 70,
        priceGram16k: 60,
        priceGram14k: 50,
        priceGram10k: 40,
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        redisHelperService = {
            getCache: jest.fn(),
            setCache: jest.fn(),
            getStandardKeyWithoutId: jest.fn().mockReturnValue('test:key'),
        };

        goldApiConfigValue = {
            accessToken: 'test-token',
        };

        loggerService = {
            info: jest.fn(),
            debug: jest.fn(),
            error: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                InquiryService,
                {
                    provide: RedisHelperService,
                    useValue: redisHelperService,
                },
                {
                    provide: goldApiConfig.KEY,
                    useValue: goldApiConfigValue,
                },
                {
                    provide: LoggerService,
                    useValue: loggerService,
                },
            ],
        }).compile();

        service = module.get<InquiryService>(InquiryService);
    });

    describe('getGoldPrice', () => {
        it('should fetch gold price from API and cache it', async () => {
            (global.fetch as jest.Mock).mockResolvedValue({
                json: jest.fn().mockResolvedValue(mockGoldPrices),
            });

            const result = await service.getGoldPrice();

            expect(global.fetch).toHaveBeenCalledWith('https://www.goldapi.io/api/XAU/USD', {
                headers: {
                    'x-access-token': goldApiConfigValue.accessToken,
                },
            });

            expect(redisHelperService.setCache).toHaveBeenCalledWith(
                expect.any(String),
                mockGoldPrices,
                300,
            );
            expect(result.success).toBe(true);
            expect(result.data).toEqual(mockGoldPrices);
        });

        it('should handle API errors gracefully', async () => {
            (global.fetch as jest.Mock).mockRejectedValue(new Error('API error'));

            const result = await service.getGoldPrice();

            expect(loggerService.error).toHaveBeenCalledWith(
                LogModuleEnum.MarketData,
                expect.stringContaining('Error fetching gold price'),
            );

            expect(result.success).toBe(false);
            expect(result.error).toEqual({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Error fetching gold price',
            });
        });

        it('should handle empty API response', async () => {
            (global.fetch as jest.Mock).mockResolvedValue({
                json: jest.fn().mockResolvedValue(null),
            });

            const result = await service.getGoldPrice();

            expect(loggerService.error).toHaveBeenCalledWith(
                LogModuleEnum.MarketData,
                'No gold price data found in GoldAPI',
            );

            expect(result.success).toBe(false);
            expect(result.error).toEqual({
                statusCode: HttpStatus.NOT_FOUND,
                message: 'No gold price data found in GoldAPI',
            });
        });
    });

    describe('Cron jobs', () => {
        it('should call _fetchGoldPrice when business hours cron is triggered', () => {
            const fetchGoldPriceSpy = jest.spyOn(service as any, '_fetchGoldPrice');

            service.handleBusinessHoursCron();

            expect(fetchGoldPriceSpy).toHaveBeenCalled();
            expect(loggerService.info).toHaveBeenCalledWith(
                LogModuleEnum.MarketData,
                '[Cron in Business Hours] Fetching gold price..',
            );
        });

        it('should call _fetchGoldPrice when off hours cron is triggered', () => {
            const fetchGoldPriceSpy = jest.spyOn(service as any, '_fetchGoldPrice');

            service.handleOffHoursCron();

            expect(fetchGoldPriceSpy).toHaveBeenCalled();
            expect(loggerService.info).toHaveBeenCalledWith(
                LogModuleEnum.MarketData,
                '[Cron in Off Hours] Fetching gold price..',
            );
        });
    });
});
