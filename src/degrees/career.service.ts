import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Career } from './entities/career.entity';
import { CreateCareerDto } from './dto/create-career.dto';
import { UpdateCareerDto } from './dto/update-career.dto';
import { ManagerError } from './../common/errors/manager.error';
import { PaginationDto } from 'src/common/dtos/pagination/pagination.dto';

@Injectable()
export class CareerService {
  constructor(
    @InjectRepository(Career)
    private readonly careerRepo: Repository<Career>,
  ) {}

  async create(createCareerDto: CreateCareerDto) {
    try {
      const existingName = await this.careerRepo.findOne({
        where: { name: createCareerDto.name },
      });
      if (existingName) {
        throw new ManagerError({
          type: 'CONFLICT',
          message: 'La carrera ya existe',
        });
      }

      const existingCode = await this.careerRepo.findOne({
        where: { careerCode: createCareerDto.careerCode },
      });
      if (existingCode) {
        throw new ManagerError({
          type: 'CONFLICT',
          message: 'El código de carrera ya existe',
        });
      }

      const career = this.careerRepo.create(createCareerDto);
      const savedCareer = await this.careerRepo.save(career);

      if (!savedCareer) {
        throw new ManagerError({
          type: 'BAD_REQUEST',
          message: 'Error al crear una carrera',
        });
      }

      return savedCareer;
    } catch (error) {
      if (error instanceof ManagerError) {
        throw ManagerError.createSignatureError(error.message);
      }
      throw error;
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, page } = paginationDto;
    const skip = (page - 1) * limit;
    try {
      const [career, total] = await Promise.all([
        this.careerRepo.find({ skip: skip, take: limit }),
        this.careerRepo.count(),
      ]);

      const lastPage = Math.ceil(total / limit);

      return {
        data: career,
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
      const career = await this.careerRepo.findOneBy({ id });
      if (!career)
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'Carrera no encontrada',
        });

      return career;
    } catch (error) {
      if (error instanceof ManagerError) {
        throw ManagerError.createSignatureError(error.message);
      }
      throw error;
    }
  }

  async update(id: string, updateCareerDto: UpdateCareerDto) {
    try {
      if (Object.keys(updateCareerDto).length === 0) {
        throw new ManagerError({
          type: 'BAD_REQUEST',
          message: 'No se enviaron datos para actualizar',
        });
      }

      const career = await this.careerRepo.update(id, updateCareerDto);
      if (career.affected === 0)
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'Carrera no encontrada',
        });
      return career;
    } catch (error) {
      if (error instanceof ManagerError)
        throw ManagerError.createSignatureError(error.message);
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const career = await this.careerRepo.delete(id);
      if (career.affected === 0)
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'Carrera no encontrada',
        });
      return career;
    } catch (error) {
      if (error instanceof ManagerError) {
        throw ManagerError.createSignatureError(error.message);
      }
      throw error;
    }
  }
}
