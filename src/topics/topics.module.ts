import { Module } from '@nestjs/common';
import { TopicsService } from './topics.service';
import { TopicsController } from './topics.controller';
import { Topic } from './entities/topic.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubjectsModule } from 'src/subjects/subjects.module';

@Module({
  controllers: [TopicsController],
  providers: [TopicsService],
  imports: [
    TypeOrmModule.forFeature([Topic]),
    SubjectsModule
  ],
  exports: [TopicsService]
})
export class TopicsModule {}
