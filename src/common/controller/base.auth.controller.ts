import platform from 'platform';
import { Response } from 'express';
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class BaseAuthController {
  protected async setCookie(res: Response, key: string, value: any) {
    res
      .cookie(key, value, {
        httpOnly: true,
        sameSite: 'strict',
      })
      .send({ status: 'success' });
  }

  protected platformInfo(userAgent: string) {
    const info = platform.parse(userAgent);
    return { description: info.description, name: info.name };
  }
}
