import { Module } from '@nestjs/common';
import { AsignatureTeachersService } from './asignature-teachers.service';
import { AsignatureTeachersController } from './asignature-teachers.controller';
import { AsignatureTeacher } from './entities/asignature-teacher.entity';
import { UsersModule } from 'src/users/users.module';
import { SubjectsModule } from 'src/subjects/subjects.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [AsignatureTeachersController],
  providers: [AsignatureTeachersService],
  imports: [
    TypeOrmModule.forFeature([AsignatureTeacher]),
    UsersModule,
    SubjectsModule,
  ],
  exports: [AsignatureTeachersService],
})
export class AsignatureTeachersModule {}
