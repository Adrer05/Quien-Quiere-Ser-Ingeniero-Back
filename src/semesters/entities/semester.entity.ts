import { BaseEntity } from "../../common/config/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany} from "typeorm";
import { Career} from "../../degrees/entities/career.entity";
import { Subject } from "../../subjects/entities/subject.entity";

@Entity()
export class Semester extends BaseEntity {

    @Column({type: "int", nullable: false})
    number: number;

    @ManyToOne(()=> Career, career => career.semester)
    @JoinColumn({name: "semester_career"})
    career: Career;

    @OneToMany(()=> Subject, subject => subject.semester)
    subject: Subject;

}
