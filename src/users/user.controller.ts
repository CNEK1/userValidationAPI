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
import cookie from 'cookie';
import { RefreshMiddleware } from '../common/refresh.middleware';
import { VerifyAuthMiddleware } from '../common/verifyAuth.middleware';
import { UserUpdateDto } from './dot/user-update.dto';

@injectable()
export class UserController extends BaseController implements IUserController {
    constructor(@inject(TYPES.ILogger) private loggerSrc: ILogger, @inject(TYPES.UserService) private UserService: IUserService, @inject(TYPES.ConfigService) private configService: IConfigInterface) {
        super(loggerSrc);
        this.bindRoutes([{ path: '/registerByUser', method: 'post', func: this.registerByUser, middlewares: [new ValidateMiddleware(UserRegisterDto)] }]);
        this.bindRoutes([{ path: '/registerByAdmin', method: 'post', func: this.registerByAdmin, middlewares: [new ValidateMiddleware(UserRegisterDto)] }]);
        this.bindRoutes([{ path: '/login', method: 'post', func: this.login, middlewares: [new ValidateMiddleware(UserLoginDto)] }]);
        this.bindRoutes([{ path: '/info', method: 'get', func: this.info, middlewares: [new GuardMiddleware()] }]);
        this.bindRoutes([{ path: '/logout', method: 'get', func: this.logout, middlewares: [] }]);
        // this.bindRoutes([{ path: '/refresh', method: 'get', func: this.refresh, middlewares: [new RefreshMiddleware(this.configService.get('SECRET_REFRESH'))] }]);
        this.bindRoutes([{ path: '/', method: 'get', func: this.getAll, middlewares: [] }]);
        this.bindRoutes([{ path: '/delete/:id', method: 'get', func: this.delete, middlewares: [] }]);
        this.bindRoutes([{ path: '/update/:id', method: 'post', func: this.update, middlewares: [new ValidateMiddleware(UserUpdateDto)] }]);
        this.bindRoutes([{ path: '/:id', method: 'get', func: this.find, middlewares: [] }]);
        this.bindRoutes([{ path: '/detail/:id', method: 'get', func: this.findDetails, middlewares: [] }]);
    }

    async login(req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): Promise<void> {
        const result = await this.UserService.validateUser(req.body);
        if (!result) {
            return next(new HTTPError(401, 'Error of auth', 'login'));
        }
        const accessToken = await this.signAccessJWT(req.body.email, this.configService.get('SECRET_ACCESS'));
        // const refreshToken = await this.signRefreshJWT(req.body.email, this.configService.get('SECRET_REFRESH'));
        // res.setHeader(
        //     'Set-Cookie',
        //     cookie.serialize('refreshToken', refreshToken, {
        //         httpOnly: true,
        //         maxAge: 60 * 60
        //     })
        // );
        this.ok(res, { accessToken });
    }
    async registerByUser({ body }: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction): Promise<void> {
        const result = await this.UserService.createUser({
            email: body.email,
            password: body.password,
            name: body.name,
            roles: 'User'
        });
        if (!result) {
            return next(new HTTPError(422, 'This User is already Exist'));
        }
        this.loggerSrc.log(body);
        this.ok(res, { email: result.email, name: result.name, roles: result.roles });
    }
    async registerByAdmin({ body }: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction): Promise<void> {
        const result = await this.UserService.createUser({
            email: body.email,
            password: body.password,
            name: body.name,
            roles: body.roles
        });
        if (result) {
            this.loggerSrc.log(body);
            res.redirect('/');
        } else {
            return next(new HTTPError(422, 'This User is already Exist'));
        }
    }

    async info({ user }: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction): Promise<void> {
        const userInfo = await this.UserService.getUserInfo(user);
        this.ok(res, { email: userInfo?.email, id: userInfo?.id });
    }
    async logout(req: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction): Promise<void> {
        res.setHeader('Set-Cookie', cookie.serialize('refreshToken', '', { httpOnly: true, maxAge: 0 }));
        res.sendStatus(200);
    }
    // async refresh(req: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction): Promise<void> {
    //     const accessToken = await this.signAccessJWT(req.body.email, this.configService.get('SECRET_ACCESS'));
    //     const refreshToken = await this.signRefreshJWT(req.body.email, this.configService.get('SECRET_REFRESH'));

    //     res.setHeader(
    //         'Set-Cookie',
    //         cookie.serialize('refreshToken', refreshToken, {
    //             httpOnly: true,
    //             maxAge: 1000 * 60 * 60
    //         })
    //     );
    //     res.send({ accessToken });
    // }

    async getAll(req: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction): Promise<void> {
        const users = await this.UserService.getUsers();
        res.render('./pages/index', {
            users: users
        });
    }
    async delete(req: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction): Promise<void> {
        const id: number = parseInt(req.params['id']);
        const deletedUser = await this.UserService.deleteUser(id);
        if (deletedUser) {
            res.redirect('/');
        } else {
            return next(new HTTPError(422, 'Some Error in deleting'));
        }
    }
    async update(req: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction): Promise<void> {
        const id: number = parseInt(req.params['id']);
        try {
            const user = req.body;
            const updatedUser = await this.UserService.updateUser(id, user.name, user.roles);
            if (updatedUser) {
                res.redirect('/');
            } else {
                return next(new HTTPError(422, 'Some Error in Updating'));
            }
        } catch (e: any) {
            this.ok(res, { err: e });
        }
    }
    async find(req: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction): Promise<void> {
        const id: number = parseInt(req.params['id']);
        try {
            const user = await this.UserService.findUser(id);
            res.render('./pages/update', {
                users: user
            });
        } catch (e: any) {
            this.ok(res, { err: e });
        }
    }
    async findDetails(req: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction): Promise<void> {
        const id: number = parseInt(req.params['id']);
        try {
            const user = await this.UserService.findUser(id);
            res.render('./pages/details', {
                user: user
            });
        } catch (e: any) {
            this.ok(res, { err: e });
        }
    }
    private signAccessJWT(email: string, secret: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            sign(
                {
                    email,
                    // iat: Math.floor(Date.now() / 1000)
                    iat: 200
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
    private signRefreshJWT(email: string, secret: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            sign(
                {
                    email,
                    // iat: Math.floor(Date.now() / 1000)
                    iat: 60 * 60
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
