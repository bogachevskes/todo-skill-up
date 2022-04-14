import { Request, Response } from 'express';
import CrudController from '../../../Framework/Http/Controller/CrudController';
import AutoBind from '../../../Framework/Decorators/AutoBind';
import NotFound from '../../../Framework/Exceptions/NotFound';
import BadRequest from '../../../Framework/Exceptions/BadRequest';
import CommandContext from '../../../Framework/Base/CommandContext';
import ValidationError from '../../../Framework/Exceptions/ValidationError';
import User from '../../Entity/User';
import TodoAccessGroup from '../../Entity/TodoAccessGroup';
import UserRepository from '../../Repository/UserRepository';
import TodoAccessGroupRepository from '../../Repository/TodoAccessGroupRepository';
import TodoAccessGroupCreate from '../../Console/Commands/TodoAccessGroupCreate';
import TodoAccessGroupUpdate from '../../Console/Commands/TodoAccessGroupUpdate';

export default class TodoAccessGroupController extends CrudController
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
        
        return await this.userRepo.getTodoAccessGroups();
    }

    /**
     * @see CrudController
     */
    protected async create(req: Request): Promise<TodoAccessGroup>
    {
        this.defineUserRepo(req);

        const
            context = new CommandContext,
            cmd = new TodoAccessGroupCreate;

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
            cmd = new TodoAccessGroupUpdate;

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
        
        await this.findTodoAccessGroupModel(id);
        
        return await TodoAccessGroupRepository.deleteById(id);
    }

    /**
     * @return Promise<TodoAccessGroup | never>
     * @throws NotFound
     */
    protected async findTodoAccessGroupModel(id: number): Promise<TodoAccessGroup | never>
    {
        const model = await this.userRepo.findTodoAccessGroupById(id);

        if (model instanceof TodoAccessGroup) {
            
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

        const model = await TodoAccessGroupRepository.findOneById(Number(req.params.id));
        
        return res.json({ item: model });
    }

}
