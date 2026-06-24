import { Module } from '@nestjs/common';
import { DifficultiesService } from './difficulties.service';
import { DifficultiesController } from './difficulties.controller';
import { Difficulty } from './entities/difficulty.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [DifficultiesController],
  providers: [DifficultiesService],
  imports: [TypeOrmModule.forFeature([Difficulty])],
  exports: [DifficultiesService],
})
export class DifficultiesModule {}
