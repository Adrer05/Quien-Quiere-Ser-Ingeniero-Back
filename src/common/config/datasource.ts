import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { ConfigModule, ConfigService } from '@nestjs/config';

ConfigModule.forRoot({
  envFilePath: `.env`,
});

const configService = new ConfigService();
const isProd = Boolean(configService.get('IS_PROD'))

export const DataSourceConfig: DataSourceOptions = {
  type: 'postgres',
  host: configService.get('DATABASE_HOST'),
  port: +configService.get('DATABASE_PORT'),
  username: configService.get('DATABASE_USER'),
  password: configService.get('DATABASE_PASSWORD'),
  database: configService.get('DATABASE_NAME'),
  entities: [__dirname + './../../**/**/*.entity{.ts,.js}'],
  migrations: [__dirname + './../../migrations/*{.ts,.js}'],
  synchronize: isProd,
  migrationsRun: !isProd,
  logging: !isProd,
  namingStrategy: new SnakeNamingStrategy(),
};

export const AppDS = new DataSource(DataSourceConfig);