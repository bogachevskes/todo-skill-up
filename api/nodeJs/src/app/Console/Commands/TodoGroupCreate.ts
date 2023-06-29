import BaseCommand from '../../../Framework/Base/BaseCommand';
import TodoGroupCreateRequest from '../../FormRequest/TodoGroup/TodoGroupCreateRequest';
import UserRepository from '../../Repository/UserRepository';

export default class TodoGroupCreate extends BaseCommand
{
    /**
     * @var TodoGroupCreateRequest
     */
    protected request: TodoGroupCreateRequest;

    /**
     * @var UserRepository
     */
    public userRepo: UserRepository;
    
    /**
     * @see BaseCommand
     */
    protected async validateData(): Promise<void>
    {
        this.request = new TodoGroupCreateRequest(this.context.all());
        
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

        this.context.set('item', await this.userRepo.addTodoGroup(this.request));
    }
}