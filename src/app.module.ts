import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createDataSourceOptions } from './common/config/datasource';
import { AuthGuard } from './auth/auth.guard';
import { UsersModule } from './users/users.module';
import { RolModule } from './roles/rol.module';
import { RankingModule } from './ranking/ranking.module';
import { SemesterModule } from './semesters/semester.module';
import { CareerModule } from './degrees/career.module';
import { SubjectsModule } from './subjects/subjects.module';
import { TopicsModule } from './topics/topics.module';
import { DifficultiesModule } from './difficulties/difficulties.module';
import { QuestionsModule } from './questions/questions.module';
import { AnswersModule } from './answers/answers.module';
import { GamesModule } from './games/games.module';
import { AsignatureTeachersModule } from './asignature-teachers/asignature-teachers.module';
import { AuthModule } from './auth/auth.module';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        createDataSourceOptions(configService),
    }),
    UsersModule,
    RolModule,
    RankingModule,
    CareerModule,
    SemesterModule,
    CareerModule,
    SubjectsModule,
    TopicsModule,
    DifficultiesModule,
    QuestionsModule,
    AnswersModule,
    GamesModule,
    AsignatureTeachersModule,
    AuthModule,
  ],
})
export class AppModule {}
