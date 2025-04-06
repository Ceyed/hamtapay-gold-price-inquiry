import { UserRoleEnum, uuid } from '@libs/shared';
import { Injectable } from '@nestjs/common';
import { SignupDto } from 'libs/auth/dtos';
import { DataSource, Repository, UpdateResult } from 'typeorm';
import { UserEntity } from '../entities';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
    constructor(private readonly _dataSource: DataSource) {
        super(UserEntity, _dataSource.createEntityManager());
    }

    async add(userSignupDto: SignupDto): Promise<UserEntity> {
        return this.save({
            ...userSignupDto,
            role: UserRoleEnum.User,
        });
    }

    async duplicateData(username: string, email: string): Promise<number> {
        return this.countBy([{ username }, { email }]);
    }

    async findByUsername(username: string): Promise<UserEntity> {
        return this.findOneBy({ username });
    }

    async findById(id: uuid): Promise<UserEntity> {
        return this.findOneBy({ id });
    }

    async updateRole(userId: uuid, role: UserRoleEnum): Promise<boolean> {
        const updateResult: UpdateResult = await this.update(userId, { role });
        return !!updateResult.affected;
    }

    async findAll(): Promise<UserEntity[]> {
        return this.find();
    }
}
