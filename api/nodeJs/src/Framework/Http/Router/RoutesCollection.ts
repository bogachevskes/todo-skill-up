import Route from './Route';
import RoutesResource from './RoutesResource';
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

    /**
     * 
     * @param  resource RoutesResource
     * @return void
     */
    public static addResource(resource: RoutesResource): void
    {
        let methodsMap = {
            'GET': {
                path: 'list',
                action: 'actionList',
            },
            'POST': {
                path: 'create',
                action: 'actionCreate'
            },
            'PUT': {
                path: 'update/:id',
                action: 'actionUpdate'
            },
            'DELETE': {
                path: 'delete/:id',
                action: 'actionDelete'
            },
        };

        if ('disableMethods' in resource.rules) {
            
            resource.rules['disableMethods'].forEach(method => {
                delete methodsMap[method];
            });

        }

        for (const method in methodsMap) {

            let path = methodsMap[method].path,
                action = methodsMap[method].action,
                middleware = [];
            
            if (method in resource.routes) {
                path = resource.routes[method].path || path;
                action = resource.routes[method].action || action;
                middleware = resource.routes[method].middleware || [];
            }

            this.add(
                new Route(
                    method,
                    `/${resource.path}/${path}`,
                    resource.controller,
                    action,
                    resource.middleware.concat(middleware)
                )
            );
            
        }
    }
}