import { SelectQueryBuilder, getConnection } from 'typeorm';
import RolePermission from '../entity/RolePermission';
import Role from '../entity/Role';
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
     * Возвращает имена разрешений роли.
     * 
     * @param  string rolesNames
     * @return Promise<string[]> 
     */
    public static async listRolePermissionNames(rolesNames: string[]): Promise<string[]>
    {
        const result = await this.getQueryBuilder()
            .leftJoinAndSelect('role_permission.permissions', 'permission')
            .leftJoinAndSelect('role_permission.roles', 'role')
            .select('permission.name')
            .where('role.name IN (:rolesNames)', { rolesNames })
            .getRawMany();

        const uniqPerms = _.uniq(result);
        
        return uniqPerms.map(perm => perm.permission_name);
    }

}
