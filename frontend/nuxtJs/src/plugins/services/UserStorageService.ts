import { NuxtAxiosInstance } from '@nuxtjs/axios';
import IndexedInterface from '../base/IndexedInterface';
import UserIdentity from '../models/UserIdentity';
import TodoGroup from '../models/TodoGroup';
import TodoStatus from '../models/TodoStatus';
import CookieStorage from './CookieStorage';
import TodoGroupsService from './TodoGroupsService';

export default class UserStorageLoader {
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
    protected storage: Storage | CookieStorage;

    /**
     * @var UserIdentity
     */
    protected identity: UserIdentity;

    protected constructor(
        private wasLoaded: boolean = false,
        private identityKeys: any[] = []
    ) {
        this.storage = process.client ? localStorage : new CookieStorage();
        this.identity = new UserIdentity();
        this.loadIdentityKeys();
    }

    /**
     * @param  string cookie
     * @return void
     */
    public fillCookies(cookies: string): void {
        if (this.storage instanceof CookieStorage === false) {
            throw new TypeError(
                'Необходимо использовать CookieStorage как хранилище'
            );
        }

        const parser = require('cookie');

        this.storage.setItems(parser.parse(cookies));
    }

    /**
     * @param  cookies
     * @return void
     */
    public setClientCookies(cookies: object): void {
        if (Boolean(process.client) === false) {
            throw new Error(
                'Использование метода возможно только на стороне клиента'
            );
        }

        const Cookie = require('js-cookie');

        const cookieValues: IndexedInterface = {};

        Object.assign(cookieValues, cookies);

        for (const cookie in cookieValues) {
            Cookie.set(cookie, cookieValues[cookie], { expires: 360 });
        }
    }

    /**
     * Получение значений сущности пользователя.
     *
     * @return void
     */
    protected loadIdentityKeys(): void {
        this.identityKeys = this.identity.getKeys();
    }

    /**
     * Присвоение признака о
     * загрузке сущности пользователя.
     *
     * @param  boolean condition
     * @return void
     */
    protected setWasLoaded(condition: boolean): void {
        this.wasLoaded = condition;
    }

    /**
     * Установка признака
     * о загрузке сущности пользователя.
     *
     * @return void
     */
    protected setStorageLoaded(): void {
        this.setWasLoaded(true);
    }

    /**
     * Сброс признака
     * о загрузке сущности пользователя.
     *
     * @return void
     */
    protected setStorageNotLoaded(): void {
        this.setWasLoaded(false);
    }

    /**
     * Проверка признака
     * загрузки сущности пользователя.
     *
     * @return boolean
     */
    protected isStorageLoaded(): boolean {
        return this.wasLoaded === true;
    }

    /**
     * @return boolean
     */
    protected storageNotLoaded(): boolean {
        return !this.isStorageLoaded();
    }

    /**
     * Загрузка сущности
     * пользователя из памяти браузера.
     *
     * @return void
     */
    public fillFomStorage(): void {
        for (const item of this.identityKeys) {
            this.identity.set(item, this.storage.getItem(item));
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
    public fillStorage(data: IndexedInterface): void {
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
    public getUserData(): object {
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
    public getUserId(): number | null {
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
    protected flushStorage(): void {
        this.storage.clear();
    }

    /**
     * @return void
     */
    protected flushClientCookie(): void {
        const Cookie = require('js-cookie');

        this.identityKeys.forEach((name) => {
            Cookie.remove(name);
        });
    }

    /**
     * Сброс сущности пользователя.
     *
     * @return void
     */
    public flushData(): void {
        this.flushStorage();
        this.fillFomStorage();

        if (Boolean(process.client) === true) {
            this.flushClientCookie();
        }
    }

    /**
     * @returns NuxtAxiosInstance | never
     */
    private getAxios(): NuxtAxiosInstance | never {
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
    public loadTodoItems(callback: Function | null = null): void {
        this.getAxios()
            .$get('todo/list')
            .then((result) => {
                const groups = TodoGroupsService.createGroups(result.items);

                this.identity.set('groups', groups);

                if (callback instanceof Function) {
                    callback();
                }
            })
            .catch((error) => {
                // TODO: Добавить хендлер
            });
    }

    /**
     * @return any
     */
    public loadPermissions(): any {
        return this.getAxios()
            .$get('user/permissions/list')
            .then((result) => {
                this.identity.set('permissions', result.items);

                return Promise.resolve(this.identity.get('permissions'));
            });
    }

    /**
     * @return any
     */
    public loadTodoGroups(): any {
        return this.getAxios()
            .$get('todo-group/list')
            .then((result) => {
                this.identity.set('todoGroups', result.items);

                return Promise.resolve(this.identity.get('todoGroups'));
            });
    }

    /**
     * Возвращает туду-задания пользователя.
     *
     * @return TodoGroup[]
     */
    public getTodoItems(): TodoGroup[] {
        return this.identity.get('groups');
    }

    /**
     * @return object[]
     */
    public getGroupsPairs(): object[] {
        const groups = this.getTodoItems();
            const pairs: object[] = [];

        for (const group of groups) {
            const status: TodoStatus = group.status || new TodoStatus();

            pairs.push({
                id: status.id,
                name: status.name,
            });
        }

        return pairs;
    }
}
