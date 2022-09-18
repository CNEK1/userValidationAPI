import { Container, ContainerModule, interfaces } from 'inversify';
import { App } from './app';
import { ConfigService } from './config/config.service';
import { IConfigInterface } from './config/config.service.interface';
import { PrismaService } from './database/prisma.service';
import { IPrismaService } from './database/prisma.service.interface';
import { ExceptionFilter } from './errors/exception.filter';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { ILogger } from './logger/logger.interface';
import { LoggerService } from './logger/logger.service';
import { TYPES } from './types';
import { UserController } from './users/user.controller';
import { IUserController } from './users/user.inteface';
import { UserSerice } from './users/user.service';
import { IUserService } from './users/user.service.interface';
import { IUsersRepository } from './users/users.interface.repository';
import { UsersRepository } from './users/users.repository';

export interface IBootstrapReturnType {
    appContainer: Container;
    app: App;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
    bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
    bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter).inSingletonScope();
    bind<IUserController>(TYPES.UserController).to(UserController).inSingletonScope();
    bind<IUserService>(TYPES.UserService).to(UserSerice).inSingletonScope();
    bind<IConfigInterface>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
    bind<IPrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
    bind<IUsersRepository>(TYPES.UserRepository).to(UsersRepository).inSingletonScope();

    bind<App>(TYPES.Application).to(App).inSingletonScope();
});

const bootstrap = (): IBootstrapReturnType => {
    const appContainer = new Container();
    appContainer.load(appBindings);
    const app = appContainer.get<App>(TYPES.Application);
    app.init();
    return { appContainer, app };
};

export const { app, appContainer } = bootstrap();
