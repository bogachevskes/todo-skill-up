import Route from './Route';
import RoutesResource from './RoutesResource';
export default class RoutesCollection
{
    protected static instance: RoutesCollection|null = null;

    protected routes: Route[] = [];

    protected groupStack: string[] = [];

    protected constructor() {};

    protected static getInstance(): RoutesCollection
    {
        if (this.instance === null) {
            this.instance = new this;
        }

        return this.instance;
    }

    public static add(resource: Route|RoutesResource): void
    {
        if (resource instanceof RoutesResource) {
            this.addResource(resource);
            return;
        }

        const instance: RoutesCollection = this.getInstance();

        if (instance.groupStack.length > 0) {
            resource.path = `/${instance.groupStack.join('/')}${resource.path}`;
        }

        instance.routes.push(resource);
    }

    public static addGroup(name: string, set: Function)
    {
        const instance = this.getInstance();
        instance.groupStack.push(name);

        set(instance);

        instance.groupStack.pop();
    }

    private static addResource(resource: RoutesResource): void
    {
        let map: object[] = [
            {
                method: 'GET',
                path: resource.path,
                action: 'actionList',
            },
            {
                method: 'POST',
                path: resource.path,
                action: 'actionCreate'
            },
            {
                method: 'GET',
                path: `${resource.path}/:id`,
                action: 'actionListItem',
            },
            {
                method: 'PUT',
                path: `${resource.path}/:id`,
                action: 'actionUpdate'
            },
            {
                method: 'PATCH',
                path: `${resource.path}/:id`,
                action: 'actionPatch'
            },
            {
                method:'DELETE',
                path: `${resource.path}/:id`,
                action: 'actionDelete'
            },
        ];

        map.forEach((route: object) => {
            let path = route['path'],
                action = route['action'],
                middleware = [];

            const existingRoute: object|undefined = resource.routes.find((configRoute) => {

                if (configRoute['method'] === 'GET') {
                    return route['method'] === configRoute['method'] && configRoute['path'] === route['path'];
                }

                return route['method'] === configRoute['method'];
            });

            if (existingRoute !== undefined) {
                path = existingRoute['path'] || path;
                action = existingRoute['action'] || action;
                middleware = existingRoute['middleware'] || [];
            }

            this.add(
                new Route(
                    route['method'],
                    path,
                    resource.controller,
                    action,
                    resource.middleware.concat(middleware)
                )
            );
        });
    }

    public static all(): Route[]
    {
        const instance = this.getInstance();

        return instance.routes;
    }
}