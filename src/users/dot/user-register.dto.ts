import { IsEmail, IsString } from 'class-validator';

export class UserRegisterDto {
    @IsEmail({}, { message: 'Wrong email' })
    email: string;
    @IsString({ message: 'Type a correct password' })
    password: string;
    @IsString({ message: 'Type a correct name' })
    name: string;
}
