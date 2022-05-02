import { Request, Response } from 'express';
import ValidationError from '../../../../Framework/Exceptions/ValidationError';
import User from '../../../Entity/User';
import CrudController from '../../../../Framework/Http/Controller/CrudController';
import UserRepository from '../../../Repository/UserRepository';
import AutoBind from '../../../../Framework/Decorators/AutoBind';
import NotFound from '../../../../Framework/Exceptions/NotFound';
import CommandContext from '../../../../Framework/Base/CommandContext';
import UserCreate from '../../../Console/Commands/UserCreate';
import UserUpdate from '../../../Console/Commands/UserUpdate';

export default class AdminUserController extends CrudController
{
    /**
     * @var UserRepository
     */
    protected userRepo: UserRepository;

    /**
     * Определение репозитория пользователя.
     * 
     * @param  number userId
     * @return Promise<void>|never
     */
    protected async defineUserRepo(userId: number): Promise<void>|never
    {
        const user = await UserRepository.findById(userId);

        if (user instanceof User) {
            this.userRepo = new UserRepository(user);
            return;
        }

        throw new NotFound('Пользователь не найден');
    }

    /**
     * Возвращает список задач пользователя.
     * 
     * @param  req Request
     * @param  res Response
     * @return Promise<Response>
     */
    @AutoBind
    public async actionTodo(req: Request, res: Response): Promise<Response>
    {
        const userId = Number(req.params.id);
        
        await this.defineUserRepo(userId);
        
        return res.json({
            items: await this.userRepo.getTodoByStatusGroups(),
        });
    }

    /**
     * Возвращает
     * данные пользователя.
     * 
     * @param  req Request
     * @param  res Response
     * @return Promise<Response>
     */
    @AutoBind
    public async actionGetUserData(req: Request, res: Response): Promise<Response>
    {
        const userId = Number(req.params.id);
        
        await this.defineUserRepo(userId);

        const model = this.userRepo.getUserModel();

        return res.json({
            item: {
                id: model.id,
                name: model.name,
                email: model.email,
                hasPassword: Boolean(model.password),
            }
        });
    }

    /**
     * Изменяет статус
     * активности пользователя.
     * 
     * @param  req Request
     * @param  res Response
     * @return Promise<Response>
     */
    @AutoBind
    public async actionSetActiveState(req: Request, res: Response): Promise<Response>
    {
        const
            userId = Number(req.params.id),
            active = parseInt(req.body.active);
        
        await this.defineUserRepo(userId);

        return res.json({
            items: await UserRepository.setActiveState(
                    this.userRepo.getUserModel(),
                    active
                ),
        });
    }
    
    /**
     * @see CrudController
     */
    protected async list(): Promise<object[]>
    {
        return await UserRepository.allExisting();
    }

    /**
     * @see CrudController
     */
    protected async create(req: Request): Promise<object>
    {
        const
            context = new CommandContext,
            cmd = new UserCreate;

        context.walk(req.body.formData);

        try {

            await cmd.execute(context);

        } catch (error) {
            if (error instanceof ValidationError) {
                return {
                    success: false,
                    error: error.message,
                };
            }

            throw new Error(error.message);
        }
        
        return {
            success: true,
            item: context.get('user'),
        };
    }

    /**
     * @see CrudController
     */
    protected async update(_id: number, req: Request): Promise<object>
    {
        const
            context = new CommandContext,
            cmd = new UserUpdate;

        context.walk(req.body.formData);

        try {

            await cmd.execute(context);

        } catch (error) {
            if (error instanceof ValidationError) {
                return {
                    success: false,
                    error: error.message,
                };
            }

            throw new Error(error.message);
        }
        
        return {
            success: true,
            item: context.get('user'),
        };
    }

    /**
     * @see CrudController
     */
    protected async delete(id: number, req: Request): Promise<boolean>
    {
        await this.defineUserRepo(id);
        
        return await UserRepository.delete(
            this.userRepo.getUserModel()
        );
    }

}
