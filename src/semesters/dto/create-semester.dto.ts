import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateSemesterDto {
    
    @IsNumber()
    @IsNotEmpty()
    number: number;
    
}
