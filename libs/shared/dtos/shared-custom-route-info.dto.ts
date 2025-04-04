import { Type } from '@nestjs/common';
import { ExternalDocumentationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { ClassConstructor } from 'class-transformer';

export interface SharedCustomRouteInfoDto {
    summary?: string;
    description?: string;
    outputType?: Type<unknown> | ClassConstructor<any>;
    outputIsArray?: boolean;
    externalDocs?: ExternalDocumentationObject;
}

export type SharedUpdateRouteInfoDto = Partial<SharedCustomRouteInfoDto>;
