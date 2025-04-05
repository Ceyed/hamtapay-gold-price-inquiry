import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailSenderController } from './mail-sender.controller';
import { MailSenderService } from './mail-sender.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                transport: {
                    host: configService.get('MAIL_HOST'),
                    secure: true,
                    port: 465,
                    auth: {
                        user: configService.get('MAIL_USER'),
                        pass: configService.get('MAIL_PASS'),
                    },
                },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [MailSenderController],
    providers: [MailSenderService],
})
export class MailSenderModule {}
