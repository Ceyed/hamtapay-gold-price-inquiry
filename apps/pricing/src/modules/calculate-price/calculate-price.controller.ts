import { GetPriceDto } from '@libs/pricing';
import { pricing } from '@libs/shared';
import { Controller } from '@nestjs/common';
import { CalculatePriceService } from './calculate-price.service';

@Controller()
@pricing.PricingServiceControllerMethods()
export class CalculatePriceController implements pricing.PricingServiceController {
    constructor(private readonly _calculatePriceService: CalculatePriceService) {}

    async getPrice(getPriceDto: GetPriceDto): Promise<pricing.GetPriceResponse> {
        return this._calculatePriceService.getPrice(getPriceDto);
    }
}
