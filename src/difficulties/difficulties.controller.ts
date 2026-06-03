import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DifficultiesService } from './difficulties.service';
import { CreateDifficultyDto } from './dto/create-difficulty.dto';
import { UpdateDifficultyDto } from './dto/update-difficulty.dto';

@Controller('difficulties')
export class DifficultiesController {
  constructor(private readonly difficultiesService: DifficultiesService) {}

  @Post()
  create(@Body() createDifficultyDto: CreateDifficultyDto) {
    return this.difficultiesService.create(createDifficultyDto);
  }

  @Get()
  findAll() {
    return this.difficultiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.difficultiesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDifficultyDto: UpdateDifficultyDto) {
    return this.difficultiesService.update(+id, updateDifficultyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.difficultiesService.remove(+id);
  }
}
