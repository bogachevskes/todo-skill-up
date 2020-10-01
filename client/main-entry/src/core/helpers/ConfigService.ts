import config from '../config/common';
import serviceConfig from '../config/_services';

export default class ConfigService
{
    /**
     * Проверяет активность режима
     * продакшн.
     * 
     * @return {boolean}
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
     * @return {number}
     */
    public static getPort(): number
    {
        if (ConfigService.isProduction()) {
            return config.PROD_APP_PORT;
        }

        return config.DEV_APP_PORT;
    }

    /**
     * Возвращает адрес
     * обращения к api.
     * 
     * @return {string}
     */
    public static getBackendUrl(): string
    {
        return serviceConfig.BACKEND_DOMAIN;
    }

}
