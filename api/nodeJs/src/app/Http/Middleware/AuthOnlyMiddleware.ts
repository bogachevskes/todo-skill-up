import jwt from 'jsonwebtoken';
import Middleware from '../../../Framework/Http/Middleware/Middleware';

import BadRequest from '../../../Framework/Exceptions/BadRequest';
import NotFound from '../../../Framework/Exceptions/NotFound';

import UserRepository from '../../Repository/UserRepository';

import User from '../../Entity/User';

import ConfigService from '../../../Framework/Utils/ConfigService';

/**
 * Фильтрация доступа только
 * авторизованных пользователей.
 */
export default class AuthOnlyMiddleware extends Middleware
{
    /**
     * @see Middleware
     */
    protected async handle(): Promise<void>
    {
        const token: string = String(this.req.get('X-BASE-AUTH'));
    
        let decodedToken;
    
        decodedToken = jwt.verify(token!, String(ConfigService.get('TOKEN_SECRET_WORD')));
    
        if (Boolean(decodedToken) === false) {
            throw new BadRequest('Аутентификация не выполнена');
        }
    
        const user = await UserRepository.findById(decodedToken.userId);
    
        if (! (user instanceof User)) {
            throw new NotFound('Пользователь не найден');
        }
    
        if (UserRepository.isBlocked(user) === true) {
            throw new BadRequest('Пользователь заблокирован');
        }
    
        this.req['user'] = user;
    }
}
