import { NuxtAxiosInstance } from '@nuxtjs/axios';
import IndexedInterface from '../base/IndexedInterface';
import User from '../models/User';
import TaskStatusGroup from '../models/TaskStatusGroup';
import TaskStatus from '../models/TaskStatus';
import CookieStorage from './CookieStorage';
import TaskStatusGroupFactory from './TaskStatusGroupFactory';

export default class UserStorageLoader {

    public axios: NuxtAxiosInstance | undefined;

    public static instance: UserStorageLoader;

    protected storage: Storage | CookieStorage;

    protected identity: User;

    protected constructor(
        private wasLoaded: boolean = false,
        private identityKeys: any[] = []
    ) {
        this.storage = process.client ? localStorage : new CookieStorage();
        this.identity = new User();
        this.loadIdentityKeys();
    }

    public fillCookies(cookies: string): void {
        if (this.storage instanceof CookieStorage === false) {
            throw new TypeError(
                'Необходимо использовать CookieStorage как хранилище'
            );
        }

        const parser = require('cookie');

        this.storage.setItems(parser.parse(cookies));
    }

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

    protected loadIdentityKeys(): void {
        this.identityKeys = this.identity.getKeys();
    }

    protected setWasLoaded(condition: boolean): void {
        this.wasLoaded = condition;
    }

    protected setStorageLoaded(): void {
        this.setWasLoaded(true);
    }

    protected setStorageNotLoaded(): void {
        this.setWasLoaded(false);
    }

    protected isStorageLoaded(): boolean {
        return this.wasLoaded === true;
    }

    protected storageNotLoaded(): boolean {
        return !this.isStorageLoaded();
    }

    public fillFomStorage(): void {
        for (const item of this.identityKeys) {
            this.identity.set(item, this.storage.getItem(item));
        }

        this.setStorageLoaded();
    }

    public fillStorage(data: IndexedInterface): void {
        const keys = Object.keys(data);

        for (const key of keys) {
            this.storage.setItem(key, data[key]);
        }

        this.setStorageNotLoaded();
    }

    public getUserData(): object {
        if (this.storageNotLoaded()) {
            this.fillFomStorage();
        }

        return this.identity.getParams();
    }

    public getUserId(): number | null {
        const userId = this.identity.get('userId');

        if (userId) {
            return parseInt(userId);
        }

        return null;
    }

    protected flushStorage(): void {
        this.storage.clear();
    }

    protected flushClientCookie(): void {
        const Cookie = require('js-cookie');

        this.identityKeys.forEach((name) => {
            Cookie.remove(name);
        });
    }

    public flushData(): void {
        this.flushStorage();
        this.fillFomStorage();

        if (Boolean(process.client) === true) {
            this.flushClientCookie();
        }
    }

    private getAxios(): NuxtAxiosInstance | never {
        if (this.axios === undefined) {
            throw new Error('Axios должен быть установлен как зависимость');
        }

        return this.axios;
    }

    public loadPermissions(): any {
        return this.getAxios()
            .$get(`user/${this.identity.get('userId')}/permissions`)
            .then((result) => {
                this.identity.set('permissions', result);

                return Promise.resolve(this.identity.get('permissions'));
            });
    }

    public loadBoards(): any {
        return this.getAxios()
            .$get(`/user/${this.identity.get('userId')}/boards`)
            .then((result) => {
                this.identity.set('boards', result.items);

                return Promise.resolve(this.identity.get('boards'));
            });
    }

    public getTasks(): TaskStatusGroup[] {
        return this.identity.get('groups');
    }

    public getGroupsPairs(): object[] {
        const groups = this.getTasks();
            const pairs: object[] = [];

        for (const group of groups) {
            const status: TaskStatus = group.status || new TaskStatus();

            pairs.push({
                id: status.id,
                name: status.name,
            });
        }

        return pairs;
    }
}
