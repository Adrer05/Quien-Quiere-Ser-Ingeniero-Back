import { BaseEntity } from "../../common/config/base.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne} from "typeorm";
import { Subject } from "../../subjects/entities/subject.entity";
import { Question } from "../../questions/entities/question.entity";
@Entity()
export class Topic extends BaseEntity {

    @Column({type: "varchar", nullable: false, length: 255})
    name: string;

    @ManyToMany(()=> Subject, subject => subject.topic)
    @JoinTable({name: "topic_subject"})
    subject: Subject;

    @ManyToOne(()=>Question, question => question.topic)
    question: Question

}
