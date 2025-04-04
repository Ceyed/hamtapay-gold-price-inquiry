import { applyDecorators, Delete } from '@nestjs/common';
import { SharedUpdateRouteInfoDto } from '../dtos/shared-custom-route-info.dto';
import { getSharedDecorators } from './get-shared-decorators';

export function DeleteInfo(path: string, paramName: string[], info: SharedUpdateRouteInfoDto) {
    const decorators: Array<ClassDecorator | MethodDecorator | PropertyDecorator> = [Delete(path)];
    decorators.push(...getSharedDecorators(path, info, paramName));

    return applyDecorators(...decorators);
}
