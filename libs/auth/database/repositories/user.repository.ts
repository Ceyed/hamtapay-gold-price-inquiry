import { UserRoleEnum, uuid } from '@lib/shared';
import { Injectable } from '@nestjs/common';
import { SignupDto } from 'libs/auth/dtos';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from '../entities';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
    constructor(private readonly _dataSource: DataSource) {
        super(UserEntity, _dataSource.createEntityManager());
    }

    async add(userSignupDto: SignupDto): Promise<UserEntity> {
        console.log(UserRoleEnum.User);
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
}
