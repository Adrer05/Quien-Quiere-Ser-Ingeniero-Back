import { BaseEntity } from "../../common/config/base.entity";
import { Column, Entity, OneToMany} from "typeorm";
import { Question } from "../../questions/entities/question.entity";

@Entity()
export class Difficulty extends BaseEntity{

    @Column({type: "varchar", nullable: false, length: 255})
    name: string;

    @OneToMany(()=> Question, question => question.difficulty)
    question: Question

}
