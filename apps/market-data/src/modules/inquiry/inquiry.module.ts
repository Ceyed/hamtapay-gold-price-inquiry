import { goldApiConfig } from '@libs/market-data';
import { RedisHelperModule } from '@libs/shared';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InquiryService } from './inquiry.service';

@Module({
    imports: [RedisHelperModule, ConfigModule.forFeature(goldApiConfig)],
    providers: [InquiryService],
})
export class InquiryModule {}
