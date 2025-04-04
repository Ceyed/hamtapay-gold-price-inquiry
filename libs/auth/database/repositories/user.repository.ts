import { UserRoleEnum } from '@lib/shared';
import { Injectable } from '@nestjs/common';
import { UserSignupDto } from 'libs/auth/dtos';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from '../entities';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
    constructor(private readonly _dataSource: DataSource) {
        super(UserEntity, _dataSource.createEntityManager());
    }

    async add(userSignupDto: UserSignupDto): Promise<UserEntity> {
        console.log(UserRoleEnum.User);
        return this.save({
            ...userSignupDto,
            role: UserRoleEnum.User,
        });
    }

    async duplicateData(username: string, email: string): Promise<number> {
        return this.countBy([{ username }, { email }]);
    }
}
