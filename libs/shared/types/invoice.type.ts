import { GoldGramsEnum } from '@libs/pricing';

export type InvoiceType = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    customerId: string;
    goldGrams: GoldGramsEnum;
    amount: number;
    gramPrice: number;
    totalPrice: number;
    // TODO: add multiple steps for purchase - pending, adminConfirmed, adminRejected
    // status: InvoiceStatusEnum;
};
