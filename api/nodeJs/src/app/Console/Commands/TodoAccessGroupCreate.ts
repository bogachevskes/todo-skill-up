import BaseCommand from '../../../Framework/Base/BaseCommand';
import TodoAccessGroupCreateRequest from '../../FormRequest/TodoAccessGroup/TodoAccessGroupCreateRequest';
import UserRepository from '../../Repository/UserRepository';

export default class TodoAccessGroupCreate extends BaseCommand
{
    /**
     * @var TodoAccessGroupCreateRequest
     */
    protected request: TodoAccessGroupCreateRequest;

    /**
     * @var UserRepository
     */
    public userRepo: UserRepository;
    
    /**
     * @see BaseCommand
     */
    protected async validateData(): Promise<void>
    {
        this.request = new TodoAccessGroupCreateRequest(this.context.all());
        
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

        this.context.set('item', await this.userRepo.addTodoAccessGroup(this.request));
    }
}