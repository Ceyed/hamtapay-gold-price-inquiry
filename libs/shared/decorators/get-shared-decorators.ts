import { HttpCode } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import {
    SharedCustomRouteInfoDto,
    SharedUpdateRouteInfoDto,
} from '../dtos/shared-custom-route-info.dto';
import { applyRouteParams } from '../utils';
import { ApiCustomParamOption } from './custom-get.decorator';

export function getSharedDecorators(
    path: string,
    info: SharedUpdateRouteInfoDto | SharedCustomRouteInfoDto,
    paramNames?: string[] | Record<string, ApiCustomParamOption>,
): Array<ClassDecorator | MethodDecorator | PropertyDecorator> {
    const { outputType, outputIsArray, ...args } = info;
    const decorators: Array<ClassDecorator | MethodDecorator | PropertyDecorator> = [
        ApiOperation({
            ...args,
        }),
    ];
    if (paramNames) {
        decorators.push(...applyRouteParams(path, paramNames));
    }
    if (outputType) {
        decorators.push(ApiOkResponse({ type: () => outputType, isArray: outputIsArray }));
    } else {
        decorators.push(HttpCode(204));
    }
    return decorators;
}
