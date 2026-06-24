import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from './entities/game.entity';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { ManagerError } from './../common/errors/manager.error';
import { UsersService } from './../users/users.service';
import { PaginationDto } from 'src/common/dtos/pagination/pagination.dto';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepo: Repository<Game>,
    private readonly usersService: UsersService,
  ) {}

  async create(createGameDto: CreateGameDto) {
    try {
      const { userId, ...gameData } = createGameDto;

      const user = await this.usersService.findOne(userId);

      const game = this.gameRepo.create({ ...gameData, user });
      const savedGame = await this.gameRepo.save(game);

      if (!savedGame) {
        throw new ManagerError({
          type: 'BAD_REQUEST',
          message: 'Error al crear una partida',
        });
      }
      return savedGame;
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
      const [game, total] = await Promise.all([
        this.gameRepo.find({ skip: skip, take: limit }),
        this.gameRepo.count(),
      ]);

      const lastPage = Math.ceil(total / limit);

      return {
        data: game,
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
      const game = await this.gameRepo.findOne({
        where: { id },
        relations: { user: true },
      });
      if (!game)
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'Partida no encontrada',
        });
      return game;
    } catch (error) {
      if (error instanceof ManagerError)
        throw ManagerError.createSignatureError(error.message);
      throw error;
    }
  }

  async update(id: string, updateGameDto: UpdateGameDto) {
    try {
      const { userId, ...gameData } = updateGameDto;
      let user;
      if (userId) user = await this.usersService.findOne(userId);

      if (Object.keys(gameData).length === 0 && !userId) {
        throw new ManagerError({
          type: 'BAD_REQUEST',
          message: 'No se enviaron datos para actualizar',
        });
      }

      const game = await this.gameRepo.update(id, {
        ...gameData,
        ...(user && { user }),
      });
      if (game.affected === 0)
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'Partida no encontrada',
        });
      return game;
    } catch (error) {
      if (error instanceof ManagerError)
        throw ManagerError.createSignatureError(error.message);
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const game = await this.gameRepo.delete(id);
      if (game.affected === 0)
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'Partida no encontrada',
        });
      return game;
    } catch (error) {
      if (error instanceof ManagerError)
        throw ManagerError.createSignatureError(error.message);
      throw error;
    }
  }
}
