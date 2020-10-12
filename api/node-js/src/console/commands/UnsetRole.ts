import ManageUserRole from './ManageUserRole';
import UserRepository from '../../repository/UserRepository';

export default class UnsetRole extends ManageUserRole
{
    /**
     * @see BaseCommand
     */
    protected async handle(): Promise<void>
    {
        await UserRepository.unsetRoleIfExists(this.user, this.role);
    }

}