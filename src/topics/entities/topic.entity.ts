import { BaseEntity } from '../../common/config/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Subject } from '../../subjects/entities/subject.entity';
import { Question } from '../../questions/entities/question.entity';
@Entity()
export class Topic extends BaseEntity {
  @Column({ type: 'varchar', nullable: false, length: 255 })
  name: string;

  @ManyToOne(() => Subject, (subject) => subject.topic)
  @JoinColumn({ name: 'subject_id' })
  subject: Subject;

  @OneToMany(() => Question, (question) => question.topic)
  question: Question;
}
