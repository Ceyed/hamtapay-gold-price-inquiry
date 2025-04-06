import { LoggerService, LogModuleEnum } from '@libs/shared';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailSenderService {
    constructor(
        private readonly _mailerService: MailerService,
        private readonly _loggerService: LoggerService,
    ) {}

    async sendMail(targetEmails: string[], subject: string, html: string) {
        try {
            const result = await this._mailerService.sendMail({
                to: targetEmails,
                from: 'HGPI',
                subject: subject,
                html: html,
            });
            this._loggerService.debug(
                LogModuleEnum.Notification,
                `Mail sent ${JSON.stringify({
                    targetEmails,
                    subject,
                    html,
                    mailSendResult: result,
                })}`,
            );
            return true;
        } catch (error) {
            this._loggerService.error(
                LogModuleEnum.Notification,
                `Mail sent failed ${JSON.stringify({
                    targetEmails,
                    subject,
                    html,
                    mailSendError: error,
                })}`,
            );
            return false;
        }
    }
}
