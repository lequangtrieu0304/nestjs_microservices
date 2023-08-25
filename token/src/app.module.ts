import { Module } from '@nestjs/common';

import { TokensModule } from './tokens/tokens.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './shared/db/data-source';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions), TokensModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
