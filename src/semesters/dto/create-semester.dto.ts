import { IsNotEmpty, IsNumber, IsUUID } from "class-validator";

export class CreateSemesterDto {
    
    @IsNumber()
    @IsNotEmpty()
    careerNumber: number;
    
    @IsUUID()
    @IsNotEmpty()
    careerId: string;
    
}
