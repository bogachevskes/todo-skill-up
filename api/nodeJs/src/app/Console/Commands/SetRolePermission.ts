import BaseCommand from '../../../Framework/Base/BaseCommand';
import RolePermissionsRepository from '../../Repository/RolePermissionsRepository';
import RoleRepository from '../../Repository/RoleRepository';
import PermissionsRepository from '../../Repository/PermissionsRepository';
import Role from '../../Entity/Role';
import Permission from '../../Entity/Permission';

export default class SetRolePermission extends BaseCommand
{
    protected role: Role;

    protected permission: Permission;
    
    /**
     * @see BaseCommand
     */
    protected getImportantKeys(): string[]
    {
        return [
            'role',
            'permission'
        ];
    }

    /**
     * @return Promise<void>
     */
    protected async validateRole(): Promise<void>
    {
        const item = this.context.get('role');
        
        const model = await RoleRepository.findByName(item);

        if (! (model instanceof Role)) {
            this.throwValidationError(`Роль ${item} не найдена`);
        }

        this.role = model;
    }

    /**
     * @return Promise<void>
     */
    protected async validatePermission(): Promise<void>
    {
        const item = this.context.get('permission');
        
        const model = await PermissionsRepository.findByName(item);

        if (! (model instanceof Permission)) {
            this.throwValidationError(`Разрешение ${item} не найдено`);
        }

        this.permission = model;
    }

    /**
     * @see BaseCommand
     */
    protected async validateData(): Promise<void>
    {
        await this.validateRole();
        await this.validatePermission();
    }

    /**
     * @see BaseCommand
     */
    protected async handle(): Promise<void>
    {
        RolePermissionsRepository.assignPermission(
            this.role,
            this.permission
        );
    }

}
