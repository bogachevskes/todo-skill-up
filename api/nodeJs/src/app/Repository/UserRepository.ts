import { SelectQueryBuilder } from 'typeorm';
import RuntimeError from '../../Framework/Exceptions/RuntimeError';
import User from '../Entity/User';
import Role from '../Entity/Role';
import TodoItem from '../Entity/TodoItem';
import UserRole from '../Entity/UserRole';
import TodoAccessGroup from '../Entity/TodoAccessGroup';
import TodoAccessUserGroup from '../Entity/TodoAccessUserGroup';
import TodoStatus from '../Entity/TodoStatus';
import TodoStatusGroup from '../Entity/TodoStatusGroup';
import UsersRoleRepository from './UsersRoleRepository';
import TodoItemRepository from './TodoItemRepository';
import RolePermissionsRepository from './RolePermissionsRepository';
import TodoAccessGroupRepository from './TodoAccessGroupRepository';
import TodoAccessUserGroupRepository from './TodoAccessUserGroupRepository';
import TodoItemCreateRequest from '../FormRequest/TodoItem/TodoItemCreateRequest';
import TodoAccessGroupCreateRequest from '../FormRequest/TodoAccessGroup/TodoAccessGroupCreateRequest';

export default class UserRepository
{
    protected user: User;
    
    public constructor(user: User)
    {
        this.user = user;
    }

    /**
     * @return SelectQueryBuilder<User>
     */
    protected static getQueryBuilder(): SelectQueryBuilder<User>
    {
        return User.createQueryBuilder('user');
    }

    /**
     * Возвращает модель пользователя.
     * 
     * @return User
     */
    public getUserModel(): User
    {
        return this.user;
    }

    /**
     * Возвращает ид пользователя.
     * 
     * @return number
     */
    public getUserId(): number
    {
        return this.user.id;
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
     * Возвращает всех
     * не удаленных пользователей.
     * 
     * @return Promise<User[]>
     */
    public static async allExisting(): Promise<User[]>
    {
        return this.all({ where: { deletedAt: null } });
    }
    
    /**
     * Поиск по ид пользователя.
     * 
     * @param  number id
     * @param  withTrashed boolean искать с удаленными?
     * @return Promise<User|null>
     */
    public static async findById(id: number, withTrashed: boolean = false): Promise<User|null>
    {
        const condition = withTrashed ? {} : { deletedAt: null },
            user = await User.findOne({ where: { id, ...condition } });

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
     * Обновление модели.
     * 
     * @param  User item 
     * @param  object attributes 
     * @return Promise<User>
     */
    public static async update(item: User, attributes: object): Promise<User>
    {
        await this.getQueryBuilder()
            .update(User)
            .set(attributes)
            .where("id = :id", { id: item.id })
            .execute();

        const updatedItem = await this.findById(item.id, true);

        if (updatedItem instanceof User) {
            return updatedItem;
        }

        throw new RuntimeError('Модель пользователя не найдена после обновления');
    }

    /**
     * Удаляет задание по ID
     * 
     * @param  User user
     * @return Promise<boolean>
     */
    public static async delete(user: User): Promise<boolean>
    {
        await this.update(user, { deletedAt: () => "NOW()" });

        return true;
    }

    /**
     * Изменяет статус
     * активности пользователя.
     * 
     * @param  User user
     * @return Promise<User>
     */
    public static async setActiveState(user: User, status: number): Promise<User>
    {
        return await this.update(user, { status });
    }

    /**
     * Пользователь активен?
     * 
     * @param  User user
     * @return boolean
     */
    public static isActive(user: User): boolean
    {
        return Boolean(user.status);
    }

    /**
     * Пользователь заблокирован?
     * 
     * @param  User user
     * @return boolean
     */
    public static isBlocked(user: User): boolean
    {
        return ! this.isActive(user);
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
            .leftJoinAndSelect('role.userRoles', 'user')
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
        const model = new UserRole;

        model.userId = this.user.id;
        model.roleId = role.id;
        
        await model.save();
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
    public async getTodo(): Promise<TodoItem[]>
    {
        return TodoItemRepository.findByUserId(this.user.id);
    }

    /**
     * Возвращает задания
     * пользователя группированные по статусам.
     * 
     * @return Promise<TodoStatusGroup[]>
     */
    public async getTodoByStatusGroups(): Promise<TodoStatusGroup[]>
    {
        return await TodoItemRepository.getTodoGroupedByStatuses(this.user.id);
    }

    /**
     * 
     * @param accessGroupId number
     * @returns Promise<TodoStatusGroup[]>
     */
    public async getTodoByStatusGroupsByAccessGroup(accessGroupId: number): Promise<TodoStatusGroup[]>
    {
        return await TodoItemRepository.getTodoGroupedByStatusesOfAccessGroup(this.user.id, accessGroupId);
    }

    /**
     * Добавление задания.
     * 
     * @param  TodoItemCreateRequest data
     * @return Promise<TodoItem>
     */
    public async addTodoItem(data: TodoItemCreateRequest): Promise<TodoItem>
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
        return await this.updateTodoItem(todoItem, { statusId: statusItem.id });
    }

    /**
     * Изменение аттрибутов туду-задания.
     * 
     * @param  TodoItem todoItem
     * @param  object attributes
     * @return Promise<TodoItem>
     */
    public async updateTodoItem(todoItem: TodoItem, attributes: object): Promise<TodoItem>
    {
        return await TodoItemRepository.update(todoItem, attributes);
    }

    /**
     * @param  id: number
     * @return Promise<TodoAccessGroup | undefined>
     */
    public async findTodoAccessGroupById(id: number): Promise<TodoAccessGroup | undefined>
    {
        return await TodoAccessGroupRepository.findOneByUserId(this.user.id, id);
    }

    /**
     * @return Promise<TodoAccessGroup[]>
     */
    public async getTodoAccessGroups(): Promise<TodoAccessGroup[]>
    {
        return await TodoAccessGroupRepository.findByUserId(this.user.id);
    }

    /**
     * @param  data TodoAccessGroupCreateRequest
     * @return Promise<TodoAccessGroup | undefined>
     */
    public async addTodoAccessGroup(data: TodoAccessGroupCreateRequest): Promise<TodoAccessGroup | undefined>
    {
        data.userId = this.user.id;
        
        return await TodoAccessGroupRepository.createNew(data);
    }

    /**
     * @param  id number
     * @return Promise<TodoAccessUserGroup | undefined>
     */
    public async findTodoAccessUserGroupById(id: number): Promise<TodoAccessUserGroup | undefined>
    {
        return await TodoAccessUserGroupRepository.findOneByUserId(this.user.id, id);
    }

    /**
     * @param  groupId number
     * @param  userId number
     * @return Promise<TodoAccessUserGroup>
     */
    public async addTodoAccessUserGroup(groupId: number, userId: number): Promise<TodoAccessUserGroup>
    {
        const model = new TodoAccessUserGroup;

        model.todoAccessGroupId = groupId;
        model.userId = userId;

        return await model.save();
    }

    /**
     * @param  groupId number
     * @return  Promise<object[]>
     */
    public async getGroupAccessedUsers(groupId: number): Promise<object[]>
    {
        const query = UserRepository.getQueryBuilder()
            .select(['user.id, user.name, user.email, taug.id as group_id'])
            .leftJoin('user.todoAccessGroupsGroups', 'taug')
            .leftJoin('taug.todoAccessGroup', 'tag')
            .where('tag.userId = :userId AND tag.id = :groupId', {userId: this.user.id, groupId});

        return await query.getRawMany();
    }

    /**
     * @param  emailEntry string
     * @param  limit number
     * @returns Promise<object[]>
     */
    public static async getUsersByEmailEntry(emailEntry: string, limit: number): Promise<object[]>
    {
        const query = this.getQueryBuilder()
            .select(['user.id', 'user.email'])
            .where('user.email LIKE :emailEntry', {emailEntry: `${emailEntry}%`})
            .limit(limit);

        return await query.getRawMany();
    }
}
