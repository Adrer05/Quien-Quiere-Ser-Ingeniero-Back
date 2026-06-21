import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Difficulty } from './entities/difficulty.entity';
import { CreateDifficultyDto } from './dto/create-difficulty.dto';
import { UpdateDifficultyDto } from './dto/update-difficulty.dto';
import { ManagerError } from './../common/errors/manager.error';
import { PaginationDto } from 'src/common/dtos/pagination/pagination.dto';


@Injectable()
export class DifficultiesService {
  constructor(
    @InjectRepository(Difficulty)
    private readonly difficultyRepo: Repository<Difficulty>,
  ) {}

  async create(createDifficultyDto: CreateDifficultyDto) {
    try {
      const difficulty = this.difficultyRepo.create(createDifficultyDto);
      const savedDifficulty = await this.difficultyRepo.save(difficulty);

      if (!savedDifficulty) {
        throw new ManagerError({ type: 'BAD_REQUEST', message: 'Error al crear una dificultad' });
      }
      return savedDifficulty;
    } catch (error) {
      if (error instanceof ManagerError) throw ManagerError.createSignatureError(error.message);
      throw error;
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, page } = paginationDto
    const skip = ( page - 1 ) * limit;
    try {
      const [difficulty, total] = await Promise.all([
        this.difficultyRepo.find({ skip: skip, take: limit }),
        this.difficultyRepo.count(),
      ])

      const lastPage = Math.ceil( total/limit )

      return {
        data: difficulty,
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
      const difficulty = await this.difficultyRepo.findOneBy({ id });
      if (!difficulty) throw new ManagerError({ type: 'NOT_FOUND', message: 'Dificultad no encontrada' });
      return difficulty;
    } catch (error) {
      if (error instanceof ManagerError) throw ManagerError.createSignatureError(error.message);
      throw error;
    }
  }

  async update(id: string, updateDifficultyDto: UpdateDifficultyDto) {
    try {
      const difficulty = await this.difficultyRepo.update(id, updateDifficultyDto);
      if (difficulty.affected === 0) throw new ManagerError({ type: 'NOT_FOUND', message: 'Dificultad no encontrada' });
      return difficulty;
    } catch (error) {
      if (error instanceof ManagerError) throw ManagerError.createSignatureError(error.message);
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const difficulty = await this.difficultyRepo.delete(id);
      if (difficulty.affected === 0) throw new ManagerError({ type: 'NOT_FOUND', message: 'Dificultad no encontrada' });
      return difficulty;
    } catch (error) {
      if (error instanceof ManagerError) throw ManagerError.createSignatureError(error.message);
      throw error;
    }
  }
}