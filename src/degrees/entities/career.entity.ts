import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from "./../../common/config/base.entity";
import { Semester } from "../../semesters/entities/semester.entity";

@Entity()
export class Career extends BaseEntity {

    @Column({type:"varchar", nullable:false, length:255})
    name:string;
    
    @Column({type:"int", nullable:false})
    careerCode:number;

    @OneToMany(()=> Semester, semester=> semester.career)
    semester: Semester;
}
