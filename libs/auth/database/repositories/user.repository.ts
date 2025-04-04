import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from '../entities';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
    constructor(private readonly _dataSource: DataSource) {
        super(UserEntity, _dataSource.createEntityManager());
    }
}
