import { IsEmail, IsNotEmpty, IsString, IsUUID } from "class-validator";
import { Exclude } from "class-transformer"

export class CreateUserDto {

    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsString()
    @IsNotEmpty()
    userName: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsUUID()
    @IsNotEmpty()
    rolId: string;
}
