import { IMiddleware } from './middleware.interface';
import { NextFunction, Request, Response } from 'express';
import { verify, JwtPayload as _JwtPayload } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';

export class VerifyAuthMiddleware implements IMiddleware {
    constructor(private secret: string) {}

    execute(req: Request, res: Response, next: NextFunction): void | Response {
        const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : '';

        if (!token) {
            return res.sendStatus(401);
        }
        try {
            const decoded = jwt.verify(token, this.secret);
            req.user = decoded as string;
        } catch (e) {
            return res.sendStatus(401);
        }
        return next();
    }
}
