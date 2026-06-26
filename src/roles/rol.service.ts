import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Rol from './entities/rol.entity';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';
import { ManagerError } from './../common/errors/manager.error';
import { PaginationDto } from './../common/dtos/pagination/pagination.dto';

@Injectable()
export class RolService {
  constructor(
    @InjectRepository(Rol)
    private readonly rolRepo: Repository<Rol>,
  ) {}

  async create(createRolDto: CreateRolDto) {
    try {
      const existingRol = await this.rolRepo.findOne({
        where: { name: createRolDto.name },
      });
      if (existingRol) {
        throw new ManagerError({
          type: 'CONFLICT',
          message: 'El Rol ya existe',
        });
      }

      const rol = this.rolRepo.create(createRolDto);
      const savedRol = await this.rolRepo.save(rol);

      if (!savedRol) {
        throw new ManagerError({
          type: 'BAD_REQUEST',
          message: 'Error al crear un Rol',
        });
      }

      return savedRol;
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
      const [roles, total] = await Promise.all([
        this.rolRepo.find({ skip: skip, take: limit }),
        this.rolRepo.count(),
      ]);

      const lastPage = Math.ceil(total / limit);

      return {
        data: roles,
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
      const rol = await this.rolRepo.findOneBy({ id });
      if (!rol)
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'Rol no encontrado',
        });

      return rol;
    } catch (error) {
      if (error instanceof ManagerError) {
        throw ManagerError.createSignatureError(error.message);
      }

      throw error;
    }
  }

  async findByName(name: string) {
    try {
      const rol = await this.rolRepo.findOneBy({ name });
      if (!rol)
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: `Rol '${name}' no encontrado`,
        });

      return rol;
    } catch (error) {
      if (error instanceof ManagerError) {
        throw ManagerError.createSignatureError(error.message);
      }

      throw error;
    }
  }

  async update(id: string, updateRolDto: UpdateRolDto) {
    try {
      if (Object.keys(updateRolDto).length === 0) {
        throw new ManagerError({
          type: 'BAD_REQUEST',
          message: 'No se enviaron datos para actualizar',
        });
      }

      const rol = await this.rolRepo.update(id, updateRolDto);
      if (rol.affected === 0)
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'Rol no encontrado',
        });

      return rol;
    } catch (error) {
      if (error instanceof ManagerError) {
        throw ManagerError.createSignatureError(error.message);
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const rol = await this.rolRepo.delete(id);
      if (rol.affected === 0) {
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'Rol no encontrado',
        });
      }
      return rol;
    } catch (error) {
      if (error instanceof ManagerError) {
        throw ManagerError.createSignatureError(error.message);
      }
      throw error;
    }
  }
}
