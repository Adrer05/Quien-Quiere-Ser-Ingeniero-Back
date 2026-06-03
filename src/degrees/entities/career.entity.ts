import { Column, Entity, ManyToMany } from "typeorm";
import { BaseEntity } from "./../../common/config/base.entity";
import { Semester } from "../../semesters/entities/semester.entity";

@Entity()
export class Career extends BaseEntity {

    @Column({type:"varchar", nullable:false, length:255})
    name:string;
    
    @Column({type:"numeric", nullable:false})
    careerCode:number;

    @ManyToMany(()=> Semester, semester=> semester.career)
    semester: Semester;
}
