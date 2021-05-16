import InvalidArgumentException from '../Framework/Exceptions/InvalidArgumentException';
import Configurable from '../Framework/Base/Configurable';
import serviceConfig from '../config/_common';

export default class ConfigService extends Configurable
{
    protected static instance: ConfigService|null = null;

    /**
     * @param  string key
     * @return number|string
     */
    public static get(key: string): number|string
    {
        const instance = this.getInstance(),
            value = instance[key];
        
        if (value === undefined) {
            throw new InvalidArgumentException(`Key ${key} is not found in configuration`);
        }

        return value;
    }
    
    /**
     * @return ConfigService
     */
    protected static getInstance(): ConfigService
    {
        if (! (this.instance instanceof ConfigService)) {
            this.instance = new this(serviceConfig);
        }
        
        return this.instance;
    }

    /**
     * Проверяет активность режима
     * продакшн.
     * 
     * @return boolean
     */
    public static isProduction(): boolean
    {
        if (process.env.NODE_ENV === 'production') {
            return true;
        }

        return false;
    }

    /**
     * Возвращает порт запуска.
     * 
     * @return number
     */
    public static getPort(): number
    {
        if (this.isProduction()) {
            return Number(this.get('PROD_APP_PORT'));
        }

        return Number(this.get('DEV_APP_PORT'));
    }

    /**
     * Возвращает порт
     * запуска веб-сокетов.
     * 
     * @return number
     */
    public static getSocketPort(): number
    {
        return Number(this.get('WEB_SOCKET_PORT'));
    }

}
