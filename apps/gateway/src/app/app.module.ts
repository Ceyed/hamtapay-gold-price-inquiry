import { Module } from '@nestjs/common';
import { AuthModule } from '../modules/auth/auth.module';
import { CommonModule } from '../modules/common/common.module';
import { OrderModule } from '../modules/order/order.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [CommonModule, AuthModule, OrderModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
