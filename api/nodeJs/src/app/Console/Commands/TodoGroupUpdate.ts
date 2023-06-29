import BaseCommand from '../../../Framework/Base/BaseCommand';
import TodoGroupUpdateRequest from '../../FormRequest/TodoGroup/TodoGroupUpdateRequest';
import UserRepository from '../../Repository/UserRepository';
import TodoGroupRepository from '../../Repository/TodoGroupRepository';
import TodoGroup from '../../Entity/TodoGroup';

export default class TodoGroupUpdate extends BaseCommand
{
    /**
     * @var TodoGroupUpdateRequest
     */
    protected request: TodoGroupUpdateRequest;

    /**
     * @var UserRepository
     */
    public userRepo: UserRepository;
    
    /**
     * @see BaseCommand
     */
    protected async validateData(): Promise<void>
    {
        this.request = new TodoGroupUpdateRequest(this.context.all());
        
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

        const model = await this.userRepo.findTodoGroupById(this.context.get('id'));

        if (model instanceof TodoGroup) {
            
            this.context.set('item', await TodoGroupRepository.update(model, this.request));

            return;
        }

        this.throwValidationError('Группа не найдена');
    }
}