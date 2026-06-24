import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateGameDto {
  @IsNumber()
  @IsNotEmpty()
  scoreObtained: number;

  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
