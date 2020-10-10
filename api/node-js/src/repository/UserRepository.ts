import { Repository, getConnection, } from 'typeorm';
import User from '../entity/User';
import Role from '../entity/Role';

export default class UserRepository
{
    protected repository: Repository<User>;

    protected constructor()
    {
        this.repository = User.getRepository();
    }

    /**
     * @return Repository<User>
     */
    protected static getRepository(): Repository<User>
    {
        const builder = new this;

        return builder.repository;
    }

    /**
     * Поиск по ид пользователя.
     * 
     * @param  string id
     * @return Promise<User|null>
     */
    static async findById(id: number): Promise<User|null>
    {
        const user = await this.getRepository().findOne({ where: { id } });

        if (user instanceof User) {
            return user;
        }

        return null;
    }

    /**
     * Поиск по почте пользователя.
     * 
     * @param  string email 
     * @return Promise<User|null>
     */
    public static async findByEmail(email: string): Promise<User|null>
    {
        const user = await
            this.getRepository()
            .findOne({where: { email }});

        if (user instanceof User) {
            return user;
        }

        return null;
    }

    /**
     * Создание нового пользователя.
     * 
     * @param  string name 
     * @param  string email 
     * @param  string password 
     * @return Promise<User>
     */
    public static async createNew(name: string, email: string, password: string): Promise<User>
    {
        const user = new User;

        user.name       = name;
        user.email      = email;
        user.password   = password;

        await user.save();

        return user;
    }

    /**
     * Есть роль у пользователя?
     * 
     * @param userId 
     * @param roleId
     * @return Promise<void>
     */
    public static async hasRole(userId: number, roleId: number): Promise<boolean>
    {
        const result = await User.createQueryBuilder('user')
            .leftJoinAndSelect('user.roles', 'role')
            .where("user.id = :userId and role.id = :roleId", { userId, roleId })
            .getCount();
        
        return Boolean(result);
    }

    /**
     * @param userId 
     * @param roleId
     * @return Promise<void>
     */
    public static async hasNoRole(userId: number, roleId: number): Promise<boolean>
    {
        return await ! this.hasRole(userId, roleId);
    }

    /**
     * Есть роли у пользователя?
     * 
     * @param userId
     * @return Promise<void>
     */
    public static async hasRoles(userId): Promise<boolean>
    {
        const result = await Role.createQueryBuilder('role')
            .leftJoinAndSelect('role.users', 'user')
            .where("user.id = :userId", { userId })
            .getCount();

        return Boolean(result);
    }

    /**
     * Добавить пользователю роль.
     * 
     * @param user 
     * @param role 
     * @return Promise<void>
     */
    public static async assignRole(user: User, role: Role)
    {
        const userRoles = await user.roles;

        userRoles.push(role);
        
        await user.save();
    }

    /**
     * Добавить пользователю роль, если ее нет.
     * 
     * @param user 
     * @param role 
     * @return Promise<void>
     */
    public static async assignRoleIfNotExists(user: User, role: Role): Promise<void>
    {
        if (await this.hasRole(user.id, role.id)) {
            return;
        }

        await this.assignRole(user, role);
    }

}