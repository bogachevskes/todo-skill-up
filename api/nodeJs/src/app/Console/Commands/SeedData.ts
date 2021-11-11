import BaseCommand from '../../../Framework/Base/BaseCommand';
import UserRepository from '../../Repository/UserRepository';
import RoleRepository from '../../Repository/RoleRepository';
import PermissionsRepository from '../../Repository/PermissionsRepository';
import TodoStatusRepository from '../../Repository/TodoStatusRepository';
import SetRole from './SetRole';
import SetRolePermission from './SetRolePermission';
import CommandContext from '../../../Framework/Base/CommandContext';
import User from '../../Entity/User';
import Role from '../../Entity/Role';
import Permission from '../../Entity/Permission';

export default class SeedData extends BaseCommand
{
    protected user: User;

    protected role: Role;

    protected manageUsersPermission: Permission;

    protected manageUsersTodoesPermissions: Permission;
    
    protected validateData(): void
    {
        //
    }

    /**
     * @return Promise<void>
     */
    protected async assignRoles(): Promise<void>
    {
        const context = new CommandContext;

        context.set('user', this.user.id);
        context.set('role', this.role.name);

        const command = new SetRole;

        await command.execute(context);
    }

    /**
     * @return Promise<void>
     */
    protected async assignRolesPermissions(): Promise<void>
    {
        const context = new CommandContext();

        context.set('role', this.role.name);
        context.set('permission', this.manageUsersPermission.name);

        const command = new SetRolePermission;

        await command.execute(context);

        context.set('permission', this.manageUsersTodoesPermissions.name);

        await command.execute(context);
    }

    /**
     * @return Promise<void>
     */
    protected async createStatuses(): Promise<void>
    {
        await TodoStatusRepository.createNew('Новое', true);
        await TodoStatusRepository.createNew('В работе');
        await TodoStatusRepository.createNew('Отменено');
    }
    
    /**
     * @see BaseCommand
     */
    protected async handle(): Promise<void>
    {
        this.user = await UserRepository.createNew(
            'admin',
            'admin@admin.com',
            '$2a$12$lAR1FHRxNOQWADxnhmQQk.RpHpTsO61h36VXnE4z2G8m1M5/481jK' //admin
        );

        this.role = await RoleRepository.createNew('admin', 'Администратор');

        this.manageUsersPermission = await PermissionsRepository.createNew(
                PermissionsRepository.PERMISSION_CAN_MANAGE_USERS,
                'Управление пользователями'
            );

        this.manageUsersTodoesPermissions = await PermissionsRepository.createNew(
                PermissionsRepository.PERMISSION_CAN_MANAGE_USERS_TODOES,
                'Управление списком задач пользователей'
            );

        await this.assignRoles();

        await this.assignRolesPermissions();

        await this.createStatuses();

    }

}
