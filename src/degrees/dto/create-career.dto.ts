import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCareerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  careerCode: number;
}
