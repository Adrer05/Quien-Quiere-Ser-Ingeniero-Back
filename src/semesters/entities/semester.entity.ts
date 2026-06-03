import { BaseEntity } from "../../common/config/base.entity";
import { Column, Entity, JoinTable, ManyToMany} from "typeorm";
import { Career} from "../../degrees/entities/career.entity";
import { Subject } from "../../subjects/entities/subject.entity";

@Entity()
export class Semester extends BaseEntity {

    @Column({type: "numeric", nullable: false})
    number: number;

    @ManyToMany(()=> Career, career => career.semester)
    @JoinTable({name: "semester_career"})
    career: Career;

    @ManyToMany(()=> Subject, subject => subject.semester)
    subject: Subject;

}
