import RoutesCollection from '../Framework/Http/Router/RoutesCollection';
import RoutesResource from '../Framework/Http/Router/RoutesResource';
import Route from '../Framework/Http/Router/Route';
import AuthOnlyMiddleware from '../app/Http/Middleware/AuthOnlyMiddleware';
import HasAccessToTodoGroupMiddleware from '../app/Http/Middleware/HasAccessToTodoGroupMiddleware';

import AuthController from '../app/Http/Controllers/AuthController';
import AdminUserController from '../app/Http/Controllers/Admin/AdminUserController';
import UserPermissionsController from '../app/Http/Controllers/UserPermissionsController';
import TodoController from '../app/Http/Controllers/TodoController';
import TodoGroupController from '../app/Http/Controllers/TodoGroupController';
import TodoGroupTodoController from '../app/Http/Controllers/TodoGroupTodoController';
import TodoUsersGroupsController from '../app/Http/Controllers/TodoUsersGroupsController';
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
        '/admin/users/todo/:id',
        AdminUserController,
        'actionTodo',
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
        'todo-group',
        TodoGroupController,
        [
            AuthOnlyMiddleware,
        ],
        {
            'PUT': {
                'middleware': [HasAccessToTodoGroupMiddleware],
            },
            'DELETE': {
                'middleware': [HasAccessToTodoGroupMiddleware],
            },
        },
    )
);

RoutesCollection.add(
    new Route(
        'GET',
        '/todo-group/get-group/:id',
        TodoGroupController,
        'actionGetGroup',
        [
            AuthOnlyMiddleware,
            HasAccessToTodoGroupMiddleware,
        ]
    ),
);

RoutesCollection.addResource(
    new RoutesResource(
        'todo-group/todo',
        TodoGroupTodoController,
        [
            AuthOnlyMiddleware,
            HasAccessToTodoGroupMiddleware,
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
        '/todo-group/todo/:id/set-status/:todoId',
        TodoGroupTodoController,
        'actionSetStatus',
        [
            AuthOnlyMiddleware,
            HasAccessToTodoGroupMiddleware,
        ]
    ),
);

RoutesCollection.addResource(
    new RoutesResource(
        'todo-user-group',
        TodoUsersGroupsController,
        [
            AuthOnlyMiddleware,
            HasAccessToTodoGroupMiddleware,
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