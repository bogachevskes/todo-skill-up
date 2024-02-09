<?php

namespace tests\integration\api;

use Tests\Support\ApiTester;

class BoardStatusesCest
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

    private function createBoardStatus(ApiTester $I, int $nameId, int $userId): array
    {
        $board = [
            'name' => "board status cest name $nameId",
            'description' => "board status cest description $nameId",
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
            'name' => "board status cest name $nameId",
        ];

        $I->haveInDatabase('task_statuses', $status);

        $statusId = $I->grabFromDatabase('task_statuses', 'id', ['name' => $status['name']]);

        return [
            $boardId,
            $statusId,
        ];
    }

    public function testCreateBoardStatus(ApiTester $I): void
    {
        $I->wantTo('Создать статус доски задач');

        [$userId, $email] = $this->createUser($I, 1);
        [$boardId] = $this->createBoardStatus($I, 1, $userId);

        $I->haveHttpHeader('X-BASE-AUTH', $email);
        $I->haveHttpHeader('Content-Type', 'application/json');

        $status = [
            'name' => 'Название 1',
        ];

        $I->sendPost("/v1/boards/$boardId/statuses", [
            'formData' => $status,
        ]);

        $I->seeResponseCodeIs(201);
        $I->seeInDatabase('task_statuses', $status);
    }

    public function testBoardStatusesSchema(ApiTester $I): void
    {
        $I->wantTo('Проверить контракт ответа статусов доски');

        [$userId, $email] = $this->createUser($I, 2);

        [$boardId] = $this->createBoardStatus($I, 2, $userId);

        $I->haveHttpHeader('X-BASE-AUTH', $email);
        $I->haveHttpHeader('Content-Type', 'application/json');

        $I->sendGet("/v1/boards/$boardId/statuses");

        $I->seeResponseCodeIs(200);
        $I->seeResponseMatchesJsonType([
            'id' => 'integer',
            'boardId' => 'integer',
            'name' => 'string',
            'createdAt' => 'string',
        ]);
    }

    public function testUpdateBoardStatus(ApiTester $I): void
    {
        $I->wantTo('Изменить статус задач доски');

        [$userId, $email] = $this->createUser($I, 3);

        [$boardId, $statusId] = $this->createBoardStatus($I, 3, $userId);

        $I->haveHttpHeader('X-BASE-AUTH', $email);
        $I->haveHttpHeader('Content-Type', 'application/json');

        $updatedStatus = [
            'name' => 'Измененное название 3',
        ];

        $I->sendPut("/v1/boards/$boardId/statuses/$statusId", [
            'formData' => $updatedStatus,
        ]);

        $I->seeResponseCodeIs(200);
        $I->seeInDatabase('task_statuses', $updatedStatus);
    }

    public function testDeleteBoardStatus(ApiTester $I): void
    {
        $I->wantTo('Удалить статус задач доски');

        [$userId, $email] = $this->createUser($I, 4);

        [$boardId, $statusId] = $this->createBoardStatus($I, 4, $userId);

        $I->haveHttpHeader('X-BASE-AUTH', $email);
        $I->haveHttpHeader('Content-Type', 'application/json');

        $I->sendDelete("/v1/boards/$boardId/statuses/$statusId");

        $I->seeResponseCodeIs(204);
        $I->dontSeeInDatabase('task_statuses', ['id' => $statusId]);
    }
}