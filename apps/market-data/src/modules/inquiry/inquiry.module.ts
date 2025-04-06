import { goldApiConfig } from '@libs/market-data';
import { LoggerModule, RedisHelperModule } from '@libs/shared';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InquiryController } from './inquiry.controller';
import { InquiryService } from './inquiry.service';

@Module({
    imports: [RedisHelperModule, ConfigModule.forFeature(goldApiConfig), LoggerModule],
    controllers: [InquiryController],
    providers: [InquiryService],
})
export class InquiryModule {}
