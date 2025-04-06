import { BaseEntity, uuid } from '@libs/shared';
import { IsNumber, IsUUID, Min } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ProductEntity } from './product.entity';

@Entity('order')
export class OrderEntity extends BaseEntity {
    @Column({ type: 'uuid' })
    @IsUUID()
    customerId: uuid;

    @Column({ type: 'uuid' })
    @IsUUID()
    productId: uuid;

    @Column({ type: 'int' })
    @IsNumber()
    @Min(0)
    amount: number;

    @Column({ type: 'double precision' })
    @IsNumber()
    @Min(0)
    price: number;

    @ManyToOne(() => ProductEntity, (product) => product.orders)
    @JoinColumn({ name: 'productId' })
    product: ProductEntity;
}
