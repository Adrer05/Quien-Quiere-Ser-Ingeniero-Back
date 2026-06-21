import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateSubjectDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsUUID()
    @IsNotEmpty()
    semesterId: string;

}
