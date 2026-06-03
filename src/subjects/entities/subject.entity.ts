import { BaseEntity } from "../../common/config/base.entity";
import { Column, Entity, JoinTable, ManyToMany} from "typeorm";
import { Semester } from "../../semesters/entities/semester.entity";
import { Topic } from "../../topics/entities/topic.entity";
import { AsignatureTeacher } from "../../asignature-teachers/entities/asignature-teacher.entity";

@Entity()
export class Subject extends BaseEntity {

    @Column({type: "varchar", nullable: false, length: 255})
    name: string;

    @ManyToMany(()=> Semester, semester => semester.subject)
    @JoinTable({name: "semester_subject"})
    semester: Semester;
    
    @ManyToMany(()=> Topic, topic => topic.subject)
    topic: Topic;

    @ManyToMany(()=> AsignatureTeacher, asignatureTeacher => asignatureTeacher.subject)
    asignatureTeacher: AsignatureTeacher;

}
