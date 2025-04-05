import { Controller } from '@nestjs/common';
import { MailSenderService } from './mail-sender.service';

@Controller()
export class MailSenderController {
    constructor(private readonly _mailSenderService: MailSenderService) {}
}
