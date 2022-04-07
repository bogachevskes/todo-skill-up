import RoutesCollection from '../Framework/Http/Router/RoutesCollection';
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

/* === auth group === */

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

/** === todo group === */

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

/** === user permissions group === */

RoutesCollection.add(
    new Route(
        'GET',
        '/user-permissions/list',
        UserPermissionsController,
        'actionList',
        [AuthOnlyMiddleware]
    ),
);

/** === admin users === **/

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

/** === todo access group group === */

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

RoutesCollection.add(
    new Route(
        'GET',
        '/todo-access-group/todo/:id/list',
        TodoAccessGroupTodoController,
        'actionList',
        [
            AuthOnlyMiddleware,
            HasAccessToTodoAccessGroupMiddleware,
        ]
    ),
);

RoutesCollection.add(
    new Route(
        'POST',
        '/todo-access-group/todo/:id/create',
        TodoAccessGroupTodoController,
        'actionCreate',
        [
            AuthOnlyMiddleware,
            HasAccessToTodoAccessGroupMiddleware,
        ]
    ),
);

RoutesCollection.add(
    new Route(
        'PUT',
        '/todo-access-group/todo/:id/update/:todoId',
        TodoAccessGroupTodoController,
        'actionUpdate',
        [
            AuthOnlyMiddleware,
            HasAccessToTodoAccessGroupMiddleware,
        ]
    ),
);

RoutesCollection.add(
    new Route(
        'DELETE',
        '/todo-access-group/todo/:id/delete/:todoId',
        TodoAccessGroupTodoController,
        'actionDelete',
        [
            AuthOnlyMiddleware,
            HasAccessToTodoAccessGroupMiddleware,
        ]
    ),
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

RoutesCollection.add(
    new Route(
        'GET',
        '/todo-access-user-group/list/:id',
        TodoAccessUserGroupController,
        'actionList',
        [AuthOnlyMiddleware]
    ),
);

/** === todo access user group group === */

RoutesCollection.add(
    new Route(
        'POST',
        '/todo-access-user-group/create/:id',
        TodoAccessUserGroupController,
        'actionCreate',
        [AuthOnlyMiddleware]
    ),
);

RoutesCollection.add(
    new Route(
        'DELETE',
        '/todo-access-user-group/delete/:id',
        TodoAccessUserGroupController,
        'actionDelete',
        [AuthOnlyMiddleware]
    ),
);

/** === users group === */

RoutesCollection.add(
    new Route(
        'GET',
        '/users/match-by-email/:email',
        UserController,
        'actionMatchUsersByEmail',
        [AuthOnlyMiddleware]
    ),
);

export default RoutesCollection;