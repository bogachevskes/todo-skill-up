import { Request } from 'express';
import CrudController from '../../../Framework/Http/Controller/CrudController';
import NotFound from '../../../Framework/Exceptions/NotFound';
import BadRequest from '../../../Framework/Exceptions/BadRequest';
import CommandContext from '../../../Framework/Base/CommandContext';
import ValidationError from '../../../Framework/Exceptions/ValidationError';
import User from '../../Entity/User';
import TodoAccessUserGroup from '../../Entity/TodoAccessUserGroup';
import UserRepository from '../../Repository/UserRepository';
import TodoAccessUserGroupRepository from '../../Repository/TodoAccessUserGroupRepository';
import TodoAccessUserGroupCreate from '../../Console/Commands/TodoAccessUserGroupCreate';

export default class TodoAccessUserGroupController extends CrudController
{
    /**
     * @var UserRepository
     */
    protected userRepo: UserRepository;

    /**
     * @param  Request req
     * @return void
     */
    protected defineUserRepo(req: Request): void
    {
        if ((req['user'] instanceof User) === false) {
            throw new BadRequest('Пользователь не определен');
        }

        this.userRepo = new UserRepository(req['user']);
    }

    /**
     * @see CrudController
     */
    protected async list(req: Request): Promise<object[]>
    {
        this.defineUserRepo(req);
        
        return await this.userRepo.getGroupAccessedUsers(Number(req.params.id));
    }

    /**
     * @see CrudController
     */
    protected async create(req: Request): Promise<object>
    {
        this.defineUserRepo(req);

        const
            context = new CommandContext,
            cmd = new TodoAccessUserGroupCreate;

        context.walk(req.body.formData);

        context.set('todo_access_group_id', Number(req.params.id));

        cmd.userRepo = this.userRepo;

        try {

            await cmd.execute(context);

        } catch (error) {
            
            if (error instanceof ValidationError) {

                throw new BadRequest(error.message);
            }

            throw new Error(error.message);
        }
        
        return {
            created: context.get('items'),
            existing: context.get('existing_user_emails'),
            not_existing: context.get('not_existing_user_emails'),
        };
    }

    /**
     * @see CrudController
     */
    protected async update(id: number, req: Request): Promise<object>
    {
        this.defineUserRepo(req);
        
        // Not implemented

        return new Promise(function(resolve, reject) {
            return resolve({});
        });
    }

    /**
     * @see CrudController
     */
    protected async delete(id: number, req: Request): Promise<boolean | never>
    {
        this.defineUserRepo(req);
        
        await this.findTodoAccessUserGroupModel(Number(req.params.groupId));
        
        return await TodoAccessUserGroupRepository.deleteById(Number(req.params.groupId));
    }

    /**
     * @return Promise<TodoAccessUserGroup | never>
     * @throws NotFound
     */
    protected async findTodoAccessUserGroupModel(id: number): Promise<TodoAccessUserGroup | never>
    {
        const model = await this.userRepo.findTodoAccessUserGroupById(id);

        if (model instanceof TodoAccessUserGroup) {
            
            return model;
        }

        throw new NotFound('Доступ к группе не найден');
    }

}