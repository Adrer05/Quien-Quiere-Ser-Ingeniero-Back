import { Difficulty } from "../../difficulties/entities/difficulty.entity";
import { BaseEntity } from "../../common/config/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany} from "typeorm";
import { Topic } from "../../topics/entities/topic.entity";
import { Answer } from "../../answers/entities/answer.entity";

@Entity()
export class Question extends BaseEntity {

    @Column({type: "text", nullable: false})
    statement: string;

    @ManyToOne(()=>Topic, topic => topic.question)
    @JoinColumn({name: "topic_id"})
    topic: Topic;

    @ManyToOne(()=>Difficulty, difficulty => difficulty.question)
    @JoinColumn({name: "difficulty_id"})
    difficulty: Difficulty;

    @OneToMany(()=>Answer, answer => answer.question)
    answer: Answer;

}
