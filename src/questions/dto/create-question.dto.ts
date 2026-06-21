import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateQuestionDto {

    @IsString()
    @IsNotEmpty()
    statement: string;

    @IsUUID()
    @IsNotEmpty()
    topicId: string;
    
    @IsUUID()
    @IsNotEmpty()
    difficultyId: string;
}
