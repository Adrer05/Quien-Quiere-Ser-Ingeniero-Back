import { Module } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { SubjectsController } from './subjects.controller';
import { Subject } from './entities/subject.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SemesterModule } from 'src/semesters/semester.module';

@Module({
  controllers: [SubjectsController],
  providers: [SubjectsService],
  imports: [
    TypeOrmModule.forFeature([Subject]),
    SemesterModule
  ],
  exports: [SubjectsService]
})
export class SubjectsModule {}
