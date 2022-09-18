import { UserLoginDto } from './dot/user-login.dto';
import { UserRegisterDto } from './dot/user-register.dto';
import { UserModel } from '@prisma/client';

export interface IUserService {
    createUser: (dto: UserRegisterDto) => Promise<UserModel | null>;
    // register: (req: Request, res: Response, next: NextFunction) => void;
    validateUser: (dto: UserLoginDto) => Promise<boolean>;
}
