import { UserRoleEnum } from '@libs/shared';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { BaseEntity } from 'libs/shared/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({
    name: 'user',
})
export class UserEntity extends BaseEntity {
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
        enum: UserRoleEnum,
        enumName: 'user_role_enum',
        default: UserRoleEnum.User,
    })
    @IsEnum(UserRoleEnum)
    role: UserRoleEnum;
}
