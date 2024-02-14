<?php

namespace tests\integration\api;

use Tests\Support\{
    ApiTester,
    UserTrait,
    HashTrait,
    UserBoardTrait,
    BoardStatusTrait,
    BoardTaskTrait,
};

class BoardTaskCest
{
    use UserTrait, HashTrait, UserBoardTrait, BoardStatusTrait, BoardTaskTrait;

    public function testCreateBoardTask(ApiTester $I): void
    {
        $I->wantTo('Создать задачу доски');

        [$boardOwnerUserId, $boardOwnerUserEmail] = $this->createUser($I);

        $boardId = $this->createBoard($I, $boardOwnerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $boardOwnerUserId);

        $statusId = $this->createBoardStatus($I, $boardId);

        $I->haveHttpHeader('Content-Type', 'application/json');
        $I->haveHttpHeader('X-BASE-AUTH', $boardOwnerUserEmail);

        $newTask = [
            'statusId' => $statusId,
            'name' => $this->generateHash(25),
            'description' => $this->generateHash(35),
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

        [$boardOwnerUserId, $boardOwnerUserEmail] = $this->createUser($I);

        $boardId = $this->createBoard($I, $boardOwnerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $boardOwnerUserId);

        $statusId = $this->createBoardStatus($I, $boardId);

        $this->createBoardTask($I, $boardId, $statusId);

        $I->haveHttpHeader('X-BASE-AUTH', $boardOwnerUserEmail);

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
        $I->wantTo('Изменить доску');

        [$boardOwnerUserId, $boardOwnerUserEmail] = $this->createUser($I);

        $boardId = $this->createBoard($I, $boardOwnerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $boardOwnerUserId);

        $statusId = $this->createBoardStatus($I, $boardId);

        $taskId = $this->createBoardTask($I, $boardId, $statusId);

        $additionalStatusId = $this->createBoardStatus($I, $boardId);

        $I->haveHttpHeader('Content-Type', 'application/json');
        $I->haveHttpHeader('X-BASE-AUTH', $boardOwnerUserEmail);

        $updatedTask = [
            'statusId' => $additionalStatusId,
            'name' => $this->generateHash(15),
            'description' => $this->generateHash(25),
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

        [$boardOwnerUserId, $boardOwnerUserEmail] = $this->createUser($I);

        $boardId = $this->createBoard($I, $boardOwnerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $boardOwnerUserId);

        $statusId = $this->createBoardStatus($I, $boardId);

        $taskId = $this->createBoardTask($I, $boardId, $statusId);

        $additionalStatusId = $this->createBoardStatus($I, $boardId);

        $I->haveHttpHeader('Content-Type', 'application/json');
        $I->haveHttpHeader('X-BASE-AUTH', $boardOwnerUserEmail);

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

        [$boardOwnerUserId, $boardOwnerUserEmail] = $this->createUser($I);

        $boardId = $this->createBoard($I, $boardOwnerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $boardOwnerUserId);

        $statusId = $this->createBoardStatus($I, $boardId);

        $taskId = $this->createBoardTask($I, $boardId, $statusId);

        $I->haveHttpHeader('X-BASE-AUTH', $boardOwnerUserEmail);

        $I->sendDelete("/v1/boards/$boardId/tasks/$taskId");

        $I->seeResponseCodeIs(204);
        $I->dontSeeInDatabase('tasks', ['id' => $taskId]);
    }
}