import { BaseEntity } from "./../../common/config/base.entity";
import { Entity, JoinColumn, ManyToOne} from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Subject } from "../../subjects/entities/subject.entity";


@Entity()
export class AsignatureTeacher extends BaseEntity {

    @ManyToOne(()=> User, user => user.asignatureTeacher)
    @JoinColumn({name: "user_id"})
    user: User;

    @ManyToOne(()=> Subject, subject => subject.asignatureTeacher)
    @JoinColumn({name: "subject_id"})
    subject: Subject;

}
