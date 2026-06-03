import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AsignatureTeachersService } from './asignature-teachers.service';
import { CreateAsignatureTeacherDto } from './dto/create-asignature-teacher.dto';
import { UpdateAsignatureTeacherDto } from './dto/update-asignature-teacher.dto';

@Controller('asignature-teachers')
export class AsignatureTeachersController {
  constructor(private readonly asignatureTeachersService: AsignatureTeachersService) {}

  @Post()
  create(@Body() createAsignatureTeacherDto: CreateAsignatureTeacherDto) {
    return this.asignatureTeachersService.create(createAsignatureTeacherDto);
  }

  @Get()
  findAll() {
    return this.asignatureTeachersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.asignatureTeachersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAsignatureTeacherDto: UpdateAsignatureTeacherDto) {
    return this.asignatureTeachersService.update(+id, updateAsignatureTeacherDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.asignatureTeachersService.remove(+id);
  }
}
