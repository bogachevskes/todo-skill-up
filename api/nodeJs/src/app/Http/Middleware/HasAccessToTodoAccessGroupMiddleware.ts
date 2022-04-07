import Middleware from '../../../Framework/Http/Middleware/Middleware';
import BadRequest from '../../../Framework/Exceptions/BadRequest';

import TodoAccessGroupRepository from '../../Repository/TodoAccessGroupRepository';
import User from '../../Entity/User';

/**
 * Фильтрация доступа только
 * авторизованных пользователей.
 */
export default class HasAccessToTodoAccessGroupMiddleware extends Middleware
{
    /**
     * @see Middleware
     */
    protected async handle(): Promise<void>
    {
        const user: User = this.req['user'];

        if (await TodoAccessGroupRepository.isUserExistsInGroup(Number(this.req.params.id), user.id) === false) {
            
            throw new BadRequest('Доступ к группе запрещен');
        }
    }
}
