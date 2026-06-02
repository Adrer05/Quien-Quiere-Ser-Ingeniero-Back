import { BaseEntity } from "./../../common/config/base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class User extends BaseEntity {
    @Column({type:"varchar", nullable: false, length: 255})
    firstName:string
    
    @Column({type:"varchar", nullable: false, length: 255})
    lastName:string
    
    @Column({type:"varchar", nullable: false, length: 255})
    email:string

    @Column({type:"text", nullable: false})
    password:string
}