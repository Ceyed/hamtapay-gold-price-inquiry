import { Module } from '@nestjs/common';
import { MailSenderModule } from '../modules/mail-sender/mail-sender.module';

@Module({
    imports: [MailSenderModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
