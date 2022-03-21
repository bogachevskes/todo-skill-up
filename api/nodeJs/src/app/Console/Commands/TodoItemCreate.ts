import BaseCommand from '../../../Framework/Base/BaseCommand';
import TodoItemCreateRequest from '../../FormRequest/TodoItem/TodoItemCreateRequest';
import UserRepository from '../../Repository/UserRepository';

export default class TodoItemCreate extends BaseCommand
{
    /**
     * @var UserCreateRequest
     */
    protected request: TodoItemCreateRequest;

    /**
     * @var UserRepository
     */
    public userRepo: UserRepository;
    
    /**
     * @see BaseCommand
     */
    protected async validateData(): Promise<void>
    {
        this.request = new TodoItemCreateRequest(this.context.all());
        
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

        this.context.set('item', await this.userRepo.addTodoItem(this.request));
    }
}