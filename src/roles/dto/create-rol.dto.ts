import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRolDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;
}
