import express, { Express } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import { ExceptionFilter } from './errors/exception.filter';
import { ILogger } from './logger/logger.interface';
import { TYPES } from './types';
import { UserController } from './users /user.controller';
import 'reflect-metadata';

@injectable()
export class App {
    app: Express;
    port: number;
    server: Server;

    constructor(
        @inject(TYPES.ILogger) private logger: ILogger,
        @inject(TYPES.UserController) private userController: UserController,
        @inject(TYPES.ExceptionFilter) private exceptionFilter: ExceptionFilter
    ) {
        this.app = express();
        this.port = 8000;
    }

    useRoutes(): void {
        this.app.use('/users', this.userController.router);
    }

    useExceptionFilter(): void {
        this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
    }

    public async init(): Promise<void> {
        this.useRoutes();
        this.useExceptionFilter();
        this.server = this.app.listen(this.port);
        this.logger.log(`Server:  http://localhost:${this.port}`);
    }
}
