import RoutesCollection from '../Framework/Http/Router/RoutesCollection';
import Route from '../Framework/Http/Router/Route';
import AuthOnlyMiddleware from '../app/Http/Middleware/AuthOnlyMiddleware';

import AuthController from '../app/Http/Controllers/AuthController';
import UserPermissionsController from '../app/Http/Controllers/UserPermissionsController';
import TodoController from '../app/Http/Controllers/TodoController';

RoutesCollection.add(
    new Route(
        'POST',
        '/auth/login',
        AuthController,
        'actionLogin'
    ),
);

RoutesCollection.add(
    new Route(
        'PUT',
        '/auth/signup',
        AuthController,
        'actionSignup'
    ),
);

RoutesCollection.add(
    new Route(
        'GET',
        '/todo/list',
        TodoController,
        'actionList',
        [AuthOnlyMiddleware]
    ),
);

RoutesCollection.add(
    new Route(
        'POST',
        '/todo/create',
        TodoController,
        'actionCreate',
        [AuthOnlyMiddleware]
    ),
);

RoutesCollection.add(
    new Route(
        'GET',
        '/user-permissions/list',
        UserPermissionsController,
        'actionList',
        [AuthOnlyMiddleware]
    ),
);

export default RoutesCollection;