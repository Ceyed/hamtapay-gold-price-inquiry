import { OrderRegisteredDto, SendEmailConfirmationCodeDto } from '@libs/notification';
import { notification } from '@libs/shared';
import { Controller } from '@nestjs/common';
import { NotifyService } from './notify.service';

@Controller()
@notification.NotificationServiceControllerMethods()
export class NotifyController implements notification.NotificationServiceController {
    constructor(private readonly _notifyService: NotifyService) {}

    async orderRegistered(orderRegisteredDto: OrderRegisteredDto): Promise<void> {
        await this._notifyService.orderRegistered(orderRegisteredDto);
    }

    async sendEmailConfirmationCode(
        sendEmailConfirmationCodeDto: SendEmailConfirmationCodeDto,
    ): Promise<void> {
        await this._notifyService.sendEmailConfirmationCode(sendEmailConfirmationCodeDto);
    }
}
