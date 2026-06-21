import { IsNotEmpty, IsNumber, IsUUID } from "class-validator";


export class CreateGameDto {

    @IsNumber()
    @IsNotEmpty()
    scoreObtained;

    @IsUUID()
    @IsNotEmpty()
    userId: string;
}
