import { IMiddleware } from './middleware.interface';
import { NextFunction, Request, Response } from 'express';
import { verify, JwtPayload as _JwtPayload } from 'jsonwebtoken';

export class AuthMiddleware implements IMiddleware {
    constructor(private secret: string) {}

    execute(req: Request, res: Response, next: NextFunction): void {
        if (req.headers.authorization) {
            verify(req.headers.authorization.split(' ')[1], this.secret, (err: any, payload: any) => {
                if (err) {
                    next();
                } else if (payload) {
                    req.user = payload.email;
                    next();
                }
            });
        } else {
            next();
        }
    }
}
