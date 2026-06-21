import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { AsignatureTeachersService } from './asignature-teachers.service';
import { CreateAsignatureTeacherDto } from './dto/create-asignature-teacher.dto';
import { UpdateAsignatureTeacherDto } from './dto/update-asignature-teacher.dto';
import { PaginationDto } from 'src/common/dtos/pagination/pagination.dto';

@Controller('asignature-teachers')
export class AsignatureTeachersController {
  constructor(private readonly asignatureTeachersService: AsignatureTeachersService) {}

  @Post()
  create(@Body() createAsignatureTeacherDto: CreateAsignatureTeacherDto) {
    return this.asignatureTeachersService.create(createAsignatureTeacherDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.asignatureTeachersService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.asignatureTeachersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateAsignatureTeacherDto: UpdateAsignatureTeacherDto) {
    return this.asignatureTeachersService.update(id, updateAsignatureTeacherDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.asignatureTeachersService.remove(id);
  }
}