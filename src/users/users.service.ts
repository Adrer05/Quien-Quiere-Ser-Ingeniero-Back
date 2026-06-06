import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ManagerError } from './../common/errors/manager.error';
import { PaginationDto } from './../common/dtos/pagination/pagination.dto';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>
  ){}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.usersRepo.create(createUserDto);
      if(!user){
        throw new ManagerError({
          type: "BAD_REQUEST",
          message: "Error al crear un usuario"
        })
      }

      return user
    } catch (error) {
      if(error instanceof ManagerError){
        throw ManagerError.createSignatureError(error.message);
      }

      throw error
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, page } = paginationDto
    const skip = ( page - 1 ) * limit;
    try {
      const [users, total] = await Promise.all([
        this.usersRepo.find({ skip: skip, take: limit }),
        this.usersRepo.count(),
      ])

      const lastPage = Math.ceil( total/limit )

      return {
        data: users,
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
      const user = await this.usersRepo.findBy({id})

      return user
    } catch (error) {
      if(error instanceof ManagerError){
        throw ManagerError.createSignatureError(error.message);
      }

      throw error
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.usersRepo.update(id, updateUserDto);
      if(user.affected===0){
        throw new ManagerError({ type: "NOT_FOUND", message: "Registro no encontrado" });
      }

      return user
    } catch (error) {
      if(error instanceof ManagerError){
        throw ManagerError.createSignatureError(error.message);
      }

      throw error
    }
  }

  async remove(id: string) {
    try {
      const user = await this.usersRepo.delete(id)
      if(user.affected===0){
        throw new ManagerError({ type: "NOT_FOUND", message: "Registro no encontrado" });
      }
      return user
    } catch (error) {
      if(error instanceof ManagerError){
        throw ManagerError.createSignatureError(error.message);
      }

      throw error
    }
  }
}
