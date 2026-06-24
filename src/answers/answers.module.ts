import { Module } from '@nestjs/common';
import { AnswersService } from './answers.service';
import { AnswersController } from './answers.controller';
import { Answer } from './entities/answer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from 'src/questions/entities/question.entity';
import { QuestionsModule } from 'src/questions/questions.module';

@Module({
  controllers: [AnswersController],
  providers: [AnswersService],
  imports: [TypeOrmModule.forFeature([Answer]), QuestionsModule],
  exports: [AnswersService],
})
export class AnswersModule {}
