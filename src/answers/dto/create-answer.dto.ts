import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class CreateAnswerDto {

    @IsString()
    @IsNotEmpty()
    statement: string;

    @IsBoolean()
    @IsNotEmpty()
    isCorrect: boolean;


}
