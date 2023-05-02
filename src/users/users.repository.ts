import { UserModel } from '.prisma/client';
import { inject, injectable } from 'inversify';
import { PrismaService } from '../database/prisma.service';
import { TYPES } from '../types';
import { User } from './user.entity';
import { IUsersRepository } from './users.interface.repository';

@injectable()
export class UsersRepository implements IUsersRepository {
    constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

    async create({ email, password, name, roles }: User): Promise<UserModel> {
        return this.prismaService.client.userModel.create({
            data: {
                email,
                password,
                name,
                roles
            }
        });
    }
    async find(email: string): Promise<UserModel | null> {
        return this.prismaService.client.userModel.findFirst({
            where: {
                email
            }
        });
    }
    async findOne(id: number): Promise<UserModel | null> {
        return this.prismaService.client.userModel.findFirst({
            where: {
                id: id
            }
        });
    }

    async findAll(): Promise<Array<UserModel> | null> {
        return this.prismaService.client.userModel.findMany({ where: {} });
    }
    async delete(id: number): Promise<UserModel | null> {
        return this.prismaService.client.userModel.delete({
            where: {
                id: id
            }
        });
    }
    async update(id: number, name?: string, roles?: string): Promise<UserModel | null> {
        return this.prismaService.client.userModel.update({
            where: {
                id: id
            },
            data: {
                name: name,
                roles: roles
            }
        });
    }
}
