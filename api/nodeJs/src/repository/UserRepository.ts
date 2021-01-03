import User from '../entity/User';
import Role from '../entity/Role';
import TodoItem from '../entity/TodoItem';
import TodoStatus from '../entity/TodoStatus';
import TodoStatusGroup from '../entity/TodoStatusGroup';
import UsersRoleRepository from './UsersRoleRepository';
import TodoItemRepository from './TodoItemRepository';
import RolePermissionsRepository from './RolePermissionsRepository';
import TodoItemInterface from '../entity/base/TodoItemInterface';

export default class UserRepository
{
    protected user: User;
    
    public constructor(user: User)
    {
        this.user = user;
    }

    /**
     * Возвращает список всех пользователей.
     * 
     * @param  object condition 
     * @return Promise<User[]>
     */
    public static async all(condition: object = {}): Promise<User[]>
    {
        return User.find({
            select: ['id', 'name', 'email', 'status', 'createdAt', 'updatedAt'],
            ...condition,
        });
    }
    
    /**
     * Поиск по ид пользователя.
     * 
     * @param  number id
     * @return Promise<User|null>
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
     * @return Promise<User|null>
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
     * Есть роли?
     * 
     * @return Promise<boolean>
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
     * @param  Role role 
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
     * @param  Role role 
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
     * @param  Role role
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

    /**
     * Возвращает задания пользователя.
     * 
     * @return Promise<TodoItem[]>
     */
    public async getTodoes(): Promise<TodoItem[]>
    {
        return TodoItemRepository.findByUserId(this.user.id);
    }

    /**
     * Возвращает задания
     * пользователя группированные по статусам.
     * 
     * @return Promise<TodoStatusGroup[]>
     */
    public async getTodoesByStatusGroups(): Promise<TodoStatusGroup[]>
    {
        return await TodoItemRepository.getTodoesGroupedByStatuses(this.user.id);
    }

    /**
     * Добавление задания.
     * 
     * @param  TodoItemInterface data
     * @return Promise<TodoItem>
     */
    public async addTodoItem(data: TodoItemInterface): Promise<TodoItem>
    {
        data.userId = this.user.id;
        
        return TodoItemRepository.createNew(data);
    }

    /**
     * Возвращает имена
     * разрешений пользователя.
     * 
     * @return Promise<string[]>
     */
    public async getPermissionNames(): Promise<string[]>
    {
        if (! await this.hasRoles()) {
            return new Promise(resolve => resolve([]));
        }
        
        const rolesNames = await UsersRoleRepository.getUserRolesNames(this.user.id);
        
        return RolePermissionsRepository.listRolePermissionNames(rolesNames);
    }

    /**
     * Возвращает
     * туду-задание пользователя.
     * 
     * @param  number cardId
     * @return Promise<TodoItem | undefined>
     */
    public async findTodoById(cardId: number): Promise<TodoItem | undefined>
    {
        return await TodoItemRepository.getUserTodoById(
            cardId,
            this.user.id
        );
    }

    /**
     * Изменение статуса задания.
     * 
     * @param  TodoItem todoItem
     * @param  TodoStatus statusItem
     * @return Promise<TodoItem>
     */
    public async setTodoStatus(todoItem: TodoItem, statusItem: TodoStatus): Promise<TodoItem>
    {
        return await TodoItemRepository.update(todoItem, { statusId: statusItem.id });
    }

}
