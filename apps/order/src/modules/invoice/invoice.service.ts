import { CreateInvoiceDto } from '@libs/order';
import { GoldGramsEnum, PRICING_SERVICE } from '@libs/pricing';
import { findUserById, order, pricing, RedisHelperService, UserType } from '@libs/shared';
import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { catchError, firstValueFrom, Observable, of } from 'rxjs';
import { timeout } from 'rxjs/operators';

@Injectable()
export class InvoiceService {
    private _pricingService: pricing.PricingServiceClient;
    private readonly _timeout: number = 1000;

    constructor(
        @Inject(PRICING_SERVICE) private readonly _grpcClient: ClientGrpc,
        private readonly _redisHelperService: RedisHelperService,
    ) {}

    onModuleInit() {
        this._pricingService = this._grpcClient.getService<pricing.PricingServiceClient>(
            pricing.PRICING_SERVICE_NAME,
        );
    }

    async createInvoice({
        customerId,
        goldGrams,
        amount,
    }: CreateInvoiceDto): Promise<order.CreateInvoiceResponse> {
        const customer: UserType = await findUserById(this._redisHelperService, customerId);
        if (!customer) {
            return {
                data: null,
                success: false,
                error: {
                    statusCode: 404,
                    message: 'Customer not found',
                },
            };
        }
    }

    private async _getGoldPrice(goldGrams: GoldGramsEnum): Promise<number> {
        try {
            const response: Observable<pricing.CalculatePriceResponse> = this._pricingService
                .calculatePrice({ grams: goldGrams, currentStock: 0, totalStock: 0 })
                .pipe(
                    timeout(this._timeout),
                    catchError(() => of(undefined)),
                );
            const res: pricing.CalculatePriceResponse = await firstValueFrom(response);
            return res?.data as number;
        } catch {
            return undefined;
        }
    }
}
