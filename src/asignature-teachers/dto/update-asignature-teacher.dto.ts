import { PartialType } from '@nestjs/mapped-types';
import { CreateAsignatureTeacherDto } from './create-asignature-teacher.dto';

export class UpdateAsignatureTeacherDto extends PartialType(CreateAsignatureTeacherDto) {}
