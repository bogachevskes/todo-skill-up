import { SelectQueryBuilder } from 'typeorm';
import UserRole from '../Entity/UserRole';
import User from '../Entity/User';
import Role from '../Entity/Role';

export default class UsersRoleRepository
{
    /**
     * @return SelectQueryBuilder<UserRole>
     */
    protected static getQueryBuilder(): SelectQueryBuilder<UserRole>
    {
        return UserRole.createQueryBuilder('user_role');
    }

    /**
     * Удаление роли у пользователя.
     * 
     * @param  UserRepository user 
     * @param  RoleRepository role
     * @return Promise<boolean>
     */
    public static async unsetRole(user: User, role: Role): Promise<boolean>
    {
        await this.getQueryBuilder()
            .where('user_id = :userId and role_id = :roleId', { userId: user.id, roleId: role.id })
            .delete()
            .execute();

        return true;
    }

    /**
     * Есть роль у пользователя?
     * 
     * @param  number userId 
     * @param  number roleId
     * @return Promise<void>
     */
    public static async hasRole(userId: number, roleId: number): Promise<boolean>
    {
        const result = await this.getQueryBuilder()
            .where('user_id = :userId and role_id = :roleId', { userId: userId, roleId: roleId })
            .getCount();
        
        return Boolean(result);
    }

    /**
     * @param  number userId 
     * @param  number roleId
     * @return Promise<void>
     */
    public static async hasNoRole(userId: number, roleId: number): Promise<boolean>
    {
        return await ! this.hasRole(userId, roleId);
    }

    /**
     * Возвращает имена ролей пользователя.
     * 
     * @param  number userId
     * @return Promise<string[]>
     */
    public static async getUserRolesNames(userId: number): Promise<string[]>
    {
        const result = await this.getQueryBuilder()
            .select('role.name')
            .leftJoinAndSelect('user_role.role', 'role')
            .where('user_role.user_id IN (:userId)', { userId })
            .getRawMany();

        return result.map(role => role.name);
    }

}