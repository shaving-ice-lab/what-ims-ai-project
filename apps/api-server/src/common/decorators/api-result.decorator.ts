import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

export class ResultDto<T> {
  code: number;
  message: string;
  data: T;
  timestamp: string;
}

export const ApiResult = <TModel extends Type<unknown>>(model?: TModel) => {
  return applyDecorators(
    ApiExtraModels(ResultDto, model || class {}),
    ApiOkResponse({
      schema: {
        allOf: [
          {
            properties: {
              code: { type: 'number', example: 0 },
              message: { type: 'string', example: 'success' },
              timestamp: {
                type: 'string',
                example: new Date().toISOString(),
              },
              data: model ? { $ref: getSchemaPath(model) } : { type: 'object' },
            },
          },
        ],
      },
    }),
  );
};

export const ApiPaginatedResult = <TModel extends Type<unknown>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiExtraModels(ResultDto, model),
    ApiOkResponse({
      schema: {
        allOf: [
          {
            properties: {
              code: { type: 'number', example: 0 },
              message: { type: 'string', example: 'success' },
              timestamp: {
                type: 'string',
                example: new Date().toISOString(),
              },
              data: {
                type: 'object',
                properties: {
                  items: {
                    type: 'array',
                    items: { $ref: getSchemaPath(model) },
                  },
                  total: { type: 'number', example: 100 },
                  page: { type: 'number', example: 1 },
                  pageSize: { type: 'number', example: 20 },
                },
              },
            },
          },
        ],
      },
    }),
  );
};
