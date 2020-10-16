import { SelectQueryBuilder } from 'typeorm';
import UserRole from '../entity/UserRole';
import User from '../entity/User';
import Role from '../entity/Role';

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
            .where('usersId = :usersId and rolesId = :rolesId', { usersId: user.id, rolesId: role.id })
            .delete()
            .execute();

        return true;
    }

    /**
     * Есть роль у пользователя?
     * 
     * @param  userId 
     * @param  roleId
     * @return Promise<void>
     */
    public static async hasRole(userId: number, roleId: number): Promise<boolean>
    {
        const result = await this.getQueryBuilder()
            .where('usersId = :usersId and rolesId = :rolesId', { usersId: userId, rolesId: roleId })
            .getCount();
        
        return Boolean(result);
    }

    /**
     * @param  userId 
     * @param  roleId
     * @return Promise<void>
     */
    public static async hasNoRole(userId: number, roleId: number): Promise<boolean>
    {
        return await ! this.hasRole(userId, roleId);
    }

}