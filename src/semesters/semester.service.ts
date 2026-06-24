import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Semester } from './entities/semester.entity';
import { CreateSemesterDto } from './dto/create-semester.dto';
import { UpdateSemesterDto } from './dto/update-semester.dto';
import { ManagerError } from './../common/errors/manager.error';
import { CareerService } from './../degrees/career.service';
import { PaginationDto } from 'src/common/dtos/pagination/pagination.dto';

@Injectable()
export class SemesterService {
  constructor(
    @InjectRepository(Semester)
    private readonly semesterRepo: Repository<Semester>,
    private readonly careerService: CareerService,
  ) {}

  async create(createSemesterDto: CreateSemesterDto) {
    try {
      const { careerId, ...semesterData } = createSemesterDto;

      const career = await this.careerService.findOne(careerId);
      if (!career) {
        throw new ManagerError({ 
          type: 'NOT_FOUND', message: 'No se encuentra la carrera'
        });
      }

      const repeatedSemester = await  this.semesterRepo.findOne ({ where:{ careerNumber: semesterData.careerNumber } })
      if (repeatedSemester) {
        throw new ManagerError({ 
          type: 'CONFLICT', message: 'Ya existe este semestre'
        });
      }

      const semester = this.semesterRepo.create({ ...semesterData, career });
      const savedSemester = await this.semesterRepo.save(semester);

      if (!savedSemester) {
        throw new ManagerError({ 
          type: 'BAD_REQUEST', message: 'Error al crear un semestre'
        });
      }

      return savedSemester;
    } catch (error) {
      if (error instanceof ManagerError) {
        throw ManagerError.createSignatureError(error.message);
      }
      throw error;
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, page } = paginationDto
    const skip = ( page - 1 ) * limit;
    try {
      const [semester, total] = await Promise.all([
        this.semesterRepo.find({ skip: skip, take: limit }),
        this.semesterRepo.count(),
      ])

      const lastPage = Math.ceil( total/limit )

      return {
        data: semester,
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
      const semester = await this.semesterRepo.findOne({ where: { id }, relations: { career: true } });
      if (!semester) throw new ManagerError({ type: 'NOT_FOUND', message: 'Semestre no encontrado' });
      return semester;
    } catch (error) {
      if (error instanceof ManagerError) throw ManagerError.createSignatureError(error.message);
      throw error;
    }
  }

  async update(id: string, updateSemesterDto: UpdateSemesterDto) {
    try {
      if (Object.keys(updateSemesterDto).length === 0){
        throw new ManagerError({ type: "BAD_REQUEST", message: "No se enviaron datos para actualizar" });
      }

      const semester = await this.semesterRepo.update(id, updateSemesterDto);
      if(semester.affected===0){
        throw new ManagerError({ type: "NOT_FOUND", message: "No se enviaron datos para actualizar" });
      }
      return semester;
    } catch (error) {
      if(error instanceof ManagerError){
        throw ManagerError.createSignatureError(error.message);
      }

      throw error
    }
  }

  async remove(id: string) {
    try {
      const semester = await this.semesterRepo.delete(id);
      if (semester.affected === 0) throw new ManagerError({ 
        type: 'NOT_FOUND', message: 'Semestre no encontrado' 
      });
      return semester;
    } catch (error) {
      if(error instanceof ManagerError){
        throw ManagerError.createSignatureError(error.message);
      }

      throw error
    }
  }
}
