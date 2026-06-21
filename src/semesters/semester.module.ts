import { Module } from '@nestjs/common';
import { SemesterService } from './semester.service';
import { SemesterController } from './semester.controller';
import { Semester } from './entities/semester.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CareerModule } from 'src/degrees/career.module';
import { CareerService } from 'src/degrees/career.service';
@Module({
  controllers: [SemesterController],
  providers: [SemesterService],
  imports: [
    TypeOrmModule.forFeature([Semester]),
    CareerModule
  ],
  exports: [SemesterService]
})
export class SemesterModule {}
