import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { RankingService } from './ranking.service';
import { CreateRankingDto } from './dto/create-ranking.dto';
import { UpdateRankingDto } from './dto/update-ranking.dto';
import { PaginationDto } from 'src/common/dtos/pagination/pagination.dto';

@Controller('ranking')
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @Post()
  create(@Body() createRankingDto: CreateRankingDto) {
    return this.rankingService.create(createRankingDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.rankingService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.rankingService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRankingDto: UpdateRankingDto,
  ) {
    return this.rankingService.update(id, updateRankingDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.rankingService.remove(id);
  }
}
