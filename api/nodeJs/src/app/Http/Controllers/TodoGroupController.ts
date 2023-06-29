import { Request, Response } from 'express';
import CrudController from '../../../Framework/Http/Controller/CrudController';
import AutoBind from '../../../Framework/Decorators/AutoBind';
import NotFound from '../../../Framework/Exceptions/NotFound';
import BadRequest from '../../../Framework/Exceptions/BadRequest';
import CommandContext from '../../../Framework/Base/CommandContext';
import ValidationError from '../../../Framework/Exceptions/ValidationError';
import User from '../../Entity/User';
import TodoGroup from '../../Entity/TodoGroup';
import UserRepository from '../../Repository/UserRepository';
import TodoGroupRepository from '../../Repository/TodoGroupRepository';
import TodoGroupCreate from '../../Console/Commands/TodoGroupCreate';
import TodoGroupUpdate from '../../Console/Commands/TodoGroupUpdate';

export default class TodoGroupController extends CrudController
{
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
        
        return await this.userRepo.getTodoGroups();
    }

    /**
     * @see CrudController
     */
    protected async create(req: Request): Promise<TodoGroup>
    {
        this.defineUserRepo(req);

        const
            context = new CommandContext,
            cmd = new TodoGroupCreate;

        context.walk(req.body.formData);

        cmd.userRepo = this.userRepo;

        try {

            await cmd.execute(context);

        } catch (error) {
            
            if (error instanceof ValidationError) {

                throw new BadRequest(error.message);
            }

            throw new Error(error.message);
        }
        
        return context.get('item');
    }

    /**
     * @see CrudController
     */
    protected async update(id: number, req: Request): Promise<object>
    {
        this.defineUserRepo(req);

        const
            context = new CommandContext,
            cmd = new TodoGroupUpdate;

        context.walk(req.body.formData);

        context.set('id', id);

        cmd.userRepo = this.userRepo;

        try {

            await cmd.execute(context);

        } catch (error) {
            
            if (error instanceof ValidationError) {

                throw new BadRequest(error.message);
            }

            throw new Error(error.message);
        }
        
        return context.get('item');
    }

    /**
     * @see CrudController
     */
    protected async delete(id: number, req: Request): Promise<boolean | never>
    {
        this.defineUserRepo(req);
        
        await this.findTodoGroupModel(id);
        
        return await TodoGroupRepository.deleteById(id);
    }

    /**
     * @return Promise<TodoGroup | never>
     * @throws NotFound
     */
    protected async findTodoGroupModel(id: number): Promise<TodoGroup | never>
    {
        const model = await this.userRepo.findTodoGroupById(id);

        if (model instanceof TodoGroup) {
            
            return model;
        }

        throw new NotFound('Группа не найдена');
    }

    /**
     * Изменить статус задачи.
     * 
     * @param  req Request
     * @param  res Response
     * @return Promise<Response>
     */
    @AutoBind
    public async actionGetGroup(req: Request, res: Response): Promise<Response>
    {
        this.defineUserRepo(req);

        const model = await TodoGroupRepository.findOneById(Number(req.params.id));
        
        return res.json({ item: model });
    }

}
