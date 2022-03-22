import RoutesCollection from '../Framework/Http/Router/RoutesCollection';
import Route from '../Framework/Http/Router/Route';
import AuthOnlyMiddleware from '../app/Http/Middleware/AuthOnlyMiddleware';

import AuthController from '../app/Http/Controllers/AuthController';
import AdminUserController from '../app/Http/Controllers/Admin/AdminUserController';
import UserPermissionsController from '../app/Http/Controllers/UserPermissionsController';
import TodoController from '../app/Http/Controllers/TodoController';
import TodoAccessGroupController from '../app/Http/Controllers/TodoAccessGroupController';

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
        'PUT',
        '/todo/update/:id',
        TodoController,
        'actionUpdate',
        [AuthOnlyMiddleware]
    ),
);

RoutesCollection.add(
    new Route(
        'DELETE',
        '/todo/delete/:id',
        TodoController,
        'actionDelete',
        [AuthOnlyMiddleware]
    ),
);

RoutesCollection.add(
    new Route(
        'PUT',
        '/todo/set-status/:id',
        TodoController,
        'actionSetStatus',
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

RoutesCollection.add(
    new Route(
        'GET',
        '/admin/users/list',
        AdminUserController,
        'actionList',
        [AuthOnlyMiddleware]
    ),
);

RoutesCollection.add(
    new Route(
        'PUT',
        '/admin/users/set-active-state/:id',
        AdminUserController,
        'actionSetActiveState',
        [AuthOnlyMiddleware]
    ),
);

RoutesCollection.add(
    new Route(
        'GET',
        '/admin/users/todoes/:id',
        AdminUserController,
        'actionTodoes',
        [AuthOnlyMiddleware]
    ),
);

RoutesCollection.add(
    new Route(
        'GET',
        '/admin/users/get-user-data/:id',
        AdminUserController,
        'actionGetUserData',
        [AuthOnlyMiddleware]
    ),
);

RoutesCollection.add(
    new Route(
        'PUT',
        '/admin/users/update/:id',
        AdminUserController,
        'actionUpdate',
        [AuthOnlyMiddleware]
    ),
);

RoutesCollection.add(
    new Route(
        'DELETE',
        '/admin/users/delete/:id',
        AdminUserController,
        'actionDelete',
        [AuthOnlyMiddleware]
    ),
);

RoutesCollection.add(
    new Route(
        'POST',
        '/admin/users/create',
        AdminUserController,
        'actionCreate',
        [AuthOnlyMiddleware]
    ),
);

RoutesCollection.add(
    new Route(
        'GET',
        '/todo-access-group/list',
        TodoAccessGroupController,
        'actionList',
        [AuthOnlyMiddleware]
    ),
);

RoutesCollection.add(
    new Route(
        'POST',
        '/todo-access-group/create',
        TodoAccessGroupController,
        'actionCreate',
        [AuthOnlyMiddleware]
    ),
);

RoutesCollection.add(
    new Route(
        'PUT',
        '/todo-access-group/update/:id',
        TodoAccessGroupController,
        'actionUpdate',
        [AuthOnlyMiddleware]
    ),
);

RoutesCollection.add(
    new Route(
        'DELETE',
        '/todo-access-group/delete/:id',
        TodoAccessGroupController,
        'actionDelete',
        [AuthOnlyMiddleware]
    ),
);

export default RoutesCollection;