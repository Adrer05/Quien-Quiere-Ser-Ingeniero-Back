import { Injectable } from '@nestjs/common';
import { CreateDifficultyDto } from './dto/create-difficulty.dto';
import { UpdateDifficultyDto } from './dto/update-difficulty.dto';

@Injectable()
export class DifficultiesService {
  create(createDifficultyDto: CreateDifficultyDto) {
    return 'This action adds a new difficulty';
  }

  findAll() {
    return `This action returns all difficulties`;
  }

  findOne(id: number) {
    return `This action returns a #${id} difficulty`;
  }

  update(id: number, updateDifficultyDto: UpdateDifficultyDto) {
    return `This action updates a #${id} difficulty`;
  }

  remove(id: number) {
    return `This action removes a #${id} difficulty`;
  }
}
