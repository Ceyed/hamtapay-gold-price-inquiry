import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { StockHistoryEntity } from '../entities';

@Injectable()
export class StockHistoryRepository extends Repository<StockHistoryEntity> {
    constructor(private readonly _dataSource: DataSource) {
        super(StockHistoryEntity, _dataSource.createEntityManager());
    }

    async findAll(): Promise<StockHistoryEntity[]> {
        return this.find({ relations: { product: true }, order: { createdAt: 'DESC' } });
    }
}
