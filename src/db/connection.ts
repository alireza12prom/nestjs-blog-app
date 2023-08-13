import path from 'path';
import { DataSourceOptions, DataSource } from 'typeorm';

export const Config: DataSourceOptions = {
  type: 'postgres',
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: +process.env.DB_PORT,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  migrationsTableName: 'migration',
  entities: [path.join(__dirname, '/entities/*.entity.{ts,js}')],
  migrations: [path.join(__dirname, '/migrations/*.ts')],
  synchronize: false,
  logging: true,
};

export const connectionSource = new DataSource(Config);
