import { IsNotEmpty, IsUUID } from "class-validator";

export class CreateAsignatureTeacherDto {

    @IsUUID()
    @IsNotEmpty()
    userId: string;

    @IsUUID()
    @IsNotEmpty()
    subjectId: string;

}