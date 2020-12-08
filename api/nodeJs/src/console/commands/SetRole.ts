import ManageUserRole from './ManageUserRole';
import UserRepository from '../../repository/UserRepository';

export default class SetRole extends ManageUserRole
{
    /**
     * @see BaseCommand
     */
    protected async handle(): Promise<void>
    {
        const repo = new UserRepository(this.user);
        
        await repo.assignRoleIfNotExists(this.role);
    }

}
