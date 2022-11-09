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
import { ValidateMiddleware } from '../common/validate.middleware';
import { sign } from 'jsonwebtoken';
import { IConfigInterface } from '../config/config.service.interface';
import { IUserService } from './user.service.interface';
import { GuardMiddleware } from '../common/guard.middleware';

@injectable()
export class UserController extends BaseController implements IUserController {
    constructor(@inject(TYPES.ILogger) private loggerSrc: ILogger, @inject(TYPES.UserService) private UserService: IUserService, @inject(TYPES.ConfigService) private configService: IConfigInterface) {
        super(loggerSrc);
        this.bindRoutes([{ path: '/register', method: 'post', func: this.register, middlewares: [new ValidateMiddleware(UserRegisterDto)] }]);
        this.bindRoutes([{ path: '/login', method: 'post', func: this.login, middlewares: [new ValidateMiddleware(UserLoginDto)] }]);
        this.bindRoutes([{ path: '/info', method: 'get', func: this.info, middlewares: [new GuardMiddleware()] }]);
    }

    async login(req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): Promise<void> {
        const result = await this.UserService.validateUser(req.body);
        if (!result) {
            return next(new HTTPError(401, 'Error of auth', 'login'));
        }
        const jwt = await this.signJWT(req.body.email, this.configService.get('SECRET'));
        this.ok(res, { message: 'Login Successfully', jwt: jwt });
    }
    async register({ body }: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction): Promise<void> {
        const result = await this.UserService.createUser(body);
        if (!result) {
            return next(new HTTPError(422, 'This User is already Exist'));
        }
        this.loggerSrc.log(body);
        this.ok(res, { email: result.email, name: result.name });
    }

    async info({ user }: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction): Promise<void> {
        const userInfo = await this.UserService.getUserInfo(user);
        this.ok(res, { email: userInfo?.email, id: userInfo?.id });
    }

    private signJWT(email: string, secret: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            sign(
                {
                    email,
                    iat: Math.floor(Date.now() / 1000)
                },
                secret,
                {
                    algorithm: 'HS256'
                },
                (err, token) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(token as string);
                }
            );
        });
    }
}
