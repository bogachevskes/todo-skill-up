import Route from './Route';

export default class RoutesCollection
{
    /**
     * @type RoutesCollection
     */
    protected static instance: RoutesCollection;
    
    /**
     * @type Route[]
     */
    protected routes: Route[] = [];

    protected constructor() {};

    /**
     * @return RoutesCollection
     */
    protected static getInstance(): RoutesCollection
    {
        if (! (this.instance instanceof RoutesCollection)) {
            this.instance = new this;
        }

        return this.instance;
    }


    /**
     * @param  Route route 
     * @return void
     */
    public static add(route: Route): void
    {
        const instance = this.getInstance();

        instance.routes.push(route);
    }

    /**
     * @return Route[]
     */
    public static all(): Route[]
    {
        const instance = this.getInstance();

        return instance.routes;
    }
}