import { Request } from 'express';
import { catchError, throwError } from 'rxjs';
import { Filesystem } from '../../common/utils';
import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';

/**
 * @description
 * this interceptor will delete uploaded file from disk
 * if an error occurs.
 */
export class DeleteUploadedFile implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest<Request>();
    const uploadedFile = (req as any).file;

    return next.handle().pipe(
      catchError((err, caught) => {
        if (uploadedFile) {
          Filesystem.deleteIfExists(uploadedFile.path);
        }
        return throwError(() => err);
      }),
    );
  }
}
