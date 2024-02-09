<?php

namespace tests\integration\api;

use Tests\Support\ApiTester;

class BoardTaskCest
{
    private function createUser(ApiTester $I, int $nameId): array
    {
        $user = [
            'name' => "boardStatusesCestGuest$nameId",
            'email' => "board.statuses.cest.guest$nameId@todo-list.com",
            'password' => base64_encode('secret'),
        ];

        $I->haveInDatabase('users', $user);

        $userId = $I->grabFromDatabase('users', 'id', ['email' => $user['email']]);

        return [
            $userId,
            $user['email'],
        ];
    }

    private function createBoardTask(ApiTester $I, int $nameId, int $userId): array
    {
        $board = [
            'name' => "board task cest name $nameId",
            'description' => "board task cest description $nameId",
        ];

        $I->haveInDatabase('boards', $board);

        $boardId = $I->grabFromDatabase('boards', 'id', ['name' => $board['name']]);

        $I->haveInDatabase('boards_users', [
            'board_id' => $boardId,
            'user_id' => $userId,
            'role_id' => 1,
        ]);

        $status = [
            'board_id' => $boardId,
            'name' => "board task cest name $nameId",
        ];

        $I->haveInDatabase('task_statuses', $status);

        $statusId = $I->grabFromDatabase('task_statuses', 'id', ['name' => $status['name']]);

        $task = [
            'board_id' => $boardId,
            'status_id' => $statusId,
            'name' => "task name $nameId",
            'description' => "task description $nameId",
            'planned_completion_at' => '2023-12-12 00:00:00.000',
        ];

        $I->haveInDatabase('tasks', $task);

        $taskId = $I->grabFromDatabase('tasks', 'id', ['name' => $task['name']]);

        return [
            $boardId,
            $statusId,
            $taskId,
        ];
    }

    public function testCreateBoardTask(ApiTester $I): void
    {
        $I->wantTo('Создать задачу доски');

        [$userId, $email] = $this->createUser($I, 1);
        [$boardId, $statusId] = $this->createBoardTask($I, 1, $userId);

        $I->haveHttpHeader('X-BASE-AUTH', $email);
        $I->haveHttpHeader('Content-Type', 'application/json');

        $newTask = [
            'statusId' => $statusId,
            'name' => 'Реализовать авторизацию',
            'description' => 'Реализовать сервис авторизации в соответствии с корп. требованиями',
            'plannedCompletionAt' => '2023-12-12T00:00:00.000Z',
        ];

        $I->sendPost("/v1/boards/$boardId/tasks", [
            'formData' => $newTask,
        ]);

        $newTask['status_id'] = $newTask['statusId'];
        $newTask['planned_completion_at'] = $newTask['plannedCompletionAt'];

        unset($newTask['statusId']);
        unset($newTask['plannedCompletionAt']);

        $I->seeResponseCodeIs(201);
        $I->seeInDatabase('tasks', $newTask);
    }

    public function testBoardTasksSchema(ApiTester $I): void
    {
        $I->wantTo('Проверить контракт ответа задач доски');

        [$userId, $email] = $this->createUser($I, 2);
        [$boardId] = $this->createBoardTask($I, 2, $userId);

        $I->haveHttpHeader('X-BASE-AUTH', $email);
        $I->haveHttpHeader('Content-Type', 'application/json');

        $I->sendGet("/v1/boards/$boardId/tasks");

        $I->seeResponseCodeIs(200);
        $I->seeResponseMatchesJsonType([
                'status' => [
                    'id' => 'integer',
                    'boardId' => 'integer',
                    'name' => 'string',
                    'createdAt' => 'string'
                ],
                'tasks' => [
                    [
                        'id' => 'integer',
                        'statusId' => 'integer',
                        'boardId' => 'integer',
                        'name' => 'string',
                        'description' => 'string',
                        'plannedCompletionAt' => 'string',
                        'createdAt' => 'string'
                    ],
                ]
        ]);
    }

    public function testUpdateBoardTask(ApiTester $I): void
    {
        [$userId, $email] = $this->createUser($I, 3);
        [$boardId, $statusId, $taskId] = $this->createBoardTask($I, 3, $userId);

        $additionalStatus = [
            'board_id' => $boardId,
            'name' => 'task cest name extra 1',
        ];

        $I->haveInDatabase('task_statuses', $additionalStatus);

        $additionalStatusId = $I->grabFromDatabase('task_statuses', 'id', ['name' => $additionalStatus['name']]);

        $I->haveHttpHeader('X-BASE-AUTH', $email);
        $I->haveHttpHeader('Content-Type', 'application/json');

        $updatedTask = [
            'statusId' => $additionalStatusId,
            'name' => 'Измененное имя',
            'description' => 'Измененное описание',
            'plannedCompletionAt' => '2023-12-14T00:00:00.000Z',
        ];

        $I->sendPut("/v1/boards/$boardId/tasks/$taskId", [
            'formData' => $updatedTask,
        ]);

        $updatedTask['status_id'] = $updatedTask['statusId'];
        $updatedTask['planned_completion_at'] = '2023-12-14 00:00:00.000';

        unset($updatedTask['statusId']);
        unset($updatedTask['plannedCompletionAt']);

        $I->seeResponseCodeIs(200);
        $I->seeInDatabase('tasks', $updatedTask);
    }

    public function testPatchBoardTask(ApiTester $I): void
    {
        $I->wantTo('Изменить доску частично');

        [$userId, $email] = $this->createUser($I, 4);
        [$boardId, $statusId, $taskId] = $this->createBoardTask($I, 4, $userId);

        $additionalStatus = [
            'board_id' => $boardId,
            'name' => 'task cest name extra 1',
        ];

        $I->haveInDatabase('task_statuses', $additionalStatus);

        $additionalStatusId = $I->grabFromDatabase('task_statuses', 'id', ['name' => $additionalStatus['name']]);

        $I->haveHttpHeader('X-BASE-AUTH', $email);
        $I->haveHttpHeader('Content-Type', 'application/json');

        $I->sendPatch("/v1/boards/$boardId/tasks/$taskId", ['formData' => ['statusId' => $additionalStatusId]]);

        $I->seeResponseCodeIs(200);
        $I->seeInDatabase('tasks', [
            'id' => $taskId,
            'status_id' => $additionalStatusId,
        ]);
    }

    public function testDeleteBoardTask(ApiTester $I): void
    {
        $I->wantTo('Удалить задачу из доски');

        [$userId, $email] = $this->createUser($I, 5);
        [$boardId, $statusId, $taskId] = $this->createBoardTask($I, 5, $userId);

        $I->haveHttpHeader('X-BASE-AUTH', $email);
        $I->haveHttpHeader('Content-Type', 'application/json');

        $I->sendDelete("/v1/boards/$boardId/tasks/$taskId");

        $I->seeResponseCodeIs(204);
        $I->dontSeeInDatabase('tasks', ['id' => $taskId]);
    }
}