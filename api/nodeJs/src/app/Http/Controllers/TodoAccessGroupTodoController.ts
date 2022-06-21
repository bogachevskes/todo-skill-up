import { Request, Response } from 'express';
import CrudController from '../../../Framework/Http/Controller/CrudController';
import AutoBind from '../../../Framework/Decorators/AutoBind';
import NotFound from '../../../Framework/Exceptions/NotFound';
import BadRequest from '../../../Framework/Exceptions/BadRequest';
import CommandContext from '../../../Framework/Base/CommandContext';
import ValidationError from '../../../Framework/Exceptions/ValidationError';
import User from '../../Entity/User';
import TodoItem from '../../Entity/TodoItem';
import TodoStatus from '../../Entity/TodoStatus';
import UserRepository from '../../Repository/UserRepository';
import TodoItemRepository from '../../Repository/TodoItemRepository';
import TodoStatusRepository from '../../Repository/TodoStatusRepository';
import TodoItemCreate from '../../Console/Commands/TodoItemCreate';
import TodoItemUpdate from '../../Console/Commands/TodoItemUpdate';
import RedisConnection from '../../Services/RedisConnection';

export default class TodoAccessGroupTodoController extends CrudController
{
    protected userRepo: UserRepository;

    /**
     * Определение репозитория пользователя.
     * 
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

        return await this.userRepo.getTodoByStatusGroupsByAccessGroup(Number(req.params.id));
    }

    /**
     * @see CrudController
     */
    protected async create(req: Request): Promise<TodoItem>
    {
        this.defineUserRepo(req);

        const
            context = new CommandContext,
            cmd = new TodoItemCreate;

        context.walk(req.body.form);

        cmd.userRepo = this.userRepo;

        try {

            await cmd.execute(context);

        } catch (error) {
            
            if (error instanceof ValidationError) {

                throw new BadRequest(error.message);
            }

            throw new Error(error.message);
        }

        const todoItem = context.get('item');

        RedisConnection.getClient()
            .publish('todo-created', JSON.stringify(todoItem));
        
        return todoItem;
    }

    /**
     * @see CrudController
     */
    protected async update(id: number, req: Request): Promise<object>
    {
        this.defineUserRepo(req);

        const
            context = new CommandContext,
            cmd = new TodoItemUpdate;

        context.walk(req.body.formData);

        context.set('id', Number(req.params.todoId));

        cmd.userRepo = this.userRepo;

        try {

            await cmd.execute(context);

        } catch (error) {
            
            if (error instanceof ValidationError) {

                throw new BadRequest(error.message);
            }

            throw new Error(error.message);
        }

        const todoItem = context.get('item');

        RedisConnection.getClient()
            .publish('todo-state-changed', JSON.stringify(todoItem));
        
        return todoItem;
    }

    /**
     * @see CrudController
     */
    protected async delete(id: number, req: Request): Promise<boolean>
    {
        this.defineUserRepo(req);
        
        const todoItem = await this.findTodoModel(Number(req.params.todoId));

        const result = await TodoItemRepository.deleteById(todoItem.id);

        RedisConnection.getClient()
            .publish('todo-deleted', String(id));
        
        return result;
    }
    
    /**
     * Изменить статус задачи.
     * 
     * @param  req Request
     * @param  res Response
     * @return Promise<Response>
     */
    @AutoBind
    public async actionSetStatus(req: Request, res: Response): Promise<Response>
    {
        this.defineUserRepo(req);

        const
            cardId      = parseInt(req.params.todoId),
            statusId    = parseInt(req.body.statusId);

        const
            todoItem    = await this.findTodoModel(cardId),
            todoStatus  = await this.findTodoStatusModel(statusId);

        const result = await this.userRepo.setTodoStatus(
            todoItem,
            todoStatus,
        );

        RedisConnection.getClient()
            .publish('todo-state-changed', JSON.stringify(todoItem));
        
        return res.json({
            item: result,
        });
    }

    /**
     * Возвращает модель туду-задания.
     * 
     * @return Promise<TodoItem | never>
     * @throws NotFound
     */
    protected async findTodoModel(id: number): Promise<TodoItem | never>
    {
        const model = await this.userRepo.findTodoById(id);

        if (model instanceof TodoItem) {
            return model;
        }

        throw new NotFound('Задание не найдено');
    }

    /**
     * Возвращает
     * модель туду-статуса.
     * 
     * @return Promise<TodoStatus | never>
     * @throws NotFound
     */
    protected async findTodoStatusModel(id: number): Promise<TodoStatus | never>
    {
        const model = await TodoStatusRepository.findById(id);
        
        if (model instanceof TodoStatus) {
            return model;
        }

        throw new NotFound('Статус не найден');
    }

}
