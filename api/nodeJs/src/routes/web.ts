import RoutesCollection from '../Framework/Http/Router/RoutesCollection';
import RoutesResource from '../Framework/Http/Router/RoutesResource';
import Route from '../Framework/Http/Router/Route';
import AuthOnlyMiddleware from '../app/Http/Middleware/AuthOnlyMiddleware';
import HasAccessToTodoAccessGroupMiddleware from '../app/Http/Middleware/HasAccessToTodoAccessGroupMiddleware';

import AuthController from '../app/Http/Controllers/AuthController';
import AdminUserController from '../app/Http/Controllers/Admin/AdminUserController';
import UserPermissionsController from '../app/Http/Controllers/UserPermissionsController';
import TodoController from '../app/Http/Controllers/TodoController';
import TodoAccessGroupController from '../app/Http/Controllers/TodoAccessGroupController';
import TodoAccessGroupTodoController from '../app/Http/Controllers/TodoAccessGroupTodoController';
import TodoAccessUserGroupController from '../app/Http/Controllers/TodoAccessUserGroupController';
import UserController from '../app/Http/Controllers/UserController';

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
        '/users/match-by-email/:email',
        UserController,
        'actionMatchUsersByEmail',
        [
            AuthOnlyMiddleware
        ]
    ),
);

RoutesCollection.addResource(
    new RoutesResource(
        'todo',
        TodoController,
        [
            AuthOnlyMiddleware,
        ],
    )
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
        '/admin/users/todoes/:id',
        AdminUserController,
        'actionTodoes',
        [
            AuthOnlyMiddleware
        ]
    ),
);

RoutesCollection.add(
    new Route(
        'GET',
        '/admin/users/get-user-data/:id',
        AdminUserController,
        'actionGetUserData',
        [
            AuthOnlyMiddleware
        ]
    ),
);

RoutesCollection.add(
    new Route(
        'PUT',
        '/admin/users/set-active-state/:id',
        AdminUserController,
        'actionSetActiveState',
        [
            AuthOnlyMiddleware
        ]
    ),
);

RoutesCollection.addResource(
    new RoutesResource(
        'admin/users',
        AdminUserController,
        [
            AuthOnlyMiddleware,
        ],
    )
);

RoutesCollection.addResource(
    new RoutesResource(
        'todo-access-group',
        TodoAccessGroupController,
        [
            AuthOnlyMiddleware,
        ],
    )
);

RoutesCollection.addResource(
    new RoutesResource(
        'todo-access-group/todo',
        TodoAccessGroupTodoController,
        [
            AuthOnlyMiddleware,
            HasAccessToTodoAccessGroupMiddleware,
        ],
        {
            'GET': {
                'path': ':id/list'
            },
            'POST': {
                'path': ':id/create'
            },
            'PUT': {
                'path': ':id/update/:todoId',
            },
            'DELETE': {
                'path': ':id/delete/:todoId',
            },
        },
    )
);

RoutesCollection.add(
    new Route(
        'PUT',
        '/todo-access-group/todo/:id/set-status/:todoId',
        TodoAccessGroupTodoController,
        'actionSetStatus',
        [
            AuthOnlyMiddleware,
            HasAccessToTodoAccessGroupMiddleware,
        ]
    ),
);

RoutesCollection.addResource(
    new RoutesResource(
        'todo-access-user-group',
        TodoAccessUserGroupController,
        [
            AuthOnlyMiddleware,
            HasAccessToTodoAccessGroupMiddleware,
        ],
        {
            'GET': {
                'path': ':id/list'
            },
            'POST': {
                'path': ':id/create'
            },
            'DELETE': {
                'path': ':id/delete/:groupId'
            },
        },
        {
            'disableMethods': ['PUT'],
        },
    )
);

export default RoutesCollection;