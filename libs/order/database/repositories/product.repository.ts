import { uuid } from '@libs/shared';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ProductEntity } from '../entities';

@Injectable()
export class ProductRepository extends Repository<ProductEntity> {
    constructor(private readonly _dataSource: DataSource) {
        super(ProductEntity, _dataSource.createEntityManager());
    }

    async findById(productId: uuid): Promise<ProductEntity> {
        return this.findOneBy({ id: productId });
    }

    async findAll(withRelations = false): Promise<ProductEntity[]> {
        return this.find({
            relations: withRelations ? { orders: true, stockHistories: true } : undefined,
            order: { goldGrams: 'ASC' },
        });
    }
}
