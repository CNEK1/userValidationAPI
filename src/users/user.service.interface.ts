import { UserLoginDto } from './dot/user-login.dto';
import { UserRegisterDto } from './dot/user-register.dto';
import { User } from './user.entity';

export interface IUserService {
    createUser: (dto: UserRegisterDto) => Promise<User | null>;
    // register: (req: Request, res: Response, next: NextFunction) => void;
    validateUser: (dto: UserLoginDto) => Promise<boolean>;
}
