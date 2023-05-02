import { IsEmail, IsString, Length, IsIn } from 'class-validator';

export class UserRegisterDto {
    @IsEmail({}, { message: 'Wrong email' })
    email: string;
    @IsString({ message: 'Type a correct password' })
    password: string;
    @IsString({ message: 'Type a correct name' })
    @Length(5, 20)
    name: string;
    @IsIn(['Admin', 'User'], { message: 'Roles can only be "Admin" or "User"' })
    roles: string;
}
