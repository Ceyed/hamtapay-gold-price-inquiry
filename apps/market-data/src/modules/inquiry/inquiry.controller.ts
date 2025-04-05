import { marketData } from '@libs/shared';
import { Controller } from '@nestjs/common';
import { InquiryService } from './inquiry.service';

@Controller()
@marketData.MarketDataServiceControllerMethods()
export class InquiryController implements marketData.MarketDataServiceController {
    constructor(private readonly _inquiryService: InquiryService) {}

    async getGoldPrice(): Promise<marketData.GoldPriceResponse> {
        return this._inquiryService.getGoldPrice();
    }
}
