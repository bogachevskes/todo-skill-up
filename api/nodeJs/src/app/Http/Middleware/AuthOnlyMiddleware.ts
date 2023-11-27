import { Request } from 'express';
import jwt from 'jsonwebtoken';
import Middleware from '../../../Framework/Http/Middleware/Middleware';
import BadRequest from '../../../Framework/Exceptions/BadRequest';
import NotFound from '../../../Framework/Exceptions/NotFound';
import UserRepository from '../../Repository/UserRepository';
import User from '../../Entity/User';
import ConfigService from '../../../Framework/Utils/ConfigService';

export default class AuthOnlyMiddleware extends Middleware
{
    private userRepository: UserRepository;

    public constructor() {
        super();
        this.userRepository = new UserRepository;
    }

    /**
     * @see Middleware
     */
    protected async handle(req: Request): Promise<void>
    {
        const token: string = String(req.get('X-BASE-AUTH'));
    
        let decodedToken;
    
        decodedToken = jwt.verify(token!, String(ConfigService.get('TOKEN_SECRET_WORD')));
    
        if (Boolean(decodedToken) === false) {
            throw new BadRequest('Аутентификация не выполнена');
        }
    
        const user: User|null = await this.userRepository.findById(decodedToken.userId);
    
        if (user === null) {
            throw new NotFound('Пользователь не найден');
        }
    
        if (this.userRepository.isBlocked(user) === true) {
            throw new BadRequest('Пользователь заблокирован');
        }
    
        req['user'] = user;
    }
}
