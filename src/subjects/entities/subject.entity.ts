import { BaseEntity } from '../../common/config/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Semester } from '../../semesters/entities/semester.entity';
import { Topic } from '../../topics/entities/topic.entity';
import { AsignatureTeacher } from '../../asignature-teachers/entities/asignature-teacher.entity';

@Entity()
export class Subject extends BaseEntity {
  @Column({ type: 'varchar', nullable: false, length: 255 })
  name: string;

  @ManyToOne(() => Semester, (semester) => semester.subject)
  @JoinColumn({ name: 'semester_id' })
  semester: Semester;

  @OneToMany(() => Topic, (topic) => topic.subject)
  topic: Topic;

  @OneToMany(
    () => AsignatureTeacher,
    (asignatureTeacher) => asignatureTeacher.subject,
  )
  asignatureTeacher: AsignatureTeacher;
}
