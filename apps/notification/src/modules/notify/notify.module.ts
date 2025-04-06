import { LoggerModule, RedisHelperModule } from '@libs/shared';
import { Module } from '@nestjs/common';
import { MailSenderModule } from '../mail-sender/mail-sender.module';
import { NotifyController } from './notify.controller';
import { NotifyService } from './notify.service';

@Module({
    imports: [MailSenderModule, RedisHelperModule, LoggerModule],
    controllers: [NotifyController],
    providers: [NotifyService],
})
export class NotifyModule {}
