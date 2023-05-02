import { User } from './user.entity';
import { UserModel } from '@prisma/client';

export interface IUsersRepository {
    create: (user: User) => Promise<UserModel>;
    find: (email: string) => Promise<UserModel | null>;
    findOne: (id: number) => Promise<UserModel | null>;
    findAll: () => Promise<Array<UserModel> | null>;
    delete: (id: number) => Promise<UserModel | null>;
    update: (id: number, email?: string, name?: string, roles?: string) => Promise<UserModel | null>;
}
