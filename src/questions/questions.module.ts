import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { Question } from './entities/question.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DifficultiesModule } from 'src/difficulties/difficulties.module';
import { TopicsModule } from 'src/topics/topics.module';

@Module({
  controllers: [QuestionsController],
  providers: [QuestionsService],
  imports: [
    TypeOrmModule.forFeature([Question]),
    DifficultiesModule,
    TopicsModule,
  ],
  exports: [QuestionsService],
})
export class QuestionsModule {}
