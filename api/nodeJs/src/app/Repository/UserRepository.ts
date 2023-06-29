import { SelectQueryBuilder } from 'typeorm';
import RuntimeError from '../../Framework/Exceptions/RuntimeError';
import User from '../Entity/User';
import TodoItem from '../Entity/TodoItem';
import TodoGroup from '../Entity/TodoGroup';
import TodoUsersGroups from '../Entity/TodoUsersGroups';
import TodoStatus from '../Entity/TodoStatus';
import TodoStatusGroup from '../Entity/TodoStatusGroup';
import TodoItemRepository from './TodoItemRepository';
import TodoGroupRepository from './TodoGroupRepository';
import TodoUserGroupRepository from './TodoUserGroupRepository';
import TodoItemCreateRequest from '../FormRequest/TodoItem/TodoItemCreateRequest';
import TodoGroupCreateRequest from '../FormRequest/TodoGroup/TodoGroupCreateRequest';

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
     * @param groupId number
     * @returns Promise<TodoStatusGroup[]>
     */
    public async getTodoByStatusGroupsByGroup(groupId: number): Promise<TodoStatusGroup[]>
    {
        return await TodoItemRepository.getTodoGroupedByStatusesOfGroup(this.user.id, groupId);
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
     * @return Promise<TodoGroup | undefined>
     */
    public async findTodoGroupById(id: number): Promise<TodoGroup | undefined>
    {
        return await TodoGroupRepository.findOneByUserId(this.user.id, id);
    }

    /**
     * @return Promise<TodoGroup[]>
     */
    public async getTodoGroups(): Promise<TodoGroup[]>
    {
        return await TodoGroupRepository.findByUserId(this.user.id);
    }

    /**
     * @param  data TodoGroupCreateRequest
     * @return Promise<TodoGroup | undefined>
     */
    public async addTodoGroup(data: TodoGroupCreateRequest): Promise<TodoGroup | undefined>
    {
        data.userId = this.user.id;
        
        return await TodoGroupRepository.createNew(data);
    }

    /**
     * @param  id number
     * @return Promise<TodoUsersGroups | undefined>
     */
    public async findTodoAccessUserGroupById(id: number): Promise<TodoUsersGroups | undefined>
    {
        return await TodoUserGroupRepository.findOneByUserId(this.user.id, id);
    }

    /**
     * @param  groupId number
     * @param  userId number
     * @return Promise<TodoUsersGroups>
     */
    public async addTodoAccessUserGroup(groupId: number, userId: number): Promise<TodoUsersGroups>
    {
        const model = new TodoUsersGroups;

        model.todoGroupId = groupId;
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
            .leftJoin('user.todoGroupsGroups', 'taug')
            .leftJoin('taug.todoGroup', 'tag')
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
