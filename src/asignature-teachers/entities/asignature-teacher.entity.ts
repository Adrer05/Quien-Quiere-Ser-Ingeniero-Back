import { BaseEntity } from "./../../common/config/base.entity";
import { Entity, JoinTable, ManyToMany} from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Subject } from "../../subjects/entities/subject.entity";


@Entity()
export class AsignatureTeacher extends BaseEntity {

    @ManyToMany(()=> User, user => user.asignatureTeacher)
    @JoinTable({name: "user_asignatureTeacher"})
    user: User;

    @ManyToMany(()=> Subject, subject => subject.asignatureTeacher)
    @JoinTable({name: "subject_asignatureTeacher"})
    subject: Subject;

}
