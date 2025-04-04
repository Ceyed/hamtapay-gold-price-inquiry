import { applyDecorators, Put, Type } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { ClassConstructor } from 'class-transformer';
import { SharedUpdateRouteInfoDto } from '../dtos/shared-custom-route-info.dto';
import { ApiCustomParamOption } from './custom-get.decorator';
import { getSharedDecorators } from './get-shared-decorators';

export function PutInfo(
    path: string,
    paramNames: string[] | Record<string, ApiCustomParamOption>,
    inputType: Type<unknown> | ClassConstructor<any>,
    inputIsArray = false,
    info: SharedUpdateRouteInfoDto,
) {
    const decorators: Array<ClassDecorator | MethodDecorator | PropertyDecorator> = [Put(path)];

    if (inputType) {
        decorators.push(ApiBody({ type: () => inputType, isArray: inputIsArray }));
    }
    decorators.push(...getSharedDecorators(path, info, paramNames));

    return applyDecorators(...decorators);
}
