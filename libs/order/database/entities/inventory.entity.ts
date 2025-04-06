import { GoldGramsEnum } from '@libs/pricing';
import { BaseEntity } from '@libs/shared';
import { IsEnum, IsNumber, Min } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';
import { StockHistoryEntity } from './stock-history.entity';

@Entity('inventory')
export class InventoryEntity extends BaseEntity {
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

    @OneToMany(() => StockHistoryEntity, (stockHistory) => stockHistory.inventory)
    stockHistories: StockHistoryEntity[];
}
