import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieparser from 'cookie-parser';
import { documentBuilder } from './swagger.config';
import { SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieparser());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  // swagger
  const document = SwaggerModule.createDocument(app, documentBuilder, {
    deepScanRoutes: true,
  });
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}
bootstrap();
