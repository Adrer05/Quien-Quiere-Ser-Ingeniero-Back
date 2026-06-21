import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ranking } from './entities/ranking.entity';
import { CreateRankingDto } from './dto/create-ranking.dto';
import { UpdateRankingDto } from './dto/update-ranking.dto';
import { ManagerError } from './../common/errors/manager.error';
import { UsersService } from './../users/users.service';
import { PaginationDto } from 'src/common/dtos/pagination/pagination.dto';


@Injectable()
export class RankingService {
  constructor(
    @InjectRepository(Ranking)
    private readonly rankingRepo: Repository<Ranking>,
    private readonly usersService: UsersService,
  ) {}

  async create(createRankingDto: CreateRankingDto) {
    try {
      const { userId, ...rankingData } = createRankingDto;
  
      const user = await this.usersService.findOne(userId);
  
      const existingRanking = await this.rankingRepo.findOne({
        where: { user: { id: userId } },
      });
  
      if (existingRanking) {
        throw new ManagerError({
          type: 'BAD_REQUEST',
          message: 'El usuario ya tiene un ranking registrado',
        });
      }
  
      const ranking = this.rankingRepo.create({ ...rankingData, user });
      const savedRanking = await this.rankingRepo.save(ranking);
  
      if (!savedRanking) {
        throw new ManagerError({ type: 'BAD_REQUEST', message: 'Error al crear un ranking' });
      }
      return savedRanking;
    } catch (error) {
      if (error instanceof ManagerError) throw ManagerError.createSignatureError(error.message);
      throw error;
    }
  }
  
  async findAll(paginationDto: PaginationDto) {
    const { limit, page } = paginationDto
    const skip = ( page - 1 ) * limit;
    try {
      const [ranking, total] = await Promise.all([
        this.rankingRepo.find({ skip: skip, take: limit }),
        this.rankingRepo.count(),
      ])

      const lastPage = Math.ceil( total/limit )

      return {
        data: ranking,
        meta: {
          total, 
          page,
          limit,
          lastPage
        }
      }
    } catch (error) {
      if(error instanceof ManagerError){
        throw ManagerError.createSignatureError(error.message);
      }

      throw error
    }
  }
  async findOne(id: string) {
    try {
      const ranking = await this.rankingRepo.findOne({ where: { id }, relations: { user: true } });
      if (!ranking) throw new ManagerError({ type: 'NOT_FOUND', message: 'Ranking no encontrado' });
      return ranking;
    } catch (error) {
      if (error instanceof ManagerError) throw ManagerError.createSignatureError(error.message);
      throw error;
    }
  }

  async update(id: string, updateRankingDto: UpdateRankingDto) {
    try {
      const { userId, ...rankingData } = updateRankingDto;
      let user;
      if (userId) user = await this.usersService.findOne(userId);

      const ranking = await this.rankingRepo.update(id, { ...rankingData, ...(user && { user }) });
      if (ranking.affected === 0) throw new ManagerError({ type: 'NOT_FOUND', message: 'Ranking no encontrado' });
      return ranking;
    } catch (error) {
      if (error instanceof ManagerError) throw ManagerError.createSignatureError(error.message);
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const ranking = await this.rankingRepo.delete(id);
      if (ranking.affected === 0) throw new ManagerError({ type: 'NOT_FOUND', message: 'Ranking no encontrado' });
      return ranking;
    } catch (error) {
      if (error instanceof ManagerError) throw ManagerError.createSignatureError(error.message);
      throw error;
    }
  }
}