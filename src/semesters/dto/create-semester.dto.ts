import { IsNotEmpty, IsNumber, IsUUID } from "class-validator";

export class CreateSemesterDto {
    
    @IsNumber()
    @IsNotEmpty()
    number: number;
    
    @IsUUID()
    @IsNotEmpty()
    careerId: string;
    
}
