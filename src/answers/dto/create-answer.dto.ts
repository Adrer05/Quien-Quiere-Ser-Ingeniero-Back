import { IsBoolean, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateAnswerDto {
  @IsString()
  @IsNotEmpty()
  statement: string;

  @IsBoolean()
  @IsNotEmpty()
  isCorrect: boolean;

  @IsUUID()
  @IsNotEmpty()
  questionId: string;
}
