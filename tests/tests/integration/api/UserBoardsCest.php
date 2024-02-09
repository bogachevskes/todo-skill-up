<?php

namespace tests\integration\api;

use Tests\Support\ApiTester;

class UserBoardsCest
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

    private function createBoard(ApiTester $I, int $nameId, int $userId): int
    {
        $board = [
            'name' => "user board cest name $nameId",
            'description' => "user board cest description $nameId",
        ];

        $I->haveInDatabase('boards', $board);

        $boardId = $I->grabFromDatabase('boards', 'id', ['name' => $board['name']]);

        $boardUser = [
            'board_id' => $boardId,
            'user_id' => $userId,
            'role_id' => 1,
        ];

        $I->haveInDatabase('boards_users', $boardUser);

        return $boardId;
    }

    public function testUserBoardsSchema(ApiTester $I): void
    {
        $I->wantTo('Проверить контракт ответа досок пользователя');

        [$userId, $email] = $this->createUser($I, 1);

        $this->createBoard($I, 1, $userId);

        $I->haveHttpHeader('X-BASE-AUTH', $email);

        $I->sendGet("/v1/user/$userId/boards");

        $I->seeResponseCodeIs(200);
        $I->seeResponseMatchesJsonType([
            'id' => 'integer',
            'name' => 'string',
            'description' => 'string',
            'createdAt' => 'string',
            'updatedAt' => 'string',
            'owner' => [
                'id' => 'integer',
                'name' => 'string',
                'email' => 'string'
            ]
        ]);
    }

    public function testUserBoardSchema(ApiTester $I): void
    {
        $I->wantTo('Проверить контракт ответа доски пользователя');

        [$userId, $email] = $this->createUser($I, 2);

        $boardId = $this->createBoard($I, 2, $userId);

        $I->haveHttpHeader('X-BASE-AUTH', $email);
        $I->haveHttpHeader('Content-Type', 'application/json');

        $I->sendGet("/v1/user/$userId/boards/$boardId");

        $I->seeResponseCodeIs(200);
        $I->seeResponseMatchesJsonType([
            'id' => 'integer',
            'name' => 'string',
            'description' => 'string',
            'createdAt' => 'string',
            'updatedAt' => 'string',
            'owner' => [
                'id' => 'integer',
                'name' => 'string',
                'email' => 'string'
            ]
        ]);
    }

    public function testCreateBoard(ApiTester $I): void
    {
        $I->wantTo('Создать доску задач');

        [$userId, $email] = $this->createUser($I, 3);

        $I->haveHttpHeader('X-BASE-AUTH', $email);
        $I->haveHttpHeader('Content-Type', 'application/json');

        $data = [
            'name' => 'Проект ISD:124467',
            'description' => 'Задачи проекта ISD:124467 запроса ISBN:456568',
        ];

        $I->sendPost("/v1/user/$userId/boards", [
            'formData' => $data,
        ]);

        $I->seeResponseCodeIs(201);
        $I->seeInDatabase('boards', $data);
        $I->seeInDatabase('boards_users', [
            'board_id' => $I->grabFromDatabase('boards', 'id', ['name' => $data['name']]),
            'user_id' => $userId,
            'role_id' => 1,
        ]);
    }

    public function testUpdateBoard(ApiTester $I): void
    {
        $I->wantTo('Изменить доску задач');

        [$userId, $email] = $this->createUser($I, 4);

        $boardId = $this->createBoard($I, 4, $userId);

        $I->haveHttpHeader('X-BASE-AUTH', $email);
        $I->haveHttpHeader('Content-Type', 'application/json');

        $updatedBoard = [
            'name' => '(изменено) Проект ISD:124470',
            'description' => '(изменено) Задачи проекта ISD:124470 запроса ISBN:456570',
        ];

        $I->sendPut("/v1/user/$userId/boards/$boardId", [
            'formData' => $updatedBoard,
        ]);

        $I->seeResponseCodeIs(200);
        $I->seeInDatabase('boards', $updatedBoard);
    }

    public function testPatchBoard(ApiTester $I): void
    {
        $I->wantTo('Частично изменить доску задач');

        [$userId, $email] = $this->createUser($I, 5);

        $boardId = $this->createBoard($I, 5, $userId);

        $I->haveHttpHeader('X-BASE-AUTH', $email);
        $I->haveHttpHeader('Content-Type', 'application/json');

        $updatedBoard = [
            'description' => '(изменено) Задачи проекта ISD:124470 запроса ISBN:45657',
        ];

        $I->sendPatch("/v1/user/$userId/boards/$boardId", [
            'formData' => $updatedBoard,
        ]);

        $I->seeResponseCodeIs(200);
        $I->seeInDatabase('boards', $updatedBoard);
    }

    public function testDeleteBoard(ApiTester $I): void
    {
        $I->wantTo('Удалить доску задач');

        [$userId, $email] = $this->createUser($I, 6);

        $boardId = $this->createBoard($I, 6, $userId);

        $I->haveHttpHeader('X-BASE-AUTH', $email);
        $I->haveHttpHeader('Content-Type', 'application/json');

        $I->sendDelete("/v1/user/$userId/boards/$boardId");

        $I->seeResponseCodeIs(204);
        $I->dontSeeInDatabase('boards', ['id' => $boardId]);
    }
}