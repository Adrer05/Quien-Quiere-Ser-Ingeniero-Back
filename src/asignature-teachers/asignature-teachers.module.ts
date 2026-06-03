import { Module } from '@nestjs/common';
import { AsignatureTeachersService } from './asignature-teachers.service';
import { AsignatureTeachersController } from './asignature-teachers.controller';

@Module({
  controllers: [AsignatureTeachersController],
  providers: [AsignatureTeachersService],
})
export class AsignatureTeachersModule {}
