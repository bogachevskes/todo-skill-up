import User from '../entity/User';
import Role from '../entity/Role';
import UsersRoleRepository from './UsersRoleRepository';


export default class UserRepository
{
    protected user: User;
    
    public constructor(user: User)
    {
        this.user = user;
    }
    
    /**
     * Поиск по ид пользователя.
     * 
     * @param  string id
     * @return Promise<UserRepository|null>
     */
    public static async findById(id: number): Promise<User|null>
    {
        const user = await User.findOne({ where: { id } });

        if (user instanceof User) {
            return user;
        }

        return null;
    }

    /**
     * Поиск по почте пользователя.
     * 
     * @param  string email 
     * @return romise<User|null>
     */
    public static async findByEmail(email: string): Promise<User|null>
    {
        const user = await User.findOne({where: { email }});

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
     * @return Promise<UserRepository>
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
     * Есть роли?
     * 
     * @return Promise<void>
     */
    public async hasRoles(): Promise<boolean>
    {
        const result = await
            Role.createQueryBuilder('role')
            .leftJoinAndSelect('role.users', 'user')
            .where("user.id = :userId", { userId: this.user.id })
            .getCount();

        return Boolean(result);
    }

    /**
     * Добавить роль.
     * 
     * @param  role 
     * @return Promise<void>
     */
    public async assignRole(role: Role): Promise<void>
    {
        const userRoles = await this.user.roles;

        userRoles.push(role);
        
        await this.user.save();
    }

    /**
     * Добавить роль, если ее нет.
     * 
     * @param  role 
     * @return Promise<boolean>
     */
    public async assignRoleIfNotExists(role: Role): Promise<boolean>
    {
        if (await UsersRoleRepository.hasRole(this.user.id, role.id)) {
            return false;
        }

        await this.assignRole(role);

        return true;
    }

    /**
     * Удалить роль если назначена.
     * 
     * @param  role
     * @return Promise<boolean>
     */
    public async unsetRoleIfExists(role: Role): Promise<boolean>
    {
        if (await UsersRoleRepository.hasNoRole(this.user.id, role.id)) {
            return false;
        }

        await UsersRoleRepository.unsetRole(this.user, role);

        return true;
    }

}
