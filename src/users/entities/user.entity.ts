import Rol from '../../roles/entities/rol.entity';
import { BaseEntity } from './../../common/config/base.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Ranking } from './../../ranking/entities/ranking.entity';
import { Game } from '../../games/entities/game.entity';
import { AsignatureTeacher } from '../../asignature-teachers/entities/asignature-teacher.entity';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';

@Entity()
export class User extends BaseEntity {
  @Column({ type: 'varchar', nullable: false, length: 255 })
  firstName: string;

  @Column({ type: 'varchar', nullable: false, length: 255 })
  lastName: string;

  @Column({ type: 'varchar', nullable: false, length: 255, unique: true })
  userName: string;

  @Column({ type: 'varchar', nullable: false, length: 255, unique: true })
  email: string;

  @Column({ type: 'text', nullable: false, select: true })
  @Exclude({ toPlainOnly: true })
  password: string;

  // //Hasheo de Contraseñas
  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }

  @ManyToOne(() => Rol, (rol) => rol.user)
  @JoinColumn({ name: 'rol_id' })
  rol: Rol;

  @OneToOne(() => Ranking, (ranking) => ranking.user)
  ranking: Ranking;

  @OneToMany(() => Game, (game) => game.user)
  game: Game;

  @OneToMany(
    () => AsignatureTeacher,
    (asignatureTeacher) => asignatureTeacher.user,
  )
  asignatureTeacher: AsignatureTeacher;
}
