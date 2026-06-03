import { Injectable } from '@nestjs/common';
import { CreateAsignatureTeacherDto } from './dto/create-asignature-teacher.dto';
import { UpdateAsignatureTeacherDto } from './dto/update-asignature-teacher.dto';

@Injectable()
export class AsignatureTeachersService {
  create(createAsignatureTeacherDto: CreateAsignatureTeacherDto) {
    return 'This action adds a new asignatureTeacher';
  }

  findAll() {
    return `This action returns all asignatureTeachers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} asignatureTeacher`;
  }

  update(id: number, updateAsignatureTeacherDto: UpdateAsignatureTeacherDto) {
    return `This action updates a #${id} asignatureTeacher`;
  }

  remove(id: number) {
    return `This action removes a #${id} asignatureTeacher`;
  }
}
