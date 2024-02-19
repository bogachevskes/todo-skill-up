import RoutesCollection from '../Framework/Http/Router/RoutesCollection';
import RoutesResource from '../Framework/Http/Router/RoutesResource';
import Route from '../Framework/Http/Router/Route';
import AuthOnlyMiddleware from '../app/Http/Middleware/AuthOnlyMiddleware';
import CurrentUserHasAccessToBoardMiddleware from '../app/Http/Middleware/CurrentUserHasAccessToBoardMiddleware';
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
import UserHasPermission from "../app/Http/Middleware/UserHasPermission";
import TaskExistInBoardMiddleware from "../app/Http/Middleware/TaskExistInBoardMiddleware";
import BoardHasStatusMiddleware from "../app/Http/Middleware/BoardHasStatusMiddleware";
import BoardsUsersPermissionsController from "../app/Http/Controllers/BoardsUsersPermissionsController";
import BoardsPermissionsController from "../app/Http/Controllers/BoardsPermissionsController";
import CurrentUserHasBoardPermission from "../app/Http/Middleware/CurrentUserHasBoardPermission";
import UserHasAccessToBoardMiddleware from "../app/Http/Middleware/UserHasAccessToBoardMiddleware";
import { NextFunction, Request, Response } from "express";
import User from "../app/Entity/User";
import DIContainer from "../Framework/Container/DIContainer";

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
            UserController,
            'actionMatch',
            [
                DIContainer.getDefinition(AuthOnlyMiddleware),
            ]
        ),
    );

    RoutesCollection.add(
        new RoutesResource(
            '/user/:user_id/permissions',
            UserPermissionsController,
            [
                DIContainer.getDefinition(AuthOnlyMiddleware),
                CurrentUserOnlyMiddleware,
            ],
        ),
    );

    RoutesCollection.add(
        new RoutesResource(
            '/admin/users',
            AdminUserController,
            [
                DIContainer.getDefinition(AuthOnlyMiddleware),
                new UserHasPermission('/admin/users'),
            ],
        )
    );

    RoutesCollection.add(
        new RoutesResource(
            '/user/:user_id/boards',
            UserBoardsController,
            [
                DIContainer.getDefinition(AuthOnlyMiddleware),
                CurrentUserOnlyMiddleware,
            ],
            [
                {
                    method: 'GET',
                    path: `/user/:user_id/boards/:id`,
                    middleware: [
                        new CurrentUserHasAccessToBoardMiddleware('id'),
                    ],
                },
                {
                    method: 'PUT',
                    middleware: [
                        new CurrentUserHasAccessToBoardMiddleware('id'),
                        new CurrentUserHasBoardPermission('manage-board', 'id'),
                    ],
                },
                {
                    method: 'PATCH',
                    middleware: [
                        new CurrentUserHasAccessToBoardMiddleware('id'),
                        new CurrentUserHasBoardPermission('manage-board', 'id'),
                    ],
                },
                {
                    method: 'DELETE',
                    middleware: [
                        new CurrentUserHasAccessToBoardMiddleware('id'),
                        new CurrentUserHasBoardPermission('delete-board', 'id'),
                    ],
                },
            ],
        )
    );

    RoutesCollection.add(
        new RoutesResource(
            '/boards/:board_id/statuses',
            BoardsTasksStatusesController,
            [
                DIContainer.getDefinition(AuthOnlyMiddleware),
                CurrentUserHasAccessToBoardMiddleware,
            ],
            [
                {
                    method: 'POST',
                    middleware: [
                        new CurrentUserHasBoardPermission('manage-board-statuses'),
                    ],
                },
                {
                    method: 'PUT',
                    middleware: [
                        BoardHasStatusMiddleware,
                        new CurrentUserHasBoardPermission('manage-board-statuses'),
                    ],
                },
                {
                    method: 'DELETE',
                    middleware: [
                        BoardHasStatusMiddleware,
                        new CurrentUserHasBoardPermission('delete-board-statuses'),
                    ],
                },
            ],
        )
    );

    RoutesCollection.add(
        new RoutesResource(
            '/boards/:board_id/tasks',
            BoardsTasksController,
            [
                DIContainer.getDefinition(AuthOnlyMiddleware),
                CurrentUserHasAccessToBoardMiddleware,
            ],
            [
                {
                    method: 'POST',
                    middleware: [
                        TaskStatusExistInBoardMiddleware,
                    ],
                },
                {
                    method: 'PUT',
                    middleware: [
                        TaskStatusExistInBoardMiddleware,
                        TaskExistInBoardMiddleware,
                    ],
                },
                {
                    method: 'PATCH',
                    middleware: [
                        TaskStatusExistInBoardMiddleware,
                        TaskExistInBoardMiddleware,
                    ],
                },
                {
                    method: 'DELETE',
                    middleware: [
                        TaskExistInBoardMiddleware,
                    ],
                },
            ],
        )
    );

    RoutesCollection.add(
        new RoutesResource(
            '/boards/:board_id/users',
            BoardsUsersController,
            [
                DIContainer.getDefinition(AuthOnlyMiddleware),
                CurrentUserHasAccessToBoardMiddleware,
            ],
            [
                {
                    method: 'POST',
                    middleware: [
                        new CurrentUserHasBoardPermission('manage-board-users'),
                    ],
                },
                {
                    method: 'DELETE',
                    middleware: [
                        new CurrentUserHasBoardPermission('manage-board-users'),
                    ],
                },
            ],
        )
    );

    RoutesCollection.add(
        new RoutesResource(
            '/boards/:board_id/permissions',
            BoardsPermissionsController,
            [
                DIContainer.getDefinition(AuthOnlyMiddleware),
                CurrentUserHasAccessToBoardMiddleware,
                new CurrentUserHasBoardPermission('manage-board-users'),
            ],
        )
    );

    /**
     * TODO:
     * Выполнить доработки
     * https://github.com/bogachevskes/todo-skill-up/issues/48
     */
    RoutesCollection.add(
        new RoutesResource(
            '/boards/:board_id/users/:user_id/permissions',
            BoardsUsersPermissionsController,
            [
                DIContainer.getDefinition(AuthOnlyMiddleware),
                CurrentUserHasAccessToBoardMiddleware,
                UserHasAccessToBoardMiddleware,
            ],
            [
                {
                    method: 'GET',
                    path: `/boards/:board_id/users/:user_id/permissions`,
                    middleware: [
                        class {
                            public async execute(req: Request, res: Response, next: NextFunction): Promise<void>
                            {
                                const user: User = req['user'];

                                if (Number(user.id) === Number(req.params.user_id)) {
                                    next();
                                }

                                await new CurrentUserHasBoardPermission('manage-board-users')
                                    .execute(req, res, next);
                            }
                        },
                    ],
                },
                {
                    method: 'PUT',
                    middleware: [
                        new CurrentUserHasBoardPermission('manage-board-users'),
                    ],
                },
                {
                    method: 'DELETE',
                    middleware: [
                        new CurrentUserHasBoardPermission('manage-board-users'),
                    ],
                },
            ],
        )
    );
});

export default RoutesCollection;