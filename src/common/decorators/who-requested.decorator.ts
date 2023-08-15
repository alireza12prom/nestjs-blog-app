import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const WhoRequested = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest<Request>();
    return req.data.who;
  },
);
