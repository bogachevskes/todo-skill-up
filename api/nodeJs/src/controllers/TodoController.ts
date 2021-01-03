import { Request, Response, NextFunction } from 'express';
import CrudController from './base/CrudController';
import RouteData from './base/RouteData';
import AutoBind from '../core/Decorators/AutoBind';
import NotFound from '../core/Exceptions/NotFound';
import BadRequest from '../core/Exceptions/BadRequest';
import User from '../entity/User';
import TodoItem from '../entity/TodoItem';
import TodoStatus from '../entity/TodoStatus';
import UserRepository from '../repository/UserRepository';
import TodoItemRepository from '../repository/TodoItemRepository';
import TodoStatusRepository from '../repository/TodoStatusRepository';

export default class TodoController extends CrudController
{
    protected userRepo: UserRepository;
    
    public constructor()
    {
        super('/todo');
    }

    /**
     * @see CrudController
     */
    protected defineCustomRoutes(): RouteData[]
    {
        return [
            new RouteData('put', 'set-status/:id', 'setStatus'),
        ];
    }

    /**
     * Определение репозитория пользователя.
     * 
     * @param  Request req
     * @return void
     */
    protected defineUserRepo(req: Request): void
    {
        if (! (req['user'] instanceof User)) {
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
        
        return await this.userRepo.getTodoesByStatusGroups();
    }

    /**
     * @see CrudController
     */
    protected async create(req: Request): Promise<TodoItem>
    {
        this.defineUserRepo(req);

        const newTodo = await this.userRepo.addTodoItem(req.body.form);
        
        return newTodo;
    }

    /**
     * @see CrudController
     */
    protected async update(id: number, req: Request): Promise<object>
    {
        this.defineUserRepo(req);
        
        return new Promise(function(resolve, reject) {
            return resolve({});
        });
    }

    /**
     * @see CrudController
     */
    protected async delete(id: number, req: Request): Promise<boolean>
    {
        return await TodoItemRepository.deleteById(id);
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
            cardId      = parseInt(req.params.id),
            statusId    = parseInt(req.body.statusId);

        const
            todoItem    = await this.findTodoModel(cardId),
            todoStatus  = await this.findTodoStatusModel(statusId);

        const result = await this.userRepo.setTodoStatus(
            todoItem,
            todoStatus,
        );
        
        return res.json({
            item: TodoItem,
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
