import ManageUserRole from './ManageUserRole';
import UserRepository from '../../app/repository/UserRepository';

export default class UnsetRole extends ManageUserRole
{
    /**
     * @see BaseCommand
     */
    protected async handle(): Promise<void>
    {
        const repo = new UserRepository(this.user);
        
        await repo.unsetRoleIfExists(this.role);
    }

}