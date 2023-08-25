import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
config();

import { TokenEntity } from '../entities/token.entity';

const entities = [TokenEntity];

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [...entities],
  logging: false,
  synchronize: true,
};

export const dataSource: DataSource = new DataSource(dataSourceOptions);
