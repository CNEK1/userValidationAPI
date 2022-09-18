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
import { UserSerice } from './user.service';
import { ValidateMiddleware } from '../common/validate.middleware';

@injectable()
export class UserController extends BaseController implements IUserController {
    constructor(@inject(TYPES.ILogger) private loggerSrc: ILogger, @inject(TYPES.UserService) private UserService: UserSerice) {
        super(loggerSrc);
        this.bindRoutes([{ path: '/register', method: 'post', func: this.register, middlewares: [new ValidateMiddleware(UserRegisterDto)] }]);
        this.bindRoutes([{ path: '/login', method: 'post', func: this.login }]);
    }

    login(req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): void {
        //Emulation Error
        this.loggerSrc.log(req.body);
        next(new HTTPError(401, 'Error of auth', 'login'));
    }
    async register({ body }: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction): Promise<void> {
        const result = await this.UserService.createUser(body);
        if (!result) {
            return next(new HTTPError(422, 'This User is already Exist'));
        }
        this.loggerSrc.log(body);
        this.ok(res, { email: result.email, name: result.name });
    }
}
