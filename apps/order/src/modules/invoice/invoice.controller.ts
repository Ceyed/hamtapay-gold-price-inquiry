import { CreateInvoiceDto } from '@libs/order';
import { order } from '@libs/shared';
import { Controller } from '@nestjs/common';
import { InvoiceService } from './invoice.service';

@Controller()
@order.OrderServiceControllerMethods()
export class InvoiceController implements order.OrderServiceController {
    constructor(private readonly _invoiceService: InvoiceService) {}

    async createInvoice(createInvoiceDto: CreateInvoiceDto): Promise<order.CreateInvoiceResponse> {
        return this._invoiceService.createInvoice(createInvoiceDto);
    }

    async getInvoiceList(): Promise<order.GetInvoiceListResponse> {
        return this._invoiceService.getInvoiceList();
    }
}
