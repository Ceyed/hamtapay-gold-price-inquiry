import { applyDecorators, Post, Type } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { ClassConstructor } from 'class-transformer';
import { getSharedDecorators } from './get-shared-decorators';
import { SharedCustomRouteInfoDto } from '../dtos/shared-custom-route-info.dto';

export function PostInfo(
    path: string,
    inputType: Type<unknown> | ClassConstructor<any>,
    inputIsArray = false,
    info: SharedCustomRouteInfoDto,
    paramNames?: string[],
) {
    const decorators: Array<ClassDecorator | MethodDecorator | PropertyDecorator> = [Post(path)];

    if (inputType) {
        decorators.push(ApiBody({ type: () => inputType, isArray: inputIsArray }));
    }
    decorators.push(...getSharedDecorators(path, info, paramNames));

    return applyDecorators(...decorators);
}
