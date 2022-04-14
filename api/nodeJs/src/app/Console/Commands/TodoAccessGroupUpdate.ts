import BaseCommand from '../../../Framework/Base/BaseCommand';
import TodoAccessGroupUpdateRequest from '../../FormRequest/TodoAccessGroup/TodoAccessGroupUpdateRequest';
import UserRepository from '../../Repository/UserRepository';
import TodoAccessGroupRepository from '../../Repository/TodoAccessGroupRepository';
import TodoAccessGroup from '../../Entity/TodoAccessGroup';

export default class TodoAccessGroupUpdate extends BaseCommand
{
    /**
     * @var TodoAccessGroupUpdateRequest
     */
    protected request: TodoAccessGroupUpdateRequest;

    /**
     * @var UserRepository
     */
    public userRepo: UserRepository;
    
    /**
     * @see BaseCommand
     */
    protected async validateData(): Promise<void>
    {
        this.request = new TodoAccessGroupUpdateRequest(this.context.all());
        
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

        const model = await this.userRepo.findTodoAccessGroupById(this.context.get('id'));

        if (model instanceof TodoAccessGroup) {
            
            this.context.set('item', await TodoAccessGroupRepository.update(model, this.request));

            return;
        }

        this.throwValidationError('Группа не найдена');
    }
}