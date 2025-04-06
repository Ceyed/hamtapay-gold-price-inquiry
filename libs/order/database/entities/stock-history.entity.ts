import { BaseEntity, uuid } from '@libs/shared';
import { IsEnum, IsNumber, IsUUID, Min } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { StockHistoryTypeEnum } from './../../enums/stock-history-type.enum';
import { InventoryEntity } from './inventory.entity';

@Entity('stock_history')
export class StockHistoryEntity extends BaseEntity {
    @Column({ type: 'enum', enum: StockHistoryTypeEnum })
    @IsEnum(StockHistoryTypeEnum)
    type: StockHistoryTypeEnum;

    @Column({ type: 'int', default: 0 })
    @IsNumber()
    @Min(0)
    amount: number;

    @Column({ type: 'uuid' })
    @IsUUID()
    inventoryId: uuid;

    @ManyToOne(() => InventoryEntity, (inventory) => inventory.stockHistories)
    @JoinColumn({ name: 'inventoryId' })
    inventory: InventoryEntity;
}
