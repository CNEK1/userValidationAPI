import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { BaseController } from '../common/base.controller';
import { HTTPError } from '../errors/http-error.class';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import 'reflect-metadata';
import { IUserController } from './user.inteface';
import { UserLoginDto } from './dot/user-login.dto';
import { UserRegisterDto } from './dot/user-register.dto';

@injectable()
export class UserController extends BaseController implements IUserController {
    constructor(@inject(TYPES.ILogger) private loggerSrc: ILogger) {
        super(loggerSrc);
        this.bindRoutes([{ path: '/register', method: 'post', func: this.register }]);
        this.bindRoutes([{ path: '/login', method: 'post', func: this.login }]);
    }

    login(req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): void {
        //Emulation Error
        console.log(req.body);
        next(new HTTPError(401, 'Error of auth', 'login'));
    }
    register(req: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction): void {
        console.log(req.body);
        this.ok(res, 'register');
    }
}
