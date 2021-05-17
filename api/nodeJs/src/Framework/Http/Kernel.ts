import Router from './Router/Router';
import express from 'express';
import OutputManager from '../Helpers/OutputManager';

export default class Kernel
{
    /**
     * @type express.Express
     */
    protected app: express.Express;
    
    /**
     * @type Router
     */
    protected router: Router;
    
    /**
     * @param  router 
     * @return void
     */
    public setRouter(router: Router): void
    {
        this.router = router;
    }
    
    /**
     * @param  number port 
     * @return Promise<void>
     */
    public async handle(port: number): Promise<void>
    {
        const app = await express();

        app.use(this.router.getRoutes())
            .listen(port, () => OutputManager.showServerInit(port));
    }

    /**
     * Завершение выполнения команды.
     * 
     * @return void
     */
    public terminate(): void
    {
        process.exit();
    }
}