import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

export const SwaggerFileUplaod = (name: string, required?: boolean) => {
  return applyDecorators(
    ApiBody({
      schema: {
        type: 'object',
        required: [required ? name : undefined],
        properties: {
          [name]: { type: 'string', format: 'binary' },
        },
      },
    }),
    ApiConsumes('multipart/form-data'),
  );
};
