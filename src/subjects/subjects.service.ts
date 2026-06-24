import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from './entities/subject.entity';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { ManagerError } from './../common/errors/manager.error';
import { SemesterService } from './../semesters/semester.service';
import { PaginationDto } from 'src/common/dtos/pagination/pagination.dto';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectRepo: Repository<Subject>,
    private readonly semesterService: SemesterService,
  ) {}

  async create(createSubjectDto: CreateSubjectDto) {
    try {
      const { semesterId, ...subjectData } = createSubjectDto;
      const semester = await this.semesterService.findOne(semesterId);

      const existingSubject = await this.subjectRepo.findOne({
        where: { name: subjectData.name, semester: { id: semesterId } },
      });
      if (existingSubject) {
        throw new ManagerError({
          type: 'CONFLICT',
          message: 'La asignatura ya existe en este semestre',
        });
      }

      const subject = this.subjectRepo.create({ ...subjectData, semester });
      const savedSubject = await this.subjectRepo.save(subject);

      if (!savedSubject) {
        throw new ManagerError({
          type: 'BAD_REQUEST',
          message: 'Error al crear una asignatura',
        });
      }
      return savedSubject;
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
      const [subject, total] = await Promise.all([
        this.subjectRepo.find({ skip: skip, take: limit }),
        this.subjectRepo.count(),
      ]);

      const lastPage = Math.ceil(total / limit);

      return {
        data: subject,
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
      const subject = await this.subjectRepo.findOne({
        where: { id },
        relations: { semester: true },
      });
      if (!subject)
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'Asignatura no encontrada',
        });
      return subject;
    } catch (error) {
      if (error instanceof ManagerError)
        throw ManagerError.createSignatureError(error.message);
      throw error;
    }
  }

  async update(id: string, updateSubjectDto: UpdateSubjectDto) {
    try {
      const { semesterId, ...subjectData } = updateSubjectDto;
      let semester;
      if (semesterId) semester = await this.semesterService.findOne(semesterId);

      if (Object.keys(subjectData).length === 0 && !semesterId) {
        throw new ManagerError({
          type: 'BAD_REQUEST',
          message: 'No se enviaron datos para actualizar',
        });
      }

      const subject = await this.subjectRepo.update(id, {
        ...subjectData,
        ...(semester && { semester }),
      });
      if (subject.affected === 0)
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'Asignatura no encontrada',
        });
      return subject;
    } catch (error) {
      if (error instanceof ManagerError)
        throw ManagerError.createSignatureError(error.message);
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const subject = await this.subjectRepo.delete(id);
      if (subject.affected === 0)
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'Asignatura no encontrada',
        });
      return subject;
    } catch (error) {
      if (error instanceof ManagerError)
        throw ManagerError.createSignatureError(error.message);
      throw error;
    }
  }
}
