import { ORDER_SERVICE } from '@libs/order';
import { order } from '@libs/shared';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { CommonModule } from '../common/common.module';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { ProductsController } from './product.controller';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: ORDER_SERVICE,
                transport: Transport.GRPC,
                options: {
                    package: order.ORDER_PACKAGE_NAME,
                    url: 'localhost:5001',
                    protoPath: join(__dirname, 'proto', 'order.proto'),
                },
            },
        ]),
        CommonModule,
    ],
    controllers: [OrderController, ProductsController],
    providers: [OrderService],
})
export class OrderModule {}
