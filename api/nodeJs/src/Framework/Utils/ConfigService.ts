
import env from '../Helpers/env';

export default class ConfigService
{
    protected static instance: ConfigService|null = null;

    /**
     * @param  string key
     * @return any | never
     */
    public static get(key: string): any | never
    {
        return env(key);
    }

    /**
     * Проверяет активность режима
     * продакшн.
     * 
     * @return boolean
     */
    public static isProduction(): boolean
    {
        return env('NODE_ENV') === 'production';
    }

    /**
     * Возвращает порт запуска.
     * 
     * @return number
     */
    public static getPort(): number
    {
        return Number(env('APP_PORT'));
    }

}
