import { NuxtAxiosInstance } from '@nuxtjs/axios';
import IndexedInterface from '../base/IndexedInterface';
import UserIdentity from '../models/UserIdentity';
import TodoGroup from '../models/TodoGroup';
import TodoStatus from '../models/TodoStatus';
import TodoGroupsService from './TodoGroupsService';

export default class UserStorageLoader
{
    /**
     * @var NuxtAxiosInstance
     */
    public axios: NuxtAxiosInstance | undefined;
    
    /**
     * @var UserStorageLoader
     */
    public static instance: UserStorageLoader;

    /**
     * @var Storage
     */
    protected storage: Storage | null;

    /**
     * @var UserIdentity
     */
    protected identity: UserIdentity;

    protected constructor(
        private wasLoaded: boolean = false,
        private identityKeys: any[] = []
    ) {
        this.storage = process.client ? localStorage : null;
        this.identity = new UserIdentity;
        this.loadIdentityKeys();
        this.fillFomStorage();
    }

    /**
     * Получение значений сущности пользователя.
     * 
     * @return void
     */
    protected loadIdentityKeys(): void
    {
        this.identityKeys = this.identity.getKeys();
    }

    /**
     * Присвоение признака о
     * загрузке сущности пользователя.
     * 
     * @param  boolean condition
     * @return void
     */
    protected setWasLoaded(condition: boolean): void
    {
        this.wasLoaded = condition;
    }

    /**
     * Установка признака
     * о загрузке сущности пользователя.
     * 
     * @return void
     */
    protected setStorageLoaded(): void
    {
        this.setWasLoaded(true);
    }

    /**
     * Сброс признака
     * о загрузке сущности пользователя.
     * 
     * @return void
     */
    protected setStorageNotLoaded(): void
    {
        this.setWasLoaded(false);
    }

    /**
     * Проверка признака
     * загрузки сущности пользователя.
     * 
     * @return boolean
     */
    protected isStorageLoaded(): boolean
    {
        return this.wasLoaded === true;
    }

    /**
     * @return boolean
     */
    protected storageNotLoaded(): boolean
    {
        return ! this.isStorageLoaded();
    }

    /**
     * Загрузка сущности
     * пользователя из памяти браузера.
     * 
     * @return void
     */
    public fillFomStorage(): void
    {
        if (this.storage === null) {
            return;
        }
        
        for (const item of this.identityKeys) {
            
            this.identity.set(
                item,
                this.storage.getItem(item)
            );

        }

        this.setStorageLoaded();
    }

    /**
     * Запись данных сущности
     * пользователя в память браузера.
     * 
     * @param  IndexedInterface data 
     * @return void
     */
    public fillStorage(data: IndexedInterface): void
    {
        if (this.storage === null) {
            return;
        }
        
        const keys = Object.keys(data);
        
        for (const key of keys) {
            this.storage.setItem(key, data[key]);
        }

        this.setStorageNotLoaded();
    }

    /**
     * Возвращает
     * сущность пользователя.
     * 
     * @return object
     */
    public getUserData(): object
    {
        if (this.storageNotLoaded()) {
            this.fillFomStorage();
        }
        
        return this.identity.getParams();
    }

    /**
     * Возвращает идентификатор пользователя.
     * 
     * @return number|null
     */
    public getUserId(): number | null
    {
        const userId = this.identity.get('userId');

        if (userId) {
            return parseInt(userId);
        }
        
        return null;
    }

    /**
     * Сброс данных
     * в памяти браузера.
     * 
     * @return void
     */
    protected flushStorage(): void
    {
        if (this.storage === null) {
            return;
        }
        
        this.storage.clear();
    }

    /**
     * Сброс сущности пользователя.
     * 
     * @return void
     */
    public flushData(): void
    {
        this.flushStorage();
        this.fillFomStorage();
    }

    /**
     * @returns NuxtAxiosInstance | never
     */
    private getAxios(): NuxtAxiosInstance | never
    {
        if (this.axios === undefined) {
            throw new Error('Axios должен быть установлен как зависимость');
        }

        return this.axios;
    }

    /**
     * Загрузка туду-заданий пользователя.
     * 
     * @param  Function|null
     * @return void
     */
    public loadTodoItems(callback: Function|null = null): void
    {
        this.getAxios().$get('todo/list')
            .then(result => {
                const groups = TodoGroupsService.createGroups(result.data.items);
                
                this.identity.set('groups', groups);

                if (callback instanceof Function) {
                    callback();
                }
            })
            .catch(error => {
                // TODO: Добавить хендлер
            });
    }

    /**
     * @return any
     */
    public loadPermissions(): any
    {
        return this.getAxios().$get('user-permissions/list')
            .then(result => {
                this.identity.set('permissions', result.data.items);

                return Promise.resolve(this.identity.get('permissions'));
            });
    }

    /**
     * @return any
     */
    public loadTodoAccessGroups(): any
    {
        return this.getAxios().$get('todo-access-group/list')
            .then(result => {
                this.identity.set('todoAccessGroups', result.data.items);

                return Promise.resolve(this.identity.get('todoAccessGroups'));
            });
    }

    /**
     * Возвращает туду-задания пользователя.
     * 
     * @return TodoGroup[]
     */
    public getTodoItems(): TodoGroup[]
    {
        return this.identity.get('groups');
    }

    /**
     * @return object[]
     */
    public getGroupsPairs(): object[]
    {
        const
            groups = this.getTodoItems(),
            pairs: object[] = [];

        for (const group of groups) {

            const status: TodoStatus = group.status || new TodoStatus;
            
            pairs.push({
                id: status.id,
                name: status.name,
            });

        }

        return pairs;
    }
    
    /**
     * Возвращает экземпляр класса.
     * 
     * @return UserStorageLoader
     */
    public static getInstance(): UserStorageLoader
    {
        if (! (this.instance instanceof this)) {
            this.instance = new this;
        }

        return this.instance;
    }

}
