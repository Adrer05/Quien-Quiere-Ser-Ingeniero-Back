import { Module } from '@nestjs/common';
import { CareerService } from './career.service';
import { CareerController } from './career.controller';
import { Career } from './entities/career.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [CareerController],
  providers: [CareerService],
  imports: [TypeOrmModule.forFeature([Career])],
  exports: [CareerService],
})
export class CareerModule {}
