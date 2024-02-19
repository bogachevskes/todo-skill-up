<?php

namespace tests\integration\api;

use Tests\Support\{
    ApiTester,
    UserTrait,
    HashTrait,
    UserBoardTrait,
};

class UserBoardsCest
{
    use UserTrait, HashTrait, UserBoardTrait;

    public function testUserBoardsSchema(ApiTester $I): void
    {
        $I->wantTo('Проверить контракт ответа досок пользователя');

        [$boardOwnerUserId, $boardOwnerUserEmail] = $this->createUser($I);

        $boardId = $this->createBoard($I, $boardOwnerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $boardOwnerUserId);

        $I->haveHttpHeader('X-BASE-AUTH', $boardOwnerUserEmail);

        $I->sendGet("/v1/user/$boardOwnerUserId/boards");

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

        [$boardOwnerUserId, $boardOwnerUserEmail] = $this->createUser($I);

        $boardId = $this->createBoard($I, $boardOwnerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $boardOwnerUserId);

        $I->haveHttpHeader('X-BASE-AUTH', $boardOwnerUserEmail);

        $I->sendGet("/v1/user/$boardOwnerUserId/boards/$boardId");

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

        [$boardOwnerUserId, $boardOwnerUserEmail] = $this->createUser($I);

        $I->haveHttpHeader('Content-Type', 'application/json');
        $I->haveHttpHeader('X-BASE-AUTH', $boardOwnerUserEmail);

        $board = [
            'name' => $this->generateHash(15),
            'description' => $this->generateHash(25),
        ];

        $I->sendPost("/v1/user/$boardOwnerUserId/boards", [
            'formData' => $board,
        ]);

        $I->seeResponseCodeIs(201);
        $I->seeInDatabase('boards', $board);
        $I->seeInDatabase('boards_users', [
            'board_id' => $I->grabFromDatabase('boards', 'id', ['name' => $board['name']]),
            'user_id' => $boardOwnerUserId,
            'role_id' => 1,
        ]);
    }

    public function testUpdateBoard(ApiTester $I): void
    {
        $I->wantTo('Изменить доску задач');

        [$boardOwnerUserId, $boardOwnerUserEmail] = $this->createUser($I);

        $boardId = $this->createBoard($I, $boardOwnerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $boardOwnerUserId);

        $I->haveHttpHeader('Content-Type', 'application/json');
        $I->haveHttpHeader('X-BASE-AUTH', $boardOwnerUserEmail);

        $updatedBoard = [
            'name' => $this->generateHash(15),
            'description' => $this->generateHash(25),
        ];

        $I->sendPut("/v1/user/$boardOwnerUserId/boards/$boardId", [
            'formData' => $updatedBoard,
        ]);

        $I->seeResponseCodeIs(200);
        $I->seeInDatabase('boards', $updatedBoard);
    }

    public function testPatchBoard(ApiTester $I): void
    {
        $I->wantTo('Частично изменить доску задач');

        [$boardOwnerUserId, $boardOwnerUserEmail] = $this->createUser($I);

        $boardId = $this->createBoard($I, $boardOwnerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $boardOwnerUserId);

        $I->haveHttpHeader('Content-Type', 'application/json');
        $I->haveHttpHeader('X-BASE-AUTH', $boardOwnerUserEmail);

        $updatedBoard = [
            'description' => $this->generateHash(25),
        ];

        $I->sendPatch("/v1/user/$boardOwnerUserId/boards/$boardId", [
            'formData' => $updatedBoard,
        ]);

        $I->seeResponseCodeIs(200);
        $I->seeInDatabase('boards', $updatedBoard);
    }

    public function testDeleteBoard(ApiTester $I): void
    {
        $I->wantTo('Удалить доску задач');

        [$boardOwnerUserId, $boardOwnerUserEmail] = $this->createUser($I);

        $boardId = $this->createBoard($I, $boardOwnerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $boardOwnerUserId);

        $I->haveHttpHeader('X-BASE-AUTH', $boardOwnerUserEmail);

        $I->sendDelete("/v1/user/$boardOwnerUserId/boards/$boardId");

        $I->seeResponseCodeIs(204);
        $I->dontSeeInDatabase('boards', ['id' => $boardId]);
    }
}