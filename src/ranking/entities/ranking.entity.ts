import { User } from './../../users/entities/user.entity';
import { BaseEntity } from './../../common/config/base.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity()
export class Ranking extends BaseEntity {
  @Column({ type: 'int', nullable: false })
  position: number;

  @Column({ type: 'int', nullable: false })
  totalScore: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
