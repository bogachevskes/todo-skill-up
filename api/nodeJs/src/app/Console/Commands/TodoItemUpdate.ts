import BaseCommand from '../../../Framework/Base/BaseCommand';
import TodoItemUpdateRequest from '../../FormRequest/TodoItem/TodoItemUpdateRequest';
import UserRepository from '../../Repository/UserRepository';
import TodoItem from '../../Entity/TodoItem';

export default class TodoItemUpdate extends BaseCommand
{
    /**
     * @var UserCreateRequest
     */
    protected request: TodoItemUpdateRequest;

    /**
     * @var UserRepository
     */
    public userRepo: UserRepository;
    
    /**
     * @see BaseCommand
     */
    protected async validateData(): Promise<void>
    {
        this.request = new TodoItemUpdateRequest(this.context.all());
        
        await this.request.validate();

        if (this.request.isNotValid()) {
            this.throwValidationError(this.request.getFirstError());
        }

    }
 
    /**
     * @see BaseCommand
     */
    protected async handle(): Promise<void>
    {
        if ((this.userRepo instanceof UserRepository) === false) {
            throw new Error('User repository must be set');
        }

        const todoItem = await this.userRepo.findTodoById(this.context.get('id'));

        if (todoItem instanceof TodoItem) {
            
            this.context.set('item', await this.userRepo.updateTodoItem(todoItem, this.request));

            return;
        }

        this.throwValidationError('Задача не найдена');
    }
}