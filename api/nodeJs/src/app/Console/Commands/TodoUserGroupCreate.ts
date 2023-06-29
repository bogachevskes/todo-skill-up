import BaseCommand from '../../../Framework/Base/BaseCommand';
import TodoUsersGroupsCreateRequest from '../../FormRequest/TodoUsersGroups/TodoUsersGroupsCreateRequest';
import UserRepository from '../../Repository/UserRepository';
import TodoUserGroupRepository from '../../Repository/TodoUserGroupRepository';
import TodoGroup from '../../Entity/TodoGroup';
import TodoUsersGroups from '../../Entity/TodoUsersGroups';
import User from '../../Entity/User';

export default class TodoUserGroupCreate extends BaseCommand
{
    /**
     * @var TodoUsersGroupsCreateRequest
     */
    protected request: TodoUsersGroupsCreateRequest;

    /**
     * @var UserRepository
     */
    public userRepo: UserRepository;
    
    /**
     * @see BaseCommand
     */
    protected async validateData(): Promise<void>
    {
        this.request = new TodoUsersGroupsCreateRequest(this.context.all());
        
        await this.request.validate();

        if (this.request.isNotValid()) {
            this.throwValidationError(this.request.getFirstError());
        }

        const model = await this.userRepo.findTodoGroupById(this.request.todo_group_id);

        if ((model instanceof TodoGroup) === false) {
            
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

            if (await TodoUserGroupRepository.isUserExistsInGroup(this.request.todo_group_id, user.id) === true) {
                
                existingUserEmails.push(email);

                continue;
            }

            const access = await this.userRepo.addTodoAccessUserGroup(this.request.todo_group_id, user.id);

            if (access instanceof TodoUsersGroups) {
                
                accesses.push(email);
            }

        }

        this.context.set('not_existing_user_emails', notExistingUserEmails);
        this.context.set('existing_user_emails', existingUserEmails);
        this.context.set('items', accesses);
    }
}