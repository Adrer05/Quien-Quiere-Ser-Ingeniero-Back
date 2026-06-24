import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ManagerError } from '../common/errors/manager.error';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
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
      const payload = { sub: user.id, username: user.userName };
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
}
