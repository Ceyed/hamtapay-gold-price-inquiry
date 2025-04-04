import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { InquiryModule } from '../modules/inquiry/inquiry.module';

@Module({
    imports: [ScheduleModule.forRoot(), InquiryModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
