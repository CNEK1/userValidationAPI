import express, { Express } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import { ILogger } from './logger/logger.interface';
import { TYPES } from './types';
import { UserController } from './users/user.controller';
import 'reflect-metadata';
import { json } from 'body-parser';
import { AuthMiddleware } from './common/auth.middleware';
import { IConfigInterface } from './config/config.service.interface';
import { IPrismaService } from './database/prisma.service.interface';
import { IExceptionFilter } from './errors/exception.filter.interface';

@injectable()
export class App {
    app: Express;
    port: number;
    server: Server;

    constructor(
        @inject(TYPES.ILogger) private logger: ILogger,
        @inject(TYPES.UserController) private userController: UserController,
        @inject(TYPES.ExceptionFilter) private exceptionFilter: IExceptionFilter,
        @inject(TYPES.PrismaService) private prismaService: IPrismaService,
        @inject(TYPES.ConfigService) private configService: IConfigInterface
    ) {
        this.app = express();
        this.port = 8000;
    }

    useMiddleWare(): void {
        this.app.use(json());
        const authMiddleware = new AuthMiddleware(this.configService.get('SECRET'));
        this.app.use(authMiddleware.execute.bind(authMiddleware));
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
