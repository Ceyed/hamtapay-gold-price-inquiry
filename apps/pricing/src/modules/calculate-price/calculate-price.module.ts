import { RedisHelperModule } from '@libs/shared';
import { Module } from '@nestjs/common';
import { CalculatePriceController } from './calculate-price.controller';
import { CalculatePriceService } from './calculate-price.service';

@Module({
    imports: [RedisHelperModule],
    controllers: [CalculatePriceController],
    providers: [CalculatePriceService],
})
export class CalculatePriceModule {}
