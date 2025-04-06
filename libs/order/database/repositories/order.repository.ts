import { Injectable } from '@nestjs/common';
import { StockHistoryTypeEnum } from 'libs/order/enums';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { OrderEntity, ProductEntity, StockHistoryEntity } from '../entities';
import { uuid } from './../../../shared/types/uuid.type';

@Injectable()
export class OrderRepository extends Repository<OrderEntity> {
    constructor(private readonly _dataSource: DataSource) {
        super(OrderEntity, _dataSource.createEntityManager());
    }

    async registerOrderTransaction(
        customerId: uuid,
        product: ProductEntity,
        amount: number,
        price: number,
    ): Promise<OrderEntity> {
        const queryRunner: QueryRunner = this._dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        let order: OrderEntity = null;

        try {
            order = await queryRunner.manager.save(OrderEntity, {
                customerId,
                productId: product.id,
                amount,
                price,
            });

            await queryRunner.manager.update(
                ProductEntity,
                { id: product.id },
                { currentStock: () => `currentStock - ${amount}` },
            );

            await queryRunner.manager.save(StockHistoryEntity, {
                type: StockHistoryTypeEnum.StockOut,
                amount,
                productId: product.id,
            });

            await queryRunner.commitTransaction();

            product.currentStock -= amount;
            order.product = product;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            console.log(error);
            order = null;
        } finally {
            await queryRunner.release();
        }

        return order;
    }

    async findAll(): Promise<OrderEntity[]> {
        return this.find({ relations: { product: true } });
    }
}
