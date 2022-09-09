import express, { Express } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import { ExceptionFilter } from './errors/exception.filter';
import { ILogger } from './logger/logger.interface';
import { TYPES } from './types';
import { UserController } from './users/user.controller';
import 'reflect-metadata';
import { json } from 'body-parser';
import { PrismaService } from './database/prisma.service';

@injectable()
export class App {
    app: Express;
    port: number;
    server: Server;

    constructor(
        @inject(TYPES.ILogger) private logger: ILogger,
        @inject(TYPES.UserController) private userController: UserController,
        @inject(TYPES.ExceptionFilter) private exceptionFilter: ExceptionFilter,
        @inject(TYPES.PrismaService) private prismaService: PrismaService
    ) {
        this.app = express();
        this.port = 8000;
    }

    useMiddleWare(): void {
        this.app.use(json());
    }
    useRoutes(): void {
        this.app.use('/users', this.userController.router);
    }

    useExceptionFilter(): void {
        this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
    }

    public async init(): Promise<void> {
        this.useMiddleWare();
        this.useRoutes();
        this.useExceptionFilter();
        await this.prismaService.connect();
        this.server = this.app.listen(this.port);
        this.logger.log(`Server:  http://localhost:${this.port}`);
    }
}
