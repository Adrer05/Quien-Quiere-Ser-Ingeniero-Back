import { BaseEntity } from './../../common/config/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Game extends BaseEntity {
  @Column({ type: 'int', nullable: false })
  scoreObtained: number;

  @ManyToOne(() => User, (user) => user.game)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
