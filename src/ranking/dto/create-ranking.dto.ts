import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateRankingDto {
  @IsNumber()
  @IsNotEmpty()
  position: number;

  @IsNumber()
  @IsNotEmpty()
  totalScore: number;

  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
