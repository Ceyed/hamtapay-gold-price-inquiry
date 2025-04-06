import { Module } from '@nestjs/common';
import { NotifyModule } from '../modules/notify/notify.module';

@Module({
    imports: [NotifyModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
