import BaseCommand from '../base/BaseCommand';
import UserRepository from '../../repository/UserRepository';
import RoleRepository from '../../repository/RoleRepository';
import PermissionsRepository from '../../repository/PermissionsRepository';
import TodoStatusRepository from '../../repository/TodoStatusRepository';
import SetRole from './SetRole';
import SetRolePermission from './SetRolePermission';
import CommandContext from '../base/CommandContext';
import User from '../../entity/User';
import Role from '../../entity/Role';
import Permission from '../../entity/Permission';

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

        this.role = await RoleRepository.createNew('admin');

        this.manageUsersPermission = await PermissionsRepository.createNew('canManageUsers');

        this.manageUsersTodoesPermissions = await PermissionsRepository.createNew('canManageUsersTodoes');

        await this.assignRoles();

        await this.assignRolesPermissions();

        await this.createStatuses();

    }

}
