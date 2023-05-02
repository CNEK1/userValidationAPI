import { IMiddleware } from './middleware.interface';
import { NextFunction, Request, Response } from 'express';
import { verify, JwtPayload as _JwtPayload } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';

export class RefreshMiddleware implements IMiddleware {
    constructor(private secret: string) {}

    execute(req: Request, res: Response, next: NextFunction): any {
        const refreshToken = req.cookies.refreshToken;
        console.log(refreshToken);
        if (!refreshToken) {
            return res.sendStatus(401);
        }
        try {
            const decoded = jwt.verify(refreshToken, this.secret);
            req.user = JSON.stringify(decoded);
        } catch (err) {
            return res.sendStatus(401);
        }
        return next();
    }
}
