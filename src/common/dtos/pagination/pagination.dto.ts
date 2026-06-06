import { IsNumber, IsOptional, Min } from "class-validator";

export class PaginationDto{
    @IsNumber()
    @Min(1)
    @IsOptional()
    page: number = 1;

    @IsNumber()
    @Min(1)
    @IsOptional()
    limit: number = 10;
}