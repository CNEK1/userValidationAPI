import { injectable } from 'inversify';
import { UserLoginDto } from './dot/user-login.dto';
import { UserRegisterDto } from './dot/user-register.dto';
import { User } from './user.entity';
import { IUserService } from './user.service.interface';
import 'reflect-metadata';

@injectable()
export class UserSerice implements IUserService {
    async createUser({ email, name, password }: UserRegisterDto): Promise<User | null> {
        const newUser = new User(email, name);
        await newUser.setPassword(password);
        return null;
    }
    async validateUser(dto: UserLoginDto): Promise<boolean> {
        return true;
    }
}
