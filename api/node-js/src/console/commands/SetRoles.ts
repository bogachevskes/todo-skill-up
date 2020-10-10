import ManageUserRole from './ManageUserRole';
import UserRepository from '../../repository/UserRepository';

export default class SetRoles extends ManageUserRole
{
    /**
     * @see BaseCommand
     */
    protected async handle(): Promise<void>
    {
        await UserRepository.assignRoleIfNotExists(this.user, this.role);
    }

}
