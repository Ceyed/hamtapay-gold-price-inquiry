import { OrderRegisteredDto, SendEmailConfirmationCodeDto } from '@libs/notification';
import {
    findUserById,
    GetInvoiceRedisKey,
    LoggerService,
    LogModuleEnum,
    order,
    RedisHelperService,
    RedisPrefixesEnum,
    RedisProjectEnum,
    RedisSubPrefixesEnum,
    UserType,
} from '@libs/shared';
import { Injectable } from '@nestjs/common';
import { MailSenderService } from '../mail-sender/mail-sender.service';

enum EmailTemplateEnum {
    InvoiceConfirmation = 'InvoiceConfirmation',
    NotifyAdmins = 'NotifyAdmins',
    ConfirmationCode = 'ConfirmationCode',
}

@Injectable()
export class NotifyService {
    constructor(
        private readonly _mailSenderService: MailSenderService,
        private readonly _redisHelperService: RedisHelperService,
        private readonly _loggerService: LoggerService,
    ) {}

    async sendEmailConfirmationCode({
        customerId,
        confirmationCode,
    }: SendEmailConfirmationCodeDto): Promise<void> {
        const customer: UserType = await findUserById(this._redisHelperService, customerId);
        if (!customer) {
            this._loggerService.info(LogModuleEnum.Notification, 'Customer not found');
            return;
        }
        const emailHtml: string = await this._generateEmailHtml(
            EmailTemplateEnum.ConfirmationCode,
            customer,
            undefined,
            confirmationCode,
        );
        this._mailSenderService.sendMail([customer.email], 'Confirmation Code', emailHtml);
    }

    async orderRegistered({ orderId, newStock, totalStock }: OrderRegisteredDto): Promise<void> {
        this._loggerService.info(
            LogModuleEnum.Notification,
            `Order registered ${JSON.stringify({
                orderId,
                newStock,
                totalStock,
            })}`,
        );

        // * Get order info from redis
        const invoiceRedisKey: string = GetInvoiceRedisKey(this._redisHelperService, orderId);
        const invoice: order.OrderProtoType =
            await this._redisHelperService.getCache<order.OrderProtoType>(invoiceRedisKey);
        if (!invoice) {
            this._loggerService.info(LogModuleEnum.Notification, 'Invoice not found');
            return;
        }
        const customer: UserType = await findUserById(this._redisHelperService, invoice.customerId);
        if (!customer) {
            this._loggerService.info(LogModuleEnum.Notification, 'Customer not found');
            return;
        }

        // * Send invoice confirmation email
        const invoiceConfirmationHtml: string = await this._generateEmailHtml(
            EmailTemplateEnum.InvoiceConfirmation,
            customer,
            invoice,
        );
        this._mailSenderService.sendMail(
            [customer.email],
            'Invoice Confirmation',
            invoiceConfirmationHtml,
        );

        // * Based on new stock, send mail to admins
        if (!this._shouldNotifyAdmins(newStock, totalStock)) {
            return;
        }

        // * Send stock alert email to admins
        this._loggerService.info(
            LogModuleEnum.Notification,
            `Sending stock alert email to admins. ${JSON.stringify({
                goldGrams: invoice.goldGrams,
                newStock,
                totalStock,
            })}`,
        );
        const admins: UserType[] = await this._findAdmins();
        const notifyAdminsHtml: string = await this._generateEmailHtml(
            EmailTemplateEnum.NotifyAdmins,
            customer,
            invoice,
        );
        this._mailSenderService.sendMail(
            admins.map((admin) => admin.email),
            'Stock Alert',
            notifyAdminsHtml,
        );
    }

    private _shouldNotifyAdmins(newStock: number, totalStock: number) {
        // * Notify admins if new stock is less than 10% of total stock
        return newStock < totalStock * 0.1;
    }

    private async _findAdmins(): Promise<UserType[]> {
        const admins: UserType[] = [];
        const pattern: string = this._redisHelperService.getPatternKey(
            RedisProjectEnum.Auth,
            RedisPrefixesEnum.User,
            RedisSubPrefixesEnum.Admin,
        );
        const keys: string[] = await this._redisHelperService.getKeysByPattern(pattern);
        for (const key of keys) {
            const user: UserType = await this._redisHelperService.getCache<UserType>(key);
            admins.push(user);
        }
        this._loggerService.debug(LogModuleEnum.Notification, `Found ${admins.length} admins`);
        return admins;
    }

    private async _generateEmailHtml(
        template: EmailTemplateEnum,
        customer: UserType,
        order?: order.OrderProtoType,
        confirmationCode?: string,
    ): Promise<string> {
        switch (template) {
            case EmailTemplateEnum.InvoiceConfirmation:
                return `
                <h1>Invoice Confirmation</h1>
                <p>Dear ${customer.firstName} ${customer.lastName},</p>
                <p>We are pleased to confirm that your invoice has been successfully created.</p>
                <p>Invoice Grams: ${order.goldGrams}</p>
                <p>Invoice Amount: ${order.amount}</p>
                <p>Invoice Total Price: ${order.totalPrice}</p>
                <p>Invoice Date: ${order.createdAt}</p>
                <p>Thank you for choosing HGPI.</p>
                <p>Best regards,</p>
                <p>HGPI Team</p>
                `;
            case EmailTemplateEnum.NotifyAdmins:
                return `
                <h1>Stock Alert</h1>
                <p>Dear Admin,</p>
                <p>We have less than 10% of ${order.goldGrams} stock left.</p>
                <p>For the love of God, do something about it. We may loose money :/</p>
                <p>Best regards,</p>
                <p>HGPI Team</p>
                `;
            case EmailTemplateEnum.ConfirmationCode:
                return `
                <h1>Confirmation Code</h1>
                <p>Dear ${customer.firstName} ${customer.lastName},</p>
                <p>Welcome to HGPI</p>
                <p>Your confirmation code is <b>${confirmationCode}</b>.</p>
                <p>Please enter this code to confirm your account.</p>
                <br/>
                <p>Thank you for choosing HGPI.</p> 
                <p>Best regards,</p>
                <p>HGPI Team</p>
                `;
            default:
                return '';
        }
    }
}
