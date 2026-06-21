import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

export class BaseEntity{
    @PrimaryGeneratedColumn("uuid")
    id:string

    @Column({ type: "bool", default: true })
    status:boolean

    @CreateDateColumn({type: "time with time zone"})
    createdAt:Date

    @UpdateDateColumn({type: "time with time zone"})
    UpdatedAt:Date
}