import { Question } from '../../questions/entities/question.entity';
import { BaseEntity } from '../../common/config/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Answer extends BaseEntity {
  @Column({ type: 'text', nullable: false })
  statement: string;

  @Column({ type: 'boolean', nullable: false })
  isCorrect: boolean;

  @ManyToOne(() => Question, (question) => question.answer)
  @JoinColumn({ name: 'question_id' })
  question: Question;
}
