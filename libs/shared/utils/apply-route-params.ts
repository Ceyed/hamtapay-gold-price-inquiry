import { ApiParam } from '@nestjs/swagger';
import { ApiCustomParamOption } from '../decorators/custom-get.decorator';

export function applyRouteParams(
    path: string,
    paramNames: string[] | Record<string, ApiCustomParamOption>,
): Array<ClassDecorator | MethodDecorator | PropertyDecorator> {
    const decorators: Array<ClassDecorator | MethodDecorator | PropertyDecorator> = [];
    const paramRegex = /:(\w+)(?=\/|$)/g;
    const params: string[] = path.match(paramRegex)?.map((param) => param.slice(1));
    const paramNameKeys: any[] = !Array.isArray(paramNames) ? Object.keys(paramNames) : paramNames;
    if (!params?.every((param) => paramNameKeys.includes(param))) {
        throw new Error(
            'please provide all the param names in param names array in the arguments of decorator',
        );
    }
    paramNameKeys.forEach((paramKey) =>
        decorators.push(
            ApiParam({
                name: paramKey,
                ...(!Array.isArray(paramNames) ? paramNames[paramKey] : { type: 'string' }),
                required: true,
            }),
        ),
    );
    return decorators;
}
