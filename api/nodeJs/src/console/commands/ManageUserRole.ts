import BaseCommand from '../base/BaseCommand';
import UserRepository from '../../app/repository/UserRepository';
import RoleRepository from '../../app/repository/RoleRepository';
import User from '../../app/entity/User';
import Role from '../../app/entity/Role';

export default abstract class ManageUserRole extends BaseCommand
{
    protected user: User;

    protected role: Role;

    /**
     * @see BaseCommand
     */
    protected getImportantKeys(): string[]
    {
        return [
            'user',
            'role',
        ];
    }

    /**
     * @return Promise<void>
     */
    protected async validateUser(): Promise<void>
    {
        const userId = this.context.get('user');
        
        const user = await UserRepository.findById(userId);

        if (! (user instanceof User)) {
            this.throwValidationError(`Пользователь id=${userId} не определен`);
        }

        this.user = user!;
    }

    /**
     * @return Promise<void>
     */
    protected async validateRole(): Promise<void>
    {
        const roleName = this.context.get('role');
        
        const role = await RoleRepository.findByName(roleName);

        if (! (role instanceof Role)) {
            this.throwValidationError(`Роль ${roleName} не найдена`);
        }

        this.role = role;
    }
    
    /**
     * @see BaseCommand
     */
    protected async validateData(): Promise<void>
    {
        await this.validateUser();
        await this.validateRole();
    }

    /**
     * @see BaseCommand
     */
    protected abstract handle(): Promise<void>

}