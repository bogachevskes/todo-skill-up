import config from '../config/common';

export default class ConfigService
{
    /**
     * Проверяет активность режима
     * продакшн.
     * 
     * @return { boolean }
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
     * @return { number }
     */
    public static getPort(): number
    {
        if (ConfigService.isProduction()) {
            return config.PROD_APP_PORT;
        }

        return config.DEV_APP_PORT;
    }

    /**
     * Возвращает порт
     * запуска веб-сокетов.
     * 
     * @return { number }
     */
    public static getSocketPort(): number
    {
        return config.WEB_SOCKET_PORT;
    }
}