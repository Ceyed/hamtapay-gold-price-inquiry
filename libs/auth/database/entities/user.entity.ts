import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { BaseEntity } from 'libs/shared/entities/base.entity';
import { Column, Entity } from 'typeorm';
import { UserRoleEnum } from '../../../../libs/shared/enums';
import { UserStatusEnum } from '../../enums/user-status.enum';

@Entity({
    name: 'user',
})
export class UserEntity extends BaseEntity {
    @Column()
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @Column()
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @Column()
    @IsString()
    @IsNotEmpty()
    username: string;

    @Column()
    @IsString()
    @IsNotEmpty()
    password: string;

    @Column()
    @IsString()
    @IsNotEmpty()
    email: string;

    @Column({
        type: 'enum',
        enum: UserStatusEnum,
        enumName: 'user_status_enum',
        default: UserStatusEnum.NotVerified,
    })
    @IsEnum(UserStatusEnum)
    status: UserStatusEnum = UserStatusEnum.NotVerified;

    @Column({
        type: 'enum',
        enum: UserRoleEnum,
        enumName: 'user_role_enum',
        default: UserRoleEnum.User,
    })
    @IsEnum(UserRoleEnum)
    role: UserRoleEnum;
}
