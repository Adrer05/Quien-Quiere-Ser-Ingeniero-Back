import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

export class BaseEntity{
    @PrimaryGeneratedColumn("uuid")
    id:string

    @Column({ type: "bool", default: true })
    status:boolean

    @CreateDateColumn({type: "timestamp with time zone"})
    createdAt:Date

    @UpdateDateColumn({type: "timestamp with time zone"})
    UpdatedAt:Date
}