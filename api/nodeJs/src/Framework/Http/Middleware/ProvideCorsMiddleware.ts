import Middleware from './Middleware';

/**
 * Добавление возможности создания
 * кросс-доменных запросов к приложению.
 */
export default class ProvideCorsMiddleware extends Middleware
{
    /**
     * @see Middleware
     */
    protected async handle(): Promise<boolean|void>
    {
        this.res.setHeader('Access-Control-Allow-Origin', '*');
        this.res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
        this.res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, X-BASE-AUTH');
    
        if ('OPTIONS' == this.req.method) {
            this.res.sendStatus(204);
    
            return false;
        }
    }
}