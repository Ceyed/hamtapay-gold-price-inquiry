import { ORDER_SERVICE } from '@libs/order';
import { LoggerModule, order, ServicesConfig } from '@libs/shared';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { CommonModule } from '../common/common.module';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { ProductsController } from './product.controller';
import { StockHistoryController } from './stock-history.controller';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: ORDER_SERVICE,
                transport: Transport.GRPC,
                options: {
                    url: ServicesConfig.order.url,
                    package: order.ORDER_PACKAGE_NAME,
                    protoPath: join(__dirname, 'proto', 'order.proto'),
                },
            },
        ]),
        CommonModule,
        LoggerModule,
    ],
    controllers: [OrderController, ProductsController, StockHistoryController],
    providers: [OrderService],
})
export class OrderModule {}
