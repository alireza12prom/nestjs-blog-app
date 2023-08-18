import { DocumentBuilder } from '@nestjs/swagger';
import { CookieTypes } from './common/constant';

export const documentBuilder = new DocumentBuilder()
  .setTitle('Blog Application')
  .setDescription('Blog REST APIs')
  .setVersion('1.0.0')
  .addCookieAuth(CookieTypes.AuthorizationCookie)
  .build();
