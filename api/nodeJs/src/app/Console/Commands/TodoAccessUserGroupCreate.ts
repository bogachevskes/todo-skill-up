import BaseCommand from '../../../Framework/Base/BaseCommand';
import TodoAccessUserGroupCreateRequest from '../../FormRequest/TodoAccessUserGroup/TodoAccessUserGroupCreateRequest';
import UserRepository from '../../Repository/UserRepository';
import TodoAccessUserGroupRepository from '../../Repository/TodoAccessUserGroupRepository';
import TodoAccessGroup from '../../Entity/TodoAccessGroup';
import TodoAccessUserGroup from '../../Entity/TodoAccessUserGroup';
import User from '../../Entity/User';

export default class TodoAccessUserGroupCreate extends BaseCommand
{
    /**
     * @var TodoAccessUserGroupCreateRequest
     */
    protected request: TodoAccessUserGroupCreateRequest;

    /**
     * @var UserRepository
     */
    public userRepo: UserRepository;
    
    /**
     * @see BaseCommand
     */
    protected async validateData(): Promise<void>
    {
        this.request = new TodoAccessUserGroupCreateRequest(this.context.all());
        
        await this.request.validate();

        if (this.request.isNotValid()) {
            this.throwValidationError(this.request.getFirstError());
        }

        const model = await this.userRepo.findTodoAccessGroupById(this.request.todo_access_group_id);

        if ((model instanceof TodoAccessGroup) === false) {
            
            this.throwValidationError('Группа не найдена');
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

        const notExistingUserEmails: string[] = [],
            existingUserEmails: string[] = [],
            accesses: string[] = [];

        for (const key in this.request.user_emails) {
            const email = this.request.user_emails[key],
                user = await UserRepository.findByEmail(email);

            if (! (user instanceof User)) {
                
                notExistingUserEmails.push(email);

                continue;
            }

            if (await TodoAccessUserGroupRepository.isUserExistsInGroup(this.request.todo_access_group_id, user.id) === true) {
                
                existingUserEmails.push(email);

                continue;
            }

            const access = await this.userRepo.addTodoAccessUserGroup(this.request.todo_access_group_id, user.id);

            if (access instanceof TodoAccessUserGroup) {
                
                accesses.push(email);
            }

        }

        this.context.set('not_existing_user_emails', notExistingUserEmails);
        this.context.set('existing_user_emails', existingUserEmails);
        this.context.set('items', accesses);
    }
}