import { inject, injectable } from 'inversify';
import { UserLoginDto } from './dot/user-login.dto';
import { UserRegisterDto } from './dot/user-register.dto';
import { User } from './user.entity';
import { IUserService } from './user.service.interface';
import 'reflect-metadata';
import { TYPES } from '../types';
import { IConfigInterface } from '../config/config.service.interface';
import { IUsersRepository } from './users.interface.repository';
import { UserModel } from '@prisma/client';

@injectable()
export class UserSerice implements IUserService {
    constructor(@inject(TYPES.ConfigService) private configService: IConfigInterface, @inject(TYPES.UserRepository) private usersRepository: IUsersRepository) {}

    async createUser({ email, name, password }: UserRegisterDto): Promise<UserModel | null> {
        const newUser = new User(email, name);
        const salt = this.configService.get('SALT');
        await newUser.setPassword(password, Number(salt));
        return this.usersRepository.create(newUser);
    }
    async validateUser(dto: UserLoginDto): Promise<boolean> {
        return true;
    }
}
