import RoutesCollection from '../Framework/Http/Router/RoutesCollection';
import RoutesResource from '../Framework/Http/Router/RoutesResource';
import Route from '../Framework/Http/Router/Route';
import AuthOnlyMiddleware from '../app/Http/Middleware/AuthOnlyMiddleware';
import UserHasAccessToBoardMiddleware from '../app/Http/Middleware/UserHasAccessToBoardMiddleware';
import AuthController from '../app/Http/Controllers/AuthController';
import AdminUserController from '../app/Http/Controllers/Admin/AdminUserController';
import UserController from '../app/Http/Controllers/UserController';
import UserPermissionsController from '../app/Http/Controllers/UserPermissionsController';
import BoardsTasksController from '../app/Http/Controllers/BoardsTasksController';
import BoardsUsersController from '../app/Http/Controllers/BoardsUsersController';
import UserBoardsController from "../app/Http/Controllers/UserBoardsController";
import IsCurrentUserMiddleware from "../app/Http/Middleware/IsCurrentUserMiddleware";
import BoardsTasksStatusesController from "../app/Http/Controllers/BoardsTasksStatusesController";
import TaskStatus from "../app/Entity/TaskStatus";
import TaskStatusExistInGroupMiddleware from "../app/Http/Middleware/TaskStatusExistInGroupMiddleware";

RoutesCollection.addGroup('v1', function () {
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
            '/users/match',
            UserController,
            'actionMatch',
            [
                AuthOnlyMiddleware
            ]
        ),
    );

    RoutesCollection.add(
        new RoutesResource(
            '/user/:id/permissions',
            UserPermissionsController,
            [
                AuthOnlyMiddleware,
                IsCurrentUserMiddleware,
            ],
        ),
    );

    RoutesCollection.add(
        new RoutesResource(
            '/admin/users',
            AdminUserController,
            [
                AuthOnlyMiddleware,
            ],
        )
    );

    RoutesCollection.add(
        new RoutesResource(
            '/user/boards',
            UserBoardsController,
            [
                AuthOnlyMiddleware,
            ],
            [
                {
                    method: 'PUT',
                    middleware: [UserHasAccessToBoardMiddleware],
                },
                {
                    method: 'DELETE',
                    middleware: [UserHasAccessToBoardMiddleware],
                },
            ],
        )
    );

    RoutesCollection.add(
        new RoutesResource(
            '/boards/:board_id/statuses',
            BoardsTasksStatusesController,
            [
                AuthOnlyMiddleware,
                UserHasAccessToBoardMiddleware,
            ],
        )
    );

    RoutesCollection.add(
        new RoutesResource(
            '/boards/:board_id/tasks',
            BoardsTasksController,
            [
                AuthOnlyMiddleware,
                UserHasAccessToBoardMiddleware,
            ],
            [
                {
                    method: 'POST',
                    middleware: [TaskStatusExistInGroupMiddleware],
                },
                {
                    method: 'PUT',
                    middleware: [TaskStatusExistInGroupMiddleware],
                },
                {
                    method: 'PATCH',
                    middleware: [TaskStatusExistInGroupMiddleware],
                },
            ],
        )
    );

    RoutesCollection.add(
        new RoutesResource(
            '/boards/:board_id/users',
            BoardsUsersController,
            [
                AuthOnlyMiddleware,
                UserHasAccessToBoardMiddleware,
            ],
        )
    );
});

export default RoutesCollection;