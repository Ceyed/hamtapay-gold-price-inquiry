import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsUUID } from 'class-validator';
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { uuid } from '../types';

export class BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    @IsNotEmpty()
    @IsUUID()
    id: uuid;

    @CreateDateColumn({
        name: 'created_at',
        default: () => 'CURRENT_TIMESTAMP(6)',
    })
    @IsDate()
    @Type(() => Date)
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        default: () => 'CURRENT_TIMESTAMP(6)',
        onUpdate: 'CURRENT_TIMESTAMP(6)',
    })
    @IsDate()
    updatedAt: Date;
}
