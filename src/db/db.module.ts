import { Global, Module } from '@nestjs/common';
import { DatabaseProvider } from './db.provider';

@Global()
@Module({
  providers: [...DatabaseProvider],
  exports: [...DatabaseProvider],
})
export class DbModule {}
