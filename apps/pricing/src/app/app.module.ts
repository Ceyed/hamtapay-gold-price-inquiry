import { Module } from '@nestjs/common';
import { CalculatePriceModule } from '../modules/calculate-price/calculate-price.module';

@Module({
    imports: [CalculatePriceModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
