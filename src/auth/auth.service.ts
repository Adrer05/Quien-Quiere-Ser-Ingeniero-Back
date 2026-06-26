import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ManagerError } from '../common/errors/manager.error';
import { RolService } from '../roles/rol.service';
import { RankingService } from '../ranking/ranking.service';
import { RegisterDto } from './dto/register.dto';
import { RegisterByAdminDto } from './dto/register-by-admin.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private rolService: RolService,
    private rankingService: RankingService,
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    try {
      const user = await this.usersService.findOneUsername(username);

      const isMatch = await bcrypt.compare(pass, user.password);

      if (!isMatch) {
        throw new ManagerError({
          type: 'UNAUTHORIZED',
          message: 'Credenciales inválidas',
        });
      }
      const payload = {
        sub: user.id,
        username: user.userName,
        rol: user.rol.name,
      };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      if (error instanceof ManagerError) {
        throw ManagerError.createSignatureError(error.message);
      }
      throw error;
    }
  }

  async register(registerDto: RegisterDto) {
    try {
      const jugadorRol = await this.rolService.findByName('JUGADOR');

      const user = await this.usersService.create({
        ...registerDto,
        rolId: jugadorRol.id,
      });

      const lastPosition = await this.rankingService.getLastPosition();

      await this.rankingService.createAuto({
        userId: user.id,
        totalScore: 0,
        position: lastPosition + 1,
      });

      return { message: 'Usuario registrado exitosamente' };
    } catch (error) {
      if (error instanceof ManagerError) {
        throw ManagerError.createSignatureError(error.message);
      }
      throw error;
    }
  }

  async registerByAdmin(registerByAdminDto: RegisterByAdminDto) {
    try {
      await this.usersService.create(registerByAdminDto);
      return { message: 'Usuario creado exitosamente' };
    } catch (error) {
      if (error instanceof ManagerError) {
        throw ManagerError.createSignatureError(error.message);
      }
      throw error;
    }
  }
}
