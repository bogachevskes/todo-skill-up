import { SelectQueryBuilder, getConnection } from 'typeorm';
import Role from '../entity/Role';
import Permission from '../entity/Permission';
import RolePermission from '../entity/RolePermission';
import * as _ from 'lodash';

export default class RolePermissionsRepository
{
    /**
     * @return SelectQueryBuilder<RolePermission>
     */
    protected static getQueryBuilder(): SelectQueryBuilder<RolePermission>
    {
        return getConnection()
            .createQueryBuilder()
            .from(RolePermission, 'role_permission');
    }

    /**
     * Возвращает запрос
     * с выборкой смежных таблиц.
     * 
     * @return SelectQueryBuilder<RolePermission>
     */
    protected static getJoinedQuery(): SelectQueryBuilder<RolePermission>
    {
        return this.getQueryBuilder()
            .leftJoinAndSelect('role_permission.permissions', 'permission')
            .leftJoinAndSelect('role_permission.roles', 'role');
    }
    
    /**
     * Возвращает имена разрешений роли.
     * 
     * @param  string rolesNames
     * @return Promise<string[]> 
     */
    public static async listRolePermissionNames(rolesNames: string[]): Promise<string[]>
    {
        const result = await this.getJoinedQuery()
            .select('permission.name')
            .where('role.name IN (:rolesNames)', { rolesNames })
            .getRawMany();

        const uniqPerms = _.uniq(result);
        
        return uniqPerms.map(perm => perm.permission_name);
    }

    /**
     * Разрешение назначено?
     * 
     * @param  role Role
     * @param  permission Permission
     * @return Promise<boolean>
     */
    public static async isPermissionAssigned(roleName: string, permissionName: string): Promise<boolean>
    {
        const result = await this.getJoinedQuery()
            .where('role.name = :roleName and permission.name = :permissionName', {roleName, permissionName})
            .getCount();
        
        return Boolean(result);
    }

    /**
     * Назначение разрешения роли.
     * 
     * @param  role Role
     * @param  permission Permission
     * @return Promise<boolean>
     */
    public static async assignPermission(role: Role, permission: Permission): Promise<boolean>
    {
        if (await this.isPermissionAssigned(role.name, permission.name)) {
            return false;
        }

        const model = new RolePermission;

        model.rolesId = role.id;
        model.permissionsId = permission.id;

        await model.save();

        return true;
    }

}
