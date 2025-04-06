import { mailConfig } from '@libs/notification';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { LoggerModule } from '@libs/shared';
import { MailSenderController } from './mail-sender.controller';
import { MailSenderService } from './mail-sender.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [mailConfig],
        }),
        MailerModule.forRootAsync({
            imports: [ConfigModule.forFeature(mailConfig)],
            useFactory: (mailConfigService: ConfigType<typeof mailConfig>) => ({
                transport: {
                    host: mailConfigService.host,
                    secure: true,
                    port: 465,
                    auth: {
                        user: mailConfigService.user,
                        pass: mailConfigService.pass,
                    },
                },
            }),
            inject: [mailConfig.KEY],
        }),
        LoggerModule,
    ],
    controllers: [MailSenderController],
    providers: [MailSenderService],
    exports: [MailSenderService],
})
export class MailSenderModule {}
