import { GoldGramsEnum } from '@libs/pricing';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ProductEntity } from '../entities';

@Injectable()
export class ProductRepository extends Repository<ProductEntity> {
    constructor(private readonly _dataSource: DataSource) {
        super(ProductEntity, _dataSource.createEntityManager());
    }

    async findByGoldGrams(goldGrams: GoldGramsEnum): Promise<ProductEntity> {
        return this.findOneBy({ goldGrams });
    }
}
