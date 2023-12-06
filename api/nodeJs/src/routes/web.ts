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
import CurrentUserOnlyMiddleware from "../app/Http/Middleware/CurrentUserOnlyMiddleware";
import BoardsTasksStatusesController from "../app/Http/Controllers/BoardsTasksStatusesController";
import TaskStatusExistInBoardMiddleware from "../app/Http/Middleware/TaskStatusExistInBoardMiddleware";

RoutesCollection.addGroup('v1', function () {
    RoutesCollection.add(
        new Route(
            'POST',
            '/auth/signin',
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
            // TODO: доделать поиск всех юзеров по пробелам
            UserController,
            'actionMatch',
            [
                AuthOnlyMiddleware
            ]
        ),
    );

    RoutesCollection.add(
        new RoutesResource(
            '/user/:user_id/permissions',
            UserPermissionsController,
            [
                AuthOnlyMiddleware,
                CurrentUserOnlyMiddleware,
            ],
        ),
    );

    RoutesCollection.add(
        new RoutesResource(
            '/admin/users',
            AdminUserController,
            [
                // TODO: добавить мидлвеер проверки разрешения
                AuthOnlyMiddleware,
            ],
        )
    );

    RoutesCollection.add(
        new RoutesResource(
            '/user/:user_id/boards',
            UserBoardsController,
            [
                AuthOnlyMiddleware,
                CurrentUserOnlyMiddleware,
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
                    middleware: [TaskStatusExistInBoardMiddleware],
                },
                {
                    method: 'PUT',
                    middleware: [TaskStatusExistInBoardMiddleware],
                },
                {
                    method: 'PATCH',
                    middleware: [TaskStatusExistInBoardMiddleware],
                },
                // TODO: DELETE
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