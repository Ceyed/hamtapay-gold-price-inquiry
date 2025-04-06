import { MARKET_DATA_SERVICE } from '@libs/market-data';
import { marketData, RedisHelperModule, ServicesConfig, LoggerModule } from '@libs/shared';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { CalculatePriceController } from './calculate-price.controller';
import { CalculatePriceService } from './calculate-price.service';

@Module({
    imports: [
        RedisHelperModule,
        ClientsModule.register([
            {
                name: MARKET_DATA_SERVICE,
                transport: Transport.GRPC,
                options: {
                    package: marketData.MARKET_DATA_PACKAGE_NAME,
                    url: ServicesConfig.marketData.url,
                    protoPath: join(__dirname, 'proto', 'market-data.proto'),
                },
            },
        ]),
        LoggerModule,
    ],
    controllers: [CalculatePriceController],
    providers: [CalculatePriceService],
})
export class CalculatePriceModule {}
