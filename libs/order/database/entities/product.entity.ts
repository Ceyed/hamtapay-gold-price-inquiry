import { GoldGramsEnum } from '@libs/pricing';
import { BaseEntity } from '@libs/shared';
import { IsEnum, IsNumber, Min } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';
import { OrderEntity } from './order.entity';
import { StockHistoryEntity } from './stock-history.entity';

@Entity('product')
export class ProductEntity extends BaseEntity {
    @Column({ type: 'enum', enum: GoldGramsEnum, unique: true })
    @IsEnum(GoldGramsEnum)
    goldGrams: GoldGramsEnum;

    @Column({ type: 'int', default: 0 })
    @IsNumber()
    @Min(0)
    currentStock: number;

    @Column({ type: 'int', default: 0 })
    @IsNumber()
    @Min(0)
    totalStock: number;

    @OneToMany(() => StockHistoryEntity, (stockHistory) => stockHistory.product)
    stockHistories: StockHistoryEntity[];

    @OneToMany(() => OrderEntity, (order) => order.product)
    orders: OrderEntity[];
}
