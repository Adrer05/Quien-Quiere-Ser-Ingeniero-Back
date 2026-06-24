import { Module } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { RankingController } from './ranking.controller';
import { Ranking } from './entities/ranking.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [RankingController],
  providers: [RankingService],
  imports: [TypeOrmModule.forFeature([Ranking]), UsersModule],
  exports: [RankingService],
})
export class RankingModule {}
