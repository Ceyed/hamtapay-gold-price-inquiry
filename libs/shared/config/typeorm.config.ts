import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class TypeormConfig {
    @IsString()
    connection = 'postgres' as const;

    @IsNumber()
    port = 5432;

    @IsString()
    @IsNotEmpty()
    host: string;

    @IsString()
    @IsNotEmpty()
    database: string;

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsBoolean()
    synchronize = false;

    @IsString()
    logging = 'all';

    constructor(obj: Partial<TypeormConfig>) {
        Object.assign(this, obj);
    }
}
