import { NOTIFICATION_SERVICE } from '@libs/notification';
import {
    OrderEntity,
    OrderRepository,
    ProductEntity,
    ProductRepository,
    StockHistoryEntity,
    StockHistoryRepository,
} from '@libs/order';
import { PRICING_SERVICE } from '@libs/pricing';
import { notification, pricing, RedisHelperModule } from '@libs/shared';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
    imports: [
        RedisHelperModule,
        TypeOrmModule.forFeature([OrderEntity, ProductEntity, StockHistoryEntity]),
        ClientsModule.register([
            {
                name: PRICING_SERVICE,
                transport: Transport.GRPC,
                options: {
                    url: '0.0.0.0:5002',
                    package: pricing.PRICING_PACKAGE_NAME,
                    protoPath: join(__dirname, 'proto', 'pricing.proto'),
                },
            },
            {
                name: NOTIFICATION_SERVICE,
                transport: Transport.GRPC,
                options: {
                    url: '0.0.0.0:5005',
                    package: notification.NOTIFICATION_PACKAGE_NAME,
                    protoPath: join(__dirname, 'proto', 'notification.proto'),
                },
            },
        ]),
    ],
    controllers: [OrderController],
    providers: [OrderService, OrderRepository, ProductRepository, StockHistoryRepository],
})
export class OrderModule {}
