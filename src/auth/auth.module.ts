import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { jwtConstants } from './constants';
import { RolModule } from '../roles/rol.module';
import { RankingModule } from '../ranking/ranking.module';
import { RolesGuard } from './roles.guard';

@Module({
  imports: [
    UsersModule,
    RolModule,
    RankingModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, AuthGuard, RolesGuard],
  controllers: [AuthController],
  exports: [AuthService, AuthGuard, RolesGuard],
})
export class AuthModule {}
