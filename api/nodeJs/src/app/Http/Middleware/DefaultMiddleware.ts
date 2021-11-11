import Middleware from '../../../Framework/Http/Middleware/Middleware';

export default class DefaultMiddleware extends Middleware
{
    /**
     * @see Middleware
     */
    protected async handle(): Promise<void>
    {
        console.log(this.req.path);
    }
}