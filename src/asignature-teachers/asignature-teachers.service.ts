import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AsignatureTeacher } from './entities/asignature-teacher.entity';
import { CreateAsignatureTeacherDto } from './dto/create-asignature-teacher.dto';
import { UpdateAsignatureTeacherDto } from './dto/update-asignature-teacher.dto';
import { ManagerError } from './../common/errors/manager.error';
import { UsersService } from './../users/users.service';
import { SubjectsService } from './../subjects/subjects.service';
import { PaginationDto } from 'src/common/dtos/pagination/pagination.dto';

@Injectable()
export class AsignatureTeachersService {
  constructor(
    @InjectRepository(AsignatureTeacher)
    private readonly asignatureTeacherRepo: Repository<AsignatureTeacher>,
    private readonly usersService: UsersService,
    private readonly subjectsService: SubjectsService,
  ) {}

  async create(createAsignatureTeacherDto: CreateAsignatureTeacherDto) {
    try {
      const { userId, subjectId } = createAsignatureTeacherDto;

      const user = await this.usersService.findOne(userId);
      const subject = await this.subjectsService.findOne(subjectId);

      const existing = await this.asignatureTeacherRepo.findOne({
        where: { user: { id: userId }, subject: { id: subjectId } },
      });

      if (existing) {
        throw new ManagerError({
          type: 'BAD_REQUEST',
          message: 'Este profesor ya está asignado a esta asignatura',
        });
      }

      const asignatureTeacher = this.asignatureTeacherRepo.create({
        user,
        subject,
      });
      const savedAsignatureTeacher =
        await this.asignatureTeacherRepo.save(asignatureTeacher);

      if (!savedAsignatureTeacher) {
        throw new ManagerError({
          type: 'BAD_REQUEST',
          message: 'Error al asignar el profesor',
        });
      }
      return savedAsignatureTeacher;
    } catch (error) {
      if (error instanceof ManagerError)
        throw ManagerError.createSignatureError(error.message);
      throw error;
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, page } = paginationDto;
    const skip = (page - 1) * limit;
    try {
      const [asignatureTeacher, total] = await Promise.all([
        this.asignatureTeacherRepo.find({ skip: skip, take: limit }),
        this.asignatureTeacherRepo.count(),
      ]);

      const lastPage = Math.ceil(total / limit);

      return {
        data: asignatureTeacher,
        meta: {
          total,
          page,
          limit,
          lastPage,
        },
      };
    } catch (error) {
      if (error instanceof ManagerError) {
        throw ManagerError.createSignatureError(error.message);
      }

      throw error;
    }
  }
  async findOne(id: string) {
    try {
      const asignatureTeacher = await this.asignatureTeacherRepo.findOne({
        where: { id },
        relations: { user: true, subject: true },
      });
      if (!asignatureTeacher)
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'Asignación no encontrada',
        });
      return asignatureTeacher;
    } catch (error) {
      if (error instanceof ManagerError)
        throw ManagerError.createSignatureError(error.message);
      throw error;
    }
  }

  async update(
    id: string,
    updateAsignatureTeacherDto: UpdateAsignatureTeacherDto,
  ) {
    try {
      const { userId, subjectId } = updateAsignatureTeacherDto;

      let user;
      if (userId) user = await this.usersService.findOne(userId);

      let subject;
      if (subjectId) subject = await this.subjectsService.findOne(subjectId);

      if (!userId && !subjectId) {
        throw new ManagerError({
          type: 'BAD_REQUEST',
          message: 'No se enviaron datos para actualizar',
        });
      }

      const asignatureTeacher = await this.asignatureTeacherRepo.update(id, {
        ...(user && { user }),
        ...(subject && { subject }),
      });

      if (asignatureTeacher.affected === 0)
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'Asignación no encontrada',
        });
      return asignatureTeacher;
    } catch (error) {
      if (error instanceof ManagerError)
        throw ManagerError.createSignatureError(error.message);
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const asignatureTeacher = await this.asignatureTeacherRepo.delete(id);
      if (asignatureTeacher.affected === 0)
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'Asignación no encontrada',
        });
      return asignatureTeacher;
    } catch (error) {
      if (error instanceof ManagerError)
        throw ManagerError.createSignatureError(error.message);
      throw error;
    }
  }
}
