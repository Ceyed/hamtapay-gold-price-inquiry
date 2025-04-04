import { registerAs } from '@nestjs/config';
import { ConfigFactoryKeyHost } from '@nestjs/config/dist/utils/register-as.util';
import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';

export declare type ClassConstructor<T> = {
    new (...args: any[]): T;
};

export function registerConfig<TConfig extends Record<string, any>>(
    classConstructor: ClassConstructor<TConfig>,
    configFactory: () => void,
): (() => TConfig) & ConfigFactoryKeyHost {
    const instance = plainToClass(classConstructor, configFactory(), {
        exposeDefaultValues: true,
    });
    const errors = validateSync(instance);
    if (errors.length > 0) {
        console.log('config instance is: ', instance);
        throw new Error(['Config Validation Error', ...errors.map((x) => x.toString())].join('\n'));
    }
    return registerAs(classConstructor.name, () => instance);
}
