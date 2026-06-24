import { DataSourceOptions } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SnakeNamingStrategy } from './naming-strategy.config';
import { DataSource } from 'typeorm';

ConfigModule.forRoot({
  envFilePath: '.env',
  isGlobal: true,
});

export const createDataSourceOptions = (
  configService: ConfigService,
): DataSourceOptions => {
  const isProduction = configService.get('IS_PRODUCTION') === 'true';

  return {
    type: 'postgres',
    url: configService.get('DATABASE_URL'),
    ssl: { rejectUnauthorized: false },

    entities: isProduction
      ? ['dist/**/*.entity.js']
      : [__dirname + './../../**/**/*.entity{.ts,.js}'],

    migrations: isProduction
      ? ['dist/migrations/*.js']
      : [__dirname + './../../migrations/*{.ts,.js}'],

    synchronize: !isProduction,
    migrationsRun: isProduction,
    logging: !isProduction,

    namingStrategy: new SnakeNamingStrategy(),
  };
};

export const AppDS = new DataSource(
  createDataSourceOptions(new ConfigService()),
);
