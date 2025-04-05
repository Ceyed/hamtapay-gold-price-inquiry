import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
@Injectable()
export class MailSenderService {
    constructor(private readonly mailerService: MailerService) {}

    private async _sendMail(targetEmails: string[], subject: string, html: string) {
        try {
            const result = await this.mailerService.sendMail({
                to: targetEmails,
                from: 'HGPI',
                subject: subject,
                html: html,
            });
            console.log(result);
            return true;
        } catch (_) {
            return false;
        }
    }
}
