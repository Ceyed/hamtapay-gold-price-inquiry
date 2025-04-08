import { CalculatePriceDto } from '@libs/pricing';
import { pricing } from '@libs/shared';
import { Controller } from '@nestjs/common';
import { CalculatePriceService } from './calculate-price.service';

@Controller()
@pricing.PricingServiceControllerMethods()
export class CalculatePriceController implements pricing.PricingServiceController {
    constructor(private readonly _calculatePriceService: CalculatePriceService) {}

    async calculatePrice(
        calculatePriceDto: CalculatePriceDto,
    ): Promise<pricing.CalculatePriceResponse> {
        return this._calculatePriceService.calculatePrice(calculatePriceDto);
    }

    async getRawPrices(): Promise<pricing.GetRawPricesResponse> {
        return this._calculatePriceService.getRawPrices();
    }
}
