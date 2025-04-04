import { applyDecorators, Patch, Type } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { ClassConstructor } from 'class-transformer';
import { ApiCustomParamOption } from './custom-get.decorator';
import { getSharedDecorators } from './get-shared-decorators';
import { SharedUpdateRouteInfoDto } from '../dtos/shared-custom-route-info.dto';

export function PatchInfo(
    path: string,
    paramNames: string[] | Record<string, ApiCustomParamOption>,
    inputType: Type<unknown> | ClassConstructor<any>,
    inputIsArray = false,
    info: SharedUpdateRouteInfoDto,
) {
    const decorators: Array<ClassDecorator | MethodDecorator | PropertyDecorator> = [Patch(path)];

    if (inputType) {
        decorators.push(ApiBody({ type: () => inputType, isArray: inputIsArray }));
    }

    decorators.push(...getSharedDecorators(path, info, paramNames));

    return applyDecorators(...decorators);
}
