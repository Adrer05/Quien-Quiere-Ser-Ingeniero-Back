import { User } from '../../users/entities/user.entity';
import { BaseEntity } from '../../common/config/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export default class Rol extends BaseEntity {
  @Column({ type: 'varchar', nullable: false, length: 255 })
  name: string;

  @Column({ type: 'varchar', nullable: true, length: 500 })
  description: string;

  @OneToMany(() => User, (user) => user.rol)
  user: User;
}
