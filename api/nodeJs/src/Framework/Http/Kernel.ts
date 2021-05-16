import Router from './Router/Router';
import express from 'express';

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
    
    public async handle(): Promise<void>
    {
        const app = await express();

        app.use(this.router.getRoutes())
            .listen(3000, () => console.log('started'));
    }
}