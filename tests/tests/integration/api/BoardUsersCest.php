<?php

namespace tests\integration\api;

use Tests\Support\{
    ApiTester,
    UserTrait,
    HashTrait,
    UserBoardTrait,
};

class BoardUsersCest
{
    use UserTrait, HashTrait, UserBoardTrait;

    public function testAddUserToBoard(ApiTester $I): void
    {
        $I->wantTo('Добавить пользователя в доску');

        [$boardOwnerUserId, $boardOwnerUserEmail] = $this->createUser($I);

        $boardId = $this->createBoard($I, $boardOwnerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $boardOwnerUserId);

        [$onAddUserId] = $this->createUser($I);

        $body = [
            'formData' => [
                'ids' => [
                    $onAddUserId,
                ]
            ],
        ];

        $I->haveHttpHeader('Content-Type', 'application/json');
        $I->haveHttpHeader('X-BASE-AUTH', $boardOwnerUserEmail);

        $I->sendPost("/v1/boards/$boardId/users", $body);

        $I->seeResponseCodeIs(201);
        $I->seeInDatabase('boards_users', [
            'board_id' => $boardId,
            'user_id' => $boardOwnerUserId,
            'role_id' => 1,
        ]);
        $I->seeInDatabase('boards_users', [
            'board_id' => $boardId,
            'user_id' => $onAddUserId,
            'role_id' => null,
        ]);
    }

    public function testAddUsersWithNotExistingUser(ApiTester $I): void
    {
        $I->wantTo('Добавить пользователей в доску, в том числе, несуществующего пользователя');

        [$boardOwnerUserId, $boardOwnerUserEmail] = $this->createUser($I);

        $boardId = $this->createBoard($I, $boardOwnerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $boardOwnerUserId);

        [$onAddUserId] = $this->createUser($I);

        $randomUserId = 123456;

        $body = [
            'formData' => [
                'ids' => [
                    $onAddUserId,
                    $randomUserId,
                ]
            ],
        ];

        $I->haveHttpHeader('Content-Type', 'application/json');
        $I->haveHttpHeader('X-BASE-AUTH', $boardOwnerUserEmail);

        $I->sendPost("/v1/boards/$boardId/users", $body);

        $I->seeResponseCodeIs(201);
        $I->seeResponseContainsJson([
            'users' => [
                'not_exist' => [
                    $randomUserId,
                ]
            ]
        ]);
        $I->seeInDatabase('boards_users', [
            'board_id' => $boardId,
            'user_id' => $boardOwnerUserId,
            'role_id' => 1,
        ]);

        $I->seeInDatabase('boards_users', [
            'board_id' => $boardId,
            'user_id' => $onAddUserId,
            'role_id' => null,
        ]);

        $I->dontSeeInDatabase('boards_users', [
            'board_id' => $boardId,
            'user_id' => $randomUserId,
        ]);
    }

    public function testBoardUsersSchema(ApiTester $I): void
    {
        $I->wantTo('Проверить контракт ответа пользователей доски');

        [$boardOwnerUserId, $boardOwnerUserEmail] = $this->createUser($I);

        $boardId = $this->createBoard($I, $boardOwnerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $boardOwnerUserId);

        $this->createUser($I);

        $I->haveHttpHeader('X-BASE-AUTH', $boardOwnerUserEmail);

        $I->sendGet("/v1/boards/$boardId/users");

        $I->seeResponseCodeIs(200);
        $I->seeResponseMatchesJsonType([
            'id' => 'integer',
            'name' => 'string',
            'email' => 'string',
        ]);
    }

    public function testDeleteBoardUser(ApiTester $I): void
    {
        $I->wantTo('Удалить пользователя из доски');

        [$boardOwnerUserId, $boardOwnerUserEmail] = $this->createUser($I);

        $boardId = $this->createBoard($I, $boardOwnerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $boardOwnerUserId);
        [$onDeleteUserId] = $this->createUser($I);

        $I->haveHttpHeader('X-BASE-AUTH', $boardOwnerUserEmail);

        $I->sendDelete("/v1/boards/$boardId/users/$onDeleteUserId");
        $I->seeResponseCodeIs(204);
        $I->seeInDatabase('boards_users', [
            'board_id' => $boardId,
            'user_id' => $boardOwnerUserId,
            'role_id' => 1,
        ]);
        $I->dontSeeInDatabase('boards_users', [
            'board_id' => $boardId,
            'user_id' => $onDeleteUserId,
        ]);
    }
}