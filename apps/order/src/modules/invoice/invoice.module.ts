import { PRICING_SERVICE } from '@libs/pricing';
import { pricing } from '@libs/shared';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { InvoiceService } from './invoice.service';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: PRICING_SERVICE,
                transport: Transport.GRPC,
                options: {
                    package: pricing.PRICING_PACKAGE_NAME,
                    protoPath: join(__dirname, 'proto', 'pricing.proto'),
                },
            },
        ]),
    ],
    providers: [InvoiceService],
    exports: [InvoiceService],
})
export class InvoiceModule {}
