import { DataSourceOptions } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SnakeNamingStrategy } from './naming-strategy.config';
import { DataSource } from 'typeorm';

ConfigModule.forRoot({
  envFilePath: ".env",
  isGlobal: true
})

export const createDataSourceOptions = (configService: ConfigService): DataSourceOptions => {
  const isProduction = configService.get('IS_PRODUCTION') === 'true';

  return {
    type: 'postgres',
    host: configService.get('DB_HOST'),
    port: +configService.get('DB_PORT'),
    username: configService.get('POSTGRES_USER'),
    password: configService.get('POSTGRES_PASSWORD'),
    database: configService.get('POSTGRES_DB'),
    extra: {
      options: '-c timezone=UTC',
    },
    
    // Configuración de entidades según el entorno
    entities: isProduction 
      ? ['dist/**/*.entity.js'] 
      : [__dirname + './../../**/**/*.entity{.ts,.js}'],
    
    // Configuración de migraciones según el entorno
    migrations: isProduction 
      ? ['dist/migrations/*.js'] 
      : [__dirname + './../../migrations/*{.ts,.js}'],
    
    // Configuraciones específicas por entorno
    synchronize: !isProduction, // Solo en desarrollo
    migrationsRun: isProduction, // Solo en producción
    logging: !isProduction, // Solo logs en desarrollo
    
    namingStrategy: new SnakeNamingStrategy(),
    
    // SSL solo en producción
    ssl: isProduction ? { rejectUnauthorized: false } : false,
  };
};

export const AppDS = new DataSource(createDataSourceOptions(new ConfigService()))